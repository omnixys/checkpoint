/**
 * Fixes iOS Deployment Target for a Capacitor SPM project.
 *
 * - NO CocoaPods
 * - NO Podfile
 * - Only patches Xcode project.pbxproj
 *
 * Compatible with:
 * - Capacitor 6+
 * - Swift Package Manager
 * - Xcode 15+
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const IOS_DIR = "ios";
const PBXPROJ = join(IOS_DIR, "App", "App.xcodeproj", "project.pbxproj");

const TARGET = "15.5";

function patchPbxproj() {
  if (!existsSync(PBXPROJ)) {
    console.warn(`⚠️  Xcode project not found: ${PBXPROJ}`);
    return;
  }

  const content = readFileSync(PBXPROJ, "utf8");

  const next = content.replace(
    /IPHONEOS_DEPLOYMENT_TARGET\s*=\s*[\d.]+;/g,
    `IPHONEOS_DEPLOYMENT_TARGET = ${TARGET};`
  );

  if (next !== content) {
    writeFileSync(PBXPROJ, next, "utf8");
    console.log(`✅ iOS Deployment Target set to ${TARGET}`);
  } else {
    console.log("ℹ️  Deployment target already correct.");
  }
}

function main() {
  if (!existsSync(IOS_DIR)) {
    console.warn("⚠️  iOS directory not found, skipping iOS fix.");
    return;
  }

  console.log("🔧 Applying iOS SPM deployment target fix…");
  patchPbxproj();

  console.log("✅ iOS fix finished (SPM mode, no CocoaPods).");
}

main();
