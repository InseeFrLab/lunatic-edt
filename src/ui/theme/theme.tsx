import type { ReactNode } from "react";
import { ThemeProvider as MuiProvider, createTheme } from "@mui/material/styles";

const primary = "#fc03a1";

const theme = createTheme({
    palette: {
        primary: { main: primary },
    },
});

const ThemeProvider = (props: { children: ReactNode }) => {
    const { children } = props;
    return <MuiProvider theme={theme}>{children}</MuiProvider>;
};

export { ThemeProvider };
