// ✅ NEW FILE

/*import { globalTimeTool } from "../tools/globalTimeTool.js";

export async function globalTimeAgent(state) {

  console.log("GLOBAL TIME STATE:", state);

  const { input } = state;

  // ✅ STEP 1
  // ask human approval
  if (!state.timeApproval) {

    return {
      ...state,

      // ✅ ADDITION
      timeApproval: "awaiting_human",

      response:
        `⚠️ Human approval required before accessing global time tool for "${state.pendingLocation}".\n\n` +
        `Type APPROVE to continue.\n` +
        `Type REJECT to cancel.`,
    };
  }

  // ✅ STEP 2
  // waiting for approval
  if (state.timeApproval === "awaiting_human") {

    // reject
    if (input.trim().toLowerCase() === "reject") {

      return {
        ...state,

        // ✅ CLEAR STATE
        timeApproval: "",

        pendingLocation: "",

        response:
          "❌ Global time request cancelled.",
      };
    }

    // invalid input
    if (input.trim().toLowerCase() !== "approve") {

      return {
        ...state,

        response:
          "⚠️ Please type APPROVE or REJECT.",
      };
    }

    // ✅ APPROVED
    const result = await globalTimeTool(
      state.pendingLocation
    );

    return {
      ...state,

      // ✅ CLEAR STATE
      timeApproval: "",

      pendingLocation: "",

      response: result,
    };
  }

  return {
    ...state,

    response: "❌ Global time flow failed.",
  };
}*/



















import { globalTimeTool } from "../tools/globalTimeTool.js";

export async function globalTimeAgent(state) {

  console.log("GLOBAL TIME STATE:", state);

  const { input } = state;

  // ✅ STEP 1
  // first request
  if (!state.timeApproval) {

    return {
      ...state,

      timeApproval: "awaiting_human",

      // ✅ SAVE CONTEXT
      timeContext: [
        {
          location: state.pendingLocation,
        },
      ],

      response:
        `⚠️ Human approval required before accessing global time tool for "${state.pendingLocation}".\n\n` +
        `Type APPROVE to continue.\n` +
        `Type REJECT to cancel.`,
    };
  }

  // ✅ STEP 2
  // approval flow
  if (state.timeApproval === "awaiting_human") {

    // ✅ GET LOCATION FROM CONTEXT
    const savedLocation =
      state.timeContext?.[0]?.location;

    // reject
    if (input.trim().toLowerCase() === "reject") {

      return {
        ...state,

        timeApproval: "",

        pendingLocation: "",

        // ✅ CLEAR CONTEXT
        timeContext: [],

        response:
          "❌ Global time request cancelled.",
      };
    }

    // invalid
    if (input.trim().toLowerCase() !== "approve") {

      return {
        ...state,

        response:
          "⚠️ Please type APPROVE or REJECT.",
      };
    }

    // ✅ APPROVED
    const result =
      //await globalTimeTool(savedLocation);
 await globalTimeTool.invoke({
    city: savedLocation,
  });
    return {
      ...state,

      timeApproval: "",

      pendingLocation: "",

      // ✅ CLEAR CONTEXT
      timeContext: [],

      response: result,
    };
  }

  return {
    ...state,

    response:
      "❌ Global time flow failed.",
  };
}