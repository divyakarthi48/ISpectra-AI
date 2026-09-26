# ISpectra AI

### AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications

ISpectra AI is an AI-powered procurement standards intelligence platform that helps users identify the **Indian Standards (IS) applicable to procurement specifications**.

It analyses procurement requirements, extracts relevant product and technical information, searches the Standards Knowledge Base, identifies applicable standards, and provides explainable recommendations along with version, amendment, testing, safety, certification, and related-standard information.

---

## 🎯 Problem Statement

### Smart India Hackathon 2026 — Problem Statement 26108

**AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications**

Procurement teams often need to determine which Indian Standards apply to a particular product, material, grade, technical specification, or procurement requirement.

Manually identifying the correct standards can involve searching through numerous standards, versions, amendments, related standards, testing requirements, and certification information.

**ISpectra AI simplifies this process by converting procurement requirements into structured, explainable standards recommendations.**

---

# 💡 How ISpectra AI Works

```text
Procurement Requirement
        │
        ▼
Input Processing
        │
        ▼
Requirement Understanding
        │
        ├── Product / Material
        ├── Grade / Specification
        ├── Quantity
        ├── Technical Requirements
        └── Existing IS References
        │
        ▼
Standards Knowledge Base
        │
        ▼
Standards Matching Engine
        │
        ▼
Recommendation & Verification
        │
        ├── Applicable Standards
        ├── Related Standards
        ├── Testing Standards
        ├── Safety Standards
        ├── Certification Requirements
        └── Version / Amendment Information
        │
        ▼
Procurement Intelligence Report
```

---

# ✨ Key Features

## 1. Procurement Requirement Analysis

Enter procurement requirements using natural language.

For example:

> Procure 500 bags of 43 grade Portland cement for a construction project.

ISpectra AI analyses the requirement and identifies the relevant product and technical information needed for standards matching.

---

## 2. Multi-Format Input

The platform supports procurement information through:

* Text input
* PDF files
* DOCX files
* TXT files
* Voice input

This allows users to work with both manually entered specifications and existing procurement documents.

---

## 3. Indian Standards Recommendation

The Recommendation Engine identifies standards relevant to the procurement requirement.

Recommendations can include:

* Primary standards
* Related standards
* Testing standards
* Safety standards
* Normative references
* Certification mappings

Each recommendation is accompanied by contextual reasoning.

---

## 4. Standards Knowledge Base

ISpectra AI maintains a structured Standards Knowledge Base containing information such as:

* IS code
* Standard title
* Year
* Version
* Amendments
* Related standards
* Normative references
* Testing standards
* Safety references
* Certification mappings
* Cross-references

The Knowledge Base is structured so that standards information can be updated independently from the application logic.

---

## 5. Standards Matching Engine

The system analyses the procurement requirement and compares its extracted concepts against the Standards Knowledge Base.

The matching process considers factors such as:

* Product type
* Material
* Grade
* Technical terminology
* Procurement context
* Standard references
* Related concepts
* Existing IS codes

The resulting standards are ranked according to their relevance to the requirement.

---

## 6. Explainable Recommendations

ISpectra AI does not simply return an IS code.

For each recommendation, the system provides information explaining:

```text
Procurement Requirement
        ↓
Identified Product / Specification
        ↓
Applicable Indian Standard
        ↓
Reason for Recommendation
        ↓
Related Requirements & References
```

This makes the recommendation process easier to understand and verify.

---

## 7. Version & Amendment Mapping

The system analyses standard versions and amendment information available in the Knowledge Base.

It can identify:

* Standard versions
* Amendment information
* Latest available version
* Year information
* Outdated references
* Unknown standard references
* Multi-part standards

This helps procurement teams identify potential version-related issues in specifications.

---

## 8. Existing IS Reference Verification

If a procurement document already contains an IS code, ISpectra AI can identify the referenced standard and compare it with the Standards Knowledge Base.

The system can indicate whether:

* The standard exists in the Knowledge Base
* The referenced year is available
* A newer version exists
* Related standards are available
* Additional verification is required

---

## 9. Human Verification

Standards recommendations can be reviewed before being used in procurement workflows.

Users can:

* Review recommendations
* Approve recommendations
* Reject recommendations
* Add review notes
* Verify cited standards

This keeps human review within the standards identification workflow.

---

## 10. Multilingual Support

The interface supports:

* English
* Hindi

Procurement information can also be processed through supported multilingual input workflows.

---

## 11. Voice Input

ISpectra AI supports browser-based voice input using speech recognition.

Users can speak procurement requirements instead of manually typing them.

Example:

> "We need 500 bags of 43 grade Portland cement."

The recognized requirement is then processed through the standards recommendation workflow.

---

## 12. Cost Analysis

ISpectra AI provides a cost analysis section associated with recommended procurement standards.

This allows procurement information and standards analysis to be viewed together.

---

## 13. PDF & Excel Reports

Analysis results can be exported into structured reports.

Supported formats:

* PDF
* Excel

Reports can contain:

* Recommended Indian Standards
* Standards cited in the input
* Supporting references
* Cost analysis
* Recommendation information
* Verification information

---

## 14. Knowledge Base Management

The Standards Knowledge Base can be updated through a JSON file.

This allows new standards and updated standard information to be incorporated without restructuring the entire application.

The Knowledge Base can also be downloaded as structured JSON for maintenance and versioning.

---

# 🖥️ Application Screens

ISpectra AI provides dedicated interfaces for:

### Dashboard

Provides an overview of procurement standards intelligence.

### Procurement Analysis

Accepts procurement requirements and documents for analysis.

### Standards

Provides access to the Standards Knowledge Base, including standards, versions, amendments, relationships, and references.

### Recommendations

Displays standards identified for the analysed procurement specification along with reasoning and supporting information.

### Reports

Provides generated procurement standards reports in PDF and Excel formats.

---

# 🏗️ System Architecture

```text
┌───────────────────────────────────────────┐
│              ISpectra AI UI               │
│                                           │
│ Dashboard │ Analysis │ Standards │ Reports│
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│          Input Processing Layer           │
│                                           │
│ Text │ PDF │ DOCX │ TXT │ Voice           │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│        Requirement Intelligence           │
│                                           │
│ Pre-processing                            │
│ Language Processing                       │
│ Entity Extraction                         │
│ Requirement Identification                │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│        Standards Knowledge Base           │
│                                           │
│ IS Codes │ Versions │ Amendments          │
│ Related │ Testing │ Safety │ Certification│
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│        Recommendation Engine              │
│                                           │
│ Matching │ Ranking │ Verification         │
│ Explanation │ Reference Mapping           │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│                  Output                   │
│                                           │
│ Recommendations │ Verification │ Reports  │
│ PDF │ Excel │ Cost Analysis               │
└───────────────────────────────────────────┘
```

---

# 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Responsive Web Design

### Intelligence Layer

* Natural Language Processing
* Language Detection
* Entity Extraction
* Semantic Matching
* Requirement Analysis
* Recommendation Ranking
* Rule-Based Verification

### Document Processing

* PDF.js
* Mammoth.js

### Report Generation

* jsPDF
* jsPDF AutoTable
* SheetJS

### Voice

* Web Speech API

### Internationalization

* English
* Hindi
* Devanagari support

### Fonts

* IBM Plex Sans
* Source Serif
* Noto Sans Devanagari
* Noto Serif Devanagari

---

# 📁 Project Structure

```text
ispectra-ai/
│
├── ispectra-ai.html
├── README.md
│
└── src/
    ├── app.js
    ├── engine.js
    ├── i18n.js
    ├── kb.js
    ├── reports.js
    └── styles.css
```

### `ispectra-ai.html`

Main application entry point containing the complete application interface.

### `src/app.js`

Handles:

* Application state
* UI interactions
* Navigation
* Procurement input
* Analysis workflow
* Recommendation display
* Verification
* Knowledge Base updates
* Report workflow

### `src/engine.js`

Contains the core intelligence and standards matching logic:

* Text preprocessing
* Language processing
* Entity extraction
* Requirement analysis
* Standards matching
* Recommendation ranking
* Verification logic

### `src/kb.js`

Contains the structured Standards Knowledge Base and relationships between standards.

### `src/i18n.js`

Contains multilingual interface strings and language handling.

### `src/reports.js`

Handles PDF and Excel report generation.

### `src/styles.css`

Contains the complete application styling and responsive layout.

---

# 🚀 Getting Started

## Prerequisites

You only need:

* A modern web browser
* Python 3.x (optional, for running a local server)

Chrome or Microsoft Edge is recommended for voice input.

---

## Run Locally

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/ispectra-ai.git
```

Navigate into the project:

```bash
cd ispectra-ai
```

Start a local server:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/ispectra-ai.html
```

---

## Direct Launch

The application can also be opened directly by launching:

```text
ispectra-ai.html
```

in a modern browser.

---

# 📊 Standards Knowledge Base

The Knowledge Base is structured around Indian Standards and their relationships.

A standard record can contain information such as:

```json
{
  "id": "IS XXXX",
  "title": "Standard Title",
  "year": 2025,
  "amendments": [],
  "relatedStandards": [],
  "testingStandards": [],
  "safetyStandards": [],
  "certification": []
}
```

The Knowledge Base can be exported and updated using JSON.

---

# 🔄 Knowledge Base Update Workflow

```text
Updated Standards JSON
        │
        ▼
Knowledge Base Validation
        │
        ▼
Standards Records
        │
        ▼
Relationship Mapping
        │
        ▼
Recommendation Engine
        │
        ▼
Updated Recommendations
```

This architecture allows the standards repository to evolve as new standards, amendments, and relationships are incorporated.

---

# 🔮 Future Expansion

ISpectra AI can be extended with:

* Large-scale BIS standards ingestion
* Automated standards update pipelines
* OCR for scanned procurement documents
* Vector database integration
* Advanced embedding-based semantic retrieval
* LLM-powered specification understanding
* Government procurement portal integration
* Enterprise authentication
* Role-based access control
* Centralized standards management
* Advanced analytics
* API-based integration with procurement systems
* Automated compliance alerts

---

# 🎯 Target Users

ISpectra AI can support:

* Government procurement departments
* Public-sector organizations
* Procurement officers
* Engineering departments
* Infrastructure organizations
* Tender preparation teams
* Quality and compliance teams
* Enterprises involved in technical procurement

---

# 🏛️ Smart India Hackathon

**Problem Statement ID:** 26108

**Problem Statement:**

> AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications

**Project:** ISpectra AI

**Focus Areas:**

* Artificial Intelligence
* Natural Language Processing
* Indian Standards
* Procurement Intelligence
* Regulatory Technology
* Engineering Compliance

---

# 📌 Example Workflow

### Input

```text
Procure 500 bags of 43 grade Portland cement
for a construction project.
```

### ISpectra AI

```text
1. Understand procurement requirement
              ↓
2. Identify product and grade
              ↓
3. Search Standards Knowledge Base
              ↓
4. Match relevant standards
              ↓
5. Rank recommendations
              ↓
6. Identify related/testing/safety standards
              ↓
7. Verify referenced standards
              ↓
8. Generate procurement report
```

### Output

```text
Applicable Indian Standards
        +
Related Standards
        +
Testing Requirements
        +
Safety Requirements
        +
Certification Information
        +
Version / Amendment Information
        +
Explanation
        +
Verification
```

---

# ⚖️ Disclaimer

ISpectra AI provides standards-related recommendations based on the information available within its Standards Knowledge Base.

Users should verify applicable standards, revisions, amendments, certification requirements, and regulatory requirements against authoritative sources before making final procurement or compliance decisions.

---

# 👥 Project

**ISpectra AI**

AI-powered intelligence for identifying applicable Indian Standards in procurement specifications.

**SIH 2026 — Problem Statement 26108**
