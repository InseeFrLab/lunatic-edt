import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider as MuiProvider } from "@mui/material/styles";
import type { ReactNode } from "react";

const theme = createTheme({
    variables: {
        neutral: "#DCE7F9",
        iconRounding: "#DEE2EB",
        white: "#FFFFFF",
    },
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
            light: "#FCE7D8",
        },
        info: {
            main: "#1f4076",
        },
        warning: {
            main: "#F4E289",
        },
        text: {
            primary: "#1F4076",
            secondary: "#2E384D",
        },
        action: {
            hover: "#5C6F99",
        },
    },
    typography: {},
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
