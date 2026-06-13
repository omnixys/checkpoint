# Wedding RSVP Theme Bridge

## Checkpoint Theme Architecture

Checkpoint builds its MUI theme in `src/themes/createAppTheme.ts`. A theme is the
combination of:

- a MUI light or dark `PaletteMode`;
- an `OmnixysColorScheme`;
- the matching palette in `src/themes/colors/omnixysPresets.ts`;
- derived extended surfaces and borders;
- derived visual tokens used by the startup shader, orb and accent effects;
- shared MUI component overrides.

`ThemeModeProvider` owns the active mode and color scheme. Normal user choices
are persisted in:

- `omnixys.theme.mode`;
- `omnixys.theme.scheme`.

The ColorBubble changes the scheme, while the mode toggle changes light or dark
mode independently. The language switcher persists the `locale` cookie and
refreshes the active route. Checkpoint currently exposes German and English in
the switcher.

`ThemeRegistry` creates the Emotion cache and provides the same generated MUI
theme to the application. The global provider tree keeps theme, language,
Apollo and existing RSVP business behavior available on the public RSVP route.

## Wedding Gold Profile

`wedding` is now a first-class Checkpoint color scheme with:

- dark cinematic backgrounds `#050506` and `#0D0C0C`;
- gold accent `#D8B879`;
- warm ivory typography;
- a complementary light ivory profile;
- gold visual tokens for the existing startup and accent systems;
- Playfair Display headings and Lato body typography.

The wedding website appends `theme=wedding` to the Checkpoint RSVP URL and sets
a short-lived shared-domain cookie before navigation. Checkpoint reads that
cookie in the root layout so the first server-rendered frame already uses the
Wedding Gold profile.

`ThemeModeProvider` consumes the bridge only once, persists Wedding Gold through
the existing local-storage model, clears the bridge cookie and removes the
query parameter. After that handoff, users can freely change mode or ColorBubble
without the wedding profile being forced again.

## RSVP Presentation

The public RSVP now uses a cinematic MUI-first composition:

1. editorial RSVP hero and wedding monogram;
2. accessible participation selection cards;
3. guest information chapter;
4. phone-number chapter;
5. companion chapter;
6. cinematic confirmation area;
7. quiet success scene.

The existing GraphQL mutation, event-selection hook, phone-number hooks,
companion hooks and validation behavior are unchanged.

## Accessibility And Performance

- Participation cards retain native checkbox semantics and visible focus states.
- Form fields use autocomplete metadata and existing labels.
- Accordions, dialogs and buttons remain MUI controls with keyboard support.
- Framer Motion entrances honor `prefers-reduced-motion`.
- The global startup experience is skipped when reduced motion is requested.
- Next Font self-hosts the wedding typography and avoids runtime font requests.
- The former RSVP confetti effect was removed to reduce motion and runtime work.
- No additional styling system or animation library was introduced.

## Known Architectural Note

Checkpoint currently applies a generated MUI theme in both `ThemeModeProvider`
and `ThemeRegistry`. This predates the wedding bridge and remains unchanged to
avoid a broad provider refactor during the presentation redesign.
