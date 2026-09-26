/* ===== ISpectra AI application shell and screens ===== */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');

const P = {
  dashboard: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  input: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6M9 9h1',
  library: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  recs: 'M3 7l2 2 4-4M3 17l2 2 4-4M13 6h8M13 12h8M13 18h8',
  report: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M12 12v6M9 15l3 3 3-3',
  mic: 'M9 2h6a0 0 0 0 1 0 0v9a3 3 0 0 1-6 0V2zM5 11a7 7 0 0 0 14 0M12 18v4',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20',
  link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2',
  alert: 'M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
  check: 'M20 6L9 17l-5-5', x: 'M18 6L6 18M6 6l12 12',
  search: 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM21 21l-4.3-4.3',
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 16v-4M12 8h.01',
  db: 'M12 2c5 0 9 1.3 9 3s-4 3-9 3-9-1.3-9-3 4-3 9-3zM3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3',
  award: 'M12 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM15.5 13.5L17 22l-5-3-5 3 1.5-8.5',
  calc: 'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h8',
  layers: 'M12 2l10 5-10 5L2 7zM2 12l10 5 10-5M2 17l10 5 10-5',
  net: 'M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM5 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM19 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 7v4M12 11l-6 6M12 11l6 6',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  plus: 'M12 5v14M5 12h14', arrow: 'M5 12h14M13 6l6 6-6 6', doc: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'
};
const ic = (n, cls = '') => '<svg class="ic ' + cls + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + P[n] + '"/></svg>';

/* ---------- data ---------- */
let kbStandards = KB_STANDARDS.map(Engine.normaliseRecord);
const S = {
  view: 'dashboard', uiLang: 'en',
  kb: Engine.indexKB(kbStandards), kbUpdates: 0,
  input: { type: 'product', text: '', fileName: '', parseMethod: 'Plain text', langHint: 'auto', busy: false, error: null },
  analysis: null, pending: null, run: { active: false, stage: -1 },
  approvals: {}, cost: {}, sel: null, detailOpen: false, filter: 'all',
  stdq: '', stdKind: 'all', stdSel: null,
  reportOpts: { scope: 'all' }, reports: [], busyReport: false, listening: false, toast: '', modal: null
};
const kbVersion = () => KB_META.version + (S.kbUpdates ? ' + ' + plural(S.kbUpdates, 'update') : '');
const KIND = { product: 'Product standard', code: 'Code of practice', test: 'Test method', safety: 'Safety / technical' };
const SAMPLES = [
  { id: 'cement', label: 'Cement supply (product description)', type: 'product', lang: 'auto', text: 'Supply of 43 grade Ordinary Portland Cement in 50 kg bags, 800 bags, for building construction. Cement shall be packed in moisture-proof bags.' },
  { id: 'steel', label: 'Reinforcement bars (technical specification)', type: 'spec', lang: 'auto', text: 'TMT bars Fe 500D, 12 mm and 16 mm diameter, 200 tonnes. The bars must be tested for tensile strength before acceptance. Material shall comply with the relevant standard.' },
  { id: 'tender', label: 'Concrete works (tender text with cited standards)', type: 'tender', lang: 'auto', text: 'Tender for construction of a reinforced concrete community hall.\n1. Concrete of grade M25 shall be used for slabs and beams. Mix design as per IS 456:1978.\n2. Cement shall conform to IS 269:1989.\n3. Coarse aggregate and sand shall conform to IS 383:1970.\n4. Water for mixing shall be tested as per IS 3025.\n5. Bricks for partition walls shall be burnt clay bricks.' },
  { id: 'hindi', label: 'Hindi input (multilingual)', type: 'product', lang: 'hi', text: 'हमें भवन निर्माण के लिए 43 ग्रेड सीमेंट की आपूर्ति चाहिए। मजबूत सरिया (टीएमटी बार Fe 500D) और पक्की ईंट भी अनिवार्य हैं।' }
];
const VS = { current: ['ok', 'Current'], outdated: ['warn', 'Outdated'], unknown: ['neutral', 'Not in Knowledge Base'], noyear: ['warn', 'Year not stated'], multipart: ['neutral', 'Multi-part'], mismatch: ['warn', 'Unknown year'] };

const std = id => S.kb.byId.get(id);
const app = id => S.approvals[id] || { status: 'pending', note: '' };
const recOf = id => S.analysis && S.analysis.recs.find(r => r.id === id);
const primaries = () => S.analysis ? S.analysis.recs.filter(r => r.roles[0] === 'Primary') : [];
const supporting = () => S.analysis ? S.analysis.recs.filter(r => r.roles[0] !== 'Primary') : [];
const pendingCount = () => S.analysis ? S.analysis.recs.filter(r => app(r.id).status === 'pending').length : 0;
const fmtNum = n => Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
const fmtINR = n => { const v = Number(n || 0); const short = v >= 1e7 ? (v / 1e7).toFixed(2) + ' Cr' : v >= 1e5 ? (v / 1e5).toFixed(2) + ' L' : ''; return '₹ ' + fmtNum(v) + (short ? ' (₹ ' + short + ')' : ''); };
const tags = roles => roles.map(r => '<span class="tag ' + r + '">' + esc(t(r)) + '</span>').join(' ');
const stChip = (cls, text) => '<span class="st ' + cls + '">' + esc(t(text)) + '</span>';
const demoPill = () => '<span class="pill demo">' + esc(t('Demo record')) + '</span>';

function demoBanner() {
  return '<div class="banner" role="note">' + ic('alert') + '<p><b>' + esc(t('Demo data.')) + '</b> ' + esc(t('Standards, versions, amendments and certification mappings below come from the sample Knowledge Base and are not verified against BIS.')) + '</p></div>';
}
function emptyState(title, text, btn) {
  return '<div class="empty"><h4>' + esc(t(title)) + '</h4><p>' + esc(t(text)) + '</p>' + (btn ? '<button class="btn primary" data-action="' + btn[1] + '">' + esc(t(btn[0])) + '</button>' : '') + '</div>';
}

/* ---------- shell ---------- */
const NAV = [['dashboard', 'Dashboard', 'dashboard'], ['analysis', 'Input / Analysis', 'input'], ['standards', 'Standards', 'library'], ['recs', 'Recommendations', 'recs'], ['reports', 'Reports', 'report']];
const TITLES = {
  dashboard: ['Dashboard', 'Procurement standards at a glance'],
  analysis: ['Input / Analysis', 'Describe the requirement and follow it through the pipeline'],
  standards: ['Standards Knowledge Base', 'Indian Standards, versions, amendments and relationships'],
  recs: ['Recommendations', 'Standards recommended for the specification, with reasons'],
  reports: ['Reports', 'Export the standards report as PDF or Excel']
};

function renderShell() {
  document.documentElement.lang = S.uiLang;
  $('#app').innerHTML =
    '<div class="app"><aside class="side"><div class="brand"><b>ISpectra AI</b><span>' + esc(t('AI-powered procurement standards intelligence')) + '</span></div>' +
    '<nav class="nav" aria-label="Main">' + NAV.map(([id, label, icon]) =>
      '<button data-action="nav" data-view="' + id + '"' + (S.view === id ? ' aria-current="page"' : '') + '>' + ic(icon) + '<span class="lbl">' + esc(t(label)) + '</span>' +
      (id === 'recs' && S.analysis && pendingCount() ? '<span class="badge" title="' + esc(t('Pending')) + '">' + pendingCount() + '</span>' : '') + '</button>').join('') + '</nav>' +
    '<div class="kbnote"><b>' + esc(t('Demo Knowledge Base')) + '</b>' + esc(t('Sample data. Not verified against BIS.')) + '</div></aside>' +
    '<div class="main"><header class="top"><div class="title" id="ptitle"></div>' +
    '<label class="sr" for="uilang">' + esc(t('Language')) + '</label><select id="uilang" class="sel" data-bind="uilang" aria-label="' + esc(t('Language')) + '"><option value="en"' + (S.uiLang === 'en' ? ' selected' : '') + '>English</option><option value="hi"' + (S.uiLang === 'hi' ? ' selected' : '') + '>हिन्दी</option></select>' +
    '<button class="chip-btn" data-action="about">' + ic('layers') + '<span class="hide-sm-t">' + esc(t('Architecture')) + '</span></button>' +
    '<div class="session" title="' + esc(t('Demo session')) + '"><span class="av">PO</span><span class="who">' + esc(t('Procurement Officer')) + '<br>' + esc(t('Demo session')) + '</span></div></header>' +
    '<main class="page" id="page"></main></div></div><div id="modal"></div><div id="toast" role="status" aria-live="polite"></div>';
  renderPage();
}
function renderPage() {
  const [h, sub] = TITLES[S.view];
  $('#ptitle').innerHTML = esc(t(h)) + '<small>' + esc(t(sub)) + '</small>';
  document.querySelectorAll('.nav button').forEach(b => { if (b.dataset.view === S.view) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  const badge = $('.nav button[data-view="recs"]');
  if (badge) { const old = badge.querySelector('.badge'); if (old) old.remove(); if (S.analysis && pendingCount()) badge.insertAdjacentHTML('beforeend', '<span class="badge">' + pendingCount() + '</span>'); }
  const fn = { dashboard: viewDashboard, analysis: viewAnalysis, standards: viewStandards, recs: viewRecs, reports: viewReports }[S.view];
  $('#page').innerHTML = fn();
  if (S.view === 'analysis') renderPipeline();
  if (S.view === 'standards') renderStdList();
}
function go(view) { S.view = view; S.detailOpen = false; renderPage(); window.scrollTo(0, 0); }
function toast(msg) { S.toast = msg; const el = $('#toast'); if (el) el.innerHTML = '<div class="toast">' + esc(msg) + '</div>'; clearTimeout(toast.t); toast.t = setTimeout(() => { const e = $('#toast'); if (e) e.innerHTML = ''; }, 4200); }

/* ---------- shared pieces ---------- */
function stageStrip(a, running) {
  const st = a ? a.stages : null;
  const steps = [
    ['Input', st && st[0].summary], ['Analyse', st && st[2].summary], ['Match', st && st[3].summary], ['Recommend', st && st[4].summary], ['Verify', st && st[5].summary]
  ];
  return '<div class="flow">' + steps.map(([n, s]) => '<div class="fs ' + (s ? 'done' : '') + '"><div class="n"><span class="dot">' + (s ? ic('check') : '') + '</span>' + esc(t(n)) + '</div><div class="s">' + esc(s || t('Not started')) + '</div></div>').join('') + '</div>';
}
function verLine(id) {
  const a = S.analysis; if (!a) return '';
  const c = a.cited.find(x => x.kbId === id);
  if (!c) return '<div class="small faint">' + esc(t('Not cited in input')) + '</div>';
  const [cls, txt] = VS[c.status];
  return '<div class="small">' + stChip(cls, txt) + (c.year ? ' <span class="faint">' + esc(c.year) + '</span>' : '') + '</div>';
}
function scoreCell(r) {
  if (r.score == null) return '<span class="faint">' + esc(t('Linked')) + '</span>';
  const p = Math.round(r.score * 100);
  return '<div class="score" title="' + esc(t('Match score')) + '"><i><s style="width:' + p + '%"></s></i><span>' + p + '%</span></div>';
}
function approvalCell(r) {
  const s = app(r.id).status;
  return '<button class="iconbtn ok' + (s === 'approved' ? ' on' : '') + '" data-action="approve" data-id="' + esc(r.id) + '" title="' + esc(t('Approve')) + '" aria-label="' + esc(t('Approve') + ' ' + r.id) + '" aria-pressed="' + (s === 'approved') + '">' + ic('check') + '</button>' +
    '<button class="iconbtn no' + (s === 'rejected' ? ' on' : '') + '" data-action="reject" data-id="' + esc(r.id) + '" title="' + esc(t('Reject')) + '" aria-label="' + esc(t('Reject') + ' ' + r.id) + '" aria-pressed="' + (s === 'rejected') + '">' + ic('x') + '</button>';
}
function stdRow(r) {
  const s = std(r.id); const ap = app(r.id).status;
  const amd = s.amendments.length ? ' · ' + plural(s.amendments.length, 'amendment') : '';
  return '<div class="srow' + (S.sel === r.id ? ' sel' : '') + '" data-action="select-rec" data-id="' + esc(r.id) + '" tabindex="0" role="button" aria-label="' + esc(r.id + ' ' + s.title) + '">' +
    '<div class="c-id"><span class="isid">' + esc(s.id) + '</span><div style="margin-top:4px">' + tags(r.roles) + '</div></div>' +
    '<div class="ttl"><b>' + esc(s.title) + '</b><small>' + (r.advisory ? '<span class="st warn">' + esc(t('Confirm grade')) + '</span>' : '') + (r.paths[0] ? '<span>' + esc(r.paths[0].text) + (r.paths.length > 1 ? ' +' + (r.paths.length - 1) : '') + '</span>' : '<span>' + esc(s.category) + '</span>') + '</small></div>' +
    '<div class="c-ver"><span>' + esc(s.version) + '</span>' + esc(amd) + verLine(r.id) + '</div>' +
    '<div class="c-score">' + scoreCell(r) + '</div>' +
    '<div class="acts">' + (ap !== 'pending' ? '<span class="st ' + (ap === 'approved' ? 'ok' : 'bad') + '">' + esc(t(ap === 'approved' ? 'Approved' : 'Rejected')) + '</span>' : '') + approvalCell(r) + '</div></div>';
}
const listHead = () => '<div class="shead"><div>' + esc(t('Standard')) + '</div><div>' + esc(t('Title')) + '</div><div>' + esc(t('Latest version')) + '</div><div>' + esc(t('Match score')) + '</div><div style="text-align:right">' + esc(t('Officer review')) + '</div></div>';

function relChips(ids) {
  if (!ids || !ids.length) return '<span class="faint">' + esc(t('None recorded')) + '</span>';
  return '<div class="chips">' + ids.map(i => '<button class="chip" data-action="open-ref" data-id="' + esc(i) + '">' + esc(i) + '</button>').join('') + '</div>';
}
function recordSections(s) {
  const usedBy = (S.kb.usedBy.get(s.id) || []).map(x => x.id).filter((v, i, a) => a.indexOf(v) === i);
  return '<div class="body" style="border-top:1px solid var(--line)"><h4 style="margin-bottom:8px">' + esc(t('Version and amendments')) + '</h4><dl class="kv">' +
    '<dt>' + esc(t('Latest version')) + '</dt><dd><b>' + esc(s.version) + '</b> ' + demoPill() + '</dd>' +
    '<dt>' + esc(t('Earlier versions')) + '</dt><dd>' + (s.history.length ? s.history.map(h => esc(h.version) + ' <span class="faint">(' + esc(t(h.status)) + ')</span>').join(', ') : '<span class="faint">' + esc(t('None recorded')) + '</span>') + '</dd>' +
    '<dt>' + esc(t('Amendments')) + '</dt><dd>' + (s.amendments.length ? s.amendments.map(m => 'No. ' + esc(m.no) + ': ' + esc(m.note)).join('<br>') : '<span class="faint">' + esc(t('None recorded')) + '</span>') + '</dd></dl></div>' +
    '<div class="body" style="border-top:1px solid var(--line)"><h4 style="margin-bottom:8px">' + esc(t('Relationships')) + '</h4><dl class="kv">' +
    '<dt>' + esc(t('Related standards')) + '</dt><dd>' + relChips(s.related) + '</dd>' +
    '<dt>' + esc(t('Normative references')) + '</dt><dd>' + relChips(s.normative) + '</dd>' +
    '<dt>' + esc(t('Test methods')) + '</dt><dd>' + relChips(s.tests) + '</dd>' +
    '<dt>' + esc(t('Safety / technical')) + '</dt><dd>' + relChips(s.safety) + '</dd>' +
    '<dt>' + esc(t('Referenced by')) + '</dt><dd>' + relChips(usedBy) + '</dd></dl></div>' +
    '<div class="body" style="border-top:1px solid var(--line)"><h4 style="margin-bottom:8px">' + esc(t('Certification mapping')) + '</h4>' +
    (s.cert.length ? s.cert.map(c => '<p><span class="tag Related">' + esc(c.scheme) + '</span> <span class="small muted">' + esc(c.note) + '</span></p>').join('') : '<p class="muted small">' + esc(t('No certification mapped in the demo Knowledge Base.')) + '</p>') + '</div>';
}
function detailHead(s, extra) {
  return '<header><div style="min-width:0"><div class="isid" style="font-size:15px">' + esc(s.id) + '</div><div class="small muted" style="margin-top:2px">' + esc(s.title) + '</div></div>' +
    '<span class="meta">' + (extra || '') + '</span><button class="iconbtn close" data-action="close-detail" aria-label="' + esc(t('Close')) + '">' + ic('x') + '</button></header>';
}

/* ---------- Dashboard ---------- */
function viewDashboard() {
  const a = S.analysis;
  let h = demoBanner();
  h += '<div class="card" style="margin-bottom:16px"><header>' + ic('net') + '<h3>' + esc(t('Workflow')) + '</h3><span class="meta">' + esc(t('Input → Analyse → Match → Recommend → Verify')) + '</span></header>' + stageStrip(a) + '</div>';
  if (a) {
    const prim = primaries(), sup = supporting();
    const att = a.cited.filter(c => c.status !== 'current').length + a.missing.length;
    h += '<div class="card metrics" style="margin-bottom:16px">' +
      '<div><b>' + prim.length + '</b><span>' + esc(t('Recommended standards')) + '</span></div><div><b>' + sup.length + '</b><span>' + esc(t('Allied, related and normative')) + '</span></div>' +
      '<div><b>' + att + '</b><span>' + esc(t('Version items needing attention')) + '</span></div><div><b>' + a.certs.length + '</b><span>' + esc(t('Certification requirements')) + '</span></div><div><b>' + pendingCount() + '</b><span>' + esc(t('Pending officer approval')) + '</span></div></div>';
  }
  const inputCard = '<div class="card"><header>' + ic('input') + '<h3>' + esc(t('Procurement input')) + '</h3>' + (a ? '<span class="meta">' + esc(a.input.typeLabel) + '</span>' : '') + '</header>' +
    (a ? '<div class="body"><p class="small muted" style="margin-bottom:6px">' + esc(t('Detected context')) + '</p><p style="margin-bottom:10px"><b>' + esc(a.intent) + '</b></p><p class="small" style="border-left:3px solid var(--line-strong);padding-left:10px;color:var(--muted)">' + esc(a.text.translated.length > 260 ? a.text.translated.slice(0, 257) + '...' : a.text.translated) + '</p>' +
      '<div class="chips" style="margin-top:12px"><span class="chip ent">' + esc(a.lang.name) + '</span><span class="chip ent">' + plural(a.entities.attributes.length, 'attribute') + '</span><span class="chip ent">' + plural(a.entities.requirements.length, 'requirement') + '</span><span class="chip ent">' + plural(a.entities.standards.length, 'cited standard') + '</span></div>' +
      '<div class="row" style="margin-top:14px"><button class="btn" data-action="nav" data-view="analysis">' + esc(t('New analysis')) + '</button></div></div>'
    : '<div class="body"><p style="margin-bottom:4px"><b>' + esc(t("Don't search. Specify. We'll find the standard.")) + '</b></p><p class="muted small" style="margin-bottom:12px">' + esc(t('Describe a product, paste a specification, upload a tender or speak the requirement. Try one of the sample inputs.')) + '</p>' +
      '<div class="chips">' + SAMPLES.map(s => '<button class="chip" data-action="dash-sample" data-id="' + s.id + '">' + esc(s.label) + '</button>').join('') + '</div><div class="row" style="margin-top:14px"><button class="btn primary" data-action="nav" data-view="analysis">' + esc(t('Start analysis')) + '</button></div></div>') + '</div>';
  const recCard = '<div class="card"><header>' + ic('recs') + '<h3>' + esc(t('Recommended standards')) + '</h3>' + (a ? '<button class="btn link meta" data-action="nav" data-view="recs">' + esc(t('View all')) + '</button>' : '') + '</header>' +
    (a && primaries().length ? '<ul class="list" style="padding:0 16px">' + primaries().slice(0, 5).map(r => '<li style="padding:10px 0"><div style="flex:1;min-width:0"><span class="isid">' + esc(r.id) + '</span> <span class="faint small">' + esc(std(r.id).version) + '</span><div class="small muted">' + esc(std(r.id).title) + '</div></div>' + scoreCell(r) + '</li>').join('') + '</ul>' :
      emptyState(a ? 'No standards matched' : 'No recommendations yet', a ? 'The demo Knowledge Base has no standard matching this input.' : 'Run an analysis to see recommended standards.', a ? null : ['Start analysis', 'go-analysis'])) + '</div>';
  const relCard = '<div class="card"><header>' + ic('link') + '<h3>' + esc(t('Related standards')) + '</h3></header>' +
    (a && supporting().length ? '<div class="body">' + ['Testing', 'Safety', 'Normative', 'Related'].map(role => {
      const list = a.recs.filter(r => r.roles.includes(role) && r.roles[0] !== 'Primary' || (r.roles.includes(role) && role !== 'Related' && false));
      const all = a.recs.filter(r => r.roles.includes(role));
      return '<div style="margin-bottom:10px"><div class="row" style="gap:8px">' + tags([role]) + '<span class="small muted">' + plural(all.length, 'standard') + '</span></div><div class="small" style="margin-top:4px">' + (all.slice(0, 5).map(r => esc(r.id)).join(', ') || '<span class="faint">' + esc(t('None')) + '</span>') + '</div></div>';
    }).join('') + '</div>' : emptyState('No related standards', 'Related, allied and normative standards appear after an analysis.')) + '</div>';
  let verBody;
  if (a) {
    const items = a.cited.filter(c => c.status !== 'current').slice(0, 4).map(c => '<li><div style="flex:1"><span class="isid">' + esc(c.raw) + '</span><div class="small muted">' + esc(c.note) + '</div></div>' + stChip(VS[c.status][0], VS[c.status][1]) + '</li>').join('');
    verBody = '<div class="body"><div class="chips" style="margin-bottom:10px"><span class="chip ent">' + plural(a.cited.length, 'reference') + ' cited</span><span class="chip ent">' + plural(a.missing.length, 'missing reference') + '</span><span class="chip ent">' + esc(t('Cross-references')) + ' ' + a.crossRef.resolved + '/' + a.crossRef.total + '</span></div>' +
      (items ? '<ul class="list">' + items + '</ul>' : '<p class="muted small">' + esc(a.cited.length ? t('All cited references match the latest versions in the Knowledge Base.') : t('The input cites no standards.')) + '</p>') + '</div>';
  } else verBody = emptyState('No version checks yet', 'Cited standards are checked against the latest versions after an analysis.');
  const verCard = '<div class="card"><header>' + ic('clock') + '<h3>' + esc(t('Version information')) + '</h3>' + (a ? '<button class="btn link meta" data-action="jump-recs" data-target="sec-ver">' + esc(t('Details')) + '</button>' : '') + '</header>' + verBody + '</div>';
  const certCard = '<div class="card"><header>' + ic('award') + '<h3>' + esc(t('Certification requirements')) + '</h3></header>' +
    (a && a.certs.length ? '<ul class="list" style="padding:0 16px">' + a.certs.slice(0, 5).map(c => '<li style="padding:10px 0"><span class="tag Related">' + esc(c.scheme) + '</span><div style="flex:1"><span class="isid">' + esc(c.standard) + '</span><div class="small muted">' + esc(c.item || c.title) + '</div></div></li>').join('') + '</ul>' : emptyState('No certification requirements', a ? 'No certification is mapped to the recommended standards in the demo Knowledge Base.' : 'Certification requirements appear after an analysis.')) + '</div>';
  const repCard = '<div class="card"><header>' + ic('report') + '<h3>' + esc(t('Reports')) + '</h3></header><div class="body">' +
    (a ? '<p class="small muted" style="margin-bottom:12px">' + esc(t('Export the applicable standards, version check and certification requirements.')) + '</p><div class="row"><button class="btn" data-action="gen" data-fmt="pdf"' + (S.busyReport ? ' disabled' : '') + '>' + ic('report') + esc(t('Download PDF')) + '</button><button class="btn" data-action="gen" data-fmt="xlsx"' + (S.busyReport ? ' disabled' : '') + '>' + ic('grid') + esc(t('Download Excel')) + '</button></div>' : '<p class="muted small">' + esc(t('Reports are available after an analysis.')) + '</p>') +
    (S.reports.length ? '<p class="small muted" style="margin-top:12px">' + esc(t('Last report')) + ': ' + esc(S.reports[0].name) + '</p>' : '') + '</div></div>';
  h += '<div class="grid g2">' + inputCard + recCard + relCard + verCard + certCard + repCard + '</div>';
  return h;
}

/* ---------- Analysis ---------- */
function viewAnalysis() {
  const I = S.input; const types = [['product', 'Product description'], ['spec', 'Technical specification'], ['tender', 'Tender document']];
  return demoBanner().replace(/<div class="banner"[\s\S]*<\/div>/, m => m) +
    '<div class="split"><div class="card"><div class="tabs" role="tablist">' + types.map(([k, l]) => '<button role="tab" aria-selected="' + (I.type === k) + '" data-action="input-type" data-type="' + k + '">' + esc(t(l)) + '</button>').join('') + '</div><div class="body">' +
    (I.type === 'tender' ? '<div class="drop" id="drop">' + ic('upload', 'lg') + '<div style="flex:1"><b>' + esc(t('Upload PDF, DOCX or TXT')) + '</b><div class="small muted">' + esc(I.fileName ? I.fileName + ' · ' + I.parseMethod : t('Text is read in your browser. The file is not uploaded anywhere.')) + '</div></div><button class="btn" data-action="choose-file"' + (I.busy ? ' disabled' : '') + '>' + esc(I.busy ? t('Reading…') : t('Choose file')) + '</button><input type="file" id="file" accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden></div><div style="height:12px"></div>' : '') +
    '<div class="row" style="margin-bottom:10px"><label class="field" style="flex-direction:row;align-items:center;gap:8px">' + esc(t('Input language')) + '<select class="sel" data-bind="langhint">' + [['auto', 'Auto-detect'], ['en', 'English'], ['hi', 'Hindi']].map(([v, l]) => '<option value="' + v + '"' + (I.langHint === v ? ' selected' : '') + '>' + esc(t(l)) + '</option>').join('') + '</select></label>' +
    '<button class="chip-btn mic' + (S.listening ? ' rec' : '') + '" id="micbtn" data-action="voice">' + ic('mic') + '<span id="miclbl">' + esc(t(S.listening ? 'Stop recording' : 'Voice input')) + '</span></button>' +
    '<select class="sel" data-bind="sample" style="margin-left:auto;max-width:100%" aria-label="' + esc(t('Load sample input')) + '"><option value="">' + esc(t('Load sample input')) + '</option>' + SAMPLES.map(s => '<option value="' + s.id + '">' + esc(s.label) + '</option>').join('') + '</select></div>' +
    '<textarea class="spec" id="spec" data-bind="text" placeholder="' + esc(I.type === 'tender' ? t('Paste tender text here, or upload a document above.') : I.type === 'spec' ? t('Paste or type the technical specification.') : t('Describe the product to be procured, for example its type, grade and quantity.')) + '" aria-label="' + esc(t(types.find(x => x[0] === I.type)[1])) + '">' + esc(I.text) + '</textarea>' +
    '<div id="inerr">' + (I.error ? '<div class="banner err" style="margin:12px 0 0">' + ic('alert') + '<p>' + esc(I.error) + '</p></div>' : '') + '</div>' +
    '<div class="row" style="margin-top:12px"><span class="small muted" id="charcount">' + I.text.length.toLocaleString('en-IN') + ' ' + esc(t('characters')) + '</span><span style="margin-left:auto"></span><button class="btn" data-action="clear-input">' + esc(t('Clear')) + '</button><button class="btn primary" data-action="run" id="runbtn"' + (S.run.active ? ' disabled' : '') + '>' + esc(t('Analyse specification')) + '</button></div></div></div>' +
    '<div id="side"></div></div>';
}
function renderPipeline() {
  const el = $('#side'); if (!el) return;
  const a = S.run.active ? S.pending : S.analysis;
  const labels = ['Input', 'Pre-processing', 'AI analysis', 'Standards matching', 'Recommendation', 'Verification'];
  const done = i => S.run.active ? i < S.run.stage : !!S.analysis;
  const running = i => S.run.active && i === S.run.stage;
  let h = '<div class="card"><header>' + ic('layers') + '<h3>' + esc(t('Processing pipeline')) + '</h3></header><div class="body"><ol class="pl">' +
    labels.map((l, i) => '<li class="' + (done(i) ? 'done' : running(i) ? 'run' : 'idle') + '"><span class="d">' + (done(i) ? ic('check') : '') + '</span><div><b>' + esc(t(l)) + '</b>' +
      (done(i) && a ? '<div class="sum">' + esc(a.stages[i].summary) + '</div><ul>' + a.stages[i].details.map(d => '<li style="display:list-item;border:0;padding:0;list-style:disc">' + esc(d) + '</li>').join('') + '</ul>' : '') + '</div></li>').join('') + '</ol></div></div>';
  if (!S.run.active && S.analysis) {
    const A = S.analysis;
    h += '<div class="card" style="margin-top:16px"><header>' + ic('doc') + '<h3>' + esc(t('Understanding')) + '</h3></header><div class="body">' +
      '<dl class="kv"><dt>' + esc(t('Language')) + '</dt><dd>' + esc(A.lang.name) + ' <span class="faint">(' + esc(A.lang.source) + ')</span></dd>' +
      (A.didTranslate ? '<dt>' + esc(t('Translation')) + '</dt><dd>' + esc(A.text.translated) + (A.untranslated.length ? '<div class="small faint" style="margin-top:4px">' + esc(t('Untranslated terms')) + ': ' + esc(A.untranslated.join(', ')) + '</div>' : '') + '</dd>' : '') +
      (!A.lang.supported ? '<dt></dt><dd><span class="st warn">' + esc(A.lang.name) + ': ' + esc(t('no translator in this prototype')) + '</span></dd>' : '') +
      '<dt>' + esc(t('Product')) + '</dt><dd>' + (A.entities.products.length ? '<div class="chips">' + A.entities.products.map(x => '<span class="chip ent">' + esc(x) + '</span>').join('') + '</div>' : '<span class="faint">' + esc(t('None found')) + '</span>') + '</dd>' +
      '<dt>' + esc(t('Attributes')) + '</dt><dd>' + (A.entities.attributes.length ? '<div class="chips">' + A.entities.attributes.map(x => '<span class="chip ent" title="' + esc(x.type) + '">' + esc(x.value) + '</span>').join('') + '</div>' : '<span class="faint">' + esc(t('None found')) + '</span>') + '</dd>' +
      '<dt>' + esc(t('Requirements')) + '</dt><dd>' + (A.entities.requirements.length ? '<ul style="margin:0;padding-left:16px">' + A.entities.requirements.slice(0, 5).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '<span class="faint">' + esc(t('None found')) + '</span>') + '</dd>' +
      '<dt>' + esc(t('Standards')) + '</dt><dd>' + (A.entities.standards.length ? '<div class="chips">' + A.entities.standards.map(x => '<span class="chip ent">' + esc(x.raw) + '</span>').join('') + '</div>' : '<span class="faint">' + esc(t('None cited')) + '</span>') + '</dd></dl>' +
      '<div class="row" style="margin-top:14px"><button class="btn primary" data-action="nav" data-view="recs">' + esc(t('View recommendations')) + ' ' + ic('arrow') + '</button></div></div></div>';
  }
  el.innerHTML = h;
}

/* ---------- Standards ---------- */
function viewStandards() {
  const kinds = ['all', 'product', 'code', 'test', 'safety'];
  const s = S.stdSel ? std(S.stdSel) : null;
  return demoBanner() +
    '<div class="card" style="margin-bottom:16px"><div class="body row"><div><b>' + esc(KB_META.name) + '</b><div class="small muted">' + esc(t('Version')) + ' ' + esc(kbVersion()) + ' · ' + plural(S.kb.list.length, 'record') + '</div></div>' +
    '<div class="row" style="margin-left:auto"><button class="btn" data-action="kb-update">' + ic('upload') + esc(t('Update Knowledge Base')) + '</button><button class="btn" data-action="kb-download">' + ic('report') + esc(t('Download Knowledge Base')) + '</button><input type="file" id="kbfile" accept=".json,application/json" hidden></div></div></div>' +
    '<div class="split"><div class="card"><div class="body row" style="border-bottom:1px solid var(--line)"><label class="field" style="flex:1;min-width:200px;position:relative"><span class="sr">' + esc(t('Search standards')) + '</span><input class="txt" data-bind="stdq" value="' + esc(S.stdq) + '" placeholder="' + esc(t('Search standards')) + '"></label>' +
    '<div class="chips">' + kinds.map(k => '<button class="chip' + (S.stdKind === k ? ' on' : '') + '" data-action="std-kind" data-kind="' + k + '">' + esc(k === 'all' ? t('All') : KIND[k]) + '</button>').join('') + '</div></div><div class="tw" id="stdlist"></div></div>' +
    '<aside class="card detail' + (s ? ' open' : ' hide-empty') + '" id="stddetail">' + stdDetail(s) + '</aside></div><div class="backdrop' + (s && S.detailOpen ? ' open' : '') + '" data-action="close-detail"></div>';
}
function stdDetail(s) {
  if (!s) return emptyState('Select a standard', 'Choose a record to see its metadata, versions and relationships.');
  return detailHead(s, '') + '<div class="body"><dl class="kv"><dt>' + esc(t('Type')) + '</dt><dd>' + esc(KIND[s.kind]) + '</dd><dt>' + esc(t('Category')) + '</dt><dd>' + esc(s.category) + '</dd><dt>' + esc(t('Scope')) + '</dt><dd>' + esc(s.scope || '—') + '</dd><dt>' + esc(t('Record status')) + '</dt><dd>' + demoPill() + '</dd></dl></div>' + recordSections(s);
}
function renderStdList() {
  const el = $('#stdlist'); if (!el) return;
  const q = S.stdq.trim().toLowerCase();
  const list = S.kb.list.filter(s => (S.stdKind === 'all' || s.kind === S.stdKind) && (!q || (s.id + ' ' + s.title + ' ' + s.category + ' ' + (s.keywords || []).join(' ')).toLowerCase().includes(q)));
  el.innerHTML = list.length ? '<table><thead><tr><th>' + esc(t('Standard')) + '</th><th>' + esc(t('Title')) + '</th><th>' + esc(t('Type')) + '</th><th>' + esc(t('Version')) + '</th><th>' + esc(t('Amendments')) + '</th><th>' + esc(t('Certification')) + '</th></tr></thead><tbody>' +
    list.map(s => '<tr class="clickable' + (S.stdSel === s.id ? ' sel' : '') + '" data-action="select-std" data-id="' + esc(s.id) + '" tabindex="0"><td><span class="isid">' + esc(s.id) + '</span></td><td>' + esc(s.title) + '<div class="small faint">' + esc(s.category) + '</div></td><td>' + esc(KIND[s.kind]) + '</td><td>' + esc(s.version) + '</td><td>' + (s.amendments.length || '<span class="faint">0</span>') + '</td><td>' + (s.cert.length ? s.cert.map(c => '<span class="tag Related">' + esc(c.scheme) + '</span>').join(' ') : '<span class="faint">—</span>') + '</td></tr>').join('') + '</tbody></table>' :
    emptyState('No standards found', 'Try a different search term or filter.');
}

/* ---------- Recommendations ---------- */
function viewRecs() {
  const a = S.analysis;
  if (!a) return demoBanner() + '<div class="card">' + emptyState('No analysis yet', 'Enter a product description, specification or tender to get recommended standards.', ['Start analysis', 'go-analysis']) + '</div>';
  const prim = primaries(), sup = supporting();
  const roleCount = r => a.recs.filter(x => x.roles[0] !== 'Primary' && x.roles.includes(r)).length;
  const supF = S.filter === 'all' ? sup : sup.filter(r => r.roles.includes(S.filter));
  const reviewed = a.recs.length - pendingCount();
  const stale = a.kbVersion !== kbVersion();
  const sel = S.sel && recOf(S.sel) ? std(S.sel) : null;
  let h = demoBanner();
  if (stale) h += '<div class="banner info">' + ic('info') + '<p>' + esc(t('The Knowledge Base changed after this analysis. Run the analysis again to use the updated records.')) + '</p></div>';
  h += '<div class="pagehead" style="margin-bottom:12px"><div><p><b>' + esc(a.intent) + '</b></p><p class="small">' + esc(reviewed + ' / ' + a.recs.length + ' ' + t('reviewed')) + ' · ' + esc(plural(a.recs.filter(r => app(r.id).status === 'approved').length, 'approved')) + '</p></div><div class="actions"><button class="btn" data-action="approve-all"' + (pendingCount() ? '' : ' disabled') + '>' + ic('check') + esc(t('Approve all pending')) + '</button><button class="btn primary" data-action="jump" data-target="sec-exp">' + ic('report') + esc(t('Export report')) + '</button></div></div>';
  h += '<div class="anchors">' + [['sec-rec', 'Recommended Indian Standards'], ['sec-all', 'Allied / normative standards'], ['sec-ver', 'Version check'], ['sec-cert', 'Certification requirements'], ['sec-cost', 'Cost analysis'], ['sec-exp', 'Export report']].map(([id, l]) => '<button class="chip" data-action="jump" data-target="' + id + '">' + esc(t(l)) + '</button>').join('') + '</div>';
  h += '<div class="split"><div>';
  h += '<section class="section card" id="sec-rec"><header>' + ic('recs') + '<h3>' + esc(t('Recommended Indian Standards')) + '</h3><span class="meta">' + esc(t('Recommendations are based on standards extracted from the input.')) + '</span></header>' +
    (prim.length ? listHead() + prim.map(stdRow).join('') : emptyState('No standards matched', 'The demo Knowledge Base has no standard matching this input. Add more detail such as product type, grade or material.', ['Edit input', 'go-analysis'])) + '</section>';
  h += '<section class="section card" id="sec-all"><header>' + ic('link') + '<h3>' + esc(t('Allied / normative and related standards')) + '</h3></header>' +
    '<div class="body" style="padding-bottom:8px"><div class="chips">' + [['all', a.recs.length - prim.length]].concat(['Related', 'Testing', 'Safety', 'Normative'].map(r => [r, roleCount(r)])).map(([k, n]) => '<button class="chip' + (S.filter === k ? ' on' : '') + '" data-action="filter" data-role="' + k + '">' + esc(t(k === 'all' ? 'All' : k)) + ' ' + n + '</button>').join('') + '</div></div>' +
    (supF.length ? listHead() + supF.map(stdRow).join('') : emptyState('Nothing to show', 'No allied or related standards for this filter.')) + '</section>';
  // version check
  const missingRows = a.missing.map(id => '<tr><td><span class="isid">' + esc(id) + '</span></td><td>' + esc(std(id).title) + '</td><td>' + esc(std(id).version) + '</td><td>' + tags(recOf(id).roles) + '</td></tr>').join('');
  h += '<section class="section card" id="sec-ver"><header>' + ic('clock') + '<h3>' + esc(t('Latest versions, revisions and amendments')) + '</h3><span class="meta">' + esc(t('Cross-references')) + ' ' + a.crossRef.resolved + '/' + a.crossRef.total + ' ' + esc(t('resolved')) + '</span></header>' +
    '<div class="body" style="padding-bottom:8px"><h4>' + esc(t('Standards cited in the input')) + '</h4></div>' +
    (a.cited.length ? '<div class="tw"><table><thead><tr><th>' + esc(t('Reference in input')) + '</th><th>' + esc(t('Latest version')) + '</th><th>' + esc(t('Status')) + '</th><th>' + esc(t('Note')) + '</th></tr></thead><tbody>' + a.cited.map(c => '<tr' + (c.kbId ? ' class="clickable" data-action="open-ref" data-id="' + esc(c.kbId) + '"' : '') + '><td><span class="isid">' + esc(c.raw) + '</span></td><td>' + esc(c.latest || '—') + '</td><td>' + stChip(VS[c.status][0], VS[c.status][1]) + '</td><td>' + esc(c.note) + '</td></tr>').join('') + '</tbody></table></div>' : '<div class="body" style="padding-top:0"><p class="muted small">' + esc(t('The input cites no standards, so no references could be checked.')) + '</p></div>') +
    '<div class="body" style="padding-bottom:8px;border-top:1px solid var(--line)"><h4>' + esc(t('Recommended but not referenced in the input')) + '</h4></div>' +
    (a.missing.length ? '<div class="tw"><table><thead><tr><th>' + esc(t('Standard')) + '</th><th>' + esc(t('Title')) + '</th><th>' + esc(t('Latest version')) + '</th><th>' + esc(t('Relationship')) + '</th></tr></thead><tbody>' + missingRows + '</tbody></table></div>' : '<div class="body" style="padding-top:0"><p class="muted small">' + esc(t('Every recommended standard is referenced in the input.')) + '</p></div>') +
    '<div class="body" style="padding-bottom:8px;border-top:1px solid var(--line)"><h4>' + esc(t('Latest versions and amendments')) + '</h4></div><div class="tw"><table><thead><tr><th>' + esc(t('Standard')) + '</th><th>' + esc(t('Latest version')) + '</th><th>' + esc(t('Earlier versions')) + '</th><th>' + esc(t('Amendments')) + '</th></tr></thead><tbody>' +
    a.recs.map(r => { const s = std(r.id); return '<tr class="clickable" data-action="select-rec" data-id="' + esc(r.id) + '"><td><span class="isid">' + esc(s.id) + '</span></td><td>' + esc(s.version) + '</td><td>' + (s.history.length ? s.history.map(x => esc(x.version)).join(', ') : '<span class="faint">—</span>') + '</td><td>' + (s.amendments.length ? plural(s.amendments.length, 'amendment') : '<span class="faint">' + esc(t('None recorded')) + '</span>') + '</td></tr>'; }).join('') + '</tbody></table></div></section>';
  // certifications
  h += '<section class="section card" id="sec-cert"><header>' + ic('award') + '<h3>' + esc(t('Certification requirements')) + '</h3><span class="meta">' + esc(t('Demo mapping')) + '</span></header>' +
    (a.certs.length ? '<div class="tw"><table><thead><tr><th>' + esc(t('Scheme')) + '</th><th>' + esc(t('Standard')) + '</th><th>' + esc(t('Item')) + '</th><th>' + esc(t('Note')) + '</th></tr></thead><tbody>' + a.certs.map(c => '<tr><td><span class="tag Related">' + esc(c.scheme) + '</span></td><td><span class="isid">' + esc(c.standard) + '</span></td><td>' + esc(c.item || c.title) + '</td><td class="muted">' + esc(c.note) + '</td></tr>').join('') + '</tbody></table></div>' : emptyState('No certification requirements', 'No certification is mapped to the recommended standards in the demo Knowledge Base.')) + '</section>';
  // cost
  const cp = prim.filter(r => std(r.id).item);
  h += '<section class="section card" id="sec-cost"><header>' + ic('calc') + '<h3>' + esc(t('Cost analysis')) + '</h3><span class="meta">' + esc(t('Figures entered by the officer')) + '</span></header>' +
    (cp.length ? '<div class="tw"><table><thead><tr><th>' + esc(t('Item')) + '</th><th>' + esc(t('Unit')) + '</th><th class="num">' + esc(t('Quantity')) + '</th><th class="num">' + esc(t('Unit rate (₹)')) + '</th><th class="num">' + esc(t('Amount')) + '</th></tr></thead><tbody>' + cp.map((r, i) => { const c = S.cost[r.id] || {}; return '<tr><td><span class="isid">' + esc(r.id) + '</span><div class="small muted">' + esc(std(r.id).item) + '</div></td><td style="width:110px"><input class="txt" data-bind="cost" data-id="' + esc(r.id) + '" data-field="unit" value="' + esc(c.unit || '') + '" placeholder="' + esc(t('e.g. bag')) + '" aria-label="' + esc(t('Unit')) + '"></td><td style="width:120px"><input class="txt r" inputmode="decimal" data-bind="cost" data-id="' + esc(r.id) + '" data-field="qty" value="' + esc(c.qty || '') + '" aria-label="' + esc(t('Quantity')) + '"></td><td style="width:130px"><input class="txt r" inputmode="decimal" data-bind="cost" data-id="' + esc(r.id) + '" data-field="rate" value="' + esc(c.rate || '') + '" aria-label="' + esc(t('Unit rate (₹)')) + '"></td><td class="num" id="amt-' + i + '">' + esc(fmtINR((+c.qty || 0) * (+c.rate || 0))) + '</td></tr>'; }).join('') + '</tbody><tfoot><tr><td colspan="4" class="num"><b>' + esc(t('Total')) + '</b></td><td class="num" id="cost-total"><b>' + esc(fmtINR(costTotal())) + '</b></td></tr></tfoot></table></div><div class="body small muted" style="border-top:1px solid var(--line)">' + esc(t('The prototype holds no price data. Amounts are quantity × unit rate as entered, and are included in the report.')) + '</div>' : emptyState('No items to cost', 'Cost analysis lists the recommended product standards once there are matches.')) + '</section>';
  h += '<section class="section" id="sec-exp">' + exportCard() + '</section></div>';
  // detail
  h += '<aside class="card detail' + (S.detailOpen ? ' open' : '') + '" id="detail">' + recDetail(sel) + '</aside></div><div class="backdrop' + (S.detailOpen ? ' open' : '') + '" data-action="close-detail"></div>';
  return h;
}
function costTotal() { return primaries().reduce((n, r) => { const c = S.cost[r.id]; return n + (c ? (+c.qty || 0) * (+c.rate || 0) : 0); }, 0); }
function recDetail(s) {
  if (!s) return emptyState('Select a standard', 'Choose a recommendation to see why it was recommended, its versions and its relationships.');
  const r = recOf(s.id); const ap = app(s.id);
  return detailHead(s, tags(r.roles)) +
    '<div class="body"><div class="row" style="margin-bottom:10px"><b>' + esc(t('Officer review')) + '</b><span class="st ' + (ap.status === 'approved' ? 'ok' : ap.status === 'rejected' ? 'bad' : 'neutral') + '" style="margin-left:auto">' + esc(t(ap.status === 'approved' ? 'Approved' : ap.status === 'rejected' ? 'Rejected' : 'Pending')) + '</span></div>' +
    '<div class="row"><button class="btn ok sm" data-action="approve" data-id="' + esc(s.id) + '">' + ic('check') + esc(t('Approve')) + '</button><button class="btn no sm" data-action="reject" data-id="' + esc(s.id) + '">' + ic('x') + esc(t('Reject')) + '</button>' + (ap.status !== 'pending' ? '<button class="btn sm" data-action="reset" data-id="' + esc(s.id) + '">' + esc(t('Reset')) + '</button>' : '') + '</div>' +
    '<label class="field" style="margin-top:10px">' + esc(t('Officer remarks')) + '<textarea class="spec" style="min-height:64px" data-bind="remark" data-id="' + esc(s.id) + '">' + esc(ap.note || '') + '</textarea></label>' +
    (ap.at ? '<p class="small faint" style="margin-top:6px">' + esc(t('Procurement Officer')) + ' · ' + esc(new Date(ap.at).toLocaleString('en-IN')) + '</p>' : '') + '</div>' +
    '<div class="body" style="border-top:1px solid var(--line)"><h4 style="margin-bottom:8px">' + esc(t('Why this was recommended')) + '</h4>' +
    (r.score != null ? '<p class="small muted" style="margin-bottom:8px">' + esc(t('Match score')) + ' <b style="color:var(--text)">' + Math.round(r.score * 100) + '%</b> · ' + esc(t('demo matcher')) + '</p>' : '') +
    (r.advisory ? '<div class="banner" style="margin-bottom:10px">' + ic('alert') + '<p>' + esc(r.advisory) + '</p></div>' : '') +
    '<ul class="list">' + r.reasons.map(x => '<li>' + ic(x.kind === 'attr-miss' ? 'alert' : 'check') + '<span>' + esc(x.text) + '</span></li>').join('') + r.paths.map(p => '<li>' + ic('link') + '<span>' + esc(p.text) + '.</span></li>').join('') + '</ul>' +
    (r.evidence.length ? '<p class="small muted" style="margin:12px 0 6px">' + esc(t('Evidence from the input')) + '</p>' + r.evidence.map(e => '<p class="small" style="border-left:3px solid var(--line-strong);padding-left:10px;margin-bottom:6px">' + e.map(sg => sg.m ? '<mark>' + esc(sg.t) + '</mark>' : esc(sg.t)).join('') + '</p>').join('') : '') + '</div>' +
    '<div class="body" style="border-top:1px solid var(--line)"><dl class="kv"><dt>' + esc(t('Type')) + '</dt><dd>' + esc(KIND[s.kind]) + '</dd><dt>' + esc(t('Scope')) + '</dt><dd>' + esc(s.scope || '—') + '</dd><dt>' + esc(t('Record status')) + '</dt><dd>' + demoPill() + '</dd></dl>' +
    '<button class="btn link" style="margin-top:8px" data-action="open-in-kb" data-id="' + esc(s.id) + '">' + esc(t('Open in Standards')) + '</button></div>' + recordSections(s);
}

/* ---------- Reports ---------- */
function exportCard() {
  const a = S.analysis; const nApproved = a ? a.recs.filter(r => app(r.id).status === 'approved').length : 0;
  return '<div class="card"><header>' + ic('report') + '<h3>' + esc(t('Export report')) + '</h3><span class="meta">PDF · Excel</span></header><div class="body">' +
    '<fieldset style="border:0;padding:0;margin:0 0 12px"><legend class="small muted" style="padding:0;margin-bottom:6px">' + esc(t('Include')) + '</legend><label class="row" style="gap:8px;margin-bottom:6px"><input type="radio" name="scope" data-bind="scope" value="all"' + (S.reportOpts.scope === 'all' ? ' checked' : '') + '>' + esc(t('All recommendations, with review status')) + '</label>' +
    '<label class="row" style="gap:8px"><input type="radio" name="scope" data-bind="scope" value="approved"' + (S.reportOpts.scope === 'approved' ? ' checked' : '') + '>' + esc(t('Approved standards only')) + ' <span class="faint small">(' + nApproved + ')</span></label></fieldset>' +
    '<p class="small muted" style="margin-bottom:12px">' + esc(t('Each report contains the applicable standards, allied and normative standards, version check, certification requirements, explanations and any cost figures entered.')) + '</p>' +
    '<div class="row"><button class="btn primary" data-action="gen" data-fmt="pdf"' + (S.busyReport ? ' disabled' : '') + '>' + ic('report') + esc(S.busyReport ? t('Preparing…') : t('Download PDF')) + '</button><button class="btn" data-action="gen" data-fmt="xlsx"' + (S.busyReport ? ' disabled' : '') + '>' + ic('grid') + esc(t('Download Excel')) + '</button></div></div></div>';
}
function viewReports() {
  const a = S.analysis;
  if (!a) return demoBanner() + '<div class="card">' + emptyState('No report available', 'Run an analysis first. Reports are generated from the recommended standards.', ['Start analysis', 'go-analysis']) + '</div>';
  const prim = primaries().length, sup = supporting().length;
  return demoBanner() + '<div class="split"><div>' + '<div class="section">' + exportCard() + '</div>' +
    '<div class="card"><header>' + ic('doc') + '<h3>' + esc(t('Report contents')) + '</h3><span class="meta">' + esc(a.id) + '</span></header><ul class="list" style="padding:0 16px">' +
    [['Recommended Indian Standards', prim], ['Allied / normative and related standards', sup], ['Standards cited in the input', a.cited.length], ['Recommended but not referenced in the input', a.missing.length], ['Certification requirements', a.certs.length], ['Explanation', a.recs.length]].map(([l, n]) => '<li style="padding:10px 0">' + ic('check') + '<span style="flex:1">' + esc(t(l)) + '</span><span class="muted">' + n + '</span></li>').join('') + '<li style="padding:10px 0">' + ic('check') + '<span style="flex:1">' + esc(t('Cost analysis')) + '</span><span class="muted">' + (costTotal() ? fmtINR(costTotal()) : esc(t('No figures entered'))) + '</span></li></ul></div></div>' +
    '<div class="card"><header>' + ic('clock') + '<h3>' + esc(t('Reports generated in this session')) + '</h3></header>' +
    (S.reports.length ? '<ul class="list" style="padding:0 16px">' + S.reports.map(r => '<li style="padding:10px 0">' + ic('report') + '<div style="flex:1;min-width:0"><div style="overflow-wrap:anywhere">' + esc(r.name) + '</div><div class="small muted">' + esc(r.at) + ' · ' + esc(r.scope) + '</div></div></li>').join('') + '</ul>' : emptyState('No reports yet', 'Generated reports are listed here.')) + '</div></div>';
}

/* ---------- Architecture dialog ---------- */
function aboutModal() {
  const L = [['Input layer', 'Product description, technical specification, tender documents (PDF, DOCX, TXT), voice and multilingual input.', 'Implemented'],
    ['Pre-processing & understanding', 'Document parsing, text cleaning and normalisation, language detection and translation, entity extraction.', 'Implemented. OCR is not run, and Hindi translation uses a small demo lexicon.'],
    ['AI engine', 'Semantic understanding, similarity matching, context and intent analysis, ranking, with a knowledge graph of relationships.', 'A concept-weighted matcher stands in for LLM embeddings and pgvector search.'],
    ['Standards Knowledge Base', 'Indian Standards repository, allied and normative standards, test methods, safety standards, cross-references, metadata and version control.', 'Sample records that can be updated separately from JSON.'],
    ['Recommendation engine', 'Rank and filter, recommend standards, suggest certifications, structured output with reasons and references.', 'Implemented on the sample records.'],
    ['Output / dashboard', 'Recommended standards with latest versions, allied and normative standards, certification requirements, PDF and Excel export.', 'Implemented.']];
  const T = [['Frontend', 'React / Next.js, Tailwind CSS, PWA, voice input, multilingual UI', 'This prototype is a single HTML page with the same screens, browser speech recognition and an English and Hindi interface.'],
    ['Backend', 'FastAPI, Python, REST APIs, authentication, API integration', 'Not connected. Engine functions are pure and map to REST endpoints.'],
    ['AI & NLP', 'LLM, embeddings, semantic search, OCR, speech-to-text', 'Demo matcher in place of LLM and embeddings. OCR is not run.'],
    ['Data & storage', 'PostgreSQL, pgvector, standards metadata, tender documents, relationship data', 'Sample Knowledge Base held in the page as JSON.'],
    ['Security & deployment', 'Docker, JWT / RBAC, HTTPS, secure document handling', 'Not implemented in the prototype. Documents are read in the browser and are not uploaded. The officer session is a demo.'],
    ['Standards intelligence', 'Standards Knowledge Base, related standards, normative references, version and amendment mapping, certification mapping', 'Implemented on the sample records.']];
  return '<div class="modal" data-action="close-modal"><div class="sheet" role="dialog" aria-modal="true" aria-label="' + esc(t('Architecture')) + '" data-stop="1"><header><h3>' + esc(t('Architecture')) + '</h3><button class="iconbtn" data-action="close-modal" aria-label="' + esc(t('Close')) + '">' + ic('x') + '</button></header><div class="body">' +
    '<p class="muted small" style="margin-bottom:12px">' + esc(t('Input → Pre-processing → AI engine → Standards Knowledge Base → Recommendation engine → Output. An integration layer covers APIs, procurement portal integration, and authentication and security.')) + '</p>' +
    '<div class="arch">' + L.map(x => '<div><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span><span style="color:var(--text);margin-top:3px">' + esc(t('Prototype')) + ': ' + esc(x[2]) + '</span></div>').join('') + '<div><b>Integration layer</b><span>APIs, procurement portal integration, authentication and security.</span><span style="color:var(--text);margin-top:3px">' + esc(t('Prototype')) + ': not connected.</span></div></div>' +
    '<h4 style="margin:18px 0 0">' + esc(t('Technology stack')) + '</h4><dl class="stack">' + T.map(x => '<dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '<br><span style="color:var(--text)">' + esc(t('Prototype')) + ': ' + esc(x[2]) + '</span></dd>').join('') + '</dl></div></div></div>';
}

/* ---------- actions ---------- */
function setStatus(id, status) {
  const cur = app(id);
  S.approvals[id] = { status: cur.status === status ? 'pending' : status, note: cur.note || '', at: cur.status === status ? undefined : new Date().toISOString() };
  renderPage(); renderShellBadge();
}
function renderShellBadge() { /* badge refreshed inside renderPage */ }

async function startAnalysis() {
  if (S.run.active) return;
  const text = S.input.text.trim();
  if (text.length < 8) { S.input.error = t('Enter or upload a requirement first. A few words are enough to start.'); const e = $('#inerr'); if (e) e.innerHTML = '<div class="banner err" style="margin:12px 0 0">' + ic('alert') + '<p>' + esc(S.input.error) + '</p></div>'; return; }
  S.input.error = null; const e = $('#inerr'); if (e) e.innerHTML = '';
  S.pending = Engine.analyse(S.kb, { text, type: S.input.type, fileName: S.input.fileName, langHint: S.input.langHint, parseMethod: S.input.fileName ? S.input.parseMethod : 'Plain text', kbVersion: kbVersion() });
  S.run = { active: true, stage: 0 };
  const btn = $('#runbtn'); if (btn) btn.disabled = true;
  for (let i = 0; i < 6; i++) { S.run.stage = i; renderPipeline(); await sleep(reduceMotion() ? 0 : 420); }
  S.analysis = S.pending; S.pending = null; S.approvals = {}; S.cost = {}; S.filter = 'all'; S.detailOpen = false;
  S.sel = (primaries()[0] || S.analysis.recs[0] || {}).id || null;
  S.run = { active: false, stage: 6 };
  if (S.view === 'analysis') { renderPipeline(); const b = $('#runbtn'); if (b) b.disabled = false; }
  renderPage();
}

async function readFile(file) {
  const I = S.input; I.busy = true; I.error = null; renderPage();
  const load = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('lib')); document.head.appendChild(s); });
  try {
    const name = file.name.toLowerCase(); let text = '', method = '';
    if (name.endsWith('.txt')) { text = await file.text(); method = 'Plain text file'; }
    else if (name.endsWith('.docx')) { await load('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js'); const r = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() }); text = r.value; method = 'DOCX text extraction'; }
    else if (name.endsWith('.pdf')) {
      await load('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise; const parts = [];
      for (let p = 1; p <= pdf.numPages; p++) { const c = await (await pdf.getPage(p)).getTextContent(); let last = null, line = ''; for (const it of c.items) { const y = it.transform[5]; if (last !== null && Math.abs(y - last) > 3) { parts.push(line); line = ''; } line += it.str + ' '; last = y; } parts.push(line); parts.push(''); }
      text = parts.join('\n'); method = 'PDF text layer (' + pdf.numPages + ' pages)';
      if (text.replace(/\s/g, '').length < 20) throw new Error('nolayer');
    } else throw new Error('type');
    I.text = text; I.fileName = file.name; I.parseMethod = method;
  } catch (err) {
    I.error = err.message === 'nolayer' ? t('This PDF has no readable text layer. Scanned documents need the OCR service, which is not available in this prototype. Paste the text instead.') :
      err.message === 'type' ? t('Unsupported file type. Use PDF, DOCX or TXT.') : t('The file could not be read in this browser. Paste the text instead.');
  }
  I.busy = false; renderPage();
}

let recog = null;
function toggleVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { toast(t('Voice input is not supported in this browser. Type or paste the requirement instead.')); return; }
  if (S.listening && recog) { recog.stop(); return; }
  recog = new SR(); recog.lang = S.input.langHint === 'hi' ? 'hi-IN' : 'en-IN'; recog.interimResults = false; recog.continuous = true;
  recog.onresult = ev => { let add = ''; for (let i = ev.resultIndex; i < ev.results.length; i++) if (ev.results[i].isFinal) add += ev.results[i][0].transcript + ' '; if (add) { const ta = $('#spec'); S.input.text = (S.input.text + ' ' + add).trim(); if (ta) { ta.value = S.input.text; } const cc = $('#charcount'); if (cc) cc.textContent = S.input.text.length.toLocaleString('en-IN') + ' ' + t('characters'); } };
  recog.onerror = ev => { toast(ev.error === 'not-allowed' || ev.error === 'service-not-allowed' ? t('Microphone access was blocked. Allow it in the browser to use voice input.') : t('Voice input stopped: ') + ev.error); };
  recog.onend = () => { S.listening = false; const b = $('#micbtn'); if (b) b.classList.remove('rec'); const l = $('#miclbl'); if (l) l.textContent = t('Voice input'); };
  try { recog.start(); S.listening = true; const b = $('#micbtn'); if (b) b.classList.add('rec'); const l = $('#miclbl'); if (l) l.textContent = t('Stop recording'); }
  catch (e) { toast(t('Voice input could not start.')); }
}

async function saveOut(filename, data) {
  let dl = null;
  try { dl = window.claude && await window.claude.use('downloads'); } catch (e) { dl = null; }
  if (dl) { await dl.save({ filename, data }); return 'saved'; }
  const blob = data instanceof Blob ? data : new Blob([data]); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); return 'link';
}
async function generate(fmt) {
  if (!S.analysis || S.busyReport) return;
  if (S.reportOpts.scope === 'approved' && !S.analysis.recs.some(r => app(r.id).status === 'approved')) { toast(t('No standards are approved yet. Approve at least one, or include all recommendations.')); return; }
  S.busyReport = true; renderPage();
  try {
    const ctx = { analysis: S.analysis, kb: S.kb, approvals: S.approvals, cost: S.cost, opts: S.reportOpts };
    const out = fmt === 'pdf' ? await Reports.pdf(ctx) : await Reports.excel(ctx);
    await saveOut(out.filename, out.data);
    S.reports.unshift({ name: out.filename, at: new Date().toLocaleString('en-IN'), scope: S.reportOpts.scope === 'approved' ? 'Approved standards only' : 'All recommendations' });
    toast(t('Report ready: ') + out.filename);
  } catch (e) {
    if (e && e.code === 'declined') toast(t('Download cancelled.'));
    else toast(t('The report could not be created. Check the network connection and try again.'));
  }
  S.busyReport = false; renderPage();
}

function applyKBUpdate(json) {
  const v = Engine.validateKBUpdate(json);
  if (!v.ok) { toast(t('Knowledge Base update rejected: ') + v.error); return; }
  const map = new Map(kbStandards.map(s => [s.id, s]));
  json.standards.forEach(s => map.set(s.id, Engine.normaliseRecord(s)));
  kbStandards = Array.from(map.values()); S.kb = Engine.indexKB(kbStandards); S.kbUpdates++;
  const un = S.kb.unresolved.length;
  toast(plural(json.standards.length, 'record') + ' ' + t('added or replaced.') + (un ? ' ' + plural(un, 'unresolved reference') + '.' : ''));
  renderPage();
}

function openRef(id) {
  if (S.view === 'recs' && recOf(id)) { S.sel = id; S.detailOpen = true; renderPage(); }
  else { S.view = 'standards'; S.stdSel = id; S.detailOpen = true; renderPage(); window.scrollTo(0, 0); }
}
function jump(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' }); }

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const act = el.dataset.action, id = el.dataset.id;
  if (el.classList.contains('modal') && e.target !== el) return;
  switch (act) {
    case 'nav': go(el.dataset.view); break;
    case 'go-analysis': go('analysis'); break;
    case 'about': $('#modal').innerHTML = aboutModal(); break;
    case 'close-modal': $('#modal').innerHTML = ''; break;
    case 'input-type': S.input.type = el.dataset.type; renderPage(); break;
    case 'choose-file': { const f = $('#file'); if (f) f.click(); break; }
    case 'clear-input': S.input.text = ''; S.input.fileName = ''; S.input.error = null; renderPage(); break;
    case 'voice': toggleVoice(); break;
    case 'run': startAnalysis(); break;
    case 'dash-sample': { const s = SAMPLES.find(x => x.id === id); S.input = { ...S.input, type: s.type, text: s.text, langHint: s.lang, fileName: '', parseMethod: 'Plain text', error: null }; go('analysis'); break; }
    case 'select-rec': S.sel = id; S.detailOpen = true; if (S.view !== 'recs') S.view = 'recs'; renderPage(); break;
    case 'select-std': S.stdSel = id; S.detailOpen = true; renderPage(); break;
    case 'open-ref': openRef(id); break;
    case 'open-in-kb': S.view = 'standards'; S.stdSel = id; S.detailOpen = true; renderPage(); window.scrollTo(0, 0); break;
    case 'close-detail': S.detailOpen = false; renderPage(); break;
    case 'std-kind': S.stdKind = el.dataset.kind; renderPage(); break;
    case 'filter': S.filter = el.dataset.role; renderPage(); break;
    case 'approve': setStatus(id, 'approved'); break;
    case 'reject': setStatus(id, 'rejected'); break;
    case 'reset': S.approvals[id] = { status: 'pending', note: app(id).note || '' }; renderPage(); break;
    case 'approve-all': S.analysis.recs.forEach(r => { if (app(r.id).status === 'pending') S.approvals[r.id] = { status: 'approved', note: app(r.id).note || '', at: new Date().toISOString() }; }); renderPage(); toast(t('All pending standards approved.')); break;
    case 'jump': jump(el.dataset.target); break;
    case 'jump-recs': go('recs'); setTimeout(() => jump(el.dataset.target), 30); break;
    case 'gen': generate(el.dataset.fmt); break;
    case 'kb-update': { const f = $('#kbfile'); if (f) f.click(); break; }
    case 'kb-download': saveOut('ispectra-knowledge-base.json', JSON.stringify({ meta: { ...KB_META, version: kbVersion() }, standards: kbStandards }, null, 2)).then(() => toast(t('Knowledge Base file ready.'))).catch(() => toast(t('Download cancelled.'))); break;
  }
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-action="select-rec"],[data-action="select-std"]')) { e.preventDefault(); e.target.click(); }
  if (e.key === 'Escape') { if ($('#modal') && $('#modal').innerHTML) $('#modal').innerHTML = ''; else if (S.detailOpen) { S.detailOpen = false; renderPage(); } }
});
document.addEventListener('input', e => {
  const b = e.target.dataset && e.target.dataset.bind; if (!b) return;
  if (b === 'text') { S.input.text = e.target.value; const c = $('#charcount'); if (c) c.textContent = S.input.text.length.toLocaleString('en-IN') + ' ' + t('characters'); }
  else if (b === 'stdq') { S.stdq = e.target.value; renderStdList(); }
  else if (b === 'remark') { const id = e.target.dataset.id; S.approvals[id] = { ...app(id), note: e.target.value }; }
  else if (b === 'cost') {
    const id = e.target.dataset.id; S.cost[id] = { ...(S.cost[id] || {}), [e.target.dataset.field]: e.target.value };
    const cp = primaries().filter(r => std(r.id).item); cp.forEach((r, i) => { const c = S.cost[r.id] || {}; const cell = $('#amt-' + i); if (cell) cell.textContent = fmtINR((+c.qty || 0) * (+c.rate || 0)); });
    const tot = $('#cost-total'); if (tot) tot.innerHTML = '<b>' + esc(fmtINR(costTotal())) + '</b>';
  }
});
document.addEventListener('change', e => {
  const el = e.target; const b = el.dataset && el.dataset.bind;
  if (el.id === 'file' && el.files[0]) { readFile(el.files[0]); el.value = ''; return; }
  if (el.id === 'kbfile' && el.files[0]) { el.files[0].text().then(tx => { try { applyKBUpdate(JSON.parse(tx)); } catch (err) { toast(t('Knowledge Base update rejected: ') + t('the file is not valid JSON.')); } }); el.value = ''; return; }
  if (!b) return;
  if (b === 'uilang') { S.uiLang = el.value; LANG = el.value; try { localStorage.setItem('ispectra-lang', LANG); } catch (x) {} renderShell(); }
  else if (b === 'langhint') S.input.langHint = el.value;
  else if (b === 'scope') { S.reportOpts.scope = el.value; renderPage(); }
  else if (b === 'sample' && el.value) { const s = SAMPLES.find(x => x.id === el.value); S.input = { ...S.input, type: s.type, text: s.text, langHint: s.lang, fileName: '', parseMethod: 'Plain text', error: null }; renderPage(); }
});
document.addEventListener('dragover', e => { const d = e.target.closest && e.target.closest('#drop'); if (d) { e.preventDefault(); d.classList.add('over'); } });
document.addEventListener('dragleave', e => { const d = e.target.closest && e.target.closest('#drop'); if (d) d.classList.remove('over'); });
document.addEventListener('drop', e => { const d = e.target.closest && e.target.closest('#drop'); if (d) { e.preventDefault(); d.classList.remove('over'); if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); } });

try { const l = localStorage.getItem('ispectra-lang'); if (l && I18N[l]) { S.uiLang = l; LANG = l; } } catch (e) {}
renderShell();
})();
