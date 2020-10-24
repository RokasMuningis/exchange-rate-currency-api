import { IncomingMessage } from "http";

export const params = <T = Record<string, string>>(request: IncomingMessage) => {
    const query = request.url?.split("?");
    if (!query) return null;
    if (query?.length === 1) return null;
    return query[1].split("&").reduce((acc, cur) => {
        const split = cur.split("=");
        return { ...acc, [split[0]]: split[1] || '' };
    }, {} as T)
}