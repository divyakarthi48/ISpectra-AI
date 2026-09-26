/* ===== Standards Knowledge Base (demo data) =====
   Kept separate from the engine so records, versions, amendments and
   certification mappings can be updated without touching application code.
   Every record here is SAMPLE data for the prototype. It is not verified
   against BIS and is not a catalogue of Indian Standards. */
const KB_META = {
  name: 'ISpectra demo Standards Knowledge Base',
  version: 'demo-0.1',
  verification: 'demo',
  notice: 'Sample records for the prototype. Not verified against BIS and not a complete catalogue of Indian Standards.'
};

const KB_STANDARDS = [
  {
    id: 'IS 8112', num: '8112', part: null, kind: 'product', category: 'Cement',
    title: '43 Grade Ordinary Portland Cement — Specification',
    version: '2013', history: [{ version: '1989', status: 'Superseded' }], amendments: [],
    scope: 'Requirements for 43 grade ordinary Portland cement.',
    keywords: ['cement', 'portland', 'ordinary', 'opc', 'hydraulic', 'binder', 'specification'],
    phrases: ['portland cement', 'ordinary portland cement'],
    grade: { family: 'opc', values: [43] }, item: '43 Grade OPC',
    related: ['IS 269', 'IS 12269', 'IS 1489 (Part 1)', 'IS 456'],
    normative: ['IS 4031', 'IS 4032'], tests: ['IS 4031', 'IS 4032'], safety: ['IS 7969', 'IS 4082'],
    cert: [{ scheme: 'BIS', note: 'Product certification mapped to this standard.' }]
  },
  {
    id: 'IS 269', num: '269', part: null, kind: 'product', category: 'Cement',
    title: 'Ordinary Portland Cement — Specification',
    version: '2015', history: [{ version: '1989', status: 'Superseded' }], amendments: [],
    scope: 'Requirements for ordinary Portland cement of 33 grade.',
    keywords: ['cement', 'portland', 'ordinary', 'opc', 'hydraulic', 'binder', 'specification'],
    phrases: ['portland cement', 'ordinary portland cement'],
    grade: { family: 'opc', values: [33] }, item: '33 Grade OPC',
    related: ['IS 8112', 'IS 12269', 'IS 1489 (Part 1)', 'IS 456'],
    normative: ['IS 4031', 'IS 4032'], tests: ['IS 4031', 'IS 4032'], safety: ['IS 7969', 'IS 4082'],
    cert: [{ scheme: 'BIS', note: 'Product certification mapped to this standard.' }]
  },
  {
    id: 'IS 12269', num: '12269', part: null, kind: 'product', category: 'Cement',
    title: '53 Grade Ordinary Portland Cement — Specification',
    version: '2013', history: [{ version: '1987', status: 'Superseded' }], amendments: [],
    scope: 'Requirements for 53 grade ordinary Portland cement.',
    keywords: ['cement', 'portland', 'ordinary', 'opc', 'hydraulic', 'binder', 'specification'],
    phrases: ['portland cement', 'ordinary portland cement'],
    grade: { family: 'opc', values: [53] }, item: '53 Grade OPC',
    related: ['IS 8112', 'IS 269', 'IS 1489 (Part 1)', 'IS 456'],
    normative: ['IS 4031', 'IS 4032'], tests: ['IS 4031', 'IS 4032'], safety: ['IS 7969', 'IS 4082'],
    cert: [{ scheme: 'BIS', note: 'Product certification mapped to this standard.' }]
  },
  {
    id: 'IS 1489 (Part 1)', num: '1489', part: '1', kind: 'product', category: 'Cement',
    title: 'Portland Pozzolana Cement — Specification — Part 1: Fly Ash Based',
    version: '2015', history: [{ version: '1991', status: 'Superseded' }], amendments: [],
    scope: 'Requirements for Portland pozzolana cement containing fly ash.',
    keywords: ['cement', 'portland', 'pozzolana', 'fly', 'ash', 'ppc', 'blended', 'specification'],
    phrases: ['portland pozzolana cement', 'fly ash'],
    grade: null, item: 'Portland Pozzolana Cement (fly ash based)',
    related: ['IS 8112', 'IS 269', 'IS 12269', 'IS 456'],
    normative: ['IS 4031', 'IS 4032'], tests: ['IS 4031', 'IS 4032'], safety: ['IS 7969', 'IS 4082'],
    cert: [{ scheme: 'BIS', note: 'Product certification mapped to this standard.' }]
  },
  {
    id: 'IS 4031', num: '4031', part: null, kind: 'test', category: 'Cement',
    title: 'Methods of Physical Tests for Hydraulic Cement',
    version: 'Multi-part', history: [], amendments: [],
    scope: 'Test methods for the physical properties of hydraulic cement. Published in several parts; the version differs by part.',
    keywords: ['physical', 'test', 'method', 'hydraulic', 'cement', 'fineness', 'setting', 'strength'],
    phrases: [], grade: null, item: null,
    related: [], normative: [], tests: [], safety: [], cert: []
  },
  {
    id: 'IS 4032', num: '4032', part: null, kind: 'test', category: 'Cement',
    title: 'Method of Chemical Analysis of Hydraulic Cement',
    version: '1985', history: [], amendments: [],
    scope: 'Chemical analysis method for hydraulic cement.',
    keywords: ['chemical', 'analysis', 'method', 'hydraulic', 'cement'],
    phrases: [], grade: null, item: null,
    related: [], normative: [], tests: [], safety: [], cert: []
  },
  {
    id: 'IS 1786', num: '1786', part: null, kind: 'product', category: 'Reinforcement steel',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement — Specification',
    version: '2008', history: [{ version: '1985', status: 'Superseded' }],
    amendments: [{ no: 1, note: 'Demo entry. Amendment text to be loaded from BIS data.' }],
    scope: 'Requirements for high strength deformed steel bars and wires used to reinforce concrete.',
    keywords: ['steel', 'bar', 'wire', 'deformed', 'reinforcement', 'concrete', 'tmt', 'rebar', 'thermo', 'mechanically', 'treated', 'specification'],
    phrases: ['reinforcement bar', 'deformed bar', 'steel bar', 'thermo mechanically treated'],
    grade: { family: 'fe', values: [415, 500, 550, 600] }, item: 'Reinforcement steel bars',
    related: ['IS 456'], normative: ['IS 1608 (Part 1)'], tests: ['IS 1608 (Part 1)'], safety: ['IS 7969', 'IS 4082'],
    cert: [{ scheme: 'BIS', note: 'Product certification mapped to this standard.' }]
  },
  {
    id: 'IS 1608 (Part 1)', num: '1608', part: '1', kind: 'test', category: 'Reinforcement steel',
    title: 'Metallic Materials — Tensile Testing — Part 1: Method of Test at Room Temperature',
    version: '2022', history: [], amendments: [],
    scope: 'Tensile test method for metallic materials at room temperature.',
    keywords: ['metallic', 'tensile', 'testing', 'test', 'method', 'steel', 'bar'],
    phrases: [], grade: null, item: null,
    related: [], normative: [], tests: [], safety: [], cert: []
  },
  {
    id: 'IS 383', num: '383', part: null, kind: 'product', category: 'Aggregates',
    title: 'Coarse and Fine Aggregates for Concrete — Specification',
    version: '2016', history: [{ version: '1970', status: 'Superseded' }], amendments: [],
    scope: 'Requirements for coarse and fine aggregates used in concrete.',
    keywords: ['aggregate', 'coarse', 'fine', 'sand', 'gravel', 'crushed', 'stone', 'concrete', 'specification'],
    phrases: ['coarse aggregate', 'fine aggregate'],
    grade: null, item: 'Coarse and fine aggregates',
    related: ['IS 456', 'IS 10262', 'IS 4926'], normative: ['IS 2386'], tests: ['IS 2386'], safety: ['IS 4082'],
    cert: []
  },
  {
    id: 'IS 2386', num: '2386', part: null, kind: 'test', category: 'Aggregates',
    title: 'Methods of Test for Aggregates for Concrete',
    version: 'Multi-part', history: [], amendments: [],
    scope: 'Test methods for aggregates used in concrete. Published in several parts; the version differs by part.',
    keywords: ['test', 'method', 'aggregate', 'concrete', 'grading', 'sieve'],
    phrases: [], grade: null, item: null,
    related: [], normative: [], tests: [], safety: [], cert: []
  },
  {
    id: 'IS 456', num: '456', part: null, kind: 'code', category: 'Concrete',
    title: 'Plain and Reinforced Concrete — Code of Practice',
    version: '2000', history: [{ version: '1978', status: 'Superseded' }],
    amendments: [{ no: 1, note: 'Demo entry. Amendment text to be loaded from BIS data.' }],
    scope: 'Code of practice for plain and reinforced concrete in general construction.',
    keywords: ['concrete', 'plain', 'reinforced', 'rcc', 'code', 'practice', 'structural', 'construction', 'works', 'design'],
    phrases: ['reinforced concrete', 'plain concrete', 'code of practice'],
    grade: null, item: 'Concrete works',
    related: ['IS 10262', 'IS 4926', 'IS 8112', 'IS 12269'], normative: ['IS 383', 'IS 1786'], tests: [], safety: ['IS 7969'],
    cert: []
  },
  {
    id: 'IS 10262', num: '10262', part: null, kind: 'code', category: 'Concrete',
    title: 'Concrete Mix Proportioning — Guidelines',
    version: '2019', history: [{ version: '2009', status: 'Superseded' }], amendments: [],
    scope: 'Guidelines for proportioning concrete mixes.',
    keywords: ['concrete', 'mix', 'proportioning', 'design', 'mixture', 'guideline', 'grade'],
    phrases: ['concrete mix', 'mix design', 'mix proportioning'],
    grade: null, item: 'Concrete mix design',
    related: ['IS 456', 'IS 383', 'IS 8112'], normative: ['IS 456', 'IS 383'], tests: [], safety: [],
    cert: []
  },
  {
    id: 'IS 4926', num: '4926', part: null, kind: 'code', category: 'Concrete',
    title: 'Ready-Mixed Concrete — Code of Practice',
    version: '2003', history: [{ version: '1976', status: 'Superseded' }], amendments: [],
    scope: 'Code of practice for ready-mixed concrete.',
    keywords: ['ready', 'mix', 'concrete', 'rmc', 'code', 'practice', 'batching', 'transport'],
    phrases: ['ready mix concrete', 'ready mixed concrete'],
    grade: null, item: 'Ready-mixed concrete',
    related: ['IS 456', 'IS 383', 'IS 10262'], normative: ['IS 456', 'IS 383'], tests: [], safety: ['IS 7969'],
    cert: []
  },
  {
    id: 'IS 1077', num: '1077', part: null, kind: 'product', category: 'Bricks',
    title: 'Common Burnt Clay Building Bricks — Specification',
    version: '1992', history: [{ version: '1986', status: 'Superseded' }], amendments: [],
    scope: 'Requirements for common burnt clay bricks used in building construction.',
    keywords: ['brick', 'burnt', 'clay', 'building', 'common', 'masonry', 'specification'],
    phrases: ['burnt clay', 'clay brick', 'building brick'],
    grade: null, item: 'Common burnt clay building bricks',
    related: ['IS 2212'], normative: ['IS 3495'], tests: ['IS 3495'], safety: ['IS 7969', 'IS 4082'],
    cert: []
  },
  {
    id: 'IS 3495', num: '3495', part: null, kind: 'test', category: 'Bricks',
    title: 'Methods of Tests of Burnt Clay Building Bricks',
    version: '1992', history: [], amendments: [],
    scope: 'Test methods for burnt clay building bricks. Published in several parts.',
    keywords: ['test', 'method', 'brick', 'burnt', 'clay', 'building', 'compressive', 'strength', 'absorption'],
    phrases: [], grade: null, item: null,
    related: [], normative: [], tests: [], safety: [], cert: []
  },
  {
    id: 'IS 2212', num: '2212', part: null, kind: 'code', category: 'Bricks',
    title: 'Brickwork — Code of Practice',
    version: '1991', history: [], amendments: [],
    scope: 'Code of practice for brickwork.',
    keywords: ['brickwork', 'brick', 'masonry', 'code', 'practice', 'wall', 'construction'],
    phrases: ['brick masonry', 'code of practice'],
    grade: null, item: 'Brickwork',
    related: ['IS 1077', 'IS 3495'], normative: ['IS 1077'], tests: [], safety: ['IS 7969'],
    cert: []
  },
  {
    id: 'IS 7969', num: '7969', part: null, kind: 'safety', category: 'Safety',
    title: 'Safety Code for Handling and Storage of Building Materials',
    version: '1975', history: [], amendments: [],
    scope: 'Safety code for handling and storage of building materials.',
    keywords: ['safety', 'handling', 'storage', 'building', 'material'],
    phrases: [], grade: null, item: null,
    related: [], normative: [], tests: [], safety: [], cert: []
  },
  {
    id: 'IS 4082', num: '4082', part: null, kind: 'safety', category: 'Safety',
    title: 'Recommendations on Stacking and Storage of Construction Materials and Components at Site',
    version: '1996', history: [{ version: '1977', status: 'Superseded' }], amendments: [],
    scope: 'Recommendations for stacking and storing construction materials at site.',
    keywords: ['stacking', 'storage', 'construction', 'material', 'component', 'site'],
    phrases: [], grade: null, item: null,
    related: [], normative: [], tests: [], safety: [], cert: []
  }
];
