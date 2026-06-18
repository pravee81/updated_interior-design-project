CREATE DATABASE IF NOT EXISTS proj_int;

USE proj_int;

-- =========================
-- USERS
-- =========================

CREATE TABLE IF NOT EXISTS users (

  id BIGINT PRIMARY KEY AUTO_INCREMENT,

  name VARCHAR(200) NOT NULL,

  email VARCHAR(200) UNIQUE,

  password VARCHAR(255) NOT NULL,

  role VARCHAR(40) DEFAULT 'user',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =========================
-- DESIGNS
-- =========================

CREATE TABLE IF NOT EXISTS designs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(300),
  image TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  description TEXT,
  category VARCHAR(100),
  authorId BIGINT,
  author VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CART
-- =========================

CREATE TABLE IF NOT EXISTS cart (

  id BIGINT PRIMARY KEY AUTO_INCREMENT,

  userId BIGINT,

  designId BIGINT,

  title VARCHAR(300),

  price DECIMAL(10,2),

  image TEXT,

  quantity INT DEFAULT 1,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =========================
-- ORDERS
-- =========================

CREATE TABLE IF NOT EXISTS orders (

  id BIGINT PRIMARY KEY AUTO_INCREMENT,

  userId BIGINT,

  total DECIMAL(12,2),

  product_cost DECIMAL(12,2) DEFAULT 0,

  profit DECIMAL(12,2) DEFAULT 0,

  payment_status VARCHAR(50) DEFAULT 'paid',

  payment_method VARCHAR(50),

  tax DECIMAL(10,2) DEFAULT 0,

  discount DECIMAL(10,2) DEFAULT 0,

  shipping_cost DECIMAL(10,2) DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =========================
-- CONTACT MESSAGES
-- =========================

CREATE TABLE IF NOT EXISTS messages (

  id BIGINT PRIMARY KEY AUTO_INCREMENT,

  name VARCHAR(255) NOT NULL,

  phone VARCHAR(20),

  email VARCHAR(255),

  requirements TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS wishlist (

  id BIGINT PRIMARY KEY AUTO_INCREMENT,

  userId BIGINT,

  designId BIGINT,

  title VARCHAR(300),

  price DECIMAL(10,2),

  image TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =========================
-- SAMPLE USERS
-- PASSWORD = 123456
-- =========================

INSERT INTO users
(name,email,password,role)
VALUES
(
  'Admin',
  'admin@gmail.com',
  '$2b$10$3euPcmQFCiblsZeEu5s7p.9jV3KjR6D4m5K8Q1M7VQjW7f8x7Qz3G',
  'admin'
),
(
  'Kat',
  'kat@gmail.com',
  '$2b$10$3euPcmQFCiblsZeEu5s7p.9jV3KjR6D4m5K8Q1M7VQjW7f8x7Qz3G',
  'user'
),
(
  'Designer',
  'designer@gmail.com',
  '$2b$10$3euPcmQFCiblsZeEu5s7p.9jV3KjR6D4m5K8Q1M7VQjW7f8x7Qz3G',
  'client'
);

-- =========================
-- SAMPLE DESIGNS
-- =========================

INSERT INTO designs
(title,image,price,description,author)
VALUES

(
  'Full Home Interiors',
  'https://static.asianpaints.com/content/dam/asian_paints/services/beautiful-homes-service-webp-images/bhs-new-page-new-images/home-decor-solutions/full-home-interiors-desktop.webp',
  1200,
  'Complete interior design solutions.',
  'Seed'
),

(
  'Modular Wardrobes',
  'https://static.asianpaints.com/content/dam/asian_paints/services/beautiful-homes-service-webp-images/bhs-new-page-new-images/home-decor-solutions/modular-wardrobes-desktop.webp',
  600,
  'Custom modular wardrobes.',
  'Seed'
),

(
  'Furniture Set',
  'https://static.asianpaints.com/content/dam/asian_paints/services/beautiful-homes-service-webp-images/bhs-new-page-new-images/categories-we-offer/furniture/furniture-one.webp',
  400,
  'Curated furniture set.',
  'Seed'
);


-- =========================
-- SAMPLE ORDERS
-- =========================

INSERT INTO orders
(
  userId,
  total,
  product_cost,
  profit,
  payment_status,
  payment_method,
  tax,
  shipping_cost
)
VALUES

(2, 1200, 700, 500, 'paid', 'UPI', 50, 20),

(2, 800, 500, 300, 'paid', 'Card', 30, 10),

(2, 1500, 900, 600, 'paid', 'UPI', 60, 30),

(2, 600, 350, 250, 'paid', 'Cash', 20, 15),

(2, 2000, 1200, 800, 'paid', 'Card', 80, 40);


-- =========================
-- SAMPLE CONTACTS
-- =========================

INSERT INTO messages
(name,phone,email,requirements)
VALUES

(
  'Saran',
  '9597173879',
  'sara@gmail.com',
  'Need Home Materials'
),

(
  'Kat',
  '9876543210',
  'kat@gmail.com',
  'Need Modular Kitchen'
);

INSERT INTO designs
(title, image, price, description, category, author)
VALUES

(
'Modern Living Hall',
'https://media.designcafe.com/wp-content/uploads/2020/02/21010329/modern-living-room-design-ideas-768x512.jpg',
2500,
'Luxury modern living hall interior with elegant sofa setup.',
'Living Room',
'Designer'
),

(
'Premium Living Room',
'https://dlifeinteriors.com/wp-content/uploads/2020/05/Living-room-design-3bhk-flat-kochi.jpg',
3200,
'Premium hall interior with modern lighting and wall decor.',
'Living Room',
'Designer'
),

(
'Minimal Bedroom Design',
'https://jumanji.livspace-cdn.com/magazine/wp-content/uploads/sites/2/2021/08/26155030/Cover-01.png',
2800,
'Minimal and cozy bedroom setup with modern interiors.',
'Bedroom',
'Designer'
),

(
'Luxury Bedroom',
'https://img.interiorcompany.com/interior/webproduct/154638723245826334471.png?aio=w-768;',
3500,
'Luxury bedroom with premium furniture and wall design.',
'Bedroom',
'Designer'
),

(
'Classic Wardrobe',
'https://ik.imagekit.io/2xkwa8s1i/img/wardrobes/r1/WWRB4DH1GINGHAMCWR1/1.jpg?tr=w-3840',
1800,
'Wooden wardrobe with modern storage design.',
'Wardrobe',
'Designer'
),

(
'Sliding Wardrobe',
'https://greentechinteriors.in/wp-content/uploads/2023/08/wardrobe-design-scaled.jpg',
2100,
'Sliding wardrobe design for compact homes.',
'Wardrobe',
'Designer'
),

(
'Modern Dining Area',
'https://jumanji.livspace-cdn.com/magazine/wp-content/uploads/sites/2/2024/08/02122514/accent-wall-idea-with-art.jpg',
2400,
'Modern dining room with artistic wall setup.',
'Dining Room',
'Designer'
),

(
'Elegant Dining Setup',
'https://i.pinimg.com/474x/d2/ef/44/d2ef44ceca38ba1b232fee29cecc29d9.jpg',
2600,
'Elegant dining room interior with premium table setup.',
'Dining Room',
'Designer'
),

(
'Traditional Pooja Room',
'https://media.designcafe.com/wp-content/uploads/2021/04/14121337/traditional-pooja-room-designs.jpg',
1700,
'Traditional pooja room with wooden temple design.',
'Pooja Room',
'Designer'
),

(
'Modern Pooja Unit',
'https://jumanji.livspace-cdn.com/magazine/wp-content/uploads/sites/2/2021/02/18133759/pooja-room-designs-for-indian-homes.png',
1900,
'Compact modern pooja unit for apartments.',
'Pooja Room',
'Designer'
),

(
'Balcony Garden Setup',
'https://assets-news.housing.com/news/wp-content/uploads/2022/01/27235757/Top-20-trends-in-balcony-design-for-2022-01.jpg',
1500,
'Green balcony setup with relaxing seating arrangement.',
'Balcony',
'Designer'
),

(
'Luxury Balcony',
'https://i.pinimg.com/474x/3c/95/2d/3c952d7989889da4117fc83e847b89a3.jpg',
2200,
'Luxury balcony design with aesthetic lighting.',
'Balcony',
'Designer'
),

(
'Wall Texture Design',
'https://walldesign.in/cdn/shop/files/WDCUVNTN0014-Petal-Burst-Living-Silver-Left-Corner.jpg?v=1709099549&width=1500',
1400,
'Modern wall texture for luxury interiors.',
'Wall Designs',
'Designer'
),

(
'Premium Wall Art',
'https://frenchrefinery.com/cdn/shop/files/3_1b7f6508-59a9-4b7b-8e6a-d6dd7b5ba13b.jpg?v=1718975488&width=5000',
1600,
'Premium artistic wall decor design.',
'Wall Designs',
'Designer'
);


INSERT INTO designs
(title, image, price, description, category, author)
VALUES

-- =========================
-- LIVING ROOM
-- =========================

(
'Modern Living Hall',
'https://media.designcafe.com/wp-content/uploads/2020/02/21010329/modern-living-room-design-ideas-768x512.jpg',
2500,
'Luxury modern living hall interior with elegant sofa setup.',
'Living Room',
'Designer'
),

(
'Premium Living Room',
'https://dlifeinteriors.com/wp-content/uploads/2020/05/Living-room-design-3bhk-flat-kochi.jpg',
3200,
'Premium hall interior with modern lighting and wall decor.',
'Living Room',
'Designer'
),

(
'Contemporary Hall Design',
'https://foyr.com/learn/wp-content/uploads/2022/06/modern-living-room-style.jpg',
2900,
'Contemporary living hall with luxury seating.',
'Living Room',
'Designer'
),

(
'Minimal Hall Interior',
'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
2600,
'Minimal and aesthetic hall setup.',
'Living Room',
'Designer'
),

(
'Luxury Family Hall',
'https://images.unsplash.com/photo-1494526585095-c41746248156',
4100,
'Spacious luxury family hall design.',
'Living Room',
'Designer'
),

(
'Classic Sofa Hall',
'https://images.unsplash.com/photo-1484154218962-a197022b5858',
2700,
'Classic hall with elegant sofa styling.',
'Living Room',
'Designer'
),

(
'Wooden Theme Hall',
'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
3000,
'Wooden textured luxury hall setup.',
'Living Room',
'Designer'
),

-- =========================
-- BEDROOM
-- =========================

(
'Luxury Bedroom',
'https://img.interiorcompany.com/interior/webproduct/154638723245826334471.png?aio=w-768;',
3500,
'Luxury bedroom with premium furniture.',
'Bedroom',
'Designer'
),

(
'Modern Bedroom',
'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
2800,
'Modern cozy bedroom setup.',
'Bedroom',
'Designer'
),

(
'Minimal Bedroom',
'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
2400,
'Minimal interior bedroom concept.',
'Bedroom',
'Designer'
),

(
'Wooden Bedroom',
'https://images.unsplash.com/photo-1494526585095-c41746248156',
3200,
'Wooden textured premium bedroom.',
'Bedroom',
'Designer'
),

(
'Couple Bedroom',
'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
3700,
'Luxury couple bedroom with ambient lighting.',
'Bedroom',
'Designer'
),

(
'Compact Bedroom',
'https://images.unsplash.com/photo-1484154218962-a197022b5858',
2100,
'Compact apartment bedroom setup.',
'Bedroom',
'Designer'
),

(
'Royal Bedroom',
'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
4500,
'Royal interior bedroom with premium finish.',
'Bedroom',
'Designer'
),

-- =========================
-- WARDROBE
-- =========================

(
'Classic Wardrobe',
'https://ik.imagekit.io/2xkwa8s1i/img/wardrobes/r1/WWRB4DH1GINGHAMCWR1/1.jpg?tr=w-3840',
1800,
'Wooden wardrobe with modern storage.',
'Wardrobe',
'Designer'
),

(
'Sliding Wardrobe',
'https://greentechinteriors.in/wp-content/uploads/2023/08/wardrobe-design-scaled.jpg',
2100,
'Sliding wardrobe for compact homes.',
'Wardrobe',
'Designer'
),

(
'Mirror Wardrobe',
'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
2500,
'Wardrobe with mirror sliding doors.',
'Wardrobe',
'Designer'
),

(
'Premium Closet',
'https://images.unsplash.com/photo-1494526585095-c41746248156',
3200,
'Premium closet storage design.',
'Wardrobe',
'Designer'
),

(
'Luxury Wardrobe',
'https://images.unsplash.com/photo-1484154218962-a197022b5858',
3500,
'Luxury wardrobe with LED setup.',
'Wardrobe',
'Designer'
),

(
'Dark Theme Wardrobe',
'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
2900,
'Dark wooden wardrobe styling.',
'Wardrobe',
'Designer'
),

(
'Minimal Closet',
'https://images.unsplash.com/photo-1494526585095-c41746248156',
2000,
'Minimal wardrobe for apartments.',
'Wardrobe',
'Designer'
),

-- =========================
-- DINING ROOM
-- =========================

(
'Modern Dining Area',
'https://jumanji.livspace-cdn.com/magazine/wp-content/uploads/sites/2/2024/08/02122514/accent-wall-idea-with-art.jpg',
2400,
'Modern dining room with artistic walls.',
'Dining Room',
'Designer'
),

(
'Elegant Dining Setup',
'https://i.pinimg.com/474x/d2/ef/44/d2ef44ceca38ba1b232fee29cecc29d9.jpg',
2600,
'Elegant dining room with premium furniture.',
'Dining Room',
'Designer'
),

(
'Wooden Dining Space',
'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
3100,
'Wooden dining setup with aesthetics.',
'Dining Room',
'Designer'
),

(
'Luxury Dining Hall',
'https://images.unsplash.com/photo-1494526585095-c41746248156',
3900,
'Luxury dining hall interior.',
'Dining Room',
'Designer'
),

(
'Compact Dining Room',
'https://images.unsplash.com/photo-1484154218962-a197022b5858',
2200,
'Compact apartment dining setup.',
'Dining Room',
'Designer'
),

(
'Minimal Dining Area',
'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
2500,
'Minimal dining room concept.',
'Dining Room',
'Designer'
),

(
'Royal Dining Interior',
'https://images.unsplash.com/photo-1494526585095-c41746248156',
4500,
'Royal premium dining hall.',
'Dining Room',
'Designer'
),

-- =========================
-- POOJA ROOM
-- =========================

(
'Traditional Pooja Room',
'https://media.designcafe.com/wp-content/uploads/2021/04/14121337/traditional-pooja-room-designs.jpg',
1700,
'Traditional pooja room with wooden temple.',
'Pooja Room',
'Designer'
),

(
'Modern Pooja Unit',
'https://jumanji.livspace-cdn.com/magazine/wp-content/uploads/sites/2/2021/02/18133759/pooja-room-designs-for-indian-homes.png',
1900,
'Compact pooja room for apartments.',
'Pooja Room',
'Designer'
),

(
'Luxury Temple Design',
'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
2400,
'Luxury pooja room setup.',
'Pooja Room',
'Designer'
),

(
'Minimal Pooja Space',
'https://images.unsplash.com/photo-1494526585095-c41746248156',
1800,
'Minimal wooden pooja unit.',
'Pooja Room',
'Designer'
),

(
'Wooden Temple Setup',
'https://images.unsplash.com/photo-1484154218962-a197022b5858',
2300,
'Wooden carved temple room.',
'Pooja Room',
'Designer'
),

(
'Compact Temple Unit',
'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
1500,
'Compact pooja setup for flats.',
'Pooja Room',
'Designer'
),

(
'Royal Pooja Hall',
'https://images.unsplash.com/photo-1494526585095-c41746248156',
3200,
'Royal pooja room with golden aesthetics.',
'Pooja Room',
'Designer'
);