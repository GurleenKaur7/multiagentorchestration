import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

export const llm = new ChatOpenAI({
  model:"llama-3.1-8b-instant",
  apiKey:process.env.KEY,
  configuration:{
    baseURL: "https://api.groq.com/openai/v1",
  }
})