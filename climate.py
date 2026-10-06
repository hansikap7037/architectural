"""
Climate & Material Recommendation Engine
========================================
FastAPI service for the Climate-Adaptive Generative Architectural Platform.

Resolves a city to coordinates (Open-Meteo Geocoding, no API key), fetches
climate indicators from Open-Meteo, then recommends envelope materials and
estimates rainwater + rooftop solar capacity for a given plot area.
"""

from __future__ import annotations

import logging
from datetime import date, timedelta
from typing import Any, Optional

import httpx
from fastapi import FastAPI, Query
from pydantic import BaseModel, Field, field_validator

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive"

# Fallback used when the requested city cannot be geocoded.
DEFAULT_CITY = "Delhi"
DEFAULT_LATITUDE = 28.6139
DEFAULT_LONGITUDE = 77.2090

HTTP_TIMEOUT_SECONDS = 20.0

# Material rule thresholds
HEAVY_RAINFALL_MM = 1500.0
HOT_CLIMATE_C = 30.0

# Infrastructure coefficients (as specified)
RUNOFF_COEFFICIENT = 0.85
SQFT_TO_LITERS_PER_M_DEPTH = 28.3168  # 1 cu.ft of water ≈ 28.3168 L
SOLAR_ROOF_UTILIZATION = 0.4  # 40% of plot area treated as usable roof
KW_PER_100_SQFT = 100.0  # ~1 kW per 100 sqft of usable roof

# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class ClimateRecommendationRequest(BaseModel):
    """JSON body for POST /climate-recommendations."""

    city: str = Field(..., min_length=1, description="City name to geocode")
    plot_area_sqft: float = Field(..., gt=0, description="Plot area in square feet")

    @field_validator("city")
    @classmethod
    def strip_city(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("city must not be empty")
        return cleaned


class ClimateMetrics(BaseModel):
    city: str
    resolved_location: str
    latitude: float
    longitude: float
    avg_temperature_c: float = Field(..., description="Mean air temperature (°C)")
    annual_rainfall_mm: float = Field(..., description="Estimated annual precipitation (mm)")
    avg_solar_radiation_mj_m2: float = Field(
        ...,
        description="Mean daily shortwave radiation (MJ/m²)",
    )
    data_source: str


class Materials(BaseModel):
    roof: str
    walls: str
    suggestions: list[str]
    applied_rules: list[str]


class InfrastructureCapacity(BaseModel):
    annual_rainwater_collection_liters: float
    solar_panel_capacity_kw: float
    usable_roof_area_sqft: float


class ClimateRecommendationResponse(BaseModel):
    climate_metrics: ClimateMetrics
    materials: Materials
    infrastructure_capacity: InfrastructureCapacity
    warning: Optional[str] = None


# ---------------------------------------------------------------------------
# External data helpers
# ---------------------------------------------------------------------------


def _http_client() -> httpx.Client:
    return httpx.Client(timeout=HTTP_TIMEOUT_SECONDS)


def geocode_city(city_name: str) -> Optional[dict[str, Any]]:
    """
    Resolve a city name to lat/lon via the Open-Meteo Geocoding API.

    Returns a dict with latitude, longitude, and a display name, or None
    if the city cannot be resolved.
    """
    try:
        with _http_client() as client:
            response = client.get(
                GEOCODING_URL,
                params={"name": city_name, "count": 1, "language": "en", "format": "json"},
            )
            response.raise_for_status()
            payload = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        logger.warning("Geocoding failed for %s: %s", city_name, exc)
        return None

    results = payload.get("results") or []
    if not results:
        return None

    hit = results[0]
    parts = [hit.get("name"), hit.get("admin1"), hit.get("country")]
    display = ", ".join(part for part in parts if part)
    return {
        "latitude": float(hit["latitude"]),
        "longitude": float(hit["longitude"]),
        "resolved_location": display or city_name,
        "city": hit.get("name") or city_name,
    }


def _mean(values: list[Optional[float]]) -> Optional[float]:
    nums = [v for v in values if v is not None]
    if not nums:
        return None
    return sum(nums) / len(nums)


def _sum(values: list[Optional[float]]) -> Optional[float]:
    nums = [v for v in values if v is not None]
    if not nums:
        return None
    return float(sum(nums))


def fetch_archive_climate(latitude: float, longitude: float) -> Optional[dict[str, float]]:
    """
    Last-365-day climate from Open-Meteo Archive (free, no API key).

    Used for annual rainfall and long-run averages. Forecast alone only
    covers ~16 days, which is not enough for annual totals.
    """
    end = date.today() - timedelta(days=2)  # archive lags ~2 days
    start = end - timedelta(days=364)
    try:
        with _http_client() as client:
            response = client.get(
                ARCHIVE_URL,
                params={
                    "latitude": latitude,
                    "longitude": longitude,
                    "start_date": start.isoformat(),
                    "end_date": end.isoformat(),
                    "daily": "temperature_2m_mean,precipitation_sum,shortwave_radiation_sum",
                    "timezone": "auto",
                },
            )
            response.raise_for_status()
            daily = response.json().get("daily") or {}
    except (httpx.HTTPError, ValueError) as exc:
        logger.warning("Archive climate fetch failed: %s", exc)
        return None

    temps = daily.get("temperature_2m_mean") or []
    rain = daily.get("precipitation_sum") or []
    solar = daily.get("shortwave_radiation_sum") or []

    avg_temp = _mean(temps)
    annual_rain = _sum(rain)
    avg_solar = _mean(solar)
    if avg_temp is None or annual_rain is None or avg_solar is None:
        return None

    # Scale rainfall if the archive window is slightly short of 365 days.
    if len(rain) > 0:
        annual_rain = annual_rain * (365.0 / len(rain))

    return {
        "avg_temperature_c": round(avg_temp, 2),
        "annual_rainfall_mm": round(annual_rain, 1),
        "avg_solar_radiation_mj_m2": round(avg_solar, 2),
    }


def fetch_forecast_climate(latitude: float, longitude: float) -> Optional[dict[str, float]]:
    """
    Near-term climate from Open-Meteo Forecast API (as specified).

    Daily precipitation is annualized from the forecast window so the
    rule engine still receives an annual rainfall estimate if archive data
    is unavailable.
    """
    try:
        with _http_client() as client:
            response = client.get(
                FORECAST_URL,
                params={
                    "latitude": latitude,
                    "longitude": longitude,
                    "daily": "temperature_2m_mean,precipitation_sum,shortwave_radiation_sum",
                    "forecast_days": 16,
                    "timezone": "auto",
                },
            )
            response.raise_for_status()
            daily = response.json().get("daily") or {}
    except (httpx.HTTPError, ValueError) as exc:
        logger.warning("Forecast climate fetch failed: %s", exc)
        return None

    temps = daily.get("temperature_2m_mean") or []
    rain = daily.get("precipitation_sum") or []
    solar = daily.get("shortwave_radiation_sum") or []

    avg_temp = _mean(temps)
    rain_sum = _sum(rain)
    avg_solar = _mean(solar)
    if avg_temp is None or rain_sum is None or avg_solar is None or not rain:
        return None

    annual_rain = rain_sum * (365.0 / len(rain))
    return {
        "avg_temperature_c": round(avg_temp, 2),
        "annual_rainfall_mm": round(annual_rain, 1),
        "avg_solar_radiation_mj_m2": round(avg_solar, 2),
    }


def fetch_climate_metrics(latitude: float, longitude: float) -> tuple[dict[str, float], str]:
    """Prefer 365-day archive; fall back to annualized 16-day forecast."""
    archive = fetch_archive_climate(latitude, longitude)
    if archive:
        return archive, "open-meteo-archive-365d"

    forecast = fetch_forecast_climate(latitude, longitude)
    if forecast:
        return forecast, "open-meteo-forecast-annualized"

    raise RuntimeError("Unable to retrieve climate data from Open-Meteo")


# ---------------------------------------------------------------------------
# Rule engine
# ---------------------------------------------------------------------------


def select_materials(annual_rainfall_mm: float, avg_temperature_c: float) -> Materials:
    """
    Climate-driven envelope recommendations.

    Rules are additive: a hot *and* wet climate receives both packages.
    The default kit is used only when neither threshold is crossed.
    """
    suggestions: list[str] = []
    applied: list[str] = []
    roof_parts: list[str] = []
    wall_parts: list[str] = []

    if annual_rainfall_mm > HEAVY_RAINFALL_MM:
        applied.append(f"annual_rainfall_mm > {HEAVY_RAINFALL_MM:g}")
        roof_parts.append("Sloped RCC Roof with Waterproof Elastomeric Coating")
        wall_parts.append("Moisture-Resistant Concrete Bricks")
        suggestions.extend(roof_parts[-1:] + wall_parts[-1:])

    if avg_temperature_c > HOT_CLIMATE_C:
        applied.append(f"avg_temperature_c > {HOT_CLIMATE_C:g}")
        roof_parts.append("Thermal Reflective Roof Coating")
        wall_parts.append("Fly Ash Hollow Blocks")
        suggestions.extend(["Fly Ash Hollow Blocks", "Thermal Reflective Roof Coating"])

    if not applied:
        applied.append("default")
        roof_parts.append("Reinforced Cement Concrete")
        wall_parts.append("Standard Kiln Red Bricks")
        suggestions.extend(["Standard Kiln Red Bricks", "Reinforced Cement Concrete"])

    # Preserve order while dropping duplicates
    unique_suggestions = list(dict.fromkeys(suggestions))
    return Materials(
        roof=" + ".join(dict.fromkeys(roof_parts)),
        walls=" + ".join(dict.fromkeys(wall_parts)),
        suggestions=unique_suggestions,
        applied_rules=applied,
    )


def compute_infrastructure(plot_area_sqft: float, annual_rainfall_mm: float) -> InfrastructureCapacity:
    """Rainwater harvest volume and rooftop PV sizing from plot area."""
    rainwater_liters = (
        plot_area_sqft
        * (annual_rainfall_mm / 1000.0)
        * RUNOFF_COEFFICIENT
        * SQFT_TO_LITERS_PER_M_DEPTH
    )
    usable_roof = plot_area_sqft * SOLAR_ROOF_UTILIZATION
    solar_kw = usable_roof / KW_PER_100_SQFT
    return InfrastructureCapacity(
        annual_rainwater_collection_liters=round(rainwater_liters, 2),
        solar_panel_capacity_kw=round(solar_kw, 3),
        usable_roof_area_sqft=round(usable_roof, 2),
    )


# ---------------------------------------------------------------------------
# Core orchestration
# ---------------------------------------------------------------------------


def get_climate_and_materials(city_name: str, plot_area_sqft: float) -> ClimateRecommendationResponse:
    """
    Resolve climate for `city_name`, recommend materials, and size infrastructure.

    If the city cannot be geocoded (or climate APIs fail), metrics for Delhi
    are returned together with a warning — never a hard 500 for a bad name.
    """
    warning: Optional[str] = None
    geo = geocode_city(city_name)

    if geo is None:
        warning = (
            f"City '{city_name}' could not be resolved. "
            f"Returning default climate values for {DEFAULT_CITY}."
        )
        logger.warning(warning)
        geo = {
            "latitude": DEFAULT_LATITUDE,
            "longitude": DEFAULT_LONGITUDE,
            "resolved_location": f"{DEFAULT_CITY}, India",
            "city": DEFAULT_CITY,
        }

    try:
        climate, source = fetch_climate_metrics(geo["latitude"], geo["longitude"])
    except RuntimeError as exc:
        # Last-resort Delhi defaults so the API stays usable offline / on API outage.
        extra = (
            f"Climate APIs unavailable ({exc}). "
            f"Using conservative default metrics for {DEFAULT_CITY}."
        )
        warning = f"{warning} {extra}".strip() if warning else extra
        geo = {
            "latitude": DEFAULT_LATITUDE,
            "longitude": DEFAULT_LONGITUDE,
            "resolved_location": f"{DEFAULT_CITY}, India",
            "city": DEFAULT_CITY,
        }
        climate = {
            "avg_temperature_c": 25.0,
            "annual_rainfall_mm": 800.0,
            "avg_solar_radiation_mj_m2": 18.0,
        }
        source = "static-delhi-defaults"

    materials = select_materials(
        annual_rainfall_mm=climate["annual_rainfall_mm"],
        avg_temperature_c=climate["avg_temperature_c"],
    )
    infrastructure = compute_infrastructure(plot_area_sqft, climate["annual_rainfall_mm"])

    return ClimateRecommendationResponse(
        climate_metrics=ClimateMetrics(
            city=geo["city"],
            resolved_location=geo["resolved_location"],
            latitude=geo["latitude"],
            longitude=geo["longitude"],
            avg_temperature_c=climate["avg_temperature_c"],
            annual_rainfall_mm=climate["annual_rainfall_mm"],
            avg_solar_radiation_mj_m2=climate["avg_solar_radiation_mj_m2"],
            data_source=source,
        ),
        materials=materials,
        infrastructure_capacity=infrastructure,
        warning=warning,
    )


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Climate & Material Recommendation Engine",
    description=(
        "Geocodes a city, pulls Open-Meteo climate indicators, and returns "
        "material + rainwater/solar recommendations for a plot."
    ),
    version="1.0.0",
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/climate-recommendations", response_model=ClimateRecommendationResponse)
def climate_recommendations_post(payload: ClimateRecommendationRequest) -> ClimateRecommendationResponse:
    """POST JSON: `{ "city": "Mumbai", "plot_area_sqft": 2400 }`."""
    return get_climate_and_materials(payload.city, payload.plot_area_sqft)


@app.get("/climate-recommendations", response_model=ClimateRecommendationResponse)
def climate_recommendations_get(
    city: str = Query(..., min_length=1, description="City name to geocode"),
    plot_area_sqft: float = Query(..., gt=0, description="Plot area in square feet"),
) -> ClimateRecommendationResponse:
    """GET query: `/climate-recommendations?city=Mumbai&plot_area_sqft=2400`."""
    return get_climate_and_materials(city.strip(), plot_area_sqft)
