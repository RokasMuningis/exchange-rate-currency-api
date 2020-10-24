import { IncomingMessage } from "http";

export const params = (request: IncomingMessage) => {
    const query = request.url?.split("?");
    if (!query) return {};
    if (query?.length === 1) return {};
    return query[1].split("&").reduce((acc, cur) => {
        const split = cur.split("=");
        return { ...acc, [split[0]]: split[1] || '' };
    }, {} as Record<string, string>)
}