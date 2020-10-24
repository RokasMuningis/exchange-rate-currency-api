import { Currencies } from "types/currencies";

/* eslint-disable max-len */
export const BAD_REQUEST = 400;
export const GOOD_REQUEST = 200;
export const JSON_RESPONSE = { "Content-Type": "application/json" };
export const HTML_RESPONSE = { "Content-Type": "text/html" };
export const ALLOWED_CURRENCIES = [Currencies.USD, Currencies.EUR, Currencies.GBP, Currencies.ILS];
export const ERR_INVALID_CURRENCY = `base and/or quota currencies are invalid. Allowed currencies: ${ALLOWED_CURRENCIES.join(
  " | "
)} `;
export const ERR_MISSING_PARAMS = `Request is missing one or more of required fields:
base_currency (String, 3 letters ISO currency code. Currency to convert from.) = ${ALLOWED_CURRENCIES.join(
  " | "
)} 
quota_currency (String, 3 letters ISO currency code. Currency to convert to.) = ${ALLOWED_CURRENCIES.join(
  " | "
)} 
base_amount (Integer. The amount to convert in cents.)
`;
