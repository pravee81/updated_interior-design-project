const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

async function init(){
  const conn = await pool.getConnection();
  try{
    await conn.query(`CREATE TABLE IF NOT EXISTS users (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(200),
      password VARCHAR(255) NOT NULL,
      role VARCHAR(40) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await conn.query(`CREATE TABLE IF NOT EXISTS designs (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(300),
      image TEXT,
      price DECIMAL(10,2) DEFAULT 0,
      description TEXT,
      authorId BIGINT,
      author VARCHAR(200),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await conn.query(`CREATE TABLE IF NOT EXISTS cart (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      userId BIGINT,
      designId BIGINT,
      title VARCHAR(300),
      price DECIMAL(10,2),
      image TEXT,
      quantity INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await conn.query(`CREATE TABLE IF NOT EXISTS orders (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      userId BIGINT,
      total DECIMAL(12,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
     await conn.query(`CREATE TABLE IF NOT EXISTS order_items (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      orderId BIGINT,
      designId BIGINT,
      title VARCHAR(300),
      price DECIMAL(10,2),
      quantity INT DEFAULT 1
    )`);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255),
          phone BIGINT,
          email VARCHAR(255),
          requirements TEXT
      )
    `);

    console.log('DB tables ensured');
  } finally { conn.release(); }
}
init().catch(e=>console.error('Init error', e));

function auth(req,res,next){
  try{
    const token = req.headers.authorization;
    if(!token) return res.status(401).json({message:'No token'});
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  }catch(e){ return res.status(401).json({message:'Invalid token'}); }
}

function adminOnly(req,res,next){
  if(req.user && req.user.role==='admin') return next();
  return res.status(403).json({message:'Admins only'});
}

// Auth
app.post('/api/auth/register', async (req,res)=>{
  const {name,email,password,role} = req.body;
  if(!name||!password) return res.status(400).json({message:'name+password required'});
  const conn = await pool.getConnection();
  try{
    const [rows] = await conn.query('SELECT id FROM users WHERE name=?',[name]);
    if(rows.length) return res.status(400).json({message:'User exists'});
    const hash = await bcrypt.hash(password,10);
    const [r] = await conn.query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)',[name,email||null,hash,role||'user']);
    const user = {id: r.insertId, name, role: role||'user'};
    const token = jwt.sign(user, JWT_SECRET);
    res.json({token, user});
  }catch(e){ console.error(e); res.status(500).json({message:'Server error'}); } finally { conn.release(); }
});

app.post('/api/auth/login', async (req,res)=>{
  const {name,password} = req.body;
  if(!name||!password) return res.status(400).json({message:'name+password required'});
  const conn = await pool.getConnection();
  try{
    const [rows] = await conn.query('SELECT * FROM users WHERE name=?',[name]);
    if(rows.length===0) return res.status(400).json({message:'No such user'});
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({message:'Invalid credentials'});
    const payload = {id: user.id, name: user.name, role: user.role};
    const token = jwt.sign(payload, JWT_SECRET);
    res.json({token, user: payload});
  }catch(e){ console.error(e); res.status(500).json({message:'Server error'}); } finally { conn.release(); }
});

app.get('/api/auth/me', auth, (req,res)=>{
  res.json({id:req.user.id, name:req.user.name, role:req.user.role});
});



//Designs
app.get('/api/designs', async (req,res)=>{
  const conn = await pool.getConnection();
  try{
    const [rows] = await conn.query('SELECT * FROM designs ORDER BY created_at DESC');
    res.json(rows);
  }catch(e){ res.status(500).json({message:'Server error'});} finally { conn.release(); }
});

app.post('/api/designs', auth, async (req,res)=>{
  const {title,image,price,description,category} = req.body;
  if(!title||!image) return res.status(400).json({message:'title+image required'});
  const conn = await pool.getConnection();
  try{
    const [r] = await conn.query(  'INSERT INTO designs (title,image,price,description,category,authorId,author) VALUES (?,?,?,?,?,?,?)',
      [title,image,price||0,description||'',category || 'Living Room', req.user.id, req.user.name]);
    res.json({id:r.insertId, title, image, price, description, author:req.user.name});
  }catch(e){ res.status(500).json({message:'Server error'});} finally { conn.release(); }
});


///////////////////

// Get all designs (Admin can see all, clients only see their own if you want)
// app.get('/api/designs', async (req, res) => {
//   const conn = await pool.getConnection();
//   try {
//     const [rows] = await conn.query('SELECT * FROM designs ORDER BY created_at DESC');
//     res.json(rows);
//   } catch (e) {
//     res.status(500).json({ message: 'Server error' });
//   } finally {
//     conn.release();
//   }
// });

// // Add new design (Client upload)
// app.post('/api/designs', auth, async (req, res) => {
//   const { title, image, price, description } = req.body;
//   if (!title || !image) return res.status(400).json({ message: 'Title + Image required' });

//   const conn = await pool.getConnection();
//   try {
//     const [r] = await conn.query(
//       'INSERT INTO designs (title, image, price, description, authorId, author) VALUES (?,?,?,?,?,?)',
//       [title, image, price || 0, description || '', req.user.id, req.user.name]
//     );
//     res.json({
//       id: r.insertId,
//       title,
//       image,
//       price,
//       description,
//       author: req.user.name
//     });
//   } catch (e) {
//     res.status(500).json({ message: 'Server error' });
//   } finally {
//     conn.release();
//   }
// });

// // Update design price or details (Admin only)
// app.put('/api/designs/:id', auth, adminOnly, async (req, res) => {
//   const { id } = req.params;
//   const { title, image, price, description } = req.body;

//   const conn = await pool.getConnection();
//   try {
//     const [result] = await conn.query(
//       'UPDATE designs SET title=?, image=?, price=?, description=? WHERE id=?',
//       [title, image, price, description, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Design not found' });
//     }

//     res.json({ message: 'Design updated successfully' });
//   } catch (e) {
//     res.status(500).json({ message: 'Server error' });
//   } finally {
//     conn.release();
//   }
// });

// // Delete design (Admin only)
// app.delete('/api/designs/:id', auth, adminOnly, async (req, res) => {
//   const { id } = req.params;

//   const conn = await pool.getConnection();
//   try {
//     const [result] = await conn.query('DELETE FROM designs WHERE id=?', [id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Design not found' });
//     }

//     res.json({ message: 'Design deleted successfully' });
//   } catch (e) {
//     res.status(500).json({ message: 'Server error' });
//   } finally {
//     conn.release();
//   }
// });

///////////


// Cart operations
app.post('/api/cart/add', auth, async (req,res)=>{
  const {designId, title, price, image, quantity} = req.body;
  if(!designId) return res.status(400).json({message:'designId required'});
  const conn = await pool.getConnection();
  try{
    // check existing
    const [exists] = await conn.query('SELECT id,quantity FROM cart WHERE userId=? AND designId=?',[req.user.id, designId]);
    if(exists.length){
      const id = exists[0].id;
      const newQ = exists[0].quantity + (quantity||1);
      await conn.query('UPDATE cart SET quantity=? WHERE id=?',[newQ,id]);
      return res.json({message:'updated quantity'});
    }
    const [r] = await conn.query('INSERT INTO cart (userId,designId,title,price,image,quantity) VALUES (?,?,?,?,?,?)',
      [req.user.id, designId, title, price||0, image, quantity||1]);
    res.json({id:r.insertId, message:'added'});
  }catch(e){ console.error(e); res.status(500).json({message:'Server error'});} finally { conn.release(); }
});

// Add item to cart
// Get all items in the cart
app.get('/api/cart', auth, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT * FROM cart WHERE userId = ?',
      [req.user.id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// Add item to cart
app.post('/api/cart', auth, async (req, res) => {
  const { designId, title, price, image, quantity } = req.body;
  if (!designId || !title || !price || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const conn = await pool.getConnection();
  try {
    // Check if item already exists
    const [existing] = await conn.query(
      'SELECT id, quantity FROM cart WHERE userId = ? AND designId = ?',
      [req.user.id, designId]
    );

    if (existing.length > 0) {
      await conn.query(
        'UPDATE cart SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing[0].id]
      );
    } else {
      await conn.query(
        'INSERT INTO cart (userId, designId, title, price, image, quantity) VALUES (?,?,?,?,?,?)',
        [req.user.id, designId, title, price, image, quantity]
      );
    }

    res.json({ message: 'Item added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// Checkout cart
app.post('/api/cart/checkout', auth, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [items] = await conn.query(
      'SELECT * FROM cart WHERE userId = ?',
      [req.user.id]
    );
    if (items.length === 0)
      return res.status(400).json({ message: 'Cart empty' });

    let total = 0;
    for (const it of items) {
      total += parseFloat(it.price) * it.quantity;
    }

    const revenue = total;

const productCost = total * 0.6;

const profit = revenue - productCost;

const [r] = await conn.query(
  `
  INSERT INTO orders
  (userId, total, product_cost, profit)
  VALUES (?, ?, ?, ?)
  `,
  [
    req.user.id,
    revenue,
    productCost,
    profit
  ]
);
    const orderId = r.insertId;

    for (const it of items) {
      await conn.query(
        'INSERT INTO order_items (orderId, designId, title, price, quantity) VALUES (?,?,?,?,?)',
        [orderId, it.designId, it.title, it.price, it.quantity]
      );
    }

    await conn.query('DELETE FROM cart WHERE userId = ?', [req.user.id]);
    res.json({ orderId, total });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// Remove item from cart
app.delete('/api/cart/:id', auth, async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();

  try {
    const [result] = await conn.query(
      'DELETE FROM cart WHERE id = ? AND userId = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// Update quantity
app.put('/api/cart/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const conn = await pool.getConnection();

  try {
    if (quantity < 1) {
      // auto delete if quantity is 0
      await conn.query(
        'DELETE FROM cart WHERE id = ? AND userId = ?',
        [id, req.user.id]
      );
      return res.json({ message: 'Item removed (quantity 0)' });
    }

    const [result] = await conn.query(
      'UPDATE cart SET quantity = ? WHERE id = ? AND userId = ?',
      [quantity, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Quantity updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// ADD TO WISHLIST
app.post('/api/wishlist', auth, async (req, res) => {

  const {
    designId,
    title,
    price,
    image
  } = req.body;

  const conn = await pool.getConnection();

  try {

    // CHECK ALREADY EXISTS
    const [exists] = await conn.query(
      `
      SELECT id
      FROM wishlist
      WHERE userId=? AND designId=?
      `,
      [req.user.id, designId]
    );

    if (exists.length) {

      return res.status(400).json({
        message: 'Already in wishlist'
      });

    }

    await conn.query(
      `
      INSERT INTO wishlist
      (
        userId,
        designId,
        title,
        price,
        image
      )
      VALUES (?,?,?,?,?)
      `,
      [
        req.user.id,
        designId,
        title,
        price,
        image
      ]
    );

    res.json({
      message: 'Added to wishlist'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });

  } finally {

    conn.release();

  }

});

// GET WISHLIST
app.get('/api/wishlist', auth, async (req, res) => {

  const conn = await pool.getConnection();

  try {

    const [rows] = await conn.query(
      `
      SELECT *
      FROM wishlist
      WHERE userId=?
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });

  } finally {

    conn.release();

  }

});

// DELETE WISHLIST ITEM
app.delete('/api/wishlist/:id', auth, async (req, res) => {

  const conn = await pool.getConnection();

  try {

    await conn.query(
      `
      DELETE FROM wishlist
      WHERE id=? AND userId=?
      `,
      [
        req.params.id,
        req.user.id
      ]
    );

    res.json({
      message: 'Removed from wishlist'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });

  } finally {

    conn.release();

  }

});


// Orders for user/admin
app.get('/api/orders', auth, async (req,res)=>{
  const conn = await pool.getConnection();
  try{
    if(req.user.role==='admin'){
      const [rows] = await conn.query('SELECT o.*, u.name as userName FROM orders o LEFT JOIN users u ON o.userId=u.id ORDER BY o.created_at DESC');
      return res.json(rows);
    }
    const [rows] = await conn.query('SELECT * FROM orders WHERE userId=? ORDER BY created_at DESC',[req.user.id]);
    res.json(rows);
  }catch(e){ res.status(500).json({message:'Server error'});} finally { conn.release(); }
});

// Admin users list
// app.get('/api/admin/users', auth, adminOnly, async (req,res)=>{
//   const conn = await pool.getConnection();
//   try{
//     const [rows] = await conn.query('SELECT id,name,role,created_at FROM users ORDER BY created_at DESC');
//     res.json(rows);
//   }catch(e){ res.status(500).json({message:'Server error'});} finally { conn.release(); }
// });
app.get('/api/admin/users', auth, adminOnly, async (req,res)=>{

  const conn = await pool.getConnection();

  try{

    const [rows] = await conn.query(`
      SELECT
        id,
        name,
        email,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json(rows);

  }catch(e){

    console.error(e);

    res.status(500).json({
      message:'Server error'
    });

  } finally {

    conn.release();

  }

});

 
// Contact users list
app.post('/api/auth/register', async (req,res)=>{

  const {name,email,password,role} = req.body;

  if(!name || !email || !password){

    return res.status(400).json({
      message:'Name, Email and Password required'
    });

  }

  const conn = await pool.getConnection();

  try{

    const [rows] = await conn.query(
      `
      SELECT id
      FROM users
      WHERE name=? OR email=?
      `,
      [name, email]
    );

    if(rows.length){

      return res.status(400).json({
        message:'Username or Email already exists'
      });

    }

    const hash = await bcrypt.hash(password,10);

    const [r] = await conn.query(
      `
      INSERT INTO users
      (name,email,password,role)
      VALUES (?,?,?,?)
      `,
      [
        name,
        email,
        hash,
        role || 'user'
      ]
    );

    const user = {
      id: r.insertId,
      name,
      role: role || 'user'
    };

    const token = jwt.sign(user, JWT_SECRET);

    res.json({
      token,
      user
    });

  }catch(e){

    console.error(e);

    res.status(500).json({
      message:'Server error'
    });

  } finally {

    conn.release();

  }

});


// Contact Page
app.post('/api/contact', async (req, res) => {
  const { name, phone, email, requirements } = req.body;

  // Basic validation for required fields
  if (!name || !email || !requirements) {
    return res.status(400).json({ message: 'Name, Email, and Requirements are required' });
  }

  // Email validation
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  const conn = await pool.getConnection();
  try {
    // Insert the contact form data into the 'messages' table
    const [result] = await conn.query(`
      INSERT INTO messages (name, phone, email, requirements) 
      VALUES (?, ?, ?, ?)`, [name, phone || '', email, requirements]
    );

    console.log('Contact message saved:', result);  // Optional: Log success

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  } finally {
    conn.release();
  }
});



// GET ALL DESIGNS (ADMIN)
app.get('/api/admin/designs', auth, adminOnly, async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const [rows] = await conn.query(`
      SELECT *, author AS userName 
      FROM designs 
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
});

// ADMIN MESSAGES
app.get('/api/admin/messages', auth, adminOnly, async (req, res) => {

  const conn = await pool.getConnection();

  try {

    const [rows] = await conn.query(`
      SELECT *
      FROM messages
      ORDER BY created_at DESC
    `);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });

  } finally {

    conn.release();

  }

});

// ADMIN (DELETE DESIGN)
app.delete('/api/admin/designs/:id', auth, adminOnly, async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const [result] = await conn.query(
      'DELETE FROM designs WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Design not found" });
    }

    res.json({ message: "Design deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
});

// Delete the user admin only 
app.delete('/api/admin/users/:id', auth, adminOnly, async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();

  try {
    // Prevent deleting own account
    if (req.user && req.user.id && Number(req.user.id) === Number(id)) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const [result] = await conn.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// app.post('/api/contact', (req, res) => {
//   const { name, phone, email, requirements } = req.body;

//   if (!name || !email) {
//     return res.status(400).json({ error: 'Name and Email are required' });
//   }

//   const sql = 'INSERT INTO messages (name, phone, email, requirements) VALUES (?, ?, ?, ?)';
//   db.query(sql, [name, phone, email, requirements], (err, result) => {
//     if (err) {
//       console.error('Insert error:', err);
//       return res.status(500).json({ error: 'Database insert failed' });
//     }
//     res.json({ message: 'Message saved successfully!', id: result.insertId });
//   });
// });

// ADMIN ANALYTICS
app.get('/api/admin/analytics', auth, adminOnly, async (req, res) => {

  const conn = await pool.getConnection();

  try {

    const filter = req.query.filter || 'month';

    let groupFormat = '%Y-%m';

    if (filter === 'day') {
      groupFormat = '%Y-%m-%d';
    }

    if (filter === 'year') {
      groupFormat = '%Y';
    }

    // TOTAL REVENUE
    const [revenueRows] = await conn.query(`
      SELECT 
        SUM(total) as revenue
      FROM orders
    `);

    // TOTAL PROFIT
    const [profitRows] = await conn.query(`
      SELECT 
        SUM(profit) as profit
      FROM orders
    `);

    // TOTAL ORDERS
    const [ordersRows] = await conn.query(`
      SELECT 
        COUNT(*) as totalOrders
      FROM orders
    `);

    // TOTAL USERS
    const [usersRows] = await conn.query(`
      SELECT 
        COUNT(*) as totalUsers
      FROM users
    `);

    // SALES CHART
    const [salesChart] = await conn.query(`
      SELECT
        DATE_FORMAT(created_at, '${groupFormat}') as label,
        SUM(total) as revenue,
        SUM(profit) as profit
      FROM orders
      GROUP BY label
      ORDER BY label ASC
    `);

    // TOP DESIGNS
    const [topDesigns] = await conn.query(`
      SELECT
        title,
        SUM(quantity) as totalSales
      FROM order_items
      GROUP BY title
      ORDER BY totalSales DESC
      LIMIT 5
    `);

    res.json({

      revenue: revenueRows[0].revenue || 0,

      profit: profitRows[0].profit || 0,

      totalOrders: ordersRows[0].totalOrders || 0,

      totalUsers: usersRows[0].totalUsers || 0,

      salesChart,

      topDesigns

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });

  } finally {

    conn.release();

  }

});

const PORT = process.env.BACKEND_PORT || 4000;
app.listen(PORT, ()=> console.log('Backend running on', PORT));
