require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });  
const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3080;

app.post("/", async (req, res) => {
  const { message } = req.body;
  console.log(message);
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ],
    max_tokens: 1000,
    temperature: 0.9,
  });
  const reply = completion.data.choices[0].message.content.trim();
  console.log(reply);
  res.json({
    message: reply,
  });
});
app.listen(port, () => { 
    console.log(`Example app listening at http://localhost:${port}`)
});
