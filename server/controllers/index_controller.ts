import type { IncomingMessage, ServerResponse } from "http";
import { GOOD_REQUEST, HTML_RESPONSE } from "controllers/constants";

export default async (
  _req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  res.writeHead(GOOD_REQUEST, HTML_RESPONSE);
  res.end("Hello world!");
  return;
};
