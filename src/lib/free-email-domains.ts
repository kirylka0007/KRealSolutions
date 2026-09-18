// Consumer/free webmail and disposable-mail providers, rejected on the
// Innovation Lab request form so only work email addresses get through.
export const FREE_EMAIL_DOMAINS = new Set([
  // Google
  "gmail.com",
  "googlemail.com",
  // Yahoo
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.co.in",
  "ymail.com",
  "rocketmail.com",
  // Microsoft
  "outlook.com",
  "hotmail.com",
  "hotmail.co.uk",
  "live.com",
  "msn.com",
  // Apple
  "icloud.com",
  "me.com",
  "mac.com",
  // Other major consumer providers
  "aol.com",
  "protonmail.com",
  "proton.me",
  "gmx.com",
  "gmx.net",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "yandex.ru",
  "qq.com",
  "163.com",
  "126.com",
  "sina.com",
  "inbox.com",
  "fastmail.com",
  "tutanota.com",
  "hushmail.com",
  "web.de",
  "seznam.cz",
  "mail.ru",
  "naver.com",
  "rediffmail.com",
  // Disposable / throwaway
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
]);

export function isFreeEmailDomain(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  return FREE_EMAIL_DOMAINS.has(domain);
}
