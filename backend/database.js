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
      { name: 'Wireless Headphones', category: 'Electronics', price: 79.99, quantity: 45, description: 'Over-ear wireless headphones with noise cancellation and 30-hour battery life.', sku: 'ELEC-001' },
      { name: 'Smartphone Stand', category: 'Electronics', price: 19.99, quantity: 120, description: 'Adjustable aluminum smartphone and tablet desk stand.', sku: 'ELEC-002' },
      { name: 'USB-C Hub', category: 'Electronics', price: 49.99, quantity: 60, description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging.', sku: 'ELEC-003' },
      { name: 'Bluetooth Speaker', category: 'Electronics', price: 59.99, quantity: 35, description: 'Portable waterproof Bluetooth speaker with 360° sound and 12-hour battery.', sku: 'ELEC-004' },
      { name: 'Laptop Sleeve', category: 'Electronics', price: 29.99, quantity: 80, description: 'Water-resistant neoprene laptop sleeve fits 13–15 inch laptops.', sku: 'ELEC-005' },
      { name: "Men's T-Shirt", category: 'Clothing', price: 24.99, quantity: 200, description: 'Classic fit 100% cotton crew-neck t-shirt, available in multiple colors.', sku: 'CLTH-001' },
      { name: "Women's Jacket", category: 'Clothing', price: 89.99, quantity: 55, description: 'Lightweight quilted jacket with zip pockets and adjustable hood.', sku: 'CLTH-002' },
      { name: 'Sports Shorts', category: 'Clothing', price: 34.99, quantity: 150, description: 'Moisture-wicking athletic shorts with inner liner and side pockets.', sku: 'CLTH-003' },
      { name: 'Casual Sneakers', category: 'Clothing', price: 64.99, quantity: 70, description: 'Comfortable canvas sneakers with cushioned insole and rubber sole.', sku: 'CLTH-004' },
      { name: 'Baseball Cap', category: 'Clothing', price: 22.99, quantity: 180, description: 'Structured baseball cap with embroidered logo and adjustable strap.', sku: 'CLTH-005' },
      { name: 'Coffee Maker', category: 'Home & Garden', price: 129.99, quantity: 25, description: '12-cup programmable drip coffee maker with thermal carafe and auto-shutoff.', sku: 'HOME-001' },
      { name: 'Scented Candle Set', category: 'Home & Garden', price: 39.99, quantity: 90, description: 'Set of 3 soy wax candles in relaxing lavender, vanilla, and eucalyptus scents.', sku: 'HOME-002' },
      { name: 'Bamboo Cutting Board', category: 'Home & Garden', price: 34.99, quantity: 65, description: 'Extra-large bamboo cutting board with juice groove and non-slip feet.', sku: 'HOME-003' },
      { name: 'LED Desk Lamp', category: 'Home & Garden', price: 44.99, quantity: 50, description: 'Touch-control LED desk lamp with 5 brightness levels and USB charging port.', sku: 'HOME-004' },
      { name: 'Storage Baskets', category: 'Home & Garden', price: 49.99, quantity: 40, description: 'Set of 3 woven seagrass storage baskets with handles in assorted sizes.', sku: 'HOME-005' },
      { name: 'Organic Coffee Beans', category: 'Food & Beverages', price: 18.99, quantity: 110, description: 'Single-origin organic Arabica coffee beans, medium roast, 12 oz bag.', sku: 'FOOD-001' },
      { name: 'Green Tea Collection', category: 'Food & Beverages', price: 24.99, quantity: 95, description: 'Premium Japanese green tea assortment — 40 individually wrapped sachets.', sku: 'FOOD-002' },
      { name: 'Mixed Nuts Pack', category: 'Food & Beverages', price: 14.99, quantity: 130, description: 'Roasted and salted mixed nuts: almonds, cashews, pecans, and walnuts, 16 oz.', sku: 'FOOD-003' },
      { name: 'Protein Bars Box', category: 'Food & Beverages', price: 29.99, quantity: 85, description: 'Box of 12 high-protein bars, 20g protein each, assorted flavors.', sku: 'FOOD-004' },
      { name: 'Sparkling Water Case', category: 'Food & Beverages', price: 19.99, quantity: 75, description: 'Case of 24 cans of naturally flavored sparkling water, zero calories.', sku: 'FOOD-005' }
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
