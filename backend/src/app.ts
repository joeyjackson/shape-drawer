import express from "express";
import path from "path";
import http from "http";
import dotenv from 'dotenv';
import bodyparser from 'body-parser';
import { connectToMongo } from "./mongo";
import { applyApiRoutes } from "./routes";

dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });
connectToMongo();

const INDEX_HTML_DIR = path.join(__dirname, "..", "..", "react-app", "build");
const PORT = (process.env.PORT || "3001") as unknown as number;
const HOST = process.env.HOST || "localhost";
const app = express();

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json());
app.use(express.static(INDEX_HTML_DIR));
app.get("/", (req, res) => {
  res.sendFile(path.join(INDEX_HTML_DIR, "index.html"))
});
applyApiRoutes(app);

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`Server started on ${HOST}:${PORT}`);
})
