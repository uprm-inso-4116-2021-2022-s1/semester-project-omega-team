import React from "react";
import { makeStyles } from "@mui/styles";
import { AppBar, Toolbar } from "@mui/material";
import Typography from "@mui/material/Typography";
import DropMenu from "./DropMenu";

const useStyles = makeStyles((theme) => ({
  rightBar: {
    marginLeft: "auto",
  },
  dot: {
    color: "#cc66ff",
  },
}));
export default function Header() {
  const classes = useStyles();
  return (
    <div>
      <AppBar className={classes.appbar} color="transparent" elevation={0}>
        <Toolbar
          className={classes.barWrapper}
          sx={{
            width: "90%",
            margin: "0 auto",
          }}
        >
          <Typography
            className={classes.barTitle}
            variant="h5"
            fontFamily="Trebuchet MS"
          >
            spot<span className={classes.dot}>.</span>
          </Typography>
          <section className={classes.rightBar}>
            <DropMenu />
          </section>
        </Toolbar>
      </AppBar>
    </div>
  );
}
