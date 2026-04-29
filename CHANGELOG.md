# 🧾 Changelog

All notable changes in this project will be documented in this file.


## 1.0.0 (2026-04-29)

### ⚠ BREAKING CHANGE

* **Create-event:** - useCreateEventWizard no longer exposes draft state
- all form state must be accessed via CreateEventContext
* **I18n:** All UI labels for guest list and invitation modules are now i18n-driven.
Hardcoded strings were removed and must be provided via translation files.

### CI

* **CI:** add CI Jobs ([](https://github.com/omnixys/checkpoint/commit/39b66f623f5739cc5a181b98c7b50c4790398371))
* **CI:** update doc ([](https://github.com/omnixys/checkpoint/commit/60b3067092eaa6221502fd2466f638c98b68007d))

### Create-event

* **Create-event:** implement multi-step event creation wizard (UI + step architecture) ([](https://github.com/omnixys/checkpoint/commit/fc87cbb8737beef599d3f9453e5a1b60c0cac18e))
* **Create-event:** unify draft state and fix stale update issues ([](https://github.com/omnixys/checkpoint/commit/adb80062bad315a959dc33ff15da2241eec50085))

### Event-settings

* **Event-settings:** add full settings coverage incl. RSVP, approval, seating and schedule ([](https://github.com/omnixys/checkpoint/commit/7cb338ee17e5cebdd2e6e23930b6978f7f0094b3))

### Format

* **Format:** format code + add semver ([](https://github.com/omnixys/checkpoint/commit/ef7087f832c54156502b0130e676830b0bb4a569))

### I18n

* **I18n:** translate guest list and invitation modules ([](https://github.com/omnixys/checkpoint/commit/d758e37f188c67caf95ba967cf1ed375384ad70c))
* **I18n:** complete RSVP flow internationalization (dialogs, pages, errors) ([](https://github.com/omnixys/checkpoint/commit/827d2a26b0148d93f49eb118bbda87fb278353a8))
* **I18n:** translate event creation flow to German (de locale) ([](https://github.com/omnixys/checkpoint/commit/90054d57a5149aa732ead7adb5f801c204e62936))

### Init

* **Init:** release: v1.0.0 – initial production-ready checkpoint platform ([](https://github.com/omnixys/checkpoint/commit/424606258d540dfffabc32f502cabdbb833232b6))

### Invitation-import

* **Invitation-import:** implement CSV/XLSX guest import with preview, mapping & inline editing ([](https://github.com/omnixys/checkpoint/commit/15e2fe4503e6af758e10b2d3c33375e62965cf8a))

### Other

* **Other:** bugFix ([](https://github.com/omnixys/checkpoint/commit/9a1f9baf137ae6cac30027170d1443a3b5b3bbd8))
* **Other:** Initial commit ([](https://github.com/omnixys/checkpoint/commit/94c56fec9b4577d44199f07076956650a38c1ca0))
* **Other:** remove github action ([](https://github.com/omnixys/checkpoint/commit/202a5016119b418fa4faf83007e22ad5586debe8))

### RSVP

* **RSVP:** Implemented the RSVP controls polish ([](https://github.com/omnixys/checkpoint/commit/4e6a77c23d62f2482e7c2becb1a21775185d63be))

### TS

* **TS:** fix TS Errors ([](https://github.com/omnixys/checkpoint/commit/5b873aa0370aaf4600d627c28a91149c04dfb800))

### Upload

* **Upload:** add Event cover + logo upload ([](https://github.com/omnixys/checkpoint/commit/408baf5c4d8c0bb4e60c8fbf90da476da2ab23e5))
