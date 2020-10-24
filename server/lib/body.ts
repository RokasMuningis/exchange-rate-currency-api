import { IncomingMessage } from "http";
export const body = (request: IncomingMessage): Promise<string> => {
  const content: string[] = [];
  const promise = new Promise<string>((resolve, reject) => {
    request.on("data", (chunk) => content.push(chunk.toString()));
    request.on("end", () => {
      resolve(content.join(""));
    });
    request.on("error", (err: Error) => {
      reject(err);
    });
  });
  return promise;
};
