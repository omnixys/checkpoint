export const teamSx = {
  root: (theme: any) => ({
    maxWidth: "1100px",
    margin: "0 auto",
    padding: theme.spacing(6, 2),
    display: "grid",
    gap: theme.spacing(3),
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  }),

  card: (theme: any) => ({
    textAlign: "center",
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
  }),

  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "14px",
  } as const,

  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
};
