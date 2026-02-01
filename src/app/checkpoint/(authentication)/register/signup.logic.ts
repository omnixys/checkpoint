import {
  SignUpStep1,
  SignUpStep2Item,
  SignUpStep3,
} from "@/types/authentication/auth.type";

// Validate Email
export function validateEmail(email: string): boolean {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
}

// Validate Username
export function validateUsername(username: string): boolean {
  const pattern = /^[a-zA-Z0-9._-]{3,20}$/;
  return pattern.test(username);
}

// Validate Password Strength
export function validatePasswordStrength(password: string): string | null {
  if (password.length < 8)
    return "Passwort muss mindestens 8 Zeichen lang sein.";

  if (!/[A-Z]/.test(password))
    return "Passwort benötigt mindestens einen Großbuchstaben.";

  if (!/[a-z]/.test(password))
    return "Passwort benötigt mindestens einen Kleinbuchstaben.";

  if (!/[0-9]/.test(password)) return "Passwort benötigt mindestens eine Zahl.";

  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
    return "Passwort benötigt mindestens ein Sonderzeichen.";

  return null;
}

// Validate Step 1
export function validateStep1(data: SignUpStep1): string | null {
  if (!data.firstName.trim()) return "Vorname darf nicht leer sein.";
  if (!data.lastName.trim()) return "Nachname darf nicht leer sein.";

  if (!validateUsername(data.username))
    return "Username muss zwischen 3 und 20 Zeichen sein und darf nur Buchstaben, Zahlen, Punkt, Unterstrich oder Bindestrich enthalten.";

  if (!validateEmail(data.email))
    return "Bitte eine gültige E-Mail-Adresse eingeben.";

  return null;
}

// Validate step 2: optional phones
export function validatePhones(phones: SignUpStep2Item[]): string | null {
  if (phones.length === 0) return null; // optional

  const primaryCount = phones.filter((p) => p.isPrimary).length;

  if (primaryCount === 0)
    return "Mindestens eine Telefonnummer muss als primär markiert sein.";

  for (const phone of phones) {
    if (!phone.number || phone.number.trim().length < 5)
      return "Telefonnummern müssen gültig sein.";
  }

  return null;
}

// Validate Step 3
export function validateStep3(data: SignUpStep3): string | null {
  if (!data.password || !data.passwordConfirm)
    return "Bitte beide Passwortfelder ausfüllen.";

  const strength = validatePasswordStrength(data.password);
  if (strength) return strength;

  if (data.password !== data.passwordConfirm)
    return "Passwörter stimmen nicht überein.";

  return null;
}
