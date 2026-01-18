-- Cinnamon Lane Database Schema

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    image TEXT,
    hover_image TEXT,
    stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    category TEXT CHECK (category IN ('pastry', 'bread', 'cake'))
);

-- Customers Table (Loyalty Tracking)
CREATE TABLE IF NOT EXISTS customers (
    phone TEXT PRIMARY KEY,
    purchase_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_phone TEXT REFERENCES customers(phone),
    total INTEGER NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'BAKING', 'OUT_FOR_DELIVERY', 'DELIVERED')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id),
    quantity INTEGER NOT NULL,
    variant TEXT,
    price_at_time INTEGER NOT NULL
);

-- Initial Seed Data
INSERT INTO products (id, name, description, price, image, hover_image, stock, is_active, category)
VALUES 
('1', 'Classic Cinnamon Roll', 'Our signature roll. 24-hour brioche dough, Ceylon cinnamon, and a cream cheese glaze.', 450, 'https://picsum.photos/id/1080/800/800', 'https://picsum.photos/id/1062/800/800', 4, true, 'pastry'),
('2', 'Cardamom Knot', 'A Nairobi favorite. Spiced dough twisted with brown sugar and fresh cardamom.', 350, 'https://picsum.photos/id/835/800/800', 'https://picsum.photos/id/431/800/800', 12, true, 'pastry'),
('3', 'Artisan Sourdough', 'Crusty, chewy, and perfectly fermented. Baked fresh at 4 AM daily.', 600, 'https://picsum.photos/id/999/800/800', 'https://picsum.photos/id/365/800/800', 2, true, 'bread'),
('4', 'Pain au Chocolat', 'Dark Belgian chocolate folded into 81 layers of butter pastry.', 400, 'https://picsum.photos/id/292/800/800', 'https://picsum.photos/id/493/800/800', 8, true, 'pastry'),
('5', 'Espresso Walnut Cake', 'Dense, moist cake infused with single-origin Kenyan espresso.', 550, 'https://picsum.photos/id/486/800/800', 'https://picsum.photos/id/225/800/800', 0, true, 'cake'),
('6', 'Savory Feta Danish', 'Flaky pastry topped with whipped feta, thyme, and roasted tomatoes.', 450, 'https://picsum.photos/id/139/800/800', 'https://picsum.photos/id/674/800/800', 15, true, 'pastry')
ON CONFLICT (id) DO NOTHING;
