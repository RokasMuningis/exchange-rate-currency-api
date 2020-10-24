import dotenv from "dotenv";
import { body } from "./lib/body";
import { params } from "./lib/params";
import { createServer } from "./lib/server";

dotenv.config();

(async () => {
    const server = await createServer();
    server.on.post("/quote", async (req, res) => {
        const data = await body(req);
        console.log(data);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("Hello world!");
    });

    server.on.get("/", async (req, res) => {
        const data = await params(req);
        console.log(data);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("Hello world!");
        return;
    });
})();