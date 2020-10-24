import { ALLOWED_CURRENCIES, BAD_REQUEST, ERR_INVALID_CURRENCY, ERR_MISSING_PARAMS, GOOD_REQUEST, JSON_RESPONSE } from "controllers/constants";
import { params } from "lib/params";
import { get_latest_currencies } from "services/get_latest_currencies";
import { Cache } from "lib/cache";
import { CurrenciesAPIRequest, Rates } from "types/currencies";
import { IncomingMessage, ServerResponse } from "http";

const CurrenciesCache = Cache<Rates>(2);
export default async (req: IncomingMessage, res: ServerResponse) => {
    const data = await params<CurrenciesAPIRequest>(req);
    if (!data || !data.base_currency || !data.quote_currency || !data.base_amount) {
        res.writeHead(BAD_REQUEST, JSON_RESPONSE);
        res.end(JSON.stringify({ error: ERR_MISSING_PARAMS }));
        return;
    }

    if (data.base_currency === data.quote_currency) {
        res.writeHead(GOOD_REQUEST, JSON_RESPONSE);
        res.end(JSON.stringify({ exchange_rate: 1.000, quote_amount: data.base_amount }));
        return;
    }

    if (ALLOWED_CURRENCIES.indexOf(data.base_currency) === -1 || ALLOWED_CURRENCIES.indexOf(data.quote_currency) === -1) {
        res.writeHead(BAD_REQUEST, JSON_RESPONSE);
        res.end(JSON.stringify({ error: ERR_INVALID_CURRENCY }));
        return;
    }

    let currency_rates = CurrenciesCache.read(data.base_currency)
    if (!currency_rates) {
        console.log(data.base_currency, 'not in cache, retrieving...')
        const response = await get_latest_currencies(data.base_currency);
        CurrenciesCache.write(data.base_currency, response.rates);
        currency_rates = response.rates;
    }
    console.log(currency_rates);
    res.writeHead(GOOD_REQUEST, JSON_RESPONSE);
    const exchange_rate = Number(currency_rates[data.quote_currency].toFixed(3));
    const quote_amount = Number((Number(data.base_amount) * currency_rates[data.quote_currency]).toFixed(3))
    res.end(JSON.stringify({ exchange_rate, quote_amount }));
    return;        
}