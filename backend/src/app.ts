import express from "express";
import path from "path";
import http from "http";

const PORT = 3001;
const app = express();

app.use(express.static(path.join(__dirname, "..", "..", "react-app", "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "react-app", "build", "index.html"));
})

app.get("/api", (req, res) => {
  res.send("API DATA");
})

const server = http.createServer(app);

server.listen(PORT, "localhost", () => {
  console.log(`Server started on port ${PORT}`);
})