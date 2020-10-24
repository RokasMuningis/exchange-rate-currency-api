import { rejects } from "assert";
import { IncomingMessage } from "http";
import https from "https";
import { CurrenciesAPIResponse } from "../types/currencies";

export const get_latest_currencies = (base_currency: string) => {
    return new Promise<CurrenciesAPIResponse>((resolve, reject) => {
        const request = https.request({
            hostname: `api.exchangeratesapi.io`,
            path: `/latest?base=${base_currency}`,
            method: 'GET',
            headers: {
                "Connection": "keep-alive"
            }
        },
        (res: IncomingMessage) => {
            const data: string[] = [];
            res.on('data', (chunk: Buffer) => {
                data.push(chunk.toString("utf8"));
            });
            res.on('end', () => {
                resolve(JSON.parse(data.join("")));
            });
            res.on('error', (err) => {
                console.log('error')
                reject(err);
            })
        });
        request.write("");
    });
};
