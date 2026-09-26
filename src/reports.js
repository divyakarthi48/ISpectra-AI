/* ===== Report generation (PDF / Excel) =====
   Libraries are loaded on demand from cdnjs. */
const Reports = (() => {
  const LIBS = {
    xlsx: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    jspdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    autotable: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js'
  };
  const cache = {};
  function load(src) {
    if (!cache[src]) cache[src] = new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = src; s.onload = () => res();
      s.onerror = () => { delete cache[src]; rej(new Error('Could not load ' + src)); };
      document.head.appendChild(s);
    });
    return cache[src];
  }

  const DEMO_NOTICE = 'Generated from the demo Standards Knowledge Base. Records are sample data and are not verified against BIS.';

  function tableData(ctx) {
    const { analysis: a, kb, approvals, opts } = ctx;
    const use = r => opts.scope !== 'approved' || (approvals[r.id] && approvals[r.id].status === 'approved');
    const stat = id => { const x = approvals[id]; return x && x.status === 'approved' ? 'Approved' : x && x.status === 'rejected' ? 'Rejected' : 'Pending review'; };
    const remark = id => (approvals[id] && approvals[id].note) || '';
    const row = r => { const s = kb.byId.get(r.id); return { r, s, cells: [s.id, s.title, s.version, r.roles.join(', '), r.score == null ? '' : Math.round(r.score * 100) + '%', stat(r.id), remark(r.id)] }; };
    const prim = a.recs.filter(r => r.roles[0] === 'Primary' && use(r)).map(row);
    const supp = a.recs.filter(r => r.roles[0] !== 'Primary' && use(r)).map(row);
    const stdHead = ['Standard', 'Title', 'Latest version (KB)', 'Relationship', 'Match', 'Officer review', 'Officer remarks'];
    const cited = a.cited.map(c => [c.raw, c.kbId || '', c.latest || '', ({ current: 'Current', outdated: 'Outdated', unknown: 'Not in Knowledge Base', noyear: 'Year not stated', multipart: 'Multi-part', mismatch: 'Unknown year' })[c.status], c.note]);
    const missing = a.missing.map(id => [id, kb.byId.get(id).title, kb.byId.get(id).version]);
    const certs = a.certs.filter(c => opts.scope !== 'approved' || (approvals[c.standard] && approvals[c.standard].status === 'approved')).map(c => [c.scheme, c.standard, c.title, c.note]);
    const expl = [...prim, ...supp].map(x => [x.s.id, x.r.reasons.map(z => z.text).concat(x.r.paths.map(p => p.text + '.')).concat(x.r.advisory ? [x.r.advisory] : []).join(' ')]);
    const cost = []; let total = 0;
    prim.forEach(x => { const c = ctx.cost[x.s.id]; if (c && (c.qty || c.rate)) { const amt = (+c.qty || 0) * (+c.rate || 0); total += amt; cost.push([x.s.id, x.s.item || '', c.unit || '', +c.qty || 0, +c.rate || 0, amt]); } });
    const meta = [
      ['Report', 'ISpectra AI: applicable standards report'], ['Generated', new Date().toLocaleString('en-IN')],
      ['Prepared by', 'Procurement Officer (demo session)'], ['Input type', a.input.typeLabel + (a.input.fileName ? ' (' + a.input.fileName + ')' : '')],
      ['Input language', a.lang.name], ['Detected context', a.intent], ['Scope', opts.scope === 'approved' ? 'Approved standards only' : 'All recommendations, with review status'],
      ['Data notice', DEMO_NOTICE]
    ];
    return { meta, stdHead, prim, supp, cited, missing, certs, expl, cost, total };
  }

  async function excel(ctx) {
    await load(LIBS.xlsx);
    const d = tableData(ctx); const wb = XLSX.utils.book_new();
    const add = (name, rows, widths) => { const ws = XLSX.utils.aoa_to_sheet(rows); ws['!cols'] = widths.map(w => ({ wch: w })); XLSX.utils.book_append_sheet(wb, ws, name); };
    add('Summary', d.meta, [18, 100]);
    add('Recommended', [d.stdHead].concat(d.prim.map(x => x.cells)), [18, 70, 18, 16, 8, 16, 40]);
    add('Allied-normative', [d.stdHead].concat(d.supp.map(x => x.cells)), [18, 70, 18, 22, 8, 16, 40]);
    add('Version check', [['Reference in input', 'Knowledge Base record', 'Latest version', 'Status', 'Note']].concat(d.cited), [22, 20, 16, 22, 70]);
    if (d.missing.length) add('Missing references', [['Standard', 'Title', 'Latest version']].concat(d.missing), [18, 70, 16]);
    add('Certifications', [['Scheme', 'Standard', 'Title', 'Note']].concat(d.certs), [12, 18, 70, 60]);
    add('Explanations', [['Standard', 'Why it was recommended']].concat(d.expl), [18, 120]);
    if (d.cost.length) add('Cost analysis', [['Standard', 'Item', 'Unit', 'Quantity', 'Unit rate (INR)', 'Amount (INR)']].concat(d.cost).concat([['', '', '', '', 'Total', d.total]]), [18, 40, 12, 12, 16, 18]);
    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return { filename: 'ISpectra-report-' + ctx.analysis.id + '.xlsx', data: new Blob([out], { type: 'application/octet-stream' }) };
  }

  const safe = s => String(s == null ? '' : s).replace(/₹/g, 'Rs.').replace(/≥/g, '>=').replace(/[^\x00-\xFF\u2013\u2014\u2018\u2019\u201C\u201D\u2022\u2026]/g, '?');

  async function pdf(ctx) {
    await load(LIBS.jspdf); await load(LIBS.autotable);
    const d = tableData(ctx); const a = ctx.analysis;
    const doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4' });
    const W = doc.internal.pageSize.getWidth(); let y = 48;
    doc.setFont('times', 'bold'); doc.setFontSize(18); doc.text('ISpectra AI', 40, y);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(90); doc.text('AI-powered procurement standards intelligence', 40, y + 15);
    doc.setTextColor(20); doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.text('Applicable standards report', 40, y + 40);
    y += 52;
    doc.autoTable({ startY: y, body: d.meta.map(r => r.map(safe)), theme: 'plain', styles: { fontSize: 9, cellPadding: 3 }, columnStyles: { 0: { fontStyle: 'bold', cellWidth: 95 } }, margin: { left: 40, right: 40 } });
    y = doc.lastAutoTable.finalY + 6;
    doc.setFillColor(251, 238, 219); doc.rect(40, y, W - 80, 26, 'F'); doc.setFontSize(8.5); doc.setTextColor(120, 70, 8);
    doc.text(safe(DEMO_NOTICE), 46, y + 16, { maxWidth: W - 92 }); doc.setTextColor(20); y += 42;
    const head = (txt) => { if (y > 730) { doc.addPage(); y = 48; } doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text(txt, 40, y); y += 6; };
    const tbl = (h, rows, cw) => { doc.autoTable({ startY: y + 4, head: [h.map(safe)], body: rows.map(r => r.map(safe)), styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' }, headStyles: { fillColor: [18, 35, 63] }, columnStyles: cw || {}, margin: { left: 40, right: 40 } }); y = doc.lastAutoTable.finalY + 22; };
    const stdCols = { 0: { cellWidth: 55 }, 2: { cellWidth: 48 }, 3: { cellWidth: 55 }, 4: { cellWidth: 32 }, 5: { cellWidth: 50 } };
    const stdH = ['Standard', 'Title', 'Version', 'Relationship', 'Match', 'Review', 'Remarks'];
    head('Recommended Indian Standards'); if (d.prim.length) tbl(stdH, d.prim.map(x => x.cells), stdCols); else { doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text('None in scope.', 40, y + 14); y += 30; }
    head('Allied / normative and related standards'); if (d.supp.length) tbl(stdH, d.supp.map(x => x.cells), stdCols); else { doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text('None in scope.', 40, y + 14); y += 30; }
    head('Version check: standards cited in the input');
    if (d.cited.length) tbl(['Reference', 'KB record', 'Latest', 'Status', 'Note'], d.cited, { 0: { cellWidth: 70 }, 1: { cellWidth: 60 }, 2: { cellWidth: 45 }, 3: { cellWidth: 70 } }); else { doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text('The input cites no standards.', 40, y + 14); y += 30; }
    if (d.missing.length) { head('Recommended standards not referenced in the input'); tbl(['Standard', 'Title', 'Latest version'], d.missing, { 0: { cellWidth: 70 }, 2: { cellWidth: 70 } }); }
    head('Certification requirements');
    if (d.certs.length) tbl(['Scheme', 'Standard', 'Title', 'Note'], d.certs, { 0: { cellWidth: 45 }, 1: { cellWidth: 60 } }); else { doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text('No certification mapping in the demo Knowledge Base for these standards.', 40, y + 14); y += 30; }
    head('Explanation'); tbl(['Standard', 'Why it was recommended'], d.expl, { 0: { cellWidth: 70 } });
    if (d.cost.length) { head('Cost analysis (figures entered by the officer)'); tbl(['Standard', 'Item', 'Unit', 'Qty', 'Unit rate (Rs.)', 'Amount (Rs.)'], d.cost.map(r => r.map((v, i) => i >= 3 ? Number(v).toLocaleString('en-IN') : v)).concat([['', '', '', '', 'Total', d.total.toLocaleString('en-IN')]])); }
    const n = doc.getNumberOfPages();
    for (let i = 1; i <= n; i++) { doc.setPage(i); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(120); doc.text('ISpectra AI  |  ' + a.id + '  |  Demo data, not verified against BIS  |  Page ' + i + ' of ' + n, 40, 822); }
    return { filename: 'ISpectra-report-' + a.id + '.pdf', data: doc.output('blob') };
  }

  return { pdf, excel };
})();
