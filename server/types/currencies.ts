export enum Currencies {
  CAD = "CAD",
  HKD = "HKD",
  ISK = "ISK",
  PHP = "PHP",
  DKK = "DKK",
  HUF = "HUF",
  CZK = "CZK",
  GBP = "GBP",
  RON = "RON",
  SEK = "SEK",
  IDR = "IDR",
  INR = "INR",
  BRL = "BRL",
  RUB = "RUB",
  HRK = "HRK",
  JPY = "JPY",
  THB = "THB",
  CHF = "CHF",
  EUR = "EUR",
  MYR = "MYR",
  BGN = "BGN",
  TRY = "TRY",
  CNY = "CNY",
  NOK = "NOK",
  NZD = "NZD",
  ZAR = "ZAR",
  USD = "USD",
  MXN = "MXN",
  SGD = "SGD",
  AUD = "AUD",
  ILS = "ILS",
  KRW = "KRW",
  PLN = "PLN",
}
export type SupportedCurrencies =
  | Currencies.USD
  | Currencies.ILS
  | Currencies.GBP
  | Currencies.EUR;
export type Rates = Record<Currencies, number>;
export interface CurrenciesAPIRequest {
  base_currency: SupportedCurrencies;
  quote_currency: SupportedCurrencies;
  base_amount: string;
}
export interface CurrenciesAPIResponse {
  rates: Rates;
  base: Currencies;
  date: string;
}
