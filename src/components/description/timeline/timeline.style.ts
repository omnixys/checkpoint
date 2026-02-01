export const timelineSx = {
  root: (theme: any) => ({
    maxWidth: "700px",
    margin: "0 auto",
    padding: theme.spacing(6, 2),
    position: "relative",
  }),

  line: (theme: any) => ({
    position: "absolute",
    left: "12px",
    top: 0,
    bottom: 0,
    width: "4px",
    backgroundColor: theme.palette.primary.main,
    opacity: 0.2,
    borderRadius: "8px",
  }),

  step: (theme: any) => ({
    position: "relative",
    marginLeft: "40px",
    marginBottom: theme.spacing(5),
  }),

  dot: (theme: any) => ({
    position: "absolute",
    left: "-32px",
    top: "4px",
    width: "16px",
    height: "16px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "50%",
  }),

  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
};
