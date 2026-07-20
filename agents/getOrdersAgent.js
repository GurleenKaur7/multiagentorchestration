/*import { db } from "../db.js";

export async function getOrdersAgent(state) {
  const { userId } = state;

  // 1️⃣ Get orders
  const [orders] = await db.execute(
    "SELECT * FROM user_orders WHERE user_id = ?",
    [userId]
  );

  // 2️⃣ Get refunds for same user
  const [refunds] = await db.execute(
    "SELECT order_id, reason, amount, status FROM refund_requests WHERE user_id = ?",
    [userId]
  );

  if (orders.length === 0) {
    return {
      ...state,
      response: "❌ No orders found for this user.",
    };
  }

  // create refund map for quick lookup
  const refundMap = new Map();
  refunds.forEach((r) => {
    refundMap.set(r.order_id, r);
  });

  let result = "🧾 Your Orders:\n\n";

  orders.forEach((o) => {
    const refund = refundMap.get(o.order_id);

    if (refund) {
      result += `🆔 ${o.order_id} | ${o.item} | ₹${o.payment} | REFUNDED ❌\n`;
      result += `   ↳ Reason: ${refund.reason}\n`;
      result += `   ↳ Status: ${refund.status}\n\n`;
    } else {
      result += `🆔 ${o.order_id} | ${o.item} | ₹${o.payment} | ${o.status}\n`;
    }
  });

  return {
    ...state,
    response: result,
  };
}*/









import { getOrdersTool } from "../tools/getOrdersTool.js";

export async function getOrdersAgent(state) {
  const { userId } = state;

  const { orders, refunds } = await getOrdersTool(userId);

  if (!orders.length) {
    return {
      ...state,
      response: "❌ No orders found for this user.",
    };
  }

  const refundMap = new Map();
  refunds.forEach((r) => {
    refundMap.set(r.order_id, r);
  });

  let result = "🧾 Your Orders:\n\n";

  orders.forEach((o) => {
    const refund = refundMap.get(o.order_id);

    if (refund) {
      result += `🆔 ${o.order_id} | ${o.item} | ₹${o.payment} | REFUNDED ❌\n`;
      result += `   ↳ Reason: ${refund.reason}\n`;
      result += `   ↳ Status: ${refund.status}\n\n`;
    } else {
      result += `🆔 ${o.order_id} | ${o.item} | ₹${o.payment} | ${o.status}\n`;
    }
  });

  return {
    ...state,
    response: result,
  };
}