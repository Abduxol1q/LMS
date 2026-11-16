import express from "express";
import { configDotenv } from "dotenv";
import router from "./routers/index.js";
import fs from "fs";
import path from "path";

configDotenv({ path: "./src/.env" });

const app = express();

// JSON body'ni o‘qiydi
app.use(express.json());

// Routerlar JSON o‘qilgandan keyin ishlaydi
app.use(router);

const logDir = path.join(process.cwd(), "src", "log");
fs.mkdirSync(logDir, { recursive: true });

app.use((error, req, res, next) => {
  if (error.status < 400) {
    res.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  } else {
    fs.appendFileSync(
      path.join(process.cwd(), "src", "log", "logger.txt"),
      `[${new Date().toLocaleString()}]_${req.method}_${req.url}_${req.message}\n`);
    
    res.status(error.status).json({
      status: error.status,
      message:"Internal servel error"
    })
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
