
import express from "express";
import { app } from "./graph.js";
import { v4 as uuidv4 } from "uuid";

const server = express();
server.use(express.json());

server.post("/chat", async (req, res) => {
  const { message, userId: bodyUserId } = req.body;

  try {
    // ✅ AUTO USER ID
   // let userId = req.headers["x-user-id"];
   // ✅ FIX 1: use header OR body OR existing (DO NOT always generate new blindly)
    let userId =
      req.headers["x-user-id"] ||   // 👈 from Postman header
      bodyUserId;      

    if (!userId) {
      userId = uuidv4();
    }

/*const result = await app.invoke({
      input: message,
      userId,
       
    });*/

      // ✅ ADD THREAD ID
    const threadId =
      req.headers["x-thread-id"] || userId;


      // ✅ ADD HERE
console.log("THREAD ID:", threadId);

    const result = await app.invoke(
      {
        input: message,
        userId,
      },
      {
        configurable: {
          thread_id: threadId, // ✅ ADD
        },
      }
    );
    
    
    
    
    res.json({
      userId,
      intent: result.intent,
      reply: result.response,
    });

  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      error: "Failed",
      details: err.message,
    });
  }
});

server.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});

