import { createServer } from "lib/server";
import IndexController from "controllers/index_controller";
import QuoteController from "controllers/quote_controller";

(async () => {
  const server = await createServer();
  server.on.get("/quote", QuoteController);
  server.on.get("/", IndexController);
})();
