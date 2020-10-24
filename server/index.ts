import { createServer } from "lib/server";
import IndexController from "controllers/indexController";
import QuoteController from "controllers/quoteController";

(async () => {
  const server = await createServer();
  server.on.get("/quote", QuoteController);
  server.on.get("/", IndexController);
})();
