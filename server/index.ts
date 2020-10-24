import { app, get } from "./lib/routes";
import dotenv from "dotenv";
import { createServer } from "./lib/server";

dotenv.config();

(async () => {
    const server = await createServer();
    server.on.get("/", (_, res) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("Hello world!");
        return;
    });
})();