// Usage: node scripts/csv-to-products.cjs
// Converts src/assets/walmart_inventory_top50.csv to src/products.js with 50 product objects, grouped by aisle/category.
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../src/assets/walmart_inventory_top50.csv');
const outPath = path.join(__dirname, '../src/products.js');

// Category to aisle mapping
const CATEGORY_TO_AISLE = {
  'Clothing': 0,
  'Home': 1,
  'Beauty': 2,
  'Food': 3,
  'Jewelry': 4,
  'Sports & Outdoors': 5,
  'Patio & Garden': 5,
  'Personal Care': 5
};

function parseCSVLine(line) {
  // Split on commas not inside quotes
  const regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
  return line.split(regex).map(s => s.replace(/^"|"$/g, '').trim());
}

function parseJsonArrayField(str) {
  if (!str) return '';
  try {
    // Replace doubled double-quotes with single double-quotes for valid JSON
    const fixed = str.replace(/""/g, '"');
    const arr = JSON.parse(fixed);
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : '';
  } catch {
    return '';
  }
}

fs.readFile(csvPath, 'utf8', (err, data) => {
  if (err) throw err;
  const lines = data.split(/\r?\n/).filter(Boolean);
  const header = parseCSVLine(lines[0]);
  const products = [];
  for (let i = 1; i < Math.min(lines.length, 51); i++) {
    const row = parseCSVLine(lines[i]);
    const obj = {};
    header.forEach((key, idx) => obj[key] = row[idx]);
    const category = parseJsonArrayField(obj['categories']);
    let aisleIndex = CATEGORY_TO_AISLE[category] !== undefined ? CATEGORY_TO_AISLE[category] : 5;
    products.push({
      id: obj['product_id'],
      name: obj['product_name'],
      price: parseFloat(obj['final_price']) || 0,
      description: obj['description'],
      image: parseJsonArrayField(obj['image_urls']),
      category,
      stock: parseInt(obj['review_count']) || 0,
      aisleIndex
    });
  }
  const js = '// Auto-generated from walmart_inventory_top50.csv\nexport const products = ' + JSON.stringify(products, null, 2) + ';\n';
  fs.writeFileSync(outPath, js, 'utf8');
  console.log('Wrote', products.length, 'products to', outPath);
}); 