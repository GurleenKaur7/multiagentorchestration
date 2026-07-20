





/*import { db } from "../db.js";
import { refundTool } from "../tools/refundTool.js"; // ✅ ADD

export async function refundAgent(state) {
  const { userId, input, step, selectedOrder } = state;

   console.log("STEP:", step);
  console.log("SELECTED ORDER:", selectedOrder);

  // 🟢 STEP 1 → show orders
  if (!step) {
    const [orders] = await db.execute(
      "SELECT order_id, item, payment FROM user_orders WHERE user_id = ?",
      [userId]
    );

    if (orders.length === 0) {
      return {
        ...state,
        response: "❌ You have no orders to refund.",
      };
    }

    let orderList = "🧾 Your Orders:\n";
    orders.forEach((o) => {
      orderList += `🆔 ${o.order_id} | ${o.item} | ₹${o.payment}\n`;
    });

    return {
      ...state,
      step: "awaiting_order_id", // ✅ MEMORY
      response: `${orderList}\n👉 Enter Order ID to refund`,
    };
  }

  // 🟢 STEP 2 → capture order id
  if (step === "awaiting_order_id") {
    const orderId = input.trim();

    // ✅ VALIDATION ADD
    if (!/^\d+$/.test(orderId)) {
      return {
        ...state,
        response: "❌ Please enter a valid Order ID",
      };
    }

    return {
      ...state,
      step: "awaiting_reason",
      selectedOrder: orderId,
      response: "❓ Why do you want to refund this order?",
    };
  }

  // 🟢 STEP 3 → process refund
  if (step === "awaiting_reason") {
    const reason = input;

    const [order] = await db.execute(
      "SELECT * FROM user_orders WHERE order_id = ? AND user_id = ?",
      [selectedOrder, userId]
    );

    if (order.length === 0) {
      return {
        ...state,
        response: "❌ Invalid order ID.",
      };
    }

    const orderData = order[0];

    // ✅ CALL TOOL
    const result = await refundTool({
      order_id: selectedOrder,
      user_id: userId,
      item: orderData.item,
      amount: orderData.payment,
      reason,
    });

    return {
      ...state,
      step: "", // ✅ RESET
      selectedOrder: "",
      response: `✅ Refund processed!

🆔 Order ID: ${result.orderId}
💰 Amount: ₹${result.amount}
📝 Reason: ${reason}`,
    };
  }

  return {
    ...state,
    response: "Something went wrong.",
  };
}*/
























import { db } from "../db.js";
import { refundTool } from "../tools/refundTool.js";

export async function refundAgent(state) {
  const { userId, input } = state;

  // ✅ DEBUG (keep for now)

    console.log("FULL STATE:", state);
  console.log("STEP:", state.step);
  console.log("SELECTED ORDER:", state.selectedOrder);

  // 🟢 STEP 1 → show orders
  if (!state.step) {
    const [orders] = await db.execute(
      "SELECT order_id, item, payment FROM user_orders WHERE user_id = ?",
      [userId]
    );

    if (orders.length === 0) {
      return {
        ...state,
        response: "❌ You have no orders to refund.",
      };
    }


//add today



  // ✅ NEW: SINGLE ORDER FLOW
  if (orders.length === 1) {
    const singleOrder = orders[0];

    state.step = "awaiting_reason";
    state.selectedOrder = singleOrder.order_id;

    return {
      ...state,
      response: `🧾 Order Found:
🆔 ${singleOrder.order_id} | ${singleOrder.item} | ₹${singleOrder.payment}

❓ Why do you want to refund this order?`,
    };
  }




    let orderList = "🧾 Your Orders:\n";
    orders.forEach((o) => {
      orderList += `🆔 ${o.order_id} | ${o.item} | ₹${o.payment}\n`;
    });

    // ✅ IMPORTANT FIX (mutation)
    state.step = "awaiting_order_id";

    return {
      ...state,
      response: `${orderList}\n👉 Enter Order ID to refund`,
    };
  }

  // 🟢 STEP 2 → capture order id
  if (state.step === "awaiting_order_id") {
    // ✅ extract number from any text
    const match = input.match(/\d+/);
    const orderId = match ? match[0] : null;

    if (!orderId) {
      return {
        ...state,
        response: "❌ Please enter a valid Order ID",
      };
    }

    // ✅ IMPORTANT FIX (mutation)
    state.step = "awaiting_reason";
    state.selectedOrder = orderId;

    return {
      ...state,
      response: "❓ Why do you want to refund this order?",
    };
  }

  // 🟢 STEP 3 → process refund
  if (state.step === "awaiting_reason") {
    const reason = input;

    const [order] = await db.execute(
      "SELECT * FROM user_orders WHERE order_id = ? AND user_id = ?",
      [state.selectedOrder, userId]
    );

    if (order.length === 0) {
      return {
        ...state,
        response: "❌ Invalid order ID.",
      };
    }

    const orderData = order[0];

    // ✅ CALL TOOL
    const result = await refundTool({
      order_id: state.selectedOrder,
      user_id: userId,
      item: orderData.item,
      amount: orderData.payment,
      reason,
    });

    // ✅ RESET STATE
    state.step = "";
    state.selectedOrder = "";

    return {
      ...state,
      response: `✅ Refund processed!

🆔 Order ID: ${result.orderId}
💰 Amount: ₹${result.amount}
📝 Reason: ${reason}`,
    };
  }

  return {
    ...state,
    response: "Something went wrong.",
  };
}




































/*import { db } from "../db.js";
import { refundTool } from "../tools/refundTool.js";

export async function refundAgent(state) {

  console.log("FULL STATE:", state);

  const { userId, input } = state;

  // ✅ STEP 1
  // start refund flow
  if (!state.step && !state.refundApproval) {

    const [orders] = await db.execute(
      `
      SELECT order_id, item, payment
      FROM user_orders
      WHERE user_id = ?
      `,
      [userId]
    );

    // no orders
    if (orders.length === 0) {

      return {
        ...state,

        response: "❌ You have no orders to refund.",
      };
    }

    // one order
    if (orders.length === 1) {

      return {
        ...state,

        selectedOrder: orders[0].order_id,

        step: "awaiting_reason",

        response:
          `🧾 Order Found\n\n` +
          `Order ID: ${orders[0].order_id}\n` +
          `Item: ${orders[0].item}\n\n` +
          `Please enter refund reason.`,
      };
    }

    // multiple orders
    let msg = "📦 Your Orders:\n\n";

    orders.forEach((o) => {

      msg +=
        `Order ID: ${o.order_id} | ${o.item} | ₹${o.payment}\n`;
    });

    msg += "\nEnter Order ID to refund.";

    return {
      ...state,

      step: "awaiting_order_id",

      response: msg,
    };
  }

  // ✅ STEP 2
  // waiting for order id
  if (state.step === "awaiting_order_id") {

    return {
      ...state,

      selectedOrder: input,

      step: "awaiting_reason",

      response: "✍️ Please enter refund reason.",
    };
  }

  // ✅ STEP 3
  // waiting for refund reason
  if (state.step === "awaiting_reason") {

    return {
      ...state,

      pendingRefundReason: input,

      step: "",

      // ✅ ADDITION
      refundApproval: "awaiting_human",

      response:
        `⚠️ Human approval required before processing refund.\n\n` +
        `Type APPROVE to continue.\n` +
        `Type REJECT to cancel refund.`,
    };
  }

  // ✅ STEP 4
  // HUMAN IN LOOP
  if (state.refundApproval === "awaiting_human") {

    // reject
    if (input.trim().toLowerCase() === "reject") {

      return {
        ...state,

        refundApproval: "",

        pendingRefundReason: "",

        selectedOrder: "",

        response: "❌ Refund request cancelled.",
      };
    }

    // invalid response
    if (input.trim().toLowerCase() !== "approve") {

      return {
        ...state,

        response:
          "⚠️ Please type APPROVE or REJECT.",
      };
    }

    // ✅ APPROVED
    const result = await refundTool({
      order_id: state.selectedOrder,

      user_id: userId,

      reason: state.pendingRefundReason,
    });

    return {
      ...state,

      refundApproval: "",

      pendingRefundReason: "",

      selectedOrder: "",

      response:
        `✅ Refund processed successfully.\n\n${result.message}`,
    };
  }

  return {
    ...state,

    response: "❌ Refund flow failed.",
  };
}*/