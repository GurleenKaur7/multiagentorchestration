
import { db } from "../db.js";

export async function orderTool({ item, price, userId,payment_mode }) {
   const [result]=await db.execute(
   "INSERT INTO user_orders (user_id, item, payment, status,payment_status, delivery_status, payment_mode) VALUES (?, ?, ?, ?,?,?,?)",
    [userId, item, price, "order_placed","paid",
      "delivered",
      payment_mode  ]
  );

   // 🔥 ADDITION: capture insertId here
  const orderId = result.insertId;


  return {
  message:`✅ Order stored: ${item} | ₹${price}` ,
 orderId: orderId
  };
}

