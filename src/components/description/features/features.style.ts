// components/event-description/features/features.style.ts

export const featuresSx = {
  root: (theme: any) => ({
    maxWidth: "1100px",
    margin: "0 auto",
    padding: theme.spacing(6, 2),
    display: "grid",
    gap: theme.spacing(3),
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  }),

  card: (theme: any) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
  }),

  icon: {
    fontSize: "34px",
    marginBottom: 8,
  },

  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
};
