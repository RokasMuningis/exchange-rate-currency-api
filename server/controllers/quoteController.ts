import {
  ALLOWED_CURRENCIES,
  BAD_REQUEST,
  ERR_INVALID_CURRENCY,
  ERR_MISSING_PARAMS,
  GOOD_REQUEST,
  JSON_RESPONSE,
} from "controllers/constants";
import { params } from "lib/params";
import { GetLatestCurrencies } from "services/getLatestCurrencies";
import { cache } from "lib/cache";
import { CurrenciesAPIRequest, Rates } from "types/currencies";
import { IncomingMessage, ServerResponse } from "http";

const CurrenciesCache = cache<Rates>(2);
export default async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  const data = params<CurrenciesAPIRequest>(req);
  if (
    !data ||
    !data.base_currency ||
    !data.quote_currency ||
    !data.base_amount
  ) {
    res.writeHead(BAD_REQUEST, JSON_RESPONSE);
    res.end(JSON.stringify({ error: ERR_MISSING_PARAMS }));
    return;
  }

  if (data.base_currency === data.quote_currency) {
    res.writeHead(GOOD_REQUEST, JSON_RESPONSE);
    res.end(
      JSON.stringify({ exchange_rate: 1.0, quote_amount: data.base_amount })
    );
    return;
  }

  if (
    ALLOWED_CURRENCIES.indexOf(data.base_currency) === -1 ||
    ALLOWED_CURRENCIES.indexOf(data.quote_currency) === -1
  ) {
    res.writeHead(BAD_REQUEST, JSON_RESPONSE);
    res.end(JSON.stringify({ error: ERR_INVALID_CURRENCY }));
    return;
  }

  let currency_rates = CurrenciesCache.read(data.base_currency);
  if (!currency_rates) {
    const response = await GetLatestCurrencies(data.base_currency);
    CurrenciesCache.write(data.base_currency, response.rates);
    currency_rates = response.rates;
  }
  res.writeHead(GOOD_REQUEST, JSON_RESPONSE);
  const exchange_rate = Number(currency_rates[data.quote_currency].toFixed(3));
  const quote_amount = Number(
    (Number(data.base_amount) * currency_rates[data.quote_currency]).toFixed(3)
  );
  res.end(JSON.stringify({ exchange_rate, quote_amount }));
  return;
};
