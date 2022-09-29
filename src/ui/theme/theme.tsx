import type { ReactNode } from "react";
import { ThemeProvider as MuiProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#4973d2",
        },
        secondary: {
            main: "#f50057",
        },
        background: {
            default: "#f2f1f7",
        },
        error: {
            main: "#d8765f",
        },
        info: {
            main: "#1f4076",
        },
        text: {
            primary: "#1F4076",
        },
    },
});

const ThemeProvider = (props: { children: ReactNode }) => {
    const { children } = props;
    return (
        <MuiProvider theme={theme}>
            <CssBaseline enableColorScheme />
            {children}
        </MuiProvider>
    );
};

export { ThemeProvider, theme };
