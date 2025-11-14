import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SisiMove API running" });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log("API running on port", port));
