import { LookupRecord } from "@/data/records";

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return "***";

  if (localPart.length === 1) {
    return `*@${domain}`;
  }
  if (localPart.length === 2) {
    return `${localPart[0]}*@${domain}`;
  }

  const firstChar = localPart[0];
  const lastChar = localPart[localPart.length - 1];
  const maskedMiddle = "*".repeat(localPart.length - 2);

  return `${firstChar}${maskedMiddle}${lastChar}@${domain}`;
}

export function maskPhone(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length <= 4) {
    return "*".repeat(digitsOnly.length);
  }

  const visibleLastFour = digitsOnly.slice(-4);
  const maskedPrefix = "*".repeat(digitsOnly.length - 4);
  return `${maskedPrefix}${visibleLastFour}`;
}

export function toPublicLookupResponse(record: LookupRecord) {
  // Explicitly return only safe fields—never spread the raw record
  return {
    code: record.code,
    status: record.status,
    maskedEmail: maskEmail(record.email),
    maskedPhone: maskPhone(record.phone),
  };
}