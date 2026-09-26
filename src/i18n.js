/* ===== Multilingual UI =====
   English is the source text. Additional languages are dictionaries keyed by the
   English string; anything missing falls back to English. */
const I18N = {
  hi: {
    'Dashboard': 'डैशबोर्ड', 'Input / Analysis': 'इनपुट / विश्लेषण', 'Standards': 'मानक', 'Recommendations': 'अनुशंसाएँ', 'Reports': 'रिपोर्ट',
    'AI-powered procurement standards intelligence': 'एआई-संचालित क्रय मानक इंटेलिजेंस',
    'Demo Knowledge Base': 'डेमो नॉलेज बेस', 'Sample data. Not verified against BIS.': 'नमूना डेटा। BIS से सत्यापित नहीं।',
    'Architecture': 'आर्किटेक्चर', 'Procurement Officer': 'क्रय अधिकारी', 'Demo session': 'डेमो सत्र',
    'Product description': 'उत्पाद विवरण', 'Technical specification': 'तकनीकी विनिर्देश', 'Tender document': 'निविदा दस्तावेज़',
    'Analyse specification': 'विनिर्देश का विश्लेषण करें', 'Voice input': 'वॉयस इनपुट', 'Stop recording': 'रिकॉर्डिंग रोकें',
    'Input language': 'इनपुट भाषा', 'Auto-detect': 'स्वतः पहचान', 'English': 'अंग्रेज़ी', 'Hindi': 'हिन्दी',
    'Load sample input': 'नमूना इनपुट लोड करें', 'Upload PDF, DOCX or TXT': 'PDF, DOCX या TXT अपलोड करें', 'Choose file': 'फ़ाइल चुनें',
    'Clear': 'साफ़ करें', 'Start analysis': 'विश्लेषण शुरू करें', 'View recommendations': 'अनुशंसाएँ देखें',
    'Processing pipeline': 'प्रोसेसिंग पाइपलाइन', 'Input': 'इनपुट', 'Analyse': 'विश्लेषण', 'Match': 'मिलान', 'Recommend': 'अनुशंसा', 'Verify': 'सत्यापन',
    'Pre-processing': 'प्री-प्रोसेसिंग', 'AI analysis': 'एआई विश्लेषण', 'Standards matching': 'मानक मिलान', 'Recommendation': 'अनुशंसा', 'Verification': 'सत्यापन',
    'Recommended Indian Standards': 'अनुशंसित भारतीय मानक', 'Allied / normative and related standards': 'संबद्ध / नॉर्मेटिव एवं संबंधित मानक',
    'Allied / normative standards': 'संबद्ध / नॉर्मेटिव मानक', 'Certification requirements': 'प्रमाणन आवश्यकताएँ', 'Latest versions': 'नवीनतम संस्करण',
    'Version check': 'संस्करण जाँच', 'Amendments': 'संशोधन', 'Explanation': 'स्पष्टीकरण', 'Cost analysis': 'लागत विश्लेषण', 'Export report': 'रिपोर्ट निर्यात करें',
    'Approve': 'स्वीकृत करें', 'Reject': 'अस्वीकार करें', 'Pending': 'लंबित', 'Approved': 'स्वीकृत', 'Rejected': 'अस्वीकृत', 'Approve all pending': 'सभी लंबित स्वीकृत करें',
    'Primary': 'मुख्य', 'Related': 'संबंधित', 'Testing': 'परीक्षण', 'Safety': 'सुरक्षा', 'Normative': 'नॉर्मेटिव', 'All': 'सभी',
    'Current': 'वर्तमान', 'Outdated': 'पुराना', 'Missing': 'अनुपलब्ध', 'Why this was recommended': 'यह अनुशंसा क्यों की गई',
    'Search standards': 'मानक खोजें', 'Standards Knowledge Base': 'मानक नॉलेज बेस', 'Version': 'संस्करण', 'Related standards': 'संबंधित मानक', 'Normative references': 'नॉर्मेटिव संदर्भ',
    'Test methods': 'परीक्षण विधियाँ', 'Certification mapping': 'प्रमाणन मैपिंग', 'Generate report': 'रिपोर्ट बनाएँ', 'Download PDF': 'PDF डाउनलोड करें', 'Download Excel': 'Excel डाउनलोड करें',
    'Language': 'भाषा', 'Demo data. Not verified against BIS.': 'डेमो डेटा। BIS से सत्यापित नहीं।',
    "Don't search. Specify. We'll find the standard.": 'खोजिए नहीं, बताइए। मानक हम ढूँढेंगे।',
    'Standards cited in the input': 'इनपुट में उद्धृत मानक', 'Not started': 'शुरू नहीं हुआ', 'Officer remarks': 'अधिकारी की टिप्पणी', 'Close': 'बंद करें',
    'Procurement input': 'क्रय इनपुट', 'Recommended standards': 'अनुशंसित मानक', 'Reports': 'रिपोर्ट', 'Match score': 'मिलान स्कोर', 'Status': 'स्थिति', 'Title': 'शीर्षक',
    'Quantity': 'मात्रा', 'Unit rate': 'इकाई दर', 'Amount': 'राशि', 'Total': 'कुल', 'Update Knowledge Base': 'नॉलेज बेस अपडेट करें', 'Download Knowledge Base': 'नॉलेज बेस डाउनलोड करें'
  }
};
let LANG = 'en';
function t(s) { const d = I18N[LANG]; return (d && d[s]) || s; }
