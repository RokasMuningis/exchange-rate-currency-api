import { IncomingMessage } from 'http'
export const body = (request: IncomingMessage) => {
    const content: string[] = [];
    const promise = new Promise<string>((resolve, reject) => {
        request.on("data", (chunk) => content.push(chunk.toString()));
        request.on("end", () => {
            resolve(content.join(""));
        });
    });
    return promise;
}