import { StateGraph, END } from "@langchain/langgraph";

import { MemorySaver } from "@langchain/langgraph-checkpoint"; // ✅ ADD

//import { refundAgent } from "./agents/refundAgent.js";
//import { refundAgent } from "./agents/refundAgent.js";

import { supervisor } from "./supervisor.js";
import { orderAgent } from "./agents/orderAgent.js";
import { supportAgent } from "./agents/supportAgent.js";
import { refundAgent } from "./agents/refundAgent.js"; // ✅ ADD
import { Annotation } from "@langchain/langgraph"; // ✅ HERE

import { getOrdersAgent } from "./agents/getOrdersAgent.js"; // ✅ ADDITION


// ✅ ADDITION
import { globalTimeAgent }
from "./agents/globalTimeAgent.js";



const AgentState = {
  input: "",
  userId: "",
  intent: "",
  response: "",

  step: "",          // ✅ ADD
  selectedOrder: "", // ✅ 
  

  

   // ✅ ADDED
  supportContext: [],






  // ✅ ADDITION
  timeApproval: "",

  // ✅ ADDITION
  pendingLocation: "",
  // ✅ ADDITION
timeContext: [],

  
};







const graph = new StateGraph({
  channels: AgentState,
});

graph.addNode("supervisor", supervisor);
graph.addNode("order", orderAgent);
graph.addNode("support", supportAgent);
//graph.addNode("refund", refundAgent);
//graph.addNode("refund", refundAgent);
graph.addNode("refund", refundAgent); // ✅ ADD
graph.addNode("get_orders", getOrdersAgent); // ✅ ADDITION

graph.addNode(
  "global_time",
  globalTimeAgent
);


graph.setEntryPoint("supervisor");

/*graph.addConditionalEdges("supervisor", (state) => {
  return state.intent === "order" ? "order" : "support";
});*/

graph.addConditionalEdges("supervisor", (state) => {
  if (state.intent === "order") return "order";
  if (state.intent === "refund") return "refund";
    if (state.intent === "get_orders") return "get_orders"; // ✅ ADDITION


     // ✅ ADDITION
    if (
      state.intent === "global_time"
    )
      return "global_time";

  return "support";
});

graph.addEdge("order", END);
graph.addEdge("support", END);
//graph.addEdge("refund", END);
//graph.addEdge("refund", END);

graph.addEdge("refund", END); // ✅ ADD
graph.addEdge("get_orders", END); // ✅ 
// ✅ ADDITION
graph.addEdge("global_time", END);

// ✅ ADD CHECKPOINTER
const checkpointer = new MemorySaver();


//export const app = graph.compile();


export const app = graph.compile({
  checkpointer, // ✅ ADD
});
