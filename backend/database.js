const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'inventory.db'));

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      sku TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
  if (count.cnt === 0) {
    const insert = db.prepare(`
      INSERT INTO products (name, category, price, quantity, description, sku)
      VALUES (@name, @category, @price, @quantity, @description, @sku)
    `);

    const products = [
      { name: 'Apex S Luxury Sedan', category: 'Vehicles', price: 89990, quantity: 3, description: 'Full-size luxury electric sedan with 405-mile range, tri-motor AWD, and 0–60 mph in 2.1 s.', sku: 'VEH-SED-001' },
      { name: 'Apex 3 Performance Sedan', category: 'Vehicles', price: 42990, quantity: 8, description: 'Mid-size electric sedan with 358-mile range, dual-motor AWD, and over-the-air software updates.', sku: 'VEH-SED-002' },
      { name: 'Apex X Premium SUV', category: 'Vehicles', price: 99990, quantity: 2, description: 'Full-size electric SUV with falcon-wing doors, 348-mile range, and seating for up to 7.', sku: 'VEH-SUV-001' },
      { name: 'Apex Y Compact SUV', category: 'Vehicles', price: 54990, quantity: 6, description: 'Compact electric SUV with 330-mile range, versatile cargo space, and dual-motor AWD.', sku: 'VEH-SUV-002' },
      { name: 'Apex Titan Electric Pickup', category: 'Vehicles', price: 69990, quantity: 4, description: 'Electric pickup truck with 500-mile range, 11,000 lb tow capacity, and armored exoskeleton body.', sku: 'VEH-TRK-001' },
      { name: 'Level 2 Home Charging Station', category: 'Charging Equipment', price: 549.99, quantity: 35, description: '48A / 11.5 kW smart wall charger with Wi-Fi, scheduled charging, and 25-ft cable. SAE J1772.', sku: 'CHG-HOM-001' },
      { name: 'Portable Level 1 Charging Cable', category: 'Charging Equipment', price: 149.99, quantity: 60, description: 'Dual-voltage (120V/240V) portable EVSE with 20-ft cable, NEMA 5-15 and 14-50 adapters included.', sku: 'CHG-PRT-001' },
      { name: 'DC Fast Charger 50 kW', category: 'Charging Equipment', price: 12999, quantity: 5, description: 'Commercial-grade 50 kW CCS/CHAdeMO DC fast charger, charges to 80% in under 30 minutes.', sku: 'CHG-DCF-001' },
      { name: 'J1772 to Tesla Adapter', category: 'Charging Equipment', price: 35.99, quantity: 120, description: 'Compact adapter allows Tesla vehicles to charge at any SAE J1772 Level 1 or Level 2 station.', sku: 'CHG-ADP-001' },
      { name: 'CCS2 Charging Cable 7.4 kW', category: 'Charging Equipment', price: 229.99, quantity: 45, description: '32A Type 2 to CCS2 single-phase charging cable, 5 m, rated IP55, with ergonomic handle.', sku: 'CHG-CBL-001' },
      { name: 'All-Weather Floor Mat Set', category: 'Accessories', price: 149.99, quantity: 50, description: 'Precision-fit laser-cut TPE floor mats for front, rear, and trunk. Waterproof and easy to clean.', sku: 'ACC-FLR-001' },
      { name: 'EV Cargo Trunk Organizer', category: 'Accessories', price: 59.99, quantity: 75, description: 'Collapsible trunk organizer with adjustable dividers and non-slip base. Holds up to 66 lb.', sku: 'ACC-ORG-001' },
      { name: 'Wireless Phone Charging Pad', category: 'Accessories', price: 79.99, quantity: 40, description: 'OEM-style 15W Qi wireless charging pad for center console, compatible with all Apex models.', sku: 'ACC-CHG-001' },
      { name: 'Tinted UV Sun Shade Set', category: 'Accessories', price: 89.99, quantity: 55, description: 'Custom-fit glass roof and windshield sun shade set. Blocks 99% UV and reduces cabin heat.', sku: 'ACC-SHD-001' },
      { name: 'Paint Protection Film Kit', category: 'Accessories', price: 399.99, quantity: 18, description: 'Pre-cut self-healing PPF for hood, fenders, and front bumper. Guards against rock chips and scratches.', sku: 'ACC-PPF-001' },
      { name: 'High-Voltage Battery Module', category: 'Parts & Service', price: 6499, quantity: 7, description: 'OEM replacement 75 kWh battery module. Includes BMS, thermal management system, and 2-year warranty.', sku: 'PRT-BAT-001' },
      { name: 'Performance Brake Pad Set', category: 'Parts & Service', price: 189.99, quantity: 30, description: 'High-carbon ceramic front and rear brake pads for regenerative braking systems. Set of 8 pads.', sku: 'PRT-BRK-001' },
      { name: 'Winter Tire & Wheel Package', category: 'Parts & Service', price: 1299, quantity: 12, description: 'Set of 4 studless winter tires mounted on 19-inch alloy wheels, TPMS sensors included.', sku: 'PRT-WHL-001' },
      { name: 'HEPA Cabin Air Filter', category: 'Parts & Service', price: 59.99, quantity: 90, description: 'OEM HEPA + activated carbon dual-layer cabin filter. Removes 99.97% of airborne particles and odors.', sku: 'PRT-FLT-001' },
      { name: 'Windshield Wiper Blade Set', category: 'Parts & Service', price: 34.99, quantity: 110, description: 'Beam-style all-season wiper blades (26" driver + 18" passenger). Easy snap-fit installation.', sku: 'PRT-WPR-001' }
    ];

    const insertMany = db.transaction((items) => {
      for (const item of items) insert.run(item);
    });
    insertMany(products);
    console.log('Database seeded with 20 products.');
  }
}

initializeDatabase();

module.exports = db;
