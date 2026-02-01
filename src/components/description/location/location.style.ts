export const locationSx = {
  root: (theme: any) => ({
    maxWidth: "1100px",
    margin: "0 auto",
    padding: theme.spacing(6, 2),
    display: "grid",
    gap: theme.spacing(3),
    gridTemplateColumns: "1fr 1fr",
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "1fr",
    },
  }),

  imgBox: (theme: any) => ({
    borderRadius: theme.shape.borderRadius * 2,
    overflow: "hidden",
    height: "100%",
  }),

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  } as const,

  right: (theme: any) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    justifyContent: "center",
  }),

  map: {
    width: "100%",
    height: "260px",
    border: 0,
    borderRadius: "12px",
  },

  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
};
