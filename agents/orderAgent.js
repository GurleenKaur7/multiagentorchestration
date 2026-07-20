
import { llm } from "../agent.js";
import { orderTool } from "../tools/orderTool.js";
import { OrderSchema } from "../schemas/orderSchema.js";

export async function orderAgent(state) {
  const { input, userId } = state;
const res = await llm.invoke(`
Extract product and price and payment mode from user message.

STRICT RULES:
- Return ONLY JSON
- No text before or after JSON
- No explanation
- item must contain FULL description (brand, color, size, specs)
- If price missing → estimate in INR
- If payment mode missing → use "COD"

Allowed payment modes: UPI, COD, CARD


Format:
{"item":"string","price":number,"payment_mode":"string"}

Message: "${input}"
`);

  let parsed;

  try {
    parsed = JSON.parse(res.content);
  } catch {
    throw new Error("❌ Invalid JSON from LLM");
  }


 // ✅ ADDITION: fallback if payment_mode missing
  if (!parsed.payment_mode) {
    parsed.payment_mode = "COD";
  }


  //const validated = OrderSchema.parse(parsed);

  const validated = OrderSchema.parse({
  item: parsed.item,
  price: parsed.price
});

  const result = await orderTool({
    item: validated.item,
    price: validated.price,
    userId,
     payment_mode: parsed.payment_mode,
  });

  return {
    ...state,
    //response: result,

    //response: `✅ Order placed! Your order ID is ${result.orderId}`,


    response: `✅ Order placed!
🆔 Order ID: ${result.orderId}
💳 Payment: Paid (${parsed.payment_mode})
📦 Status: Delivered`,
  };
}
