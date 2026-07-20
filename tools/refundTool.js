/*import { db } from "../db.js";

export async function refundTool({ orderId, userId, reason }) {

  // ✅ insert into refund table
  await db.execute(
    "INSERT INTO refunds (order_id, user_id, reason, status) VALUES (?, ?, ?, ?)",
    [orderId, userId, reason, "refunded"]
  );

  // ✅ also update order table
  await db.execute(
    "UPDATE user_orders SET status = ?, payment_status = ? WHERE order_id = ?",
    ["refunded", "refunded", orderId]
  );

  return {
    message: `✅ Refund processed for Order ID ${orderId}`,
  };
}*/





/*import { db } from "../db.js";

export async function refundTool({ orderId, userId, item, amount, reason }) {
  
  const [result] = await db.execute(
    `INSERT INTO refund_requests 
    (order_id, user_id, item, amount, reason, status)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [orderId, userId, item, amount, reason, "completed"]
  );

  const refundId = result.insertId;

  return {
    refundId,
    orderId,
    amount,
    message: "Refund stored successfully"
  };
}*/



















import { db } from "../db.js";

export async function refundTool({
  order_id,
  user_id,
  item,
  amount,
  reason,
}) {
  // ✅ ONLY insert refund
  await db.execute(
    `INSERT INTO refund_requests 
     (order_id, user_id, item, amount, reason, status) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [order_id, user_id, item, amount, reason, "completed"]
  );

  return {
    orderId: order_id,
    amount,
  };
}