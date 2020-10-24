import * as https from "https";
import * as fs from 'fs';
import * as util from 'util'
import dotenv from "dotenv";
import { IncomingMessage, ServerResponse } from "http";
import { app, Methods, get, post, put } from "./routes";

dotenv.config();
const readFile = util.promisify(fs.readFile);

export const createServer = async () => {
    const [key, cert] = await Promise.all([
        readFile('config/cert/server.key'),
        readFile('config/cert/server.cert')
    ]);

    const options = { key, cert };

    const server = https.createServer(options, (req: IncomingMessage, res: ServerResponse) => {
        const routesByMethod = app[req.method as Methods];
        if (!routesByMethod) {
            throw new Error(`Method "${req.method}" is not allowed.`);
        }
        const route = routesByMethod.find((listener) => listener[0].test(req.url!));
        if (!route) {
            throw new Error(`Route ${req.url} for "${req.method}" method was not found.`);
        }
        route[1](req, res);
    });

    server.listen(process.env.SERVER_PORT, () => console.log(`Server open at ${process.env.SERVER_PORT} port`));

    return { on: { get, post, put } };
}