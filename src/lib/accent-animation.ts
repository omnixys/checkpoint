// -------------------------------------------------------------
// Accent Animation Utility
// Creates a radial pulse using the current theme primary color
// -------------------------------------------------------------
export function triggerAccentPulse(accentColor: string) {
  const pulse = document.createElement("div");

  // Style pulse container
  Object.assign(pulse.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    width: "0px",
    height: "0px",
    borderRadius: "50%",
    pointerEvents: "none",
    background: accentColor,
    opacity: "0.35",
    transform: "translate(-50%, -50%)",
    zIndex: "999999", // always on top
    animation: "accentPulseAnimation 450ms cubic-bezier(.4,0,.2,1)",
  });

  document.body.appendChild(pulse);

  pulse.addEventListener("animationend", () => {
    pulse.remove();
  });
}
