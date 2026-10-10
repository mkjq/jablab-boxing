/**
 * Validates and normalizes Jordanian phone numbers into international format: +9627XXXXXXXX
 * Supported networks:
 * - Zain (079)
 * - Orange (077)
 * - Umniah (078)
 */
export function validateAndFormatJordanianPhone(input: string): {
  isValid: boolean;
  phone: string;
  error?: string;
} {
  if (!input || typeof input !== "string" || !input.trim()) {
    return {
      isValid: false,
      phone: "",
      error: "يرجى إدخال رقم الهاتف",
    };
  }

  // 1. Convert Arabic/Eastern numbers (٠١٢٣٤٥٦٧٨٩) to standard ASCII digits
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let cleaned = input.trim();
  for (let i = 0; i < 10; i++) {
    cleaned = cleaned.replaceAll(arabicDigits[i], i.toString());
  }

  // 2. Remove all non-digit characters except leading '+' if present
  let hasPlus = cleaned.startsWith("+");
  let digitsOnly = cleaned.replace(/\D/g, "");

  if (!digitsOnly) {
    return {
      isValid: false,
      phone: "",
      error: "رقم الهاتف يجب أن يحتوي على أرقام فقط",
    };
  }

  // 3. Strip international prefixes: 00962 or 962
  if (digitsOnly.startsWith("00962")) {
    digitsOnly = digitsOnly.substring(5);
  } else if (digitsOnly.startsWith("962")) {
    digitsOnly = digitsOnly.substring(3);
  }

  // 4. Strip local leading 0 (e.g. 079... -> 79...)
  if (digitsOnly.startsWith("0")) {
    digitsOnly = digitsOnly.substring(1);
  }

  // 5. Must start with 77, 78, or 79 and be exactly 9 digits
  const jordanMobileRegex = /^7[789]\d{7}$/;

  if (!jordanMobileRegex.test(digitsOnly)) {
    return {
      isValid: false,
      phone: "",
      error: "رقم الهاتف يجب أن يكون رقماً أردنياً صحيحاً يبدأ بـ 079 أو 078 أو 077 ويتكون من 10 أرقام (مثال: 0791234567)",
    };
  }

  // 6. Return normalized international format
  return {
    isValid: true,
    phone: `+962${digitsOnly}`,
  };
}
