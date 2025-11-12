import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { YoutubeTranscript } from "youtube-transcript";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // bạn cần set key này ở bước 3
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API chính để extension gọi tới
app.post("/getTranscriptAndExplain", async (req, res) => {
  const { youtube_url } = req.body;
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(youtube_url);
    const text = transcript.map(t => t.text).join(" ");

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Bạn là trợ lý AI chuyên dịch và tóm tắt video YouTube sang tiếng Việt." },
        { role: "user", content: `Hãy tóm tắt và dịch nội dung video sau sang tiếng Việt:\n${text}` }
      ]
    });

    const output = completion.choices[0].message.content;
    res.json({ translation: output, explanation: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không lấy được transcript hoặc dịch." });
  }
});

app.listen(3000, () => console.log("✅ Server AI chạy tại http://localhost:3000"));
