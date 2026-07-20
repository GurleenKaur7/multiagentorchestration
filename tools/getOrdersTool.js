import { db } from "../db.js";

export async function getOrdersTool(userId) {

  // ✅ ADDITION: fetch orders
  const [orders] = await db.execute(
    "SELECT * FROM user_orders WHERE user_id = ?",
    [userId]
  );

  // ✅ ADDITION: fetch refunds
  const [refunds] = await db.execute(
    "SELECT order_id, reason, amount, status FROM refund_requests WHERE user_id = ?",
    [userId]
  );

  return { orders, refunds };
}