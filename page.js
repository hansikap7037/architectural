"use client";

import { useState } from "react";

export default function Home() {
  const [screen, setScreen] = useState("landing");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [role, setRole] = useState("consumer");

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    location: "",
    experience: "",
    email: "",
    password: "",
  });

  const openSignup = () => {
    setAuthMode("signup");
    setShowAuth(true);
  };

  const openLogin = () => {
    setAuthMode("login");
    setShowAuth(true);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();

    setShowAuth(false);

    if (role === "consumer") {
      setScreen("dashboard");
    } else {
      setScreen("seller");
    }
  };

  return (
    <>
      {screen === "landing" && (
        <LandingPage
          onStart={openSignup}
          onLogin={openLogin}
        />
      )}

      {screen === "dashboard" && (
        <ConsumerDashboard
          onLogout={() => setScreen("landing")}
        />
      )}

      {screen === "seller" && (
        <SellerScreen
          onLogout={() => setScreen("landing")}
        />
      )}

      {showAuth && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          role={role}
          setRole={setRole}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setShowAuth(false)}
          onSubmit={handleAuthSubmit}
        />
      )}
    </>
  );
}

/* =========================================================
   LANDING PAGE
========================================================= */

function LandingPage({ onStart, onLogin }) {
  return (
    <main className="min-h-screen bg-[#f6f7f2] text-[#14251d]">

      {/* NAVBAR */}
      <nav className="border-b border-[#dfe5dc] bg-[#f6f7f2]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#163d2b] text-xl text-white">
              ◈
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                BhoomiAI
              </div>

              <div className="text-[10px] uppercase tracking-[0.25em] text-[#718078]">
                Land to Home
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm text-[#5f6e65] md:flex">
            <a href="#features" className="hover:text-[#163d2b]">
              Features
            </a>

            <a href="#how" className="hover:text-[#163d2b]">
              How it works
            </a>

            <a href="#solutions" className="hover:text-[#163d2b]">
              Solutions
            </a>

            <a href="#about" className="hover:text-[#163d2b]">
              About
            </a>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={onLogin}
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-[#163d2b] hover:bg-[#e8eee7] sm:block"
            >
              Login
            </button>

            <button
              onClick={onStart}
              className="rounded-full bg-[#163d2b] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2d20]"
            >
              Start Designing
            </button>

          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">

        <div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cbd8cb] bg-[#edf3ec] px-4 py-2 text-xs font-semibold text-[#31533f]">
            <span className="h-2 w-2 rounded-full bg-[#4f8a63]" />
            AI-powered architectural intelligence
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Turn your land into your
            <span className="text-[#4d795b]"> dream home.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[#66736c]">
            BhoomiAI transforms a simple piece of land into a complete
            intelligent home plan — from climate analysis and Vastu-aware
            orientation to 3D visualization, materials and cost estimation.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">

            <button
              onClick={onStart}
              className="rounded-full bg-[#163d2b] px-7 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#0f2d20]"
            >
              Start with your land →
            </button>

            <a
              href="#how"
              className="rounded-full border border-[#cfd8d0] bg-white px-7 py-4 text-sm font-semibold text-[#254334] hover:bg-[#f0f3ee]"
            >
              See how it works
            </a>

          </div>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-6">

            <Stat number="AI" label="Land Analysis" />
            <Stat number="3D" label="Home Visualization" />
            <Stat number="360°" label="Design Control" />

          </div>
        </div>

        {/* HERO VISUAL */}
        <div className="relative">

          <div className="absolute -inset-10 rounded-full bg-[#dce9dc] blur-3xl" />

          <div className="relative overflow-hidden rounded-[32px] border border-[#d9e0d8] bg-white p-4 shadow-2xl">

            <div className="rounded-[25px] bg-[#dfe9dd] p-5">

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#65776b]">
                    AI Analysis
                  </div>

                  <div className="mt-1 text-lg font-bold">
                    Your land, understood.
                  </div>
                </div>

                <div className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#39704f]">
                  94% Match
                </div>

              </div>

              <div className="relative h-[390px] overflow-hidden rounded-[22px] bg-[#c6d9bf]">

                <div className="absolute inset-0 opacity-40">
                  <div className="h-full w-full bg-[linear-gradient(30deg,transparent_48%,rgba(255,255,255,.5)_49%,transparent_50%),linear-gradient(120deg,transparent_48%,rgba(255,255,255,.4)_49%,transparent_50%)] bg-[length:80px_80px]" />
                </div>

                <div className="absolute bottom-12 left-10 right-10 h-44 rotate-[-5deg] rounded-[12px] border-2 border-dashed border-[#3f6749] bg-[#b5cfaa]/70" />

                <div className="absolute bottom-20 left-1/2 w-48 -translate-x-1/2">

                  <div className="relative mx-auto h-24 w-40 rounded-sm bg-[#f4f0e7] shadow-xl">

                    <div className="absolute -top-14 left-[-10px] h-0 w-0 border-l-[90px] border-r-[90px] border-b-[70px] border-l-transparent border-r-transparent border-b-[#7c987e]" />

                    <div className="absolute left-7 top-8 h-10 w-7 rounded-sm bg-[#7e9eae]" />

                    <div className="absolute right-7 top-8 h-10 w-7 rounded-sm bg-[#7e9eae]" />

                    <div className="absolute bottom-0 left-1/2 h-14 w-9 -translate-x-1/2 bg-[#795d48]" />

                  </div>
                </div>

                <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-2 shadow-lg backdrop-blur">

                  <div className="text-[10px] uppercase tracking-wider text-[#738078]">
                    Plot
                  </div>

                  <div className="font-bold">
                    2,400 sq.ft
                  </div>

                </div>

                <div className="absolute bottom-4 right-4 rounded-xl bg-[#163d2b]/95 px-4 py-3 text-white shadow-lg">

                  <div className="text-[10px] uppercase tracking-wider text-[#a8c2b1]">
                    Location
                  </div>

                  <div className="text-sm font-semibold">
                    Haridwar, Uttarakhand
                  </div>

                </div>

              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">

                <MiniMetric label="Climate" value="28°C" />
                <MiniMetric label="Humidity" value="68%" />
                <MiniMetric label="Wind" value="14 km/h" />

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="bg-[#123526] px-6 py-24 text-white"
      >
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#9bbca5]">
              Everything connected
            </div>

            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              From empty plot to
              <span className="text-[#a8c99f]"> intelligent home.</span>
            </h2>

            <p className="mt-5 leading-7 text-[#b5c8bd]">
              BhoomiAI combines architectural planning, environmental
              intelligence and construction insights in one platform.
            </p>

          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            <FeatureCard
              icon="☀"
              title="Climate Intelligence"
              text="Understand temperature, rainfall, humidity, wind and sunlight before designing your home."
            />

            <FeatureCard
              icon="⌖"
              title="Direction & Vastu"
              text="Optimize orientation, entrances, rooms and sunlight using direction-aware planning."
            />

            <FeatureCard
              icon="▦"
              title="AI Floor Plan"
              text="Generate intelligent floor plans based on your family, plot size and lifestyle."
            />

            <FeatureCard
              icon="◇"
              title="3D House"
              text="Explore your future home in an interactive three-dimensional environment."
            />

            <FeatureCard
              icon="▤"
              title="Smart Materials"
              text="Get climate-suitable construction materials with practical recommendations."
            />

            <FeatureCard
              icon="₹"
              title="Cost Estimate"
              text="Understand construction cost ranges before making major decisions."
            />

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-[#f6f7f2] px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#708077]">
              How it works
            </div>

            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              One platform. Complete journey.
            </h2>

          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-4">

            <StepCard
              number="01"
              title="Upload Land"
              text="Upload your land image and enter basic site information."
            />

            <StepCard
              number="02"
              title="AI Analysis"
              text="BhoomiAI understands plot conditions, climate and orientation."
            />

            <StepCard
              number="03"
              title="Generate Home"
              text="Create floor plans, materials and a complete architectural concept."
            />

            <StepCard
              number="04"
              title="Explore in 3D"
              text="Walk through your future home before construction begins."
            />

          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section id="solutions" className="bg-[#eef1eb] px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex items-end justify-between gap-6">

            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#718078]">
                Your workspace
              </div>

              <h2 className="mt-3 text-4xl font-bold">
                Everything in one dashboard.
              </h2>
            </div>

            <button
              onClick={onStart}
              className="hidden rounded-full bg-[#163d2b] px-5 py-3 text-sm font-bold text-white md:block"
            >
              Open Dashboard →
            </button>

          </div>

          <div className="overflow-hidden rounded-[28px] border border-[#d4ddd3] bg-white shadow-xl">

            <div className="grid lg:grid-cols-[220px_1fr]">

              <div className="border-b border-[#e0e5df] bg-[#f8faf7] p-4 lg:border-b-0 lg:border-r">

                <div className="mb-7 flex items-center gap-2 px-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#163d2b] text-white">
                    ◈
                  </div>

                  <span className="font-bold">
                    BhoomiAI
                  </span>

                </div>

                <div className="space-y-1">

                  {[
                    "Overview",
                    "Land Analysis",
                    "Climate",
                    "Floor Plan",
                    "3D House",
                    "Materials",
                    "Cost Estimate",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className={`rounded-xl px-3 py-2.5 text-sm ${
                        index === 0
                          ? "bg-[#e0ebdf] font-semibold text-[#245039]"
                          : "text-[#68766e]"
                      }`}
                    >
                      {item}
                    </div>
                  ))}

                </div>
              </div>

              <div className="p-6 lg:p-8">

                <div className="flex items-center justify-between">

                  <div>
                    <div className="text-2xl font-bold">
                      Good morning 👋
                    </div>

                    <div className="mt-1 text-sm text-[#77847d]">
                      Here is your project overview.
                    </div>
                  </div>

                  <button
                    onClick={onStart}
                    className="rounded-xl bg-[#163d2b] px-4 py-2.5 text-sm font-bold text-white"
                  >
                    + New Project
                  </button>

                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                  <DashboardPreviewCard
                    title="Land Area"
                    value="2,400"
                    suffix="sq.ft"
                  />

                  <DashboardPreviewCard
                    title="Climate"
                    value="28°"
                    suffix="C"
                  />

                  <DashboardPreviewCard
                    title="Sustainability"
                    value="87"
                    suffix="/100"
                  />

                  <DashboardPreviewCard
                    title="Design Progress"
                    value="62"
                    suffix="%"
                  />

                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-2">

                  <div className="rounded-2xl border border-[#e2e7e1] p-5">

                    <div className="flex items-center justify-between">
                      <div className="font-bold">
                        Floor Plan
                      </div>

                      <div className="text-xs text-[#708078]">
                        Ground Floor
                      </div>
                    </div>

                    <div className="mt-5 h-52 rounded-xl bg-[#f1f3ef] p-5">

                      <div className="grid h-full grid-cols-4 grid-rows-3 gap-2">

                        <div className="col-span-2 row-span-2 rounded-md border-2 border-[#98aa9d] bg-white" />
                        <div className="rounded-md border-2 border-[#98aa9d] bg-white" />
                        <div className="rounded-md border-2 border-[#98aa9d] bg-white" />
                        <div className="rounded-md border-2 border-[#98aa9d] bg-white" />
                        <div className="col-span-2 rounded-md border-2 border-[#98aa9d] bg-white" />
                        <div className="rounded-md border-2 border-[#98aa9d] bg-white" />

                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#e2e7e1] p-5">

                    <div className="font-bold">
                      3D House
                    </div>

                    <div className="mt-5 flex h-52 items-center justify-center overflow-hidden rounded-xl bg-[#dfe8dc]">

                      <div className="relative mt-8 h-28 w-44 bg-[#f2eee5] shadow-xl">

                        <div className="absolute -top-16 left-[-15px] h-0 w-0 border-l-[100px] border-r-[100px] border-b-[75px] border-l-transparent border-r-transparent border-b-[#79947d]" />

                        <div className="absolute left-7 top-10 h-9 w-7 bg-[#7697a5]" />

                        <div className="absolute right-7 top-10 h-9 w-7 bg-[#7697a5]" />

                        <div className="absolute bottom-0 left-1/2 h-14 w-9 -translate-x-1/2 bg-[#795d48]" />

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-6 py-24">

        <div className="mx-auto max-w-5xl text-center">

          <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#718078]">
            Built for better decisions
          </div>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Design with intelligence,
            <span className="text-[#4d795b]"> not guesswork.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#68766e]">
            BhoomiAI brings architectural thinking, environmental data and
            modern AI together so homeowners can make better decisions before
            construction begins.
          </p>

          <button
            onClick={onStart}
            className="mt-8 rounded-full bg-[#163d2b] px-7 py-4 text-sm font-bold text-white"
          >
            Start your project →
          </button>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#dce3db] bg-[#f0f2ed] px-6 py-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <div className="font-bold">
              BhoomiAI
            </div>

            <div className="mt-1 text-sm text-[#718078]">
              From land to home, intelligently.
            </div>
          </div>

          <div className="text-sm text-[#718078]">
            © 2026 BhoomiAI. Built for intelligent living.
          </div>

        </div>
      </footer>

    </main>
  );
}

/* =========================================================
   CONSUMER DASHBOARD
========================================================= */

function ConsumerDashboard({ onLogout }) {
  const [active, setActive] = useState("Overview");

  return (
    <main className="min-h-screen bg-[#f4f6f1] text-[#14251d]">

      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-[245px] shrink-0 border-r border-[#dce3db] bg-[#f9faf7] lg:block">

          <div className="flex h-full flex-col p-5">

            <div className="flex items-center gap-3 px-2 py-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#163d2b] text-xl text-white">
                ◈
              </div>

              <div>
                <div className="font-bold">
                  BhoomiAI
                </div>

                <div className="text-[9px] uppercase tracking-[0.22em] text-[#7b887f]">
                  Consumer
                </div>
              </div>

            </div>

            <div className="mt-8">

              <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#87928b]">
                Workspace
              </div>

              <div className="space-y-1">

                {[
                  "Overview",
                  "My Projects",
                  "Land Analysis",
                  "House Designs",
                  "3D Studio",
                  "Materials",
                  "Cost Estimate",
                  "Profile",
                ].map((item) => (

                  <button
                    key={item}
                    onClick={() => setActive(item)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                      active === item
                        ? "bg-[#e0ebdf] font-semibold text-[#245039]"
                        : "text-[#65736b] hover:bg-[#edf1eb]"
                    }`}
                  >

                    <span className="w-5 text-center">
                      {getMenuIcon(item)}
                    </span>

                    {item}

                  </button>

                ))}

              </div>
            </div>

            <div className="mt-auto">

              <div className="mb-4 rounded-2xl bg-[#edf2eb] p-4">

                <div className="text-xs font-semibold text-[#31543e]">
                  AI Design Assistant
                </div>

                <div className="mt-2 text-xs leading-5 text-[#748078]">
                  Continue creating your dream home.
                </div>

                <button
                  onClick={() => setActive("Land Analysis")}
                  className="mt-3 text-xs font-bold text-[#245039]"
                >
                  Start analysis →
                </button>

              </div>

              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#68756d] hover:bg-[#edf1eb]"
              >
                <span>↪</span>
                Logout
              </button>

            </div>
          </div>
        </aside>

        {/* MOBILE HEADER */}
        <div className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-[#dce3db] bg-[#f9faf7] px-5 py-4 lg:hidden">

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#163d2b] text-white">
              ◈
            </div>

            <span className="font-bold">
              BhoomiAI
            </span>

          </div>

          <button
            onClick={onLogout}
            className="text-sm font-semibold text-[#31543e]"
          >
            Logout
          </button>

        </div>

        {/* MAIN */}
        <section className="min-w-0 flex-1 pt-20 lg:pt-0">

          {active === "Land Analysis" && (
            <LandAnalysisScreen
              onBack={() => setActive("Overview")}
              onContinue={() => setActive("House Designs")}
            />
          )}

          {active === "House Designs" && (
            <HouseDesignScreen
              onBack={() => setActive("Land Analysis")}
              onContinue={() => setActive("3D Studio")}
            />
          )}

          {active === "Overview" && (
            <DashboardOverview
              setActive={setActive}
            />
          )}

          {![
            "Overview",
            "Land Analysis",
            "House Designs",
          ].includes(active) && (
            <DashboardPlaceholder
              title={active}
              onBack={() => setActive("Overview")}
            />
          )}

        </section>

      </div>
    </main>
  );
}

/* =========================================================
   DASHBOARD OVERVIEW
========================================================= */

function DashboardOverview({ setActive }) {
  return (
    <div className="mx-auto max-w-7xl p-5 md:p-8 lg:p-10">

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div>

          <div className="text-sm font-medium text-[#758179]">
            Consumer Dashboard
          </div>

          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
            Good morning 👋
          </h1>

          <p className="mt-2 text-sm text-[#758179]">
            Continue building your dream home.
          </p>

        </div>

        <button
          onClick={() => setActive("Land Analysis")}
          className="rounded-xl bg-[#163d2b] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0f2d20]"
        >
          + New Project
        </button>

      </div>

      {/* STATS */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <DashStat
          title="Land Area"
          value="2,400"
          suffix="sq.ft"
          icon="⌂"
        />

        <DashStat
          title="Climate"
          value="28°"
          suffix="C"
          icon="☀"
        />

        <DashStat
          title="Sustainability"
          value="87"
          suffix="/100"
          icon="♧"
        />

        <DashStat
          title="Design Progress"
          value="62"
          suffix="%"
          icon="◒"
        />

      </div>

      {/* PROJECT */}
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        <div className="rounded-2xl border border-[#dfe5dd] bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#7b877f]">
                Current project
              </div>

              <h2 className="mt-2 text-xl font-bold">
                Haridwar Family Home
              </h2>

            </div>

            <div className="rounded-full bg-[#e8f0e7] px-3 py-1.5 text-xs font-bold text-[#396148]">
              In Progress
            </div>

          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">

            <ProgressRow
              label="Land Analysis"
              value={100}
            />

            <ProgressRow
              label="House Design"
              value={70}
            />

            <ProgressRow
              label="3D Model"
              value={35}
            />

          </div>

          <button
            onClick={() => setActive("Land Analysis")}
            className="mt-7 rounded-xl border border-[#cad7ca] px-4 py-3 text-sm font-bold text-[#31543e] hover:bg-[#f2f5f1]"
          >
            Open Land Analysis →
          </button>

        </div>

        {/* QUICK ACTIONS */}
        <div className="rounded-2xl border border-[#dfe5dd] bg-white p-6 shadow-sm">

          <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#7b877f]">
            Quick actions
          </div>

          <div className="mt-5 space-y-3">

            <QuickAction
              icon="◎"
              title="Analyze Land"
              text="Upload your land and get AI insights."
              onClick={() => setActive("Land Analysis")}
            />

            <QuickAction
              icon="⌂"
              title="House Designs"
              text="Create your AI home concepts."
              onClick={() => setActive("House Designs")}
            />

            <QuickAction
              icon="◇"
              title="Open 3D Studio"
              text="Explore your house in 3D."
              onClick={() => setActive("3D Studio")}
            />

            <QuickAction
              icon="₹"
              title="Estimate Cost"
              text="Calculate construction cost."
              onClick={() => setActive("Cost Estimate")}
            />

          </div>
        </div>

      </div>

      {/* RECENT PROJECT */}
      <div className="mt-8 rounded-2xl border border-[#dfe5dd] bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#7b877f]">
              Recent activity
            </div>

            <h2 className="mt-2 text-xl font-bold">
              Your design journey
            </h2>

          </div>

          <button
            onClick={() => setActive("Land Analysis")}
            className="text-sm font-bold text-[#31543e]"
          >
            Continue →
          </button>

        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">

          <ActivityCard
            number="01"
            title="Land Analysis"
            text="Completed"
            done
          />

          <ActivityCard
            number="02"
            title="House Design"
            text="In progress"
          />

          <ActivityCard
            number="03"
            title="3D Visualization"
            text="Upcoming"
          />

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   LAND ANALYSIS
========================================================= */

function LandAnalysisScreen({ onBack, onContinue }) {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const [siteData, setSiteData] = useState({
    location: "Haridwar, Uttarakhand",
    length: "60",
    width: "40",
    direction: "North",
    road: "East",
    slope: "Mostly Flat",
    vegetation: "Moderate",
  });

  const handleChange = (field, value) => {
    setSiteData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);
    setAnalyzed(false);
  };

  const runAnalysis = () => {
    setAnalyzing(true);

    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 1400);
  };

  return (
    <div className="mx-auto max-w-7xl p-5 md:p-8 lg:p-10">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div>

          <button
            onClick={onBack}
            className="mb-3 text-sm font-semibold text-[#5f7166] hover:text-[#163d2b]"
          >
            ← Back to Dashboard
          </button>

          <div className="text-sm font-medium text-[#758179]">
            Step 01 of your home journey
          </div>

          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
            Land Analysis
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#758179]">
            Give BhoomiAI some information about your land. Our AI will
            analyze the site and prepare it for the house design stage.
          </p>

        </div>

        <div className="rounded-2xl border border-[#dce6db] bg-[#edf3eb] px-5 py-4">

          <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#708078]">
            Analysis status
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm font-bold text-[#31543e]">

            <span
              className={`h-2.5 w-2.5 rounded-full ${
                analyzed ? "bg-[#4d8b5c]" : "bg-[#c49b45]"
              }`}
            />

            {analyzed
              ? "Analysis Complete"
              : "Ready to Analyze"}

          </div>

        </div>

      </div>

      {/* PROGRESS */}
      <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2">

        <AnalysisStep
          number="01"
          title="Land"
          active
        />

        <div className="h-px w-12 bg-[#cdd8cd]" />

        <AnalysisStep
          number="02"
          title="Climate"
        />

        <div className="h-px w-12 bg-[#cdd8cd]" />

        <AnalysisStep
          number="03"
          title="Design"
        />

        <div className="h-px w-12 bg-[#cdd8cd]" />

        <AnalysisStep
          number="04"
          title="3D Home"
        />

      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1.1fr]">

        {/* UPLOAD */}
        <div className="rounded-3xl border border-[#dce3da] bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#7b877f]">
                Site image
              </div>

              <h2 className="mt-2 text-xl font-bold">
                Upload your land
              </h2>

            </div>

            <div className="rounded-xl bg-[#edf3eb] px-3 py-2 text-xs font-bold text-[#3c644b]">
              JPG / PNG
            </div>

          </div>

          <label className="mt-6 block cursor-pointer">

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />

            <div
              className={`relative flex min-h-[330px] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition ${
                image
                  ? "border-[#9db5a1] bg-[#edf2ea]"
                  : "border-[#cbd7cb] bg-[#f8faf7] hover:border-[#8eaa94] hover:bg-[#f3f6f1]"
              }`}
            >

              {image ? (
                <>
                  <img
                    src={image}
                    alt="Uploaded land"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/20" />

                  <div className="relative rounded-xl bg-white/95 px-5 py-3 text-center shadow-lg">

                    <div className="text-sm font-bold text-[#244333]">
                      Land image uploaded
                    </div>

                    <div className="mt-1 text-xs text-[#748078]">
                      Click to replace image
                    </div>

                  </div>
                </>
              ) : (
                <div className="px-6 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e5eee3] text-2xl text-[#3d684c]">
                    ↑
                  </div>

                  <div className="mt-5 text-lg font-bold">
                    Upload a photo of your land
                  </div>

                  <div className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7a867f]">
                    Take a clear photo showing the plot, surrounding road,
                    vegetation and nearby structures if possible.
                  </div>

                  <div className="mt-5 inline-flex rounded-full bg-[#163d2b] px-5 py-2.5 text-xs font-bold text-white">
                    Choose Image
                  </div>

                </div>
              )}

            </div>

          </label>

          <div className="mt-5 rounded-xl bg-[#f4f7f2] p-4 text-xs leading-5 text-[#748078]">

            <strong className="text-[#31543e]">
              Tip:
            </strong>{" "}
            A photo taken from a higher viewpoint gives better visibility of
            the plot boundary and surrounding conditions.

          </div>

        </div>

        {/* SITE DETAILS */}
        <div className="rounded-3xl border border-[#dce3da] bg-white p-6 shadow-sm">

          <div>

            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#7b877f]">
              Site information
            </div>

            <h2 className="mt-2 text-xl font-bold">
              Tell us about the plot
            </h2>

            <p className="mt-2 text-sm text-[#7a867f]">
              These details help BhoomiAI understand the land more accurately.
            </p>

          </div>

          <div className="mt-6 space-y-5">

            <div>

              <label className="mb-2 block text-xs font-bold text-[#526159]">
                Location
              </label>

              <input
                value={siteData.location}
                onChange={(e) =>
                  handleChange("location", e.target.value)
                }
                className="w-full rounded-xl border border-[#d5ded5] bg-[#fafbf9] px-4 py-3 text-sm outline-none transition focus:border-[#78967e]"
                placeholder="City, State"
              />

            </div>

            <div>

              <label className="mb-2 block text-xs font-bold text-[#526159]">
                Approximate plot dimensions
              </label>

              <div className="grid grid-cols-2 gap-3">

                <div className="relative">

                  <input
                    value={siteData.length}
                    onChange={(e) =>
                      handleChange("length", e.target.value)
                    }
                    className="w-full rounded-xl border border-[#d5ded5] bg-[#fafbf9] px-4 py-3 pr-16 text-sm outline-none focus:border-[#78967e]"
                  />

                  <span className="absolute right-4 top-3 text-xs text-[#849087]">
                    ft length
                  </span>

                </div>

                <div className="relative">

                  <input
                    value={siteData.width}
                    onChange={(e) =>
                      handleChange("width", e.target.value)
                    }
                    className="w-full rounded-xl border border-[#d5ded5] bg-[#fafbf9] px-4 py-3 pr-16 text-sm outline-none focus:border-[#78967e]"
                  />

                  <span className="absolute right-4 top-3 text-xs text-[#849087]">
                    ft width
                  </span>

                </div>

              </div>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <SelectField
                label="Main direction"
                value={siteData.direction}
                onChange={(value) =>
                  handleChange("direction", value)
                }
                options={[
                  "North",
                  "South",
                  "East",
                  "West",
                  "North-East",
                  "North-West",
                  "South-East",
                  "South-West",
                ]}
              />

              <SelectField
                label="Road access"
                value={siteData.road}
                onChange={(value) =>
                  handleChange("road", value)
                }
                options={[
                  "North",
                  "South",
                  "East",
                  "West",
                  "North + East",
                  "North + West",
                  "South + East",
                  "South + West",
                ]}
              />

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <SelectField
                label="Terrain / slope"
                value={siteData.slope}
                onChange={(value) =>
                  handleChange("slope", value)
                }
                options={[
                  "Mostly Flat",
                  "Slight Slope",
                  "Moderate Slope",
                  "Steep Slope",
                ]}
              />

              <SelectField
                label="Vegetation"
                value={siteData.vegetation}
                onChange={(value) =>
                  handleChange("vegetation", value)
                }
                options={[
                  "Low",
                  "Moderate",
                  "High",
                ]}
              />

            </div>

          </div>

          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#163d2b] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#0f2d20] disabled:cursor-not-allowed disabled:opacity-70"
          >

            {analyzing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Analyzing your land...
              </>
            ) : (
              <>
                ✦ Run AI Land Analysis
              </>
            )}

          </button>

        </div>

      </div>

      {analyzed && (
        <div className="mt-8">

          <div className="mb-5">

            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#718078]">
              AI analysis results
            </div>

            <h2 className="mt-2 text-2xl font-bold">
              Your land is ready for design.
            </h2>

          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">

            <div className="rounded-3xl bg-[#163d2b] p-7 text-white shadow-sm">

              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#a9c1af]">
                AI Site Score
              </div>

              <div className="mt-5 flex items-end gap-2">

                <div className="text-7xl font-bold">
                  89
                </div>

                <div className="mb-2 text-lg text-[#a9c1af]">
                  /100
                </div>

              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[89%] rounded-full bg-[#a8c99f]" />
              </div>

              <p className="mt-5 text-sm leading-6 text-[#c3d2c8]">
                Your plot appears suitable for a residential design with
                strong daylight potential and good road accessibility.
              </p>

              <div className="mt-6 rounded-2xl bg-white/10 p-4">

                <div className="text-xs font-bold text-[#a8c99f]">
                  AI recommendation
                </div>

                <div className="mt-2 text-sm leading-6 text-[#d2ddd5]">
                  Consider placing primary living spaces toward the
                  North/East side while using the road-facing side for
                  convenient entry and parking.
                </div>

              </div>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <AnalysisResult
                icon="⌂"
                label="Estimated Plot Area"
                value={`${(
                  Number(siteData.length || 0) *
                  Number(siteData.width || 0)
                ).toLocaleString()} sq.ft`}
                detail={`${siteData.length} × ${siteData.width} ft`}
              />

              <AnalysisResult
                icon="⌖"
                label="Road Access"
                value={siteData.road}
                detail="Suitable for main entry"
              />

              <AnalysisResult
                icon="☀"
                label="Sun Exposure"
                value="High"
                detail="Good natural light potential"
              />

              <AnalysisResult
                icon="≈"
                label="Terrain"
                value={siteData.slope}
                detail="Low design complexity"
              />

              <AnalysisResult
                icon="♧"
                label="Vegetation"
                value={siteData.vegetation}
                detail="Can be integrated into landscape"
              />

              <AnalysisResult
                icon="◎"
                label="Orientation"
                value={siteData.direction}
                detail="Suitable for planning"
              />

            </div>

          </div>

          <div className="mt-5 rounded-3xl border border-[#dce3da] bg-white p-6 shadow-sm">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>

                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#7b877f]">
                  Preliminary climate profile
                </div>

                <h3 className="mt-2 text-xl font-bold">
                  {siteData.location}
                </h3>

              </div>

              <div className="rounded-full bg-[#edf3eb] px-4 py-2 text-xs font-bold text-[#396148]">
                Climate suitable for residential planning
              </div>

            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <ClimateMetric
                icon="☀"
                label="Temperature"
                value="28°C"
              />

              <ClimateMetric
                icon="◌"
                label="Humidity"
                value="68%"
              />

              <ClimateMetric
                icon="≈"
                label="Wind"
                value="14 km/h"
              />

              <ClimateMetric
                icon="☂"
                label="Rainfall"
                value="Moderate"
              />

            </div>

          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-3xl border border-[#d6e0d5] bg-[#edf3eb] p-6 sm:flex-row">

            <div>

              <div className="font-bold text-[#284a36]">
                Land analysis complete
              </div>

              <div className="mt-1 text-sm text-[#6f7e75]">
                Your site information is ready for the house design stage.
              </div>

            </div>

            <button
              onClick={onContinue}
              className="rounded-xl bg-[#163d2b] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#0f2d20]"
            >
              Continue to House Design →
            </button>

          </div>

        </div>
      )}

      {!analyzed && (
        <div className="mt-8 rounded-3xl border border-[#dce3da] bg-[#edf2eb] p-6">

          <div className="flex gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#31543e] shadow-sm">
              ✦
            </div>

            <div>

              <div className="font-bold text-[#31543e]">
                What will BhoomiAI analyze?
              </div>

              <div className="mt-1 max-w-3xl text-sm leading-6 text-[#718078]">
                Plot dimensions, orientation, road access, terrain, vegetation,
                sunlight potential and an initial climate profile.
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   HOUSE DESIGN SCREEN
========================================================= */

function HouseDesignScreen({ onBack, onContinue }) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(0);

  const [requirements, setRequirements] = useState({
    floors: "2 Floors",
    bedrooms: "3 Bedrooms",
    bathrooms: "3 Bathrooms",
    kitchen: "Open Kitchen",
    parking: "1 Car",
    balcony: "Yes",
    garden: "Yes",
    vastu: "Vastu Preferred",
    style: "Modern",
    budget: "₹40–50 Lakhs",
    family: "4–5 Members",
    special: "",
  });

  const updateRequirement = (field, value) => {
    setRequirements((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateDesigns = () => {
    setGenerating(true);
    setGenerated(false);

    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setSelectedDesign(0);
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-7xl p-5 md:p-8 lg:p-10">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div>

          <button
            onClick={onBack}
            className="mb-3 text-sm font-semibold text-[#5f7166] hover:text-[#163d2b]"
          >
            ← Back to Land Analysis
          </button>

          <div className="text-sm font-medium text-[#758179]">
            Step 02 of your home journey
          </div>

          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
            House Design
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#758179]">
            Tell BhoomiAI how you want to live. We will use your land analysis,
            lifestyle and preferences to create suitable house concepts.
          </p>

        </div>

        <div className="rounded-2xl border border-[#dce6db] bg-[#edf3eb] px-5 py-4">

          <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#708078]">
            Project location
          </div>

          <div className="mt-1 text-sm font-bold text-[#31543e]">
            Haridwar, Uttarakhand
          </div>

        </div>

      </div>

      {/* PROGRESS */}
      <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2">

        <AnalysisStep
          number="01"
          title="Land"
          active
          completed
        />

        <div className="h-px w-12 bg-[#9eb39f]" />

        <AnalysisStep
          number="02"
          title="Design"
          active
        />

        <div className="h-px w-12 bg-[#cdd8cd]" />

        <AnalysisStep
          number="03"
          title="Floor Plan"
        />

        <div className="h-px w-12 bg-[#cdd8cd]" />

        <AnalysisStep
          number="04"
          title="3D Home"
        />

      </div>

      {/* SITE SUMMARY */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <SiteSummary
          icon="⌂"
          title="Plot"
          value="2,400 sq.ft"
        />

        <SiteSummary
          icon="⌖"
          title="Orientation"
          value="North"
        />

        <SiteSummary
          icon="◎"
          title="Road"
          value="East"
        />

        <SiteSummary
          icon="✦"
          title="AI Site Score"
          value="89 / 100"
        />

      </div>

      {/* REQUIREMENTS */}
      <div className="mt-6 rounded-3xl border border-[#dce3da] bg-white p-6 shadow-sm md:p-8">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>

            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#7b877f]">
              Your requirements
            </div>

            <h2 className="mt-2 text-2xl font-bold">
              Design your way
            </h2>

            <p className="mt-2 text-sm text-[#758179]">
              Choose what your family needs. BhoomiAI will use these
              preferences to create your house concepts.
            </p>

          </div>

          <div className="rounded-xl bg-[#f0f4ee] px-4 py-3 text-xs font-bold text-[#396148]">
            AI-assisted planning
          </div>

        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <DesignSelect
            label="Number of floors"
            value={requirements.floors}
            onChange={(value) =>
              updateRequirement("floors", value)
            }
            options={[
              "1 Floor",
              "2 Floors",
              "3 Floors",
            ]}
          />

          <DesignSelect
            label="Bedrooms"
            value={requirements.bedrooms}
            onChange={(value) =>
              updateRequirement("bedrooms", value)
            }
            options={[
              "2 Bedrooms",
              "3 Bedrooms",
              "4 Bedrooms",
              "5 Bedrooms",
            ]}
          />

          <DesignSelect
            label="Bathrooms"
            value={requirements.bathrooms}
            onChange={(value) =>
              updateRequirement("bathrooms", value)
            }
            options={[
              "2 Bathrooms",
              "3 Bathrooms",
              "4 Bathrooms",
              "5 Bathrooms",
            ]}
          />

          <DesignSelect
            label="Kitchen"
            value={requirements.kitchen}
            onChange={(value) =>
              updateRequirement("kitchen", value)
            }
            options={[
              "Closed Kitchen",
              "Open Kitchen",
              "Open + Utility",
            ]}
          />

          <DesignSelect
            label="Parking"
            value={requirements.parking}
            onChange={(value) =>
              updateRequirement("parking", value)
            }
            options={[
              "No Parking",
              "1 Car",
              "2 Cars",
              "2 Cars + Bikes",
            ]}
          />

          <DesignSelect
            label="Balcony"
            value={requirements.balcony}
            onChange={(value) =>
              updateRequirement("balcony", value)
            }
            options={[
              "Yes",
              "No",
              "Multiple Balconies",
            ]}
          />

          <DesignSelect
            label="Garden"
            value={requirements.garden}
            onChange={(value) =>
              updateRequirement("garden", value)
            }
            options={[
              "Yes",
              "No",
              "Small Garden",
              "Large Garden",
            ]}
          />

          <DesignSelect
            label="Vastu preference"
            value={requirements.vastu}
            onChange={(value) =>
              updateRequirement("vastu", value)
            }
            options={[
              "Vastu Preferred",
              "Strong Vastu",
              "No Vastu Preference",
            ]}
          />

          <DesignSelect
            label="Design style"
            value={requirements.style}
            onChange={(value) =>
              updateRequirement("style", value)
            }
            options={[
              "Modern",
              "Contemporary",
              "Traditional",
              "Minimalist",
              "Luxury",
            ]}
          />

          <DesignSelect
            label="Budget"
            value={requirements.budget}
            onChange={(value) =>
              updateRequirement("budget", value)
            }
            options={[
              "₹25–35 Lakhs",
              "₹35–40 Lakhs",
              "₹40–50 Lakhs",
              "₹50–70 Lakhs",
              "₹70 Lakhs+",
            ]}
          />

          <DesignSelect
            label="Family size"
            value={requirements.family}
            onChange={(value) =>
              updateRequirement("family", value)
            }
            options={[
              "1–2 Members",
              "3 Members",
              "4–5 Members",
              "6–7 Members",
              "8+ Members",
            ]}
          />

        </div>

        {/* SPECIAL REQUIREMENTS */}
        <div className="mt-5">

          <label className="mb-2 block text-xs font-bold text-[#526159]">
            Special requirements
          </label>

          <textarea
            value={requirements.special}
            onChange={(e) =>
              updateRequirement("special", e.target.value)
            }
            rows={4}
            placeholder="Example: Need a home office, prayer room, elderly-friendly bedroom, rooftop garden..."
            className="w-full resize-none rounded-xl border border-[#d5ded5] bg-[#fafbf9] px-4 py-3 text-sm outline-none focus:border-[#78967e]"
          />

        </div>

        {/* GENERATE */}
        <div className="mt-7 flex flex-col justify-between gap-4 rounded-2xl bg-[#edf3eb] p-5 md:flex-row md:items-center">

          <div>

            <div className="font-bold text-[#31543e]">
              Ready to generate your home?
            </div>

            <div className="mt-1 text-xs leading-5 text-[#718078]">
              BhoomiAI will combine your land analysis with these requirements
              to generate multiple concepts.
            </div>

          </div>

          <button
            onClick={generateDesigns}
            disabled={generating}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#163d2b] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#0f2d20] disabled:cursor-not-allowed disabled:opacity-70"
          >

            {generating ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating designs...
              </>
            ) : (
              <>
                ✦ Generate AI House Designs
              </>
            )}

          </button>

        </div>

      </div>

      {/* GENERATED DESIGNS */}
      {generated && (
        <div className="mt-8">

          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#7b877f]">
                AI generated concepts
              </div>

              <h2 className="mt-2 text-2xl font-bold">
                Choose your preferred direction
              </h2>

              <p className="mt-2 text-sm text-[#758179]">
                BhoomiAI generated these concepts from your land and
                requirements.
              </p>

            </div>

            <div className="rounded-full bg-[#e8f0e7] px-4 py-2 text-xs font-bold text-[#396148]">
              3 concepts generated
            </div>

          </div>

          <div className="grid gap-5 lg:grid-cols-3">

            <HouseConcept
              selected={selectedDesign === 0}
              onClick={() => setSelectedDesign(0)}
              number="01"
              title="Modern Courtyard"
              description="Open, bright family home with a central courtyard."
              area="2,050 sq.ft"
              floors="2 Floors"
              bedrooms="3 BHK"
              style="Modern"
              accent="courtyard"
            />

            <HouseConcept
              selected={selectedDesign === 1}
              onClick={() => setSelectedDesign(1)}
              number="02"
              title="Contemporary Family"
              description="Efficient family layout with spacious living areas."
              area="1,950 sq.ft"
              floors="2 Floors"
              bedrooms="3 BHK"
              style="Contemporary"
              accent="modern"
            />

            <HouseConcept
              selected={selectedDesign === 2}
              onClick={() => setSelectedDesign(2)}
              number="03"
              title="Vastu Harmony"
              description="Direction-aware layout focused on Vastu principles."
              area="2,100 sq.ft"
              floors="2 Floors"
              bedrooms="3 BHK"
              style="Traditional Modern"
              accent="vastu"
            />

          </div>

          {/* SELECTED DESIGN */}
          <div className="mt-6 rounded-3xl border border-[#d6e0d5] bg-white p-6 shadow-sm">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>

                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#7b877f]">
                  Selected concept
                </div>

                <h3 className="mt-2 text-xl font-bold">
                  {selectedDesign === 0
                    ? "Modern Courtyard"
                    : selectedDesign === 1
                    ? "Contemporary Family"
                    : "Vastu Harmony"}
                </h3>

                <p className="mt-1 text-sm text-[#758179]">
                  This concept will be used for your detailed floor plan.
                </p>

              </div>

              <button
                onClick={onContinue}
                className="rounded-xl bg-[#163d2b] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#0f2d20]"
              >
                Continue to Floor Plan →
              </button>

            </div>

          </div>

        </div>
      )}

      {!generated && (
        <div className="mt-8 rounded-3xl border border-[#dce3da] bg-[#edf2eb] p-6">

          <div className="flex gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#31543e] shadow-sm">
              ✦
            </div>

            <div>

              <div className="font-bold text-[#31543e]">
                What will BhoomiAI generate?
              </div>

              <div className="mt-1 max-w-3xl text-sm leading-6 text-[#718078]">
                Multiple house concepts based on your plot dimensions,
                orientation, family requirements, preferred style, budget,
                parking, outdoor spaces and Vastu preferences.
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   SELLER
========================================================= */

function SellerScreen({ onLogout }) {
  return (
    <main className="min-h-screen bg-[#f4f6f1] p-6">

      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#163d2b] text-white">
              ◈
            </div>

            <div>

              <div className="font-bold">
                BhoomiAI
              </div>

              <div className="text-[10px] uppercase tracking-[0.2em] text-[#7a867f]">
                Seller
              </div>

            </div>

          </div>

          <button
            onClick={onLogout}
            className="rounded-xl border border-[#d3ddd3] px-4 py-2 text-sm font-semibold"
          >
            Logout
          </button>

        </div>

        <div className="mt-20 rounded-3xl border border-[#dce3da] bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e5eee3] text-2xl text-[#31543e]">
            ◇
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Seller Dashboard
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#758179]">
            Your seller workspace will allow you to receive project
            requirements, submit quotations and showcase construction
            materials and services.
          </p>

          <div className="mt-7 inline-flex rounded-full bg-[#edf3eb] px-5 py-2 text-xs font-bold text-[#396148]">
            Seller module coming next
          </div>

        </div>

      </div>

    </main>
  );
}

/* =========================================================
   AUTH MODAL
========================================================= */

function AuthModal({
  mode,
  setMode,
  role,
  setRole,
  formData,
  setFormData,
  onClose,
  onSubmit,
}) {
  const update = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10271c]/60 p-4 backdrop-blur-sm">

      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8">

        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f3ee] text-[#65736b]"
        >
          ×
        </button>

        <div className="pr-10">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#163d2b] text-white">
              ◈
            </div>

            <div>

              <div className="font-bold">
                BhoomiAI
              </div>

              <div className="text-[9px] uppercase tracking-[0.2em] text-[#7b877f]">
                Land to Home
              </div>

            </div>

          </div>

          <h2 className="mt-7 text-2xl font-bold">
            {mode === "login"
              ? "Welcome back"
              : "Create your BhoomiAI account"}
          </h2>

          <p className="mt-2 text-sm text-[#758179]">
            {mode === "login"
              ? "Continue your home design journey."
              : "Choose your account type to get started."}
          </p>

        </div>

        <div className="mt-6 grid grid-cols-2 rounded-xl bg-[#f1f4ef] p-1">

          <button
            onClick={() => setMode("login")}
            className={`rounded-lg py-2.5 text-sm font-semibold ${
              mode === "login"
                ? "bg-white text-[#163d2b] shadow-sm"
                : "text-[#758179]"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setMode("signup")}
            className={`rounded-lg py-2.5 text-sm font-semibold ${
              mode === "signup"
                ? "bg-white text-[#163d2b] shadow-sm"
                : "text-[#758179]"
            }`}
          >
            Sign Up
          </button>

        </div>

        <form onSubmit={onSubmit} className="mt-6">

          {mode === "signup" && (
            <>

              <div className="mb-5 text-xs font-bold uppercase tracking-[0.15em] text-[#7b877f]">
                Account type
              </div>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() => setRole("consumer")}
                  className={`rounded-2xl border p-4 text-left ${
                    role === "consumer"
                      ? "border-[#7d9a82] bg-[#edf3eb]"
                      : "border-[#dce3da]"
                  }`}
                >

                  <div className="text-lg">
                    ⌂
                  </div>

                  <div className="mt-2 text-sm font-bold">
                    Consumer
                  </div>

                  <div className="mt-1 text-xs text-[#7b877f]">
                    Design your home
                  </div>

                </button>

                <button
                  type="button"
                  onClick={() => setRole("seller")}
                  className={`rounded-2xl border p-4 text-left ${
                    role === "seller"
                      ? "border-[#7d9a82] bg-[#edf3eb]"
                      : "border-[#dce3da]"
                  }`}
                >

                  <div className="text-lg">
                    ◇
                  </div>

                  <div className="mt-2 text-sm font-bold">
                    Seller
                  </div>

                  <div className="mt-1 text-xs text-[#7b877f]">
                    Offer products/services
                  </div>

                </button>

              </div>

            </>
          )}

          {mode === "signup" && (
            <div className="mt-5">

              <Input
                label="Full Name"
                placeholder="Your name"
                value={formData.name}
                onChange={(value) =>
                  update("name", value)
                }
                required
              />

              <div className="mt-4">

                <Input
                  label="Contact Number"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.contact}
                  onChange={(value) =>
                    update("contact", value)
                  }
                  required
                />

              </div>

              <div className="mt-4">

                <Input
                  label="Location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(value) =>
                    update("location", value)
                  }
                  required
                />

              </div>

              {role === "seller" && (
                <div className="mt-4">

                  <Input
                    label="Experience"
                    placeholder="e.g. 8 years"
                    value={formData.experience}
                    onChange={(value) =>
                      update("experience", value)
                    }
                    required
                  />

                </div>
              )}

            </div>
          )}

          <div className={mode === "signup" ? "mt-4" : ""}>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(value) =>
                update("email", value)
              }
              required
            />

          </div>

          <div className="mt-4">

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(value) =>
                update("password", value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-[#163d2b] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#0f2d20]"
          >
            {mode === "login"
              ? "Login to BhoomiAI →"
              : `Create ${
                  role === "consumer"
                    ? "Consumer"
                    : "Seller"
                } Account →`}
          </button>

          <div className="mt-5 text-center text-xs text-[#7b877f]">
            Frontend demo — backend authentication will be connected later.
          </div>

        </form>

      </div>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold text-[#526159]">
        {label}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#d5ded5] bg-[#fafbf9] px-4 py-3 text-sm outline-none transition focus:border-[#78967e] focus:ring-2 focus:ring-[#dfeade]"
      />

    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold text-[#526159]">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#d5ded5] bg-[#fafbf9] px-4 py-3 text-sm outline-none focus:border-[#78967e]"
      >

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}

function DesignSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold text-[#526159]">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#d5ded5] bg-[#fafbf9] px-4 py-3 text-sm outline-none focus:border-[#78967e]"
      >

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>

      <div className="text-2xl font-bold">
        {number}
      </div>

      <div className="mt-1 text-xs text-[#758179]">
        {label}
      </div>

    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-xl bg-white/80 p-3">

      <div className="text-[10px] uppercase tracking-wider text-[#7a867f]">
        {label}
      </div>

      <div className="mt-1 text-sm font-bold">
        {value}
      </div>

    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:bg-white/[0.09]">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dcebd7] text-lg text-[#214c34]">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[#b6c8bd]">
        {text}
      </p>

    </div>
  );
}

function StepCard({ number, title, text }) {
  return (
    <div className="rounded-2xl border border-[#dce3da] bg-white p-6">

      <div className="text-sm font-bold text-[#78907f]">
        {number}
      </div>

      <h3 className="mt-5 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[#748078]">
        {text}
      </p>

    </div>
  );
}

function DashboardPreviewCard({
  title,
  value,
  suffix,
}) {
  return (
    <div className="rounded-2xl border border-[#e0e6df] bg-[#fbfcfa] p-4">

      <div className="text-xs text-[#7b877f]">
        {title}
      </div>

      <div className="mt-2 text-2xl font-bold">

        {value}

        <span className="ml-1 text-xs font-medium text-[#7a867f]">
          {suffix}
        </span>

      </div>

    </div>
  );
}

function DashStat({
  title,
  value,
  suffix,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-[#dfe5dd] bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="text-xs font-semibold text-[#78847d]">
          {title}
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3eb] text-[#31543e]">
          {icon}
        </div>

      </div>

      <div className="mt-5 text-3xl font-bold">

        {value}

        <span className="ml-1 text-sm font-medium text-[#7b877f]">
          {suffix}
        </span>

      </div>

    </div>
  );
}

function ProgressRow({ label, value }) {
  return (
    <div className="rounded-xl bg-[#f5f7f3] p-4">

      <div className="flex justify-between text-xs font-semibold">

        <span>{label}</span>

        <span className="text-[#708078]">
          {value}%
        </span>

      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dfe6de]">

        <div
          className="h-full rounded-full bg-[#5c8666]"
          style={{ width: `${value}%` }}
        />

      </div>

    </div>
  );
}

function QuickAction({
  icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl border border-[#e1e7df] p-4 text-left transition hover:border-[#bfcfbe] hover:bg-[#f8faf7]"
    >

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3eb] text-[#31543e]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <div className="text-sm font-bold">
          {title}
        </div>

        <div className="mt-1 text-xs text-[#7b877f]">
          {text}
        </div>

      </div>

      <div className="text-[#708078]">
        →
      </div>

    </button>
  );
}

function ActivityCard({
  number,
  title,
  text,
  done,
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-[#f5f7f3] p-4">

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
          done
            ? "bg-[#dfeee0] text-[#396148]"
            : "bg-white text-[#78847d]"
        }`}
      >
        {done ? "✓" : number}
      </div>

      <div>

        <div className="text-sm font-bold">
          {title}
        </div>

        <div className="mt-1 text-xs text-[#7b877f]">
          {text}
        </div>

      </div>

    </div>
  );
}

function AnalysisStep({
  number,
  title,
  active,
  completed,
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
          active
            ? "bg-[#163d2b] text-white"
            : completed
            ? "bg-[#dfeee0] text-[#396148]"
            : "border border-[#d2ddd1] bg-white text-[#7a867f]"
        }`}
      >
        {completed ? "✓" : number}
      </div>

      <span
        className={`text-sm font-semibold ${
          active
            ? "text-[#31543e]"
            : "text-[#87928b]"
        }`}
      >
        {title}
      </span>

    </div>
  );
}

function AnalysisResult({
  icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="rounded-2xl border border-[#dfe5dd] bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3eb] text-[#31543e]">
          {icon}
        </div>

      </div>

      <div className="mt-5 text-xs font-semibold text-[#7b877f]">
        {label}
      </div>

      <div className="mt-1 text-lg font-bold">
        {value}
      </div>

      <div className="mt-1 text-xs text-[#7b877f]">
        {detail}
      </div>

    </div>
  );
}

function ClimateMetric({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl bg-[#f5f7f3] p-4">

      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#31543e]">
        {icon}
      </div>

      <div className="mt-4 text-xs text-[#7b877f]">
        {label}
      </div>

      <div className="mt-1 text-lg font-bold">
        {value}
      </div>

    </div>
  );
}

/* =========================================================
   HOUSE DESIGN COMPONENTS
========================================================= */

function SiteSummary({
  icon,
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-[#dfe5dd] bg-white p-5 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3eb] text-[#31543e]">
          {icon}
        </div>

        <div>

          <div className="text-xs text-[#7b877f]">
            {title}
          </div>

          <div className="mt-1 text-sm font-bold">
            {value}
          </div>

        </div>

      </div>

    </div>
  );
}

function HouseConcept({
  selected,
  onClick,
  number,
  title,
  description,
  area,
  floors,
  bedrooms,
  style,
  accent,
}) {
  return (
    <button
      onClick={onClick}
      className={`group overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        selected
          ? "border-[#5d8067] ring-2 ring-[#dbe9da]"
          : "border-[#dce3da]"
      }`}
    >

      {/* HOUSE PREVIEW */}
      <div className="relative h-60 overflow-hidden bg-[#dfe8dc]">

        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.35)_1px,transparent_1px)] bg-[length:28px_28px]" />

        {/* LAND */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#b9cfad]" />

        {/* HOUSE */}
        <div className="absolute bottom-12 left-1/2 h-24 w-40 -translate-x-1/2 bg-[#f2eee5] shadow-xl">

          <div
            className={`absolute -top-14 left-[-12px] h-0 w-0 border-l-[92px] border-r-[92px] border-b-[65px] border-l-transparent border-r-transparent ${
              accent === "vastu"
                ? "border-b-[#866e55]"
                : accent === "courtyard"
                ? "border-b-[#708d76]"
                : "border-b-[#657f70]"
            }`}
          />

          <div className="absolute left-6 top-8 h-10 w-7 bg-[#7899a6]" />

          <div className="absolute right-6 top-8 h-10 w-7 bg-[#7899a6]" />

          <div className="absolute bottom-0 left-1/2 h-12 w-8 -translate-x-1/2 bg-[#765a45]" />

          {accent === "courtyard" && (
            <div className="absolute left-1/2 top-3 h-10 w-10 -translate-x-1/2 rounded-full border-4 border-[#91a98d] bg-[#b9cfad]" />
          )}

        </div>

        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#31543e] shadow">
          Concept {number}
        </div>

        {selected && (
          <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#163d2b] text-sm font-bold text-white shadow">
            ✓
          </div>
        )}

      </div>

      <div className="p-5">

        <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#7b877f]">
          {style}
        </div>

        <h3 className="mt-2 text-xl font-bold">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#758179]">
          {description}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">

          <ConceptMetric
            label="Area"
            value={area}
          />

          <ConceptMetric
            label="Floors"
            value={floors}
          />

          <ConceptMetric
            label="Home"
            value={bedrooms}
          />

        </div>

      </div>

    </button>
  );
}

function ConceptMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-[#f4f6f2] p-3">

      <div className="text-[10px] uppercase tracking-wider text-[#7d8982]">
        {label}
      </div>

      <div className="mt-1 text-xs font-bold">
        {value}
      </div>

    </div>
  );
}

/* =========================================================
   PLACEHOLDER
========================================================= */

function DashboardPlaceholder({
  title,
  onBack,
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-6">

      <div className="w-full rounded-3xl border border-[#dce3da] bg-white p-10 text-center shadow-sm">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e5eee3] text-2xl text-[#31543e]">
          ✦
        </div>

        <div className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#7b877f]">
          BhoomiAI Workspace
        </div>

        <h1 className="mt-3 text-3xl font-bold">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#758179]">
          This section is connected to your consumer dashboard and will be
          developed as the next stage of the BhoomiAI workflow.
        </p>

        <button
          onClick={onBack}
          className="mt-7 rounded-xl bg-[#163d2b] px-6 py-3 text-sm font-bold text-white"
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   MENU ICONS
========================================================= */

function getMenuIcon(item) {
  const icons = {
    Overview: "⌂",
    "My Projects": "▣",
    "Land Analysis": "◎",
    "House Designs": "⌂",
    "3D Studio": "◇",
    Materials: "▤",
    "Cost Estimate": "₹",
    Profile: "○",
  };

  return icons[item] || "•";
}