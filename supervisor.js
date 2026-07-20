


/*import { llm } from "./agent.js";

export async function supervisor(state) {
  const res = await llm.invoke(`
You are a routing supervisor.

Agents:
- order → for buying products
- support → for general queries

Rules:
- If user wants to buy/order → order
- Else → support

User: "${state.input}"

Return ONLY:
order OR support OR refund
`);

  return {
    ...state,
    intent: res.content.trim().toLowerCase(),
  };
}*/

























import { llm } from "./agent.js";



 

export async function supervisor(state) {


// 🔥 ADD HERE (VERY IMPORTANT)
  if (state.step) {
    return {
      ...state,
      intent: "refund",
    };
  }


if (state.timeApproval) {

    return {
      ...state,

      intent: "global_time",
    };
  }






  // ✅ ADDITION
  // detect time query
  const lowerInput = state.input.toLowerCase();

  const isTimeQuery =
    lowerInput.includes("time") ||
    lowerInput.includes("clock");

  // ✅ ADDITION
  if (isTimeQuery) {

    const locationRes = await llm.invoke(`
Extract ONLY the city/country/location from message.

Rules:
- Return ONLY location
- No explanation
- Can be any location in world

Message:
"${state.input}"
`);

    return {
      ...state,

      // ✅ ADDITION
      intent: "global_time",

      // ✅ ADDITION
      pendingLocation:
        locationRes.content.trim(),
    };
  }




















  const res = await llm.invoke(`
You are a routing supervisor.

Agents:
- order → for buying products
- support → for general queries
- refund → for refund/cancel requests   // ✅ ADD

- get_orders → for showing all user orders   // ✅ ADDITION
- global_time → for global time requests


Rules:
- If user wants to buy/order → order
- If user wants refund/cancel → refund   // ✅ ADD
- If user asks "my orders", "show orders", "what did I buy" → get_orders   // ✅ ADDITION

- If user asks time/clock/current time → global_time
- Else → support

User: "${state.input}"

Return ONLY:
order OR support OR refund OR get_orders
`);


 // ✅ ADD HERE
  console.log("RAW INTENT:", res.content);


  return {
    ...state,
    intent: res.content.trim().toLowerCase(),
  };
}














