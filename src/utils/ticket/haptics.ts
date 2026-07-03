import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

export async function hapticRotate() {
  if (!Capacitor.isNativePlatform()) {
    return;
  }
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    // Haptics are best-effort and should never block the ticket flow.
  }
}

/**
 * One-shot warning haptic (used for critical phase entry)
 */
export async function hapticCritical() {
  if (!Capacitor.isNativePlatform()) {
    return;
  }
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Haptics are best-effort and should never block the ticket flow.
  }
}
