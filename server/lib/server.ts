import * as https from "https";
import * as fs from "fs";
import * as util from "util";
import dotenv from "dotenv";
import { IncomingMessage, ServerResponse } from "http";
import { app, Methods, get, post, put } from "lib/routes";

dotenv.config();
const readFile = util.promisify(fs.readFile);

interface Server {
  on: {
    get: typeof get;
    post: typeof post;
    put: typeof put;
  };
}

export const createServer = async (): Promise<Server> => {
  if (!process.env.SSL_KEY || !process.env.SSL_CERT) {
    throw new Error("Certificate or Key does not exist!");
  }

  const [key, cert] = await Promise.all([
    readFile(process.env.SSL_KEY),
    readFile(process.env.SSL_CERT),
  ]);

  const options = { key, cert };

  const server = https.createServer(
    options,
    (req: IncomingMessage, res: ServerResponse) => {
      const routesByMethod = app[req.method as Methods];
      if (!routesByMethod) {
        throw new Error(`Method "${req.method}" is not allowed.`);
      }
      const route = routesByMethod.find((listener) =>
        listener[0].test(req.url ?? '')
      );
      if (!route) {
        throw new Error(
          `Route ${req.url} for "${req.method}" method was not found.`
        );
      }
      route[1](req, res);
    }
  );

  server.listen(process.env.SERVER_PORT, () =>
    console.log(`Server open at ${process.env.SERVER_PORT} port`)
  );

  return { on: { get, post, put } };
};
