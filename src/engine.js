/* ===== ISpectra engine =====
   Layers mirror the architecture: pre-processing & understanding, AI engine
   (demo matcher), knowledge-base access, recommendation engine, verification.
   Every function here is pure so it can be replaced by REST calls to a
   backend service without changing the UI. */
const Engine = (() => {
  const ROLE_ORDER = ['Primary', 'Testing', 'Safety', 'Normative', 'Related'];
  const REL_TO_ROLE = { tests: 'Testing', safety: 'Safety', normative: 'Normative', related: 'Related' };
  const REL_TEXT = {
    tests: 'Test method referenced by',
    safety: 'Safety / technical standard referenced by',
    normative: 'Normative reference of',
    related: 'Related standard of'
  };

  const STOP = new Set(('a an the of and or for to in on at by with from as is are be been being this that these those it its into per ' +
    'shall should must will would can may any all each such than then also not no nor only own same so too very just now ' +
    'supply supplying supplied required requirement requirements need needs needed please provide providing including include ' +
    'etc as per quantity total building construction work site material').split(' '));

  const SYN_REPLACE = { mixed: 'mix', mixture: 'mix', mixing: 'mix', reinforcing: 'reinforcement', rod: 'bar', rmc: 'rmc' };
  const SYN_EXPAND = {
    opc: 'ordinary portland cement',
    ppc: 'portland pozzolana cement fly ash',
    tmt: 'thermo mechanically treated deformed steel reinforcement bar',
    rebar: 'reinforcement steel bar deformed',
    sariya: 'reinforcement steel bar',
    rmc: 'ready mix concrete',
    rcc: 'reinforced concrete',
    gravel: 'coarse aggregate',
    sand: 'fine aggregate',
    stone: 'aggregate',
    chip: 'aggregate',
    brickwork: 'brick masonry'
  };

  /* ---- language detection & translation ---- */
  const SCRIPTS = [
    ['Hindi (Devanagari)', 'hi', /[\u0900-\u0963\u0966-\u097F]/g],
    ['Bengali', 'bn', /[\u0980-\u09FF]/g],
    ['Punjabi (Gurmukhi)', 'pa', /[\u0A00-\u0A7F]/g],
    ['Gujarati', 'gu', /[\u0A80-\u0AFF]/g],
    ['Odia', 'or', /[\u0B00-\u0B7F]/g],
    ['Tamil', 'ta', /[\u0B80-\u0BFF]/g],
    ['Telugu', 'te', /[\u0C00-\u0C7F]/g],
    ['Kannada', 'kn', /[\u0C80-\u0CFF]/g],
    ['Malayalam', 'ml', /[\u0D00-\u0D7F]/g]
  ];

  function detectLanguage(text, hint) {
    const letters = (text.match(/[A-Za-z\u0900-\u0D7F]/g) || []).length || 1;
    let best = { name: 'English', code: 'en', share: (text.match(/[A-Za-z]/g) || []).length / letters };
    for (const [name, code, re] of SCRIPTS) {
      const n = (text.match(re) || []).length;
      if (n / letters > 0.25 && n / letters > best.share) best = { name, code, share: n / letters };
    }
    const supported = best.code === 'en' || best.code === 'hi';
    let source = 'detected';
    if (hint === 'en' || hint === 'hi') {
      if (hint !== best.code && best.share < 0.6) { best = { name: hint === 'hi' ? 'Hindi (Devanagari)' : 'English', code: hint, share: best.share }; }
      source = 'selected';
    }
    return { name: best.name, code: best.code, supported: best.code === 'en' || best.code === 'hi', share: Math.round(best.share * 100), source };
  }

  const HI_LEX_RAW = {
    'सीमेंट': 'cement', 'सीमेन्ट': 'cement', 'ओपीसी': 'OPC', 'पीपीसी': 'PPC', 'ग्रेड': 'grade', 'स्टील': 'steel', 'इस्पात': 'steel',
    'सरिया': 'reinforcement bar', 'सरिये': 'reinforcement bar', 'छड़': 'bar', 'छड़ें': 'bars', 'छड़ों': 'bars', 'बार': 'bar', 'तार': 'wire',
    'टीएमटी': 'TMT', 'ईंट': 'brick', 'ईंटें': 'bricks', 'ईंटों': 'bricks', 'ईंटो': 'bricks', 'कंक्रीट': 'concrete', 'कंक्रिट': 'concrete',
    'रेत': 'sand', 'बालू': 'sand', 'बजरी': 'gravel', 'गिट्टी': 'coarse aggregate', 'रोड़ी': 'coarse aggregate', 'रोड़ा': 'coarse aggregate',
    'रेडी': 'ready', 'मिक्स': 'mixed', 'मिश्रित': 'mixed', 'आरएमसी': 'RMC', 'मिट्टी': 'clay', 'पक्की': 'burnt', 'पकी': 'burnt',
    'आपूर्ति': 'supply', 'चाहिए': 'shall', 'चाहिये': 'shall', 'अनिवार्य': 'mandatory', 'मानक': 'standard', 'मानकों': 'standards',
    'निर्माण': 'construction', 'भवन': 'building', 'इमारत': 'building', 'पानी': 'water', 'टन': 'tonnes', 'बोरी': 'bags', 'बोरे': 'bags',
    'मजबूत': 'strong', 'मज़बूत': 'strong', 'तैयार': 'ready', 'का': '', 'की': '', 'के': '', 'को': '', 'में': 'in', 'और': 'and', 'भी': 'also',
    'लिए': 'for', 'हमें': '', 'है': '', 'हैं': '', 'से': 'from', 'पर': 'on', 'एक': 'one', 'सभी': 'all', 'प्रमाणित': 'certified',
    'विनिर्देश': 'specification', 'निविदा': 'tender', 'ठेका': 'contract', 'कार्य': 'works', 'दीवार': 'wall', 'चिनाई': 'brickwork',
    'संपीड़न': 'compressive', 'शक्ति': 'strength', 'मीट्रिक': 'metric', 'घन': 'cubic', 'मीटर': 'metre', 'मिमी': 'mm'
  };
  const HI_LEX = {};
  for (const k of Object.keys(HI_LEX_RAW)) HI_LEX[k.normalize('NFC')] = HI_LEX_RAW[k];

  function translateHindi(text) {
    const missing = [];
    const digits = text.replace(/[\u0966-\u096F]/g, d => String(d.charCodeAt(0) - 0x0966));
    const out = digits.replace(/\u0964/g, '. ').replace(/[\u0900-\u0963\u0966-\u097F]+/g, w => {
      const key = w.normalize('NFC');
      if (Object.prototype.hasOwnProperty.call(HI_LEX, key)) return HI_LEX[key];
      missing.push(w);
      return w;
    });
    return { text: out.replace(/\s+/g, ' ').trim(), untranslated: Array.from(new Set(missing)) };
  }

  /* ---- cleaning / normalisation ---- */
  function cleanText(raw) {
    return String(raw || '')
      .normalize('NFC')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u200B-\u200D\uFEFF]/g, '')
      .replace(/(\w)-\n(\w)/g, '$1$2')
      .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-')
      .replace(/\r/g, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function sentences(text) {
    return text.split(/(?<=[.!?;])\s+|\n+/).map(s => s.trim()).filter(s => s.length > 3);
  }

  /* ---- tokens ---- */
  function stem(w) {
    if (SYN_REPLACE[w]) return SYN_REPLACE[w];
    if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
    if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && !w.endsWith('is')) return w.slice(0, -1);
    return w;
  }
  function tokenize(text) {
    return (String(text).toLowerCase().match(/[a-z0-9]+/g) || []).map(stem)
      .filter(t => t.length > 1 && !STOP.has(t) && !/^\d+$/.test(t));
  }
  function expandTokens(tokens) {
    const out = new Set(); const expansions = [];
    for (const t of tokens) {
      out.add(t);
      if (SYN_EXPAND[t]) {
        const add = tokenize(SYN_EXPAND[t]);
        add.forEach(a => out.add(a));
        expansions.push(t + ' → ' + SYN_EXPAND[t]);
      }
    }
    return { set: out, expansions };
  }

  /* ---- entity extraction ---- */
  const PRODUCT_LEX = [
    ['Cement', /\b(cement|opc|ppc)\b/i],
    ['Reinforcement steel bars', /\b(tmt|rebars?|sariya|reinforcement\s+(?:steel\s+)?bars?|deformed\s+(?:steel\s+)?bars?|steel\s+bars?|steel\s+rods?)\b/i],
    ['Aggregates', /\b(aggregates?|gravel|crushed\s+stone|sand)\b/i],
    ['Concrete', /\b(concrete|rmc|rcc)\b/i],
    ['Bricks', /\bbricks?\b/i]
  ];
  const CITE_RE = /\bIS\b[\s.:-]*(\d{2,5})(?:\s*\(?\s*(?:Part|Pt)\.?\s*(\d+)\s*\)?)?(?:\s*(?:[:\-\/]\s*|\(\s*)((?:19|20)\d{2})\)?)?/g;

  function extractCitations(text) {
    const out = []; const seen = new Set(); let m;
    CITE_RE.lastIndex = 0;
    while ((m = CITE_RE.exec(text))) {
      const rec = { raw: m[0].replace(/\s+/g, ' ').trim(), num: m[1], part: m[2] || null, year: m[3] || null };
      const key = rec.num + '|' + (rec.part || '') + '|' + (rec.year || '');
      if (!seen.has(key)) { seen.add(key); out.push(rec); }
    }
    return out;
  }

  function uniq(a) { return Array.from(new Set(a)); }

  function extractEntities(text) {
    const products = PRODUCT_LEX.filter(([, re]) => re.test(text)).map(([n]) => n);
    const attrs = [];
    let m;
    const g1 = /\b(33|43|53)\s*[- ]?grade\b|\bgrade\s*[- ]?(33|43|53)\b/gi;
    while ((m = g1.exec(text))) attrs.push({ type: 'Cement grade', value: (m[1] || m[2]) + ' grade' });
    const fe = /\bFe\s*[- ]?(415|500|550|600)\s*(D|S|CRS)?\b/gi;
    while ((m = fe.exec(text))) attrs.push({ type: 'Steel grade', value: 'Fe ' + m[1] + (m[2] ? m[2].toUpperCase() : '') });
    const mg = /\bM\s?-?(10|15|20|25|30|35|40|45|50)\b/g;
    while ((m = mg.exec(text))) attrs.push({ type: 'Concrete grade', value: 'M' + m[1] });
    const st = /(\d+(?:\.\d+)?)\s*(MPa|N\/mm2|N\/mm²)/gi;
    while ((m = st.exec(text))) attrs.push({ type: 'Strength', value: m[1] + ' ' + m[2] });
    const dia = /(\d+(?:\.\d+)?)\s*mm\b/gi;
    while ((m = dia.exec(text))) attrs.push({ type: 'Dimension', value: m[1] + ' mm' });
    const q = /(\d[\d,]*(?:\.\d+)?)\s*(tonnes?|tons?|MT|kg|bags?|nos\.?|numbers?|cubic\s*met(?:er|re)s?|cum|m3|m³|bricks?)\b/gi;
    while ((m = q.exec(text))) attrs.push({ type: 'Quantity', value: m[1] + ' ' + m[2].toLowerCase() });
    const seen = new Set();
    const attributes = attrs.filter(a => { const k = a.type + a.value.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
    const reqRe = /\b(shall|must|should|required|requirement|conform(?:s|ing)?|compl(?:y|ies|iance)|in accordance|as per|mandatory|necessary|minimum|not less than|at least)\b/i;
    const requirements = sentences(text).filter(s => reqRe.test(s)).slice(0, 8).map(s => s.length > 240 ? s.slice(0, 237) + '...' : s);
    return { products, attributes, requirements, standards: extractCitations(text) };
  }

  function detectIntent(text, products) {
    const works = /\b(construction|works?|laying|execution|erection|casting|building)\b/i.test(text);
    const purchase = /\b(supply|procure|procurement|purchase|tender|quotation|delivery|supplying)\b/i.test(text);
    const what = products.length ? products.join(', ').toLowerCase() : 'unidentified items';
    if (purchase && works) return 'Supply of materials for construction works: ' + what;
    if (purchase) return 'Procurement of ' + what;
    if (works) return 'Construction works involving ' + what;
    return 'Requirement involving ' + what;
  }

  /* ---- knowledge base access ---- */
  function indexKB(standards) {
    const byId = new Map(); const byNum = new Map();
    for (const s of standards) {
      byId.set(s.id, s);
      if (!byNum.has(s.num)) byNum.set(s.num, []);
      byNum.get(s.num).push(s);
    }
    const docs = standards.map(s => {
      const terms = new Map();
      const add = (arr, w) => arr.forEach(t => terms.set(t, Math.max(terms.get(t) || 0, w)));
      add(tokenize(s.title), 1.4); add((s.keywords || []).flatMap(k => tokenize(k)), 1.0); add(tokenize(s.scope || ''), 0.4);
      return { id: s.id, terms };
    });
    const df = new Map();
    docs.forEach(d => d.terms.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
    const N = docs.length || 1; const idf = new Map();
    df.forEach((c, t) => idf.set(t, Math.log(1 + N / c)));
    const usedBy = new Map();
    for (const s of standards) for (const rel of ['tests', 'safety', 'normative', 'related']) for (const r of s[rel] || []) {
      if (!usedBy.has(r)) usedBy.set(r, []);
      usedBy.get(r).push({ id: s.id, rel });
    }
    const unresolved = [];
    for (const s of standards) for (const rel of ['tests', 'safety', 'normative', 'related']) for (const r of s[rel] || []) if (!byId.has(r)) unresolved.push({ from: s.id, ref: r, rel });
    return { list: standards, byId, byNum, docs: new Map(docs.map(d => [d.id, d])), idf, usedBy, unresolved };
  }

  function latestYear(std) { const m = /(\d{4})/.exec(std.version || ''); return m ? m[1] : null; }

  function lookupCitation(kb, c) {
    const list = kb.byNum.get(c.num) || [];
    if (!list.length) return null;
    if (c.part) return list.find(s => String(s.part) === String(c.part)) || null;
    return list.find(s => !s.part) || (list.length === 1 ? list[0] : list[0]);
  }

  function verifyCitation(kb, c) {
    const std = lookupCitation(kb, c);
    if (!std) return { ...c, kbId: null, status: 'unknown', latest: null, note: 'Not in the demo Knowledge Base, so it cannot be verified.' };
    const latest = std.version;
    const ly = latestYear(std);
    if (/multi/i.test(latest)) return { ...c, kbId: std.id, status: 'multipart', latest, note: 'Multi-part standard. Confirm the part and its year.' };
    if (!c.year) return { ...c, kbId: std.id, status: 'noyear', latest, note: 'Year not stated. Latest version in the Knowledge Base is ' + latest + '.' };
    if (c.year === ly) return { ...c, kbId: std.id, status: 'current', latest, note: 'Matches the latest version.' };
    const old = (std.history || []).find(h => h.version === c.year);
    if (old) return { ...c, kbId: std.id, status: 'outdated', latest, note: 'Version ' + c.year + ' is superseded. Latest is ' + latest + '.' };
    return { ...c, kbId: std.id, status: 'mismatch', latest, note: 'Year ' + c.year + ' is not a known version. Latest is ' + latest + '.' };
  }

  /* ---- AI engine: demo semantic matcher ---- */
  const K = 5;
  function scoreStandard(kb, std, qset, qtext, attrs) {
    const doc = kb.docs.get(std.id);
    let raw = 0; const matched = [];
    doc.terms.forEach((w, t) => { if (qset.has(t)) { raw += w * (kb.idf.get(t) || 0); matched.push(t); } });
    const phrases = (std.phrases || []).filter(p => qtext.includes(p));
    raw += phrases.length * 2.0;
    const notes = [];
    if (std.grade && raw > 0) {
      const fam = std.grade.family;
      const stated = attrs.filter(a => (fam === 'opc' && a.type === 'Cement grade') || (fam === 'fe' && a.type === 'Steel grade'))
        .map(a => parseInt(a.value.replace(/\D/g, '').slice(0, 3), 10));
      if (stated.length) {
        if (stated.some(v => std.grade.values.includes(v))) { raw += 4; notes.push({ kind: 'attr-match', text: (fam === 'opc' ? 'Stated cement grade ' : 'Stated steel grade Fe ') + stated.join(', ') + ' falls within this standard.' }); }
        else { raw *= 0.25; notes.push({ kind: 'attr-miss', text: 'Input states grade ' + stated.join(', ') + ', which this standard does not cover.' }); }
      }
    }
    const sem = 1 - Math.exp(-raw / K);
    return { sem, raw, matched, phrases, notes };
  }

  function segments(sentence, termSet) {
    const parts = sentence.split(/([A-Za-z0-9]+)/); const out = [];
    for (const p of parts) {
      if (!p) continue;
      const isWord = /^[A-Za-z0-9]+$/.test(p);
      const hit = isWord && (termSet.has(stem(p.toLowerCase())) || termSet.has(p.toLowerCase()));
      out.push({ t: p, m: !!hit });
    }
    const merged = [];
    for (const s of out) { const l = merged[merged.length - 1]; if (l && l.m === s.m) l.t += s.t; else merged.push({ ...s }); }
    return merged;
  }

  function analyse(kb, input) {
    const stages = [];
    const raw = String(input.text || '');
    const type = input.type || 'product';
    const typeLabel = { product: 'Product description', spec: 'Technical specification', tender: 'Tender document' }[type] || 'Product description';

    // 1 Input
    stages.push({ key: 'input', label: 'Input', summary: typeLabel + ' · ' + raw.length.toLocaleString('en-IN') + ' characters',
      details: [typeLabel, input.fileName ? 'File: ' + input.fileName : 'Typed, pasted or spoken text', 'Input language setting: ' + ({ auto: 'Auto-detect', en: 'English', hi: 'Hindi' }[input.langHint || 'auto'])] });

    // 2 Pre-processing
    const cleaned = cleanText(raw);
    const lang = detectLanguage(cleaned, input.langHint || 'auto');
    let translated = cleaned; let untranslated = []; let didTranslate = false;
    if (lang.code === 'hi') { const tr = translateHindi(cleaned); translated = tr.text; untranslated = tr.untranslated; didTranslate = true; }
    const entities = extractEntities(translated);
    const parse = input.parseMethod || 'Plain text';
    const pre = [
      'Document parsing: ' + parse,
      'OCR: not run in this prototype' + (input.parseMethod && /PDF/.test(input.parseMethod) ? ' (text layer used)' : ''),
      'Text cleaned and normalised',
      'Language: ' + lang.name + ' (' + lang.source + ')',
      didTranslate ? 'Translation to English: demo term lexicon' + (untranslated.length ? ', ' + untranslated.length + ' term(s) left untranslated' : '') : (lang.supported ? 'Translation: not needed' : 'Translation: no translator for ' + lang.name + ' in this prototype'),
      'Entities: ' + entities.products.length + ' product, ' + entities.attributes.length + ' attribute, ' + entities.requirements.length + ' requirement, ' + entities.standards.length + ' standard reference'
    ];
    stages.push({ key: 'pre', label: 'Pre-processing & understanding', summary: lang.name + ' · ' + (entities.products.length + entities.attributes.length + entities.requirements.length + entities.standards.length) + ' entities', details: pre });

    // 3 AI analysis
    const toks = tokenize(translated);
    const ex = expandTokens(toks);
    const intent = detectIntent(translated, entities.products);
    stages.push({ key: 'ai', label: 'AI analysis', summary: intent,
      details: ['Context and intent: ' + intent, ex.set.size + ' distinct concepts after normalisation', ex.expansions.length ? 'Concept expansion: ' + ex.expansions.join('; ') : 'No abbreviations expanded', 'Demo matcher stands in for LLM embeddings and pgvector search'] });

    // 4 Standards matching
    const qtext = translated.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ');
    const qtextStem = ' ' + Array.from(ex.set).join(' ') + ' ' + qtext + ' ';
    const scored = kb.list.filter(s => s.kind === 'product' || s.kind === 'code')
      .map(s => ({ std: s, ...scoreStandard(kb, s, ex.set, qtextStem, entities.attributes) }))
      .filter(r => r.raw > 0 && r.matched.length > 0)
      .sort((a, b) => b.sem - a.sem);
    const top = scored.length ? scored[0].sem : 0;
    const primaries = scored.filter(r => r.sem >= 0.30 && r.sem >= top * 0.65 && (r.phrases.length > 0 || r.matched.length >= 2 || r.raw >= 1.5)).slice(0, 5);

    const recs = new Map();
    const sentList = sentences(translated);
    for (const p of primaries) {
      const termSet = new Set(p.matched);
      const ev = sentList.map(s => ({ s, n: tokenize(s).filter(t => termSet.has(t)).length })).filter(x => x.n > 0)
        .sort((a, b) => b.n - a.n).slice(0, 2).map(x => segments(x.s, termSet));
      const reasons = [];
      const named = uniq(p.phrases.concat(p.matched.slice(0, 4)));
      reasons.push({ kind: 'semantic', text: 'The input describes ' + named.slice(0, 4).join(', ') + ', which matches the title and scope of ' + p.std.id + '.' });
      p.notes.forEach(n => reasons.push(n));
      recs.set(p.std.id, { id: p.std.id, roles: ['Primary'], score: p.sem, matched: p.matched, phrases: p.phrases, reasons, evidence: ev, paths: [], advisory: null });
    }
    // grade advisory
    const opcPrim = primaries.filter(p => p.std.grade && p.std.grade.family === 'opc');
    if (opcPrim.length > 1 && !entities.attributes.some(a => a.type === 'Cement grade')) {
      opcPrim.forEach(p => { recs.get(p.std.id).advisory = 'The input does not state a cement grade, so more than one grade-specific standard is listed. Confirm the grade before approving.'; });
    }
    stages.push({ key: 'match', label: 'Standards matching', summary: primaries.length + ' matched from ' + kb.list.filter(s => s.kind === 'product' || s.kind === 'code').length + ' candidates',
      details: [scored.length + ' candidate standard(s) with overlapping concepts', primaries.length + ' above the match threshold', primaries.length ? 'Top match: ' + primaries[0].std.id + ' (' + Math.round(primaries[0].sem * 100) + '%)' : 'No standard in the demo Knowledge Base matched this input'] });

    // 5 Recommendation (graph expansion, rank & filter, certifications)
    for (const p of primaries) {
      for (const rel of ['tests', 'safety', 'normative', 'related']) {
        for (const rid of p.std[rel] || []) {
          if (!kb.byId.has(rid)) continue;
          const role = REL_TO_ROLE[rel];
          let r = recs.get(rid);
          if (!r) { r = { id: rid, roles: [], score: null, matched: [], phrases: [], reasons: [], evidence: [], paths: [], advisory: null }; recs.set(rid, r); }
          if (!r.roles.includes(role)) r.roles.push(role);
          r.paths.push({ from: p.std.id, rel, text: REL_TEXT[rel] + ' ' + p.std.id });
        }
      }
    }
    recs.forEach(r => { r.roles.sort((a, b) => ROLE_ORDER.indexOf(a) - ROLE_ORDER.indexOf(b)); });
    const recList = Array.from(recs.values()).sort((a, b) => {
      const pa = a.roles[0] === 'Primary' ? 0 : 1, pb = b.roles[0] === 'Primary' ? 0 : 1;
      if (pa !== pb) return pa - pb;
      if (pa === 0) return (b.score || 0) - (a.score || 0);
      const ra = ROLE_ORDER.indexOf(a.roles[0]), rb = ROLE_ORDER.indexOf(b.roles[0]);
      if (ra !== rb) return ra - rb;
      if (b.paths.length !== a.paths.length) return b.paths.length - a.paths.length;
      return a.id.localeCompare(b.id, 'en', { numeric: true });
    });

    const certs = [];
    for (const r of recList) { const s = kb.byId.get(r.id); (s.cert || []).forEach(c => certs.push({ scheme: c.scheme, standard: s.id, note: c.note, item: s.item, title: s.title })); }
    stages.push({ key: 'rec', label: 'Recommendation', summary: recList.length + ' standards · ' + certs.length + ' certification mapping(s)',
      details: [recList.filter(r => r.roles[0] === 'Primary').length + ' recommended, ' + recList.filter(r => r.roles[0] !== 'Primary').length + ' allied, related or normative',
        'Ranked by match score, then by relationship type', certs.length + ' certification requirement(s) suggested from the Knowledge Base', 'Structured output generated with reasons and references'] });

    // 6 Verification
    const cited = entities.standards.map(c => verifyCitation(kb, c));
    const citedKeys = new Set(cited.filter(c => c.kbId).map(c => c.kbId));
    const citedNums = new Set(entities.standards.map(c => c.num));
    const missing = recList.filter(r => r.roles.some(x => x !== 'Related') && !citedKeys.has(r.id) && !citedNums.has(kb.byId.get(r.id).num)).map(r => r.id);
    const attention = cited.filter(c => c.status !== 'current').length;
    let total = 0, resolved = 0;
    for (const r of recList) { const s = kb.byId.get(r.id); for (const rel of ['tests', 'safety', 'normative', 'related']) for (const x of s[rel] || []) { total++; if (kb.byId.has(x)) resolved++; } }
    stages.push({ key: 'verify', label: 'Verification', summary: cited.length + ' cited · ' + attention + ' need attention · ' + missing.length + ' missing',
      details: [cited.length + ' standard reference(s) found in the input and checked against the Knowledge Base',
        cited.filter(c => c.status === 'outdated').length + ' outdated, ' + cited.filter(c => c.status === 'unknown').length + ' not in the Knowledge Base',
        missing.length + ' recommended standard(s) not referenced in the input', 'Cross-references resolved: ' + resolved + ' of ' + total] });

    return {
      id: 'A-' + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      input: { type, typeLabel, fileName: input.fileName || '', chars: raw.length, langHint: input.langHint || 'auto', parseMethod: input.parseMethod || 'Plain text' },
      text: { raw, cleaned, translated }, lang, didTranslate, untranslated, entities, intent,
      expansions: ex.expansions, stages, recs: recList, cited, missing, certs, crossRef: { resolved, total },
      kbVersion: input.kbVersion || ''
    };
  }

  function validateKBUpdate(json) {
    if (!json || !Array.isArray(json.standards)) return { ok: false, error: 'The file needs a "standards" array.' };
    const need = ['id', 'num', 'title', 'kind', 'version'];
    for (let i = 0; i < json.standards.length; i++) {
      const s = json.standards[i];
      const miss = need.filter(k => s[k] === undefined || s[k] === null || s[k] === '');
      if (miss.length) return { ok: false, error: 'Record ' + (i + 1) + ' is missing: ' + miss.join(', ') + '.' };
      if (!['product', 'code', 'test', 'safety'].includes(s.kind)) return { ok: false, error: 'Record ' + s.id + ' has an unknown kind "' + s.kind + '".' };
    }
    return { ok: true };
  }

  function normaliseRecord(s) {
    return Object.assign({ part: null, category: 'Uncategorised', history: [], amendments: [], scope: '', keywords: [], phrases: [], grade: null, item: null,
      related: [], normative: [], tests: [], safety: [], cert: [] }, s);
  }

  const api = { ROLE_ORDER, REL_TEXT, analyse, indexKB, validateKBUpdate, normaliseRecord, detectLanguage, translateHindi, extractCitations, verifyCitation, tokenize, cleanText };
  if (typeof module !== 'undefined') module.exports = api;
  return api;
})();
