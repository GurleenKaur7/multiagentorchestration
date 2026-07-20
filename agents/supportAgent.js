/*import { llm } from "../agent.js";
import { supportTool } from "../tools/supportTool.js"; // ✅ ADDITION

export async function supportAgent(state) {
// ✅ ADDITION (THIS WAS MISSING)
  const { input, userId } = state;


const msg = state.input.toLowerCase().trim();


  // ✅ handle greeting
  if (msg === "hi" || msg === "hello" || msg === "hey") {
    return {
      ...state,
      response: "Hi, how may I help you?",
    };
  }




  const res = await llm.invoke(`
You are a helpful assistant.

User: ${state.input}
`);

 

// ✅ ADDITION: store conversation
  await supportTool({
    userId,
    message: input,
    response: reply,
  });
  return {
    ...state,
    response: res.content,
  };
}*/



















/*import { llm } from "../agent.js";
import { supportTool } from "../tools/supportTool.js";

export async function supportAgent(state) {

  const { input, userId } = state;

  const msg = input.toLowerCase().trim();

  // ✅ handle greeting
  if (msg === "hi" || msg === "hello" || msg === "hey") {

    // ✅ store greeting ALSO (optional but better)
    await supportTool({
      userId,
      message: input,
      response: "Hi, how may I help you?",
    });

    return {
      ...state,
      response: "Hi, how may I help you?",
    };
  }

  const res = await llm.invoke(`
You are a helpful assistant.

User: ${input}
`);

  // ✅ FIX: use res.content instead of reply
  await supportTool({
    userId,
    message: input,
    response: res.content,
  });

  return {
    ...state,
    response: res.content,
  };
}*/





































import { llm } from "../agent.js";
import { supportTool } from "../tools/supportTool.js";
import { db } from "../db.js"; // ✅ ADD THIS
export async function supportAgent(state) {

  const { input, userId } = state;

  const msg = input.toLowerCase().trim();




 



  // =========================================================
  // ✅ ADDED: runtime context init
  // =========================================================
 /* const supportContext = state.supportContext || [];

  // =========================================================
  // ✅ ADDED: last 5 messages memory window
  // =========================================================
  const recentContext = supportContext.slice(-5);

  const formattedHistory = recentContext
    .map((m) => `User: ${m.user}\nAssistant: ${m.assistant}`)
    .join("\n");*/







  // =========================================================
  // ✅ FETCH LAST 5 CONVERSATIONS FROM DB
  // =========================================================
  const [rows] = await db.execute(
    `
    SELECT message, response
    FROM support_chats
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 5
    `,
    [userId]
  );

  // =========================================================
  // ✅ REVERSE FOR CORRECT CHAT ORDER
  // =========================================================
  const chatHistory = rows.reverse();

  // =========================================================
  // ✅ BUILD CHAT CONTEXT
  // =========================================================
  const formattedHistory = chatHistory
    .map(
      (chat) =>
        `User: ${chat.message}\nAssistant: ${chat.response}`
    )
    .join("\n");













  // =========================================================
  // greeting handling
  // =========================================================
  if (msg === "hi" || msg === "hello" || msg === "hey") {

    const reply = "Hi, how may I help you?";

    await supportTool({
      userId,
      message: input,
      response: reply,
    });

    /*return {
      ...state,
      response: reply,

      // ✅ ADDED: update context
      supportContext: [
        ...supportContext,
        {
          user: input,
          assistant: reply,
        },
      ],
    };
  }*/



    return {
  ...state,
  response: reply,
};
  }
  // =========================================================
  // LLM WITH CONTEXT (ADDED)
  // =========================================================
  const res = await llm.invoke(`
You are a helpful support assistant.

Conversation history:
${formattedHistory}

User: ${input}

Respond naturally using conversation context.
`);

  const reply = res.content;

  await supportTool({
    userId,
    message: input,
    response: reply,
  });

  // =========================================================
  // ✅ ADDED: update runtime context
  // =========================================================
 /* return {
    ...state,
    response: reply,

    supportContext: [
      ...supportContext,
      {
        user: input,
        assistant: reply,
      },
    ],
  };*/

  return {
  ...state,
  response: reply,
};
}
