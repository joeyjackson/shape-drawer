import express from "express";
import path from "path";
import http from "http";
import dotenv from 'dotenv';
import bodyparser from 'body-parser';
import { connectToMongo } from "./mongo";
import { applyApiRoutes } from "./routes";
import cors from "cors";

dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });
connectToMongo();

const INDEX_HTML_DIR = path.join(__dirname, "..", "..", "react-app", "build");
const PORT = (process.env.PORT || "3001") as unknown as number;
const HOST = process.env.HOST || "localhost";
const NODE_ENV = process.env.NODE_ENV || "production";
const app = express();

if (NODE_ENV === "development") {
  console.log("CORS enabled");
  app.use(cors());
} else {
  console.log("CORS disabled");
}
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json());
app.use(express.static(INDEX_HTML_DIR));
app.get("/", (req, res) => {
  res.sendFile(path.join(INDEX_HTML_DIR, "index.html"))
});
applyApiRoutes(app);

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`Server started in mode "${NODE_ENV}" at http://${HOST}:${PORT}`);
})
