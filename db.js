
import mysql from "mysql2/promise";

export const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "gbakshi21@0618",
  database: "mysql_api",
});

await db.execute(`
    CREATE TABLE IF NOT EXISTS user_orders (

    order_id INT AUTO_INCREMENT PRIMARY KEY,  
  
  user_id VARCHAR(100),
  item VARCHAR(255),
  payment DECIMAL(10,2),
  status VARCHAR(50),
  payment_status VARCHAR(50),
  delivery_status VARCHAR(50),
  payment_mode VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`)



await db.execute(`
CREATE TABLE IF NOT EXISTS support_chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100),
  message TEXT,
  response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`);

console.log("table created successfully");//db.js

/*await db.execute(`
CREATE TABLE IF NOT EXISTS refunds (
  refund_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  user_id VARCHAR(100),
  reason TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`);*/




await db.execute(
  `CREATE TABLE IF NOT EXISTS refund_requests (
  refund_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  user_id VARCHAR(100),
  item VARCHAR(255),
  amount DECIMAL(10,2),
  reason TEXT,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);