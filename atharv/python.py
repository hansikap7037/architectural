import streamlit as st
import pytesseract
from PIL import Image
import fitz
import cv2
import numpy as np
import pandas as pd
import re
import json
import os
from datetime import datetime

# Tesseract OCR path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# ============================================================
# PAGE CONFIGURATION
# ============================================================

st.set_page_config(
    page_title="Land & Property Scanner",
    page_icon="🏠",
    layout="wide"
)


# ============================================================
# TESSERACT CONFIGURATION
# ============================================================

TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH
else:
    st.error(
        "Tesseract OCR was not found. "
        "Please install Tesseract or check the installation path."
    )


# ============================================================
# CUSTOM CSS
# ============================================================

st.markdown("""
<style>

.main {
    background-color: #f5f7fa;
}

.title {
    font-size: 42px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 5px;
}

.subtitle {
    text-align: center;
    color: #666;
    font-size: 18px;
    margin-bottom: 30px;
}

.card {
    background-color: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0px 2px 10px rgba(0,0,0,0.08);
    margin-bottom: 20px;
}

.success-box {
    padding: 15px;
    border-radius: 10px;
    background-color: #e8f5e9;
    border-left: 5px solid #2e7d32;
}

.warning-box {
    padding: 15px;
    border-radius: 10px;
    background-color: #fff3e0;
    border-left: 5px solid #ef6c00;
}

.danger-box {
    padding: 15px;
    border-radius: 10px;
    background-color: #ffebee;
    border-left: 5px solid #c62828;
}

</style>
""", unsafe_allow_html=True)


# ============================================================
# TITLE
# ============================================================

st.markdown(
    '<div class="title">🏠 Land & Property Document Scanner</div>',
    unsafe_allow_html=True
)

st.markdown(
    '<div class="subtitle">'
    'AI-assisted document scanning and property information extraction'
    '</div>',
    unsafe_allow_html=True
)


# ============================================================
# SESSION STATE
# ============================================================

if "extracted_text" not in st.session_state:
    st.session_state.extracted_text = ""

if "property_data" not in st.session_state:
    st.session_state.property_data = {}


# ============================================================
# IMAGE PREPROCESSING
# ============================================================

def preprocess_image(image):
    """
    Improve image quality before OCR.
    """

    img = np.array(image)

    # Convert RGB to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

    # Remove noise
    gray = cv2.GaussianBlur(gray, (3, 3), 0)

    # Adaptive thresholding
    processed = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11,
        2
    )

    return processed


# ============================================================
# OCR IMAGE
# ============================================================

def extract_text_from_image(image):
    """
    Extract text from an image using Tesseract OCR.
    """

    processed_image = preprocess_image(image)

    text = pytesseract.image_to_string(
        processed_image,
        config="--psm 6"
    )

    return text


# ============================================================
# OCR PDF
# ============================================================

def extract_text_from_pdf(pdf_bytes):
    """
    Extract text from PDF.
    Handles both normal PDFs and scanned PDFs.
    """

    document = fitz.open(stream=pdf_bytes, filetype="pdf")

    complete_text = ""

    for page_number in range(len(document)):

        page = document[page_number]

        # First try normal PDF text extraction
        text = page.get_text()

        if text.strip():

            complete_text += (
                f"\n\n--- PAGE {page_number + 1} ---\n\n"
            )

            complete_text += text

        else:

            # If PDF contains scanned image,
            # render page to image.
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))

            img = Image.frombytes(
                "RGB",
                [pix.width, pix.height],
                pix.samples
            )

            page_text = extract_text_from_image(img)

            complete_text += (
                f"\n\n--- PAGE {page_number + 1} ---\n\n"
            )

            complete_text += page_text

    document.close()

    return complete_text


# ============================================================
# CLEAN TEXT
# ============================================================

def clean_text(text):

    # Remove excessive spaces
    text = re.sub(r"[ \t]+", " ", text)

    # Remove excessive blank lines
    text = re.sub(r"\n\s*\n+", "\n\n", text)

    return text.strip()


# ============================================================
# GENERIC REGEX SEARCH
# ============================================================

def search_pattern(text, patterns):

    for pattern in patterns:

        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if match:

            try:
                return match.group(1).strip()
            except:
                return match.group(0).strip()

    return None


# ============================================================
# EXTRACT OWNER NAME
# ============================================================

def extract_owner_name(text):

    patterns = [

        r"(?:owner|owner's name|property owner|land owner)\s*[:\-]?\s*([A-Za-z .]{3,100})",

        r"(?:name of owner|name of the owner)\s*[:\-]?\s*([A-Za-z .]{3,100})",

        r"(?:owned by|registered in favour of)\s*[:\-]?\s*([A-Za-z .]{3,100})",

        r"(?:श्री|श्रीमती|स्वामी|स्वामिनी)\s*([A-Za-z .]{3,100})"
    ]

    result = search_pattern(text, patterns)

    return result


# ============================================================
# EXTRACT PROPERTY ADDRESS
# ============================================================

def extract_address(text):

    patterns = [

        r"(?:property address|property location|address)\s*[:\-]?\s*(.{10,200})",

        r"(?:situated at|located at)\s*[:\-]?\s*(.{10,200})",

        r"(?:village|vill\.|ग्राम)\s*[:\-]?\s*(.{3,100})"
    ]

    result = search_pattern(text, patterns)

    if result:
        return result

    return None


# ============================================================
# EXTRACT AREA
# ============================================================

def extract_area(text):

    patterns = [

        r"(?:area|land area|plot area|property area)\s*[:\-]?\s*([\d,.]+\s*(?:sq\.?\s*ft|sqft|square feet|sq\.?\s*m|sqm|square meter|acre|acres|hectare|hectares|bigha|बीघा))",

        r"([\d,.]+)\s*(sq\.?\s*ft|sqft|square feet|sq\.?\s*m|sqm|square meter|acre|acres|hectare|hectares|bigha)"
    ]

    result = search_pattern(text, patterns)

    return result


# ============================================================
# EXTRACT KHASRA NUMBER
# ============================================================

def extract_khasra_number(text):

    patterns = [

        r"(?:khasra\s*(?:no\.?|number)?)\s*[:\-]?\s*([A-Za-z0-9\/\-]+)",

        r"(?:खसरा\s*(?:नंबर|संख्या|नं\.?)?)\s*[:\-]?\s*([A-Za-z0-9\/\-]+)"
    ]

    return search_pattern(text, patterns)


# ============================================================
# EXTRACT SURVEY NUMBER
# ============================================================

def extract_survey_number(text):

    patterns = [

        r"(?:survey\s*(?:no\.?|number)?)\s*[:\-]?\s*([A-Za-z0-9\/\-]+)",

        r"(?:survey number)\s*[:\-]?\s*([A-Za-z0-9\/\-]+)"
    ]

    return search_pattern(text, patterns)


# ============================================================
# EXTRACT PLOT NUMBER
# ============================================================

def extract_plot_number(text):

    patterns = [

        r"(?:plot\s*(?:no\.?|number)?)\s*[:\-]?\s*([A-Za-z0-9\/\-]+)",

        r"(?:plot number)\s*[:\-]?\s*([A-Za-z0-9\/\-]+)"
    ]

    return search_pattern(text, patterns)


# ============================================================
# EXTRACT REGISTRATION NUMBER
# ============================================================

def extract_registration_number(text):

    patterns = [

        r"(?:registration\s*(?:no\.?|number)?)\s*[:\-]?\s*([A-Za-z0-9\/\-]+)",

        r"(?:registered\s*(?:no\.?|number)?)\s*[:\-]?\s*([A-Za-z0-9\/\-]+)",

        r"(?:regn\.?\s*(?:no\.?|number)?)\s*[:\-]?\s*([A-Za-z0-9\/\-]+)"
    ]

    return search_pattern(text, patterns)


# ============================================================
# EXTRACT DOCUMENT NUMBER
# ============================================================

def extract_document_number(text):

    patterns = [

        r"(?:document\s*(?:no\.?|number)?)\s*[:\-]?\s*([A-Za-z0-9\/\-]+)",

        r"(?:deed\s*(?:no\.?|number)?)\s*[:\-]?\s*([A-Za-z0-9\/\-]+)"
    ]

    return search_pattern(text, patterns)


# ============================================================
# EXTRACT DATE
# ============================================================

def extract_date(text):

    patterns = [

        r"\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b",

        r"\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b"
    ]

    for pattern in patterns:

        matches = re.findall(
            pattern,
            text,
            re.IGNORECASE
        )

        if matches:
            return matches[0]

    return None


# ============================================================
# EXTRACT DISTRICT
# ============================================================

def extract_district(text):

    patterns = [

        r"(?:district|dist\.?)\s*[:\-]?\s*([A-Za-z .]{3,100})",

        r"(?:जिला)\s*[:\-]?\s*([A-Za-z .]{3,100})"
    ]

    return search_pattern(text, patterns)


# ============================================================
# EXTRACT STATE
# ============================================================

def extract_state(text):

    indian_states = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Delhi",
        "Jammu and Kashmir",
        "Ladakh"
    ]

    text_lower = text.lower()

    for state in indian_states:

        if state.lower() in text_lower:
            return state

    return None


# ============================================================
# EXTRACT MONEY VALUE
# ============================================================

def extract_property_value(text):

    patterns = [

        r"(?:sale consideration|sale value|property value|total value|consideration)\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([\d,]+)",

        r"(?:₹|rs\.?|inr)\s*([\d,]+)"
    ]

    result = search_pattern(text, patterns)

    if result:
        return "₹ " + result

    return None


# ============================================================
# EXTRACT BUYER
# ============================================================

def extract_buyer(text):

    patterns = [

        r"(?:buyer|purchaser|purchaser's name)\s*[:\-]?\s*([A-Za-z .]{3,100})",

        r"(?:sold to|transferred to)\s*[:\-]?\s*([A-Za-z .]{3,100})"
    ]

    return search_pattern(text, patterns)


# ============================================================
# EXTRACT SELLER
# ============================================================

def extract_seller(text):

    patterns = [

        r"(?:seller|vendor|seller's name)\s*[:\-]?\s*([A-Za-z .]{3,100})",

        r"(?:sold by|transferred by)\s*[:\-]?\s*([A-Za-z .]{3,100})"
    ]

    return search_pattern(text, patterns)


# ============================================================
# PROPERTY TYPE
# ============================================================

def detect_property_type(text):

    text_lower = text.lower()

    if "residential" in text_lower:
        return "Residential"

    if "commercial" in text_lower:
        return "Commercial"

    if "agricultural" in text_lower:
        return "Agricultural"

    if "industrial" in text_lower:
        return "Industrial"

    if "house" in text_lower:
        return "House"

    if "apartment" in text_lower or "flat" in text_lower:
        return "Apartment"

    if "plot" in text_lower:
        return "Plot"

    return None


# ============================================================
# EXTRACT ALL PROPERTY INFORMATION
# ============================================================

def extract_property_information(text):

    property_data = {

        "Owner Name": extract_owner_name(text),

        "Buyer Name": extract_buyer(text),

        "Seller Name": extract_seller(text),

        "Property Address": extract_address(text),

        "Property Type": detect_property_type(text),

        "Area": extract_area(text),

        "Khasra Number": extract_khasra_number(text),

        "Survey Number": extract_survey_number(text),

        "Plot Number": extract_plot_number(text),

        "Registration Number": extract_registration_number(text),

        "Document Number": extract_document_number(text),

        "Document Date": extract_date(text),

        "District": extract_district(text),

        "State": extract_state(text),

        "Property Value": extract_property_value(text)
    }

    return property_data


# ============================================================
# DOCUMENT COMPLETENESS ANALYSIS
# ============================================================

def analyze_document(property_data):

    important_fields = [

        "Owner Name",
        "Property Address",
        "Area",
        "Khasra Number",
        "Registration Number",
        "Document Date"
    ]

    missing_fields = []

    available_fields = []

    for field in important_fields:

        value = property_data.get(field)

        if value:
            available_fields.append(field)

        else:
            missing_fields.append(field)

    total = len(important_fields)

    available = len(available_fields)

    score = int((available / total) * 100)

    return score, available_fields, missing_fields


# ============================================================
# RISK INDICATORS
# ============================================================

def detect_risk_indicators(text, property_data):

    risks = []

    text_lower = text.lower()

    # Missing owner
    if not property_data.get("Owner Name"):
        risks.append(
            "Owner name could not be identified."
        )

    # Missing property area
    if not property_data.get("Area"):
        risks.append(
            "Property/land area could not be identified."
        )

    # Missing registration number
    if not property_data.get("Registration Number"):
        risks.append(
            "Registration number could not be identified."
        )

    # Dispute keywords
    dispute_keywords = [
        "dispute",
        "litigation",
        "court case",
        "stay order",
        "injunction",
        "encroachment",
        "mortgage",
        "loan",
        "charge",
        "disputed",
        "विवाद",
        "मुकदमा"
    ]

    for keyword in dispute_keywords:

        if keyword in text_lower:

            risks.append(
                f"Potential legal/encumbrance keyword detected: {keyword}"
            )

    return risks


# ============================================================
# PROPERTY SCORE
# ============================================================

def calculate_property_score(
    completeness_score,
    risks
):

    score = completeness_score

    # Deduct points for risk indicators
    score -= min(len(risks) * 5, 30)

    score = max(0, min(score, 100))

    return score


# ============================================================
# JSON REPORT
# ============================================================

def generate_report(
    property_data,
    completeness_score,
    missing_fields,
    risks,
    property_score
):

    report = {

        "generated_at":
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),

        "property_information":
            property_data,

        "document_analysis": {

            "completeness_score":
                completeness_score,

            "missing_information":
                missing_fields,

            "risk_indicators":
                risks,

            "property_analysis_score":
                property_score
        },

        "disclaimer":
            "This report extracts information from uploaded documents. "
            "It does not constitute legal verification, title verification, "
            "ownership verification, or government record verification."
    }

    return report


# ============================================================
# SIDEBAR
# ============================================================

with st.sidebar:

    st.header("📋 Scanner Controls")

    st.write(
        "Upload a land/property document to begin analysis."
    )

    st.divider()

    st.info(
        "Supported formats:\n"
        "- PDF\n"
        "- PNG\n"
        "- JPG\n"
        "- JPEG"
    )

    st.divider()

    st.write("### Scanner Pipeline")

    st.write("1️⃣ Upload document")
    st.write("2️⃣ OCR scanning")
    st.write("3️⃣ Text extraction")
    st.write("4️⃣ Data identification")
    st.write("5️⃣ Property analysis")
    st.write("6️⃣ Report generation")


# ============================================================
# FILE UPLOAD
# ============================================================

uploaded_file = st.file_uploader(
    "📄 Upload Land / Property Document",
    type=[
        "pdf",
        "png",
        "jpg",
        "jpeg"
    ]
)


# ============================================================
# PROCESS FILE
# ============================================================

if uploaded_file is not None:

    st.success(
        f"Uploaded: {uploaded_file.name}"
    )

    file_extension = uploaded_file.name.lower().split(".")[-1]

    extracted_text = ""

    # --------------------------------------------------------
    # IMAGE
    # --------------------------------------------------------

    if file_extension in ["png", "jpg", "jpeg"]:

        image = Image.open(uploaded_file)

        st.subheader("📷 Uploaded Document")

        st.image(
            image,
            caption="Document Preview",
            use_container_width=True
        )

        with st.spinner("🔍 Scanning document..."):

            extracted_text = extract_text_from_image(
                image
            )

    # --------------------------------------------------------
    # PDF
    # --------------------------------------------------------

    elif file_extension == "pdf":

        pdf_bytes = uploaded_file.read()

        with st.spinner("🔍 Scanning PDF document..."):

            extracted_text = extract_text_from_pdf(
                pdf_bytes
            )

    # --------------------------------------------------------
    # CLEAN TEXT
    # --------------------------------------------------------

    extracted_text = clean_text(
        extracted_text
    )

    st.session_state.extracted_text = extracted_text

    # ========================================================
    # OCR RESULT
    # ========================================================

    st.subheader("🔍 Extracted Document Text")

    with st.expander(
        "View complete OCR text",
        expanded=False
    ):

        st.text_area(
            "OCR Result",
            extracted_text,
            height=400
        )

    # ========================================================
    # PROPERTY INFORMATION EXTRACTION
    # ========================================================

    with st.spinner(
        "🤖 Analyzing property information..."
    ):

        property_data = extract_property_information(
            extracted_text
        )

    st.session_state.property_data = property_data

    # ========================================================
    # DOCUMENT ANALYSIS
    # ========================================================

    completeness_score, available_fields, missing_fields = \
        analyze_document(property_data)

    risks = detect_risk_indicators(
        extracted_text,
        property_data
    )

    property_score = calculate_property_score(
        completeness_score,
        risks
    )

    # ========================================================
    # SCORE DISPLAY
    # ========================================================

    st.subheader("📊 Document Analysis")

    col1, col2, col3 = st.columns(3)

    with col1:

        st.metric(
            "Information Completeness",
            f"{completeness_score}%"
        )

    with col2:

        st.metric(
            "Property Analysis Score",
            f"{property_score}/100"
        )

    with col3:

        st.metric(
            "Risk Indicators",
            len(risks)
        )

    # ========================================================
    # PROPERTY DATA
    # ========================================================

    st.subheader("🏠 Property Information")

    data_rows = []

    for key, value in property_data.items():

        if value:

            display_value = value

        else:

            display_value = "Not Found"

        data_rows.append(
            {
                "Field": key,
                "Extracted Information": display_value
            }
        )

    df = pd.DataFrame(
        data_rows
    )

    st.dataframe(
        df,
        use_container_width=True,
        hide_index=True
    )

    # ========================================================
    # MISSING INFORMATION
    # ========================================================

    if missing_fields:

        st.subheader(
            "⚠️ Missing Information"
        )

        st.warning(
            "The following important information "
            "could not be identified:"
        )

        for field in missing_fields:

            st.write(
                f"❌ {field}"
            )

    else:

        st.success(
            "✅ All major information fields were identified."
        )

    # ========================================================
    # RISK ANALYSIS
    # ========================================================

    st.subheader(
        "⚠️ Document Risk Indicators"
    )

    if risks:

        for risk in risks:

            st.warning(
                f"⚠️ {risk}"
            )

    else:

        st.success(
            "✅ No obvious risk keywords were detected "
            "in the uploaded document."
        )

    # ========================================================
    # VERIFICATION STATUS
    # ========================================================

    st.subheader(
        "🔐 Verification Status"
    )

    st.info(
        """
        **Document-derived information only**

        This scanner extracts information from the uploaded
        document. It does NOT independently verify:

        • Legal ownership  
        • Government land records  
        • Title validity  
        • Encumbrances  
        • Court disputes  
        • Property boundaries  
        • Land-use permissions  
        • Building approvals  

        These should be verified using official government
        records and appropriate legal professionals.
        """
    )

    # ========================================================
    # GENERATE REPORT
    # ========================================================

    report = generate_report(
        property_data,
        completeness_score,
        missing_fields,
        risks,
        property_score
    )

    json_report = json.dumps(
        report,
        indent=4,
        ensure_ascii=False
    )

    st.subheader(
        "📥 Download Property Report"
    )

    col1, col2 = st.columns(2)

    with col1:

        st.download_button(
            label="📊 Download JSON Report",
            data=json_report,
            file_name="property_analysis.json",
            mime="application/json"
        )

    with col2:

        st.download_button(
            label="📄 Download Extracted Text",
            data=extracted_text,
            file_name="property_document_text.txt",
            mime="text/plain"
        )


# ============================================================
# EMPTY STATE
# ============================================================

else:

    st.info(
        "👆 Upload a property document above to start scanning."
    )

    st.markdown(
        """
        ### 💡 What this scanner does

        **1. Document Scanning**

        Reads uploaded property documents using OCR.

        **2. Information Extraction**

        Identifies important property information such as:

        - Owner
        - Plot number
        - Khasra number
        - Survey number
        - Area
        - Address
        - Registration number
        - Document date
        - Property value
        - District
        - State

        **3. Document Analysis**

        Calculates how much important information
        was successfully identified.

        **4. Risk Indicators**

        Searches the document for terms related to
        disputes, mortgages, litigation, encroachment,
        etc.

        **5. Property Report**

        Generates a machine-readable JSON report
        that can be connected to your 3D property platform.
        """
    )