
// import { llm } from "../agent.js";
// import mysql from "mysql2/promise";

// const db = await mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "gbakshi21@0618",
//   database: "mysql_db",
// });

// export const orderAgent = async (input, userId) => {
//   const res = await llm.invoke(`
// Extract item from: "${input}"
// Return JSON: { "item": "" }
// `);

//   let parsed;
//   try {
//     parsed = JSON.parse(res.content);
//   } catch {
//     return "❌ Could not understand order";
//   }

//   const [result] = await db.query(
//     "INSERT INTO orders (user_id, product_name) VALUES (?, ?)",
//     [userId, parsed.item]
//   );

//   return `🛒 Order placed. ID: ${result.insertId}`;
// };


// import { llm } from "../agent.js";
// import mysql from "mysql2/promise";
// import { z } from "zod";

// // ⚠️ In real projects, move this to db.js (shared connection)
// const db = await mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "gbakshi21@0618",
//   database: "mysql_db",
// });

// // 🧠 ZOD SCHEMA (STRICT VALIDATION)
// const OrderSchema = z.object({
//   item: z.string().min(1, "Item cannot be empty"),
// });

// export const orderAgent = async (input, userId) => {
//   try {
//     // 🧠 Step 1: Extract product using LLM
//     const res = await llm.invoke(`
// Extract product name from this sentence:
// "${input}"

// Return ONLY valid JSON:
// { "item": "string" }
// `);

//     // 🧹 Step 2: Clean LLM response
//     const cleaned = res.content
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     let parsed;

//     try {
//       parsed = JSON.parse(cleaned);
//     } catch {
//       return "❌ Could not parse LLM response";
//     }

//     // 🛑 Step 3: ZOD VALIDATION (IMPORTANT ADDITION)
//     const validation = OrderSchema.safeParse(parsed);

//     if (!validation.success) {
//       return "❌ Invalid order format (Zod validation failed)";
//     }

//     const item = validation.data.item;

//     // 🗄️ Step 4: Save order in DB
//     const [result] = await db.query(
//       "INSERT INTO orders (user_id, product_name) VALUES (?, ?)",
//       [userId, item]
//     );

//     // ✅ Step 5: Success response
//     return `🛒 Order placed successfully. Order ID: ${result.insertId}`;

//   } catch (err) {
//     console.error("OrderAgent error:", err);
//     return "❌ Failed to place order";
//   }
// };


/*import { StateGraph, END } from "@langchain/langgraph";
 import { llm } from "./agent.js";
 import { orderTool, refundTool, supportTool } from "./tools/agentTools.js";

 
 const AgentState = {
   input: null,
   response: null,
   userId:null
 };


const routerNode = async (state) => {
  const res = await llm.invoke(`
You are a router.

 User request: "${state.input}"

 Choose ONE:
 - order
 - refund
 - support

 Return only one word.
 `);

  const decision = res.content.trim().toLowerCase();

   return { ...state, decision };
 };

 

const orderNode = async (state) => {
  const result = await orderTool.invoke(state.input);
   return { ...state, response: result };
 };

 const refundNode = async (state) => {
   const result = await refundTool.invoke(state.input);
   return { ...state, response: result };
 };

 const supportNode = async (state) => {
   const result = await supportTool.invoke(state.input);
   return { ...state, response: result };
 };


 const workflow = new StateGraph({
   channels: AgentState,
 });


 workflow.addNode("router", routerNode);
 workflow.addNode("order", orderNode);
 workflow.addNode("refund", refundNode);
 workflow.addNode("support", supportNode);


workflow.setEntryPoint("router");

addConditionalEdges("router", (state) => {
   if (state.decision === "order") return "order";
  if (state.decision === "refund") return "refund";
  return "support";
});


 workflow.addEdge("order", END);
 workflow.addEdge("refund", END);
 workflow.addEdge("support", END);


 export const supervisor = workflow.compile();
*/







/*import express from "express";
import bcrypt from "bcrypt";
//import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { supervisor } from "./supervisor.js"; 
dotenv.config();

// ================== APP INIT ==================
const app = express();
app.use(express.json());
//app.use(cors());

const PORT =  5000;
const JWT_SECRET =  "super_secret_key";

// ================== DATABASE ==================
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "gbakshi21@0618",
  database: "mysql_db",
});

// ================== CREATE TABLE ==================
await db.query(`
  CREATE TABLE IF NOT EXISTS profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("✅ profile table ready");

/





await db.query(`
  CREATE TABLE IF NOT EXISTS neworders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    specs TEXT,
    address TEXT,
    status ENUM('placed','cancelled','delivered') DEFAULT 'placed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES profile(id)
    ON DELETE CASCADE
  )
`);

console.log("✅ neworders table ready");





await db.query(`
  CREATE TABLE IF NOT EXISTS order_sessions (
    user_id INT PRIMARY KEY,

    step ENUM(
      'ASK_ITEM',
      'ASK_SPEC',
      'ASK_ADDRESS',
      'CONFIRM',
      'DONE'
    ) NOT NULL,

    item VARCHAR(255),
    specs TEXT,
    address TEXT,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
      ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES profile(id)
    ON DELETE CASCADE
  )
`);

console.log("✅ order_sessions table ready");




// ================== MIDDLEWARE ==================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// ================== ROUTES ==================


app.use((req, res, next) => {
  console.log("🔥 METHOD:", req.method);
  console.log("🔥 CONTENT-TYPE:", req.headers["content-type"]);
  next();
});
// ---------- SIGNUP ----------
app.post("/api/signup", async (req, res) => {
  const { username, email,  password } = req.body;

  if (!username || !email|| !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO profile (username, email, password)
      VALUES (?, ?, ?)
    `;

    await db.query(sql, [
      username,
      email,
      
      hashedPassword,
    ]);

    res.status(201).json({ message: "Signup successful" });

  } catch (err) {
    console.error("Signup error:", err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "User already exists" });
    }

    res.status(500).json({ message: "Database error" });
  }
});

// ---------- LOGIN ----------
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const sql = "SELECT id, username, password FROM profile WHERE username = ?";
    const [results] = await db.query(sql, [username]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "20h" }
    );

    res.json({ message: "Login successful", token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// ---------- PROFILE ----------
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const sql = "SELECT id, username, email FROM profile WHERE id = ?";
    const [results] = await db.query(sql, [req.user.id]);

    res.json(results[0]);

  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
});








app.post("/agent", authenticateToken, async (req, res) => {
  try {
    const input = req.body?.input;
const userId = req.user.id;
    if (!input) {
      return res.status(400).json({ message: "Input required" });
    }

    //const userId = req.user.id;

    const result = await supervisor.invoke({
      input,
      userId, // ✅ IMPORTANT FIX
    });

    console.log("🧠 Agent Input:", input);
    console.log("👤 User ID:", userId);
    console.log("📦 Result:", result);

    res.json({
      reply: result.response || result.message || "No response generated",
    });

  } catch (err) {
    console.error("🔥 Agent error:", err);
    res.status(500).json({
      message: "Agent failed",
      error: err.message,
    });
  }
});









// ---------- GET ALL USERS ----------
app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT id, username, email
      FROM profile
    `;

    const [results] = await db.query(sql);
    res.json(results);

  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
});

// ================== START SERVER ==================
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});*/











