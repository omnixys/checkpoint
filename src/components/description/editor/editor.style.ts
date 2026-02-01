export const editorSx = {
  root: (theme: any, open: boolean) => ({
    position: "fixed",
    top: 0,
    right: 0,
    width: "380px",
    height: "100vh",
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
    zIndex: 2000,
    padding: theme.spacing(3),
    transform: open ? "translateX(0)" : "translateX(100%)",
    transition: "transform 0.32s cubic-bezier(0.25, 0.1, 0.25, 1)",
    overflowY: "auto",
  }),

  title: {
    marginBottom: "12px",
    fontWeight: 600,
  },

  field: (theme: any) => ({
    marginBottom: theme.spacing(2),
  }),

  footer: (theme: any) => ({
    marginTop: theme.spacing(4),
    display: "flex",
    justifyContent: "space-between",
  }),
};
