/**
 * Central currency dataset (ISO 4217).
 *
 * This is the single source of truth for currency metadata used across
 * every monetary calculator in Shankhya. Components should never hardcode
 * currency symbols; they should look them up here (via `getCurrency`) or
 * use the shared `formatMoney`/`formatMoneyCompact` helpers.
 *
 * IMPORTANT — currency vs. country/jurisdiction:
 *   A currency (e.g. INR) is NOT a country (India) and NOT a jurisdiction /
 *   tax system. This file only lists currencies. Future country-specific
 *   tax logic (GST/VAT/sales tax/income tax) must live in a separate
 *   jurisdiction module, never here.
 *
 * Extend this list by appending entries; it feeds the searchable
 * CurrencySelector automatically.
 */

export interface CurrencyInfo {
  /** ISO 4217 alphabetic code, e.g. "USD" */
  code: string;
  /** Human-readable name, e.g. "US Dollar" */
  name: string;
  /** Display symbol, e.g. "$" */
  symbol: string;
  /** Number of minor units (decimal places) */
  decimals: number;
  /** Primary locale used for grouping/formatting, e.g. "en-US" */
  locale: string;
  /** Flag / region emoji for the UI (optional) */
  flag?: string;
  /** Countries / regions that use this currency (informational) */
  countries?: string[];
  /** Show in the "Popular" section of the selector */
  popular?: boolean;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", name: "US Dollar", symbol: "$", decimals: 2, locale: "en-US", flag: "🇺🇸", countries: ["United States"], popular: true },
  { code: "EUR", name: "Euro", symbol: "€", decimals: 2, locale: "en-IE", flag: "🇪🇺", countries: ["Eurozone"], popular: true },
  { code: "GBP", name: "British Pound", symbol: "£", decimals: 2, locale: "en-GB", flag: "🇬🇧", countries: ["United Kingdom"], popular: true },
  { code: "INR", name: "Indian Rupee", symbol: "₹", decimals: 2, locale: "en-IN", flag: "🇮🇳", countries: ["India"], popular: true },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", decimals: 0, locale: "ja-JP", flag: "🇯🇵", countries: ["Japan"], popular: true },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$", decimals: 2, locale: "en-CA", flag: "🇨🇦", countries: ["Canada"], popular: true },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", decimals: 2, locale: "en-AU", flag: "🇦🇺", countries: ["Australia"], popular: true },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", decimals: 2, locale: "de-CH", flag: "🇨🇭", countries: ["Switzerland"], popular: true },
  { code: "CNY", name: "Chinese Yuan", symbol: "CN¥", decimals: 2, locale: "zh-CN", flag: "🇨🇳", countries: ["China"] },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", decimals: 2, locale: "en-HK", flag: "🇭🇰", countries: ["Hong Kong"] },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", decimals: 2, locale: "en-SG", flag: "🇸🇬", countries: ["Singapore"] },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", decimals: 2, locale: "en-NZ", flag: "🇳🇿", countries: ["New Zealand"] },
  { code: "KRW", name: "South Korean Won", symbol: "₩", decimals: 0, locale: "ko-KR", flag: "🇰🇷", countries: ["South Korea"] },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", decimals: 2, locale: "sv-SE", flag: "🇸🇪", countries: ["Sweden"] },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", decimals: 2, locale: "nb-NO", flag: "🇳🇴", countries: ["Norway"] },
  { code: "DKK", name: "Danish Krone", symbol: "kr", decimals: 2, locale: "da-DK", flag: "🇩🇰", countries: ["Denmark"] },
  { code: "PLN", name: "Polish Złoty", symbol: "zł", decimals: 2, locale: "pl-PL", flag: "🇵🇱", countries: ["Poland"] },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", decimals: 2, locale: "cs-CZ", flag: "🇨🇿", countries: ["Czechia"] },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", decimals: 2, locale: "hu-HU", flag: "🇭🇺", countries: ["Hungary"] },
  { code: "RON", name: "Romanian Leu", symbol: "lei", decimals: 2, locale: "ro-RO", flag: "🇷🇴", countries: ["Romania"] },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв", decimals: 2, locale: "bg-BG", flag: "🇧🇬", countries: ["Bulgaria"] },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", decimals: 2, locale: "ru-RU", flag: "🇷🇺", countries: ["Russia"] },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", decimals: 2, locale: "uk-UA", flag: "🇺🇦", countries: ["Ukraine"] },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", decimals: 2, locale: "tr-TR", flag: "🇹🇷", countries: ["Turkey"] },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪", decimals: 2, locale: "he-IL", flag: "🇮🇱", countries: ["Israel"] },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", decimals: 2, locale: "ar-AE", flag: "🇦🇪", countries: ["United Arab Emirates"] },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", decimals: 2, locale: "ar-SA", flag: "🇸🇦", countries: ["Saudi Arabia"] },
  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق", decimals: 2, locale: "ar-QA", flag: "🇶🇦", countries: ["Qatar"] },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", decimals: 3, locale: "ar-KW", flag: "🇰🇼", countries: ["Kuwait"] },
  { code: "BHD", name: "Bahraini Dinar", symbol: "د.ب", decimals: 3, locale: "ar-BH", flag: "🇧🇭", countries: ["Bahrain"] },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", decimals: 3, locale: "ar-OM", flag: "🇴🇲", countries: ["Oman"] },
  { code: "JOD", name: "Jordanian Dinar", symbol: "د.أ", decimals: 3, locale: "ar-JO", flag: "🇯🇴", countries: ["Jordan"] },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", decimals: 2, locale: "ar-EG", flag: "🇪🇬", countries: ["Egypt"] },
  { code: "ZAR", name: "South African Rand", symbol: "R", decimals: 2, locale: "en-ZA", flag: "🇿🇦", countries: ["South Africa"] },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", decimals: 2, locale: "en-NG", flag: "🇳🇬", countries: ["Nigeria"] },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", decimals: 2, locale: "en-KE", flag: "🇰🇪", countries: ["Kenya"] },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", decimals: 2, locale: "en-GH", flag: "🇬🇭", countries: ["Ghana"] },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م.", decimals: 2, locale: "ar-MA", flag: "🇲🇦", countries: ["Morocco"] },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", decimals: 2, locale: "en-TZ", flag: "🇹🇿", countries: ["Tanzania"] },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", decimals: 0, locale: "en-UG", flag: "🇺🇬", countries: ["Uganda"] },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br", decimals: 2, locale: "am-ET", flag: "🇪🇹", countries: ["Ethiopia"] },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", decimals: 2, locale: "ur-PK", flag: "🇵🇰", countries: ["Pakistan"] },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", decimals: 2, locale: "bn-BD", flag: "🇧🇩", countries: ["Bangladesh"] },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", decimals: 2, locale: "si-LK", flag: "🇱🇰", countries: ["Sri Lanka"] },
  { code: "NPR", name: "Nepalese Rupee", symbol: "रू", decimals: 2, locale: "ne-NP", flag: "🇳🇵", countries: ["Nepal"] },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", decimals: 2, locale: "ms-MY", flag: "🇲🇾", countries: ["Malaysia"] },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", decimals: 2, locale: "id-ID", flag: "🇮🇩", countries: ["Indonesia"] },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", decimals: 2, locale: "en-PH", flag: "🇵🇭", countries: ["Philippines"] },
  { code: "THB", name: "Thai Baht", symbol: "฿", decimals: 2, locale: "th-TH", flag: "🇹🇭", countries: ["Thailand"] },
  { code: "VND", name: "Vietnamese Đồng", symbol: "₫", decimals: 0, locale: "vi-VN", flag: "🇻🇳", countries: ["Vietnam"] },
  { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$", decimals: 2, locale: "zh-TW", flag: "🇹🇼", countries: ["Taiwan"] },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", decimals: 2, locale: "es-MX", flag: "🇲🇽", countries: ["Mexico"] },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", decimals: 2, locale: "pt-BR", flag: "🇧🇷", countries: ["Brazil"] },
  { code: "ARS", name: "Argentine Peso", symbol: "AR$", decimals: 2, locale: "es-AR", flag: "🇦🇷", countries: ["Argentina"] },
  { code: "CLP", name: "Chilean Peso", symbol: "CL$", decimals: 0, locale: "es-CL", flag: "🇨🇱", countries: ["Chile"] },
  { code: "COP", name: "Colombian Peso", symbol: "$", decimals: 2, locale: "es-CO", flag: "🇨🇴", countries: ["Colombia"] },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", decimals: 2, locale: "es-PE", flag: "🇵🇪", countries: ["Peru"] },
  { code: "UYU", name: "Uruguayan Peso", symbol: "$U", decimals: 2, locale: "es-UY", flag: "🇺🇾", countries: ["Uruguay"] },
];

/** Default currency — deliberately global/neutral (USD), not tied to any dev location. */
export const DEFAULT_CURRENCY = "USD";

/** Currencies surfaced in the "Popular" section of the selector. */
export const POPULAR_CURRENCIES = CURRENCIES.filter((c) => c.popular).map((c) => c.code);

/** Safe fallback if an unknown code is requested. */
const FALLBACK_CURRENCY: CurrencyInfo = {
  code: DEFAULT_CURRENCY,
  name: "US Dollar",
  symbol: "$",
  decimals: 2,
  locale: "en-US",
  flag: "🇺🇸",
};

const BY_CODE = new Map(CURRENCIES.map((c) => [c.code, c]));

/** Returns currency info for an ISO code (case-insensitive), or a safe USD fallback. */
export function getCurrency(code: string): CurrencyInfo {
  return BY_CODE.get(code?.toUpperCase()) ?? FALLBACK_CURRENCY;
}

/** Returns the number of decimal places for a currency code. */
export function getCurrencyDecimals(code: string): number {
  return getCurrency(code).decimals;
}

/** Search-friendly: matches currency by code, name or symbol. */
export function searchCurrencies(query: string): CurrencyInfo[] {
  const q = query.trim().toLowerCase();
  if (!q) return CURRENCIES;
  return CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q) ||
      (c.flag ?? "").toLowerCase().includes(q)
  );
}
