import { RATES_PER_SQFT, GLASS_MODIFIERS, PRODUCT_CONFIGS, calculateSquareFeet, getAvailablePanelCounts } from './src/lib/quote-wizard/pricing';

function round2(n: number) { return Math.round(n * 100) / 100; }

const testCases = [
  // Bi-fold tests
  { slug: 'bi-fold', width: 180, height: 60, glass: 'Laminated Glass' },
  { slug: 'bi-fold', width: 180, height: 60, glass: 'Clear Glass' },
  { slug: 'bi-fold', width: 180, height: 60, glass: 'Low-E3 Glass' },
  { slug: 'bi-fold', width: 150, height: 96, glass: 'Laminated Glass' },
  // Multi-slide tests
  { slug: 'multi-slide-pocket', width: 210, height: 96, glass: 'Laminated Glass' },
  { slug: 'multi-slide-pocket', width: 210, height: 96, glass: 'Clear Glass' },
  { slug: 'multi-slide-pocket', width: 210, height: 96, glass: 'Low-E3 Glass' },
  // Ultra-slim tests
  { slug: 'ultra-slim', width: 210, height: 96, glass: 'Laminated Glass' },
  // Slide-stack tests
  { slug: 'slide-stack', width: 180, height: 96, glass: 'Laminated Glass' },
  { slug: 'slide-stack', width: 180, height: 96, glass: 'Clear Glass' },
  // Awning window
  { slug: 'awning-window', width: 48, height: 48, glass: 'Laminated Glass' },
  { slug: 'awning-window', width: 48, height: 48, glass: 'Clear Glass' },
];

console.log('='.repeat(90));
console.log('PRICING TEST RESULTS - Compare with real calculator');
console.log('='.repeat(90));

for (const tc of testCases) {
  const config = PRODUCT_CONFIGS[tc.slug];
  const sqft = calculateSquareFeet(tc.width, tc.height);
  const rate = RATES_PER_SQFT[tc.slug] ?? 0;
  const basePrice = round2(sqft * rate);
  const glassMod = GLASS_MODIFIERS[tc.glass] ?? 0;
  const panels = getAvailablePanelCounts(tc.width, config.usableOpeningOffset, config.panelMinWidth, config.panelMaxWidth);

  console.log('');
  console.log('-'.repeat(90));
  console.log(`${config.displayName} | ${tc.width}" x ${tc.height}" | ${tc.glass}`);
  console.log(`  Sq Ft: ${round2(sqft)} | Rate: $${rate}/sqft | Base Price: $${basePrice.toLocaleString()}`);
  console.log(`  Glass modifier per unit: $${glassMod}`);

  if (panels.length > 0) {
    console.log(`  Available panels: ${panels.map(p => p.count).join(', ')}`);
    for (const p of panels) {
      const isBifold = tc.slug === 'bi-fold';
      const multiplier = isBifold ? Math.ceil(p.count / 2) : p.count;
      const totalGlass = round2(glassMod * multiplier);
      const total = round2(basePrice + totalGlass);
      const note = isBifold ? ` [ceil(${p.count}/2)]` : '';
      console.log(`    ${p.count} panels (pw: ${p.perPanelWidth}") -> glass: $${glassMod} x ${multiplier}${note} = $${totalGlass} -> TOTAL: $${total.toLocaleString()}`);
    }
  } else {
    const total = round2(basePrice + glassMod);
    console.log(`    No panels -> glass: $${glassMod} x 1 = $${glassMod} -> TOTAL: $${total.toLocaleString()}`);
  }
}
console.log('');
console.log('='.repeat(90));
