import { db } from "../db.js";

export async function supportTool({ userId, message, response }) {
  await db.execute(
    "INSERT INTO support_chats (user_id, message, response) VALUES (?, ?, ?)",
    [userId, message, response]
  );
}