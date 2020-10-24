import { app, get } from "./lib/routes";
import dotenv from "dotenv";
import { createServer } from "./lib/server";

dotenv.config();

(async () => {
    const server = await createServer();
})();