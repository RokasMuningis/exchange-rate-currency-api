import { createServer } from "lib/server";
import index_controller from "controllers/index_controller";
import quote_controller from "controllers/quote_controller";

(async () => {
    const server = await createServer();            
    server.on.get("/quote", quote_controller);

    server.on.get("/", index_controller);
})();