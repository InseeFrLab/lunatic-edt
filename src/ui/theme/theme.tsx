import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider as MuiProvider } from "@mui/material/styles";
import type { ReactNode } from "react";
import { EdtThemeOptions } from "./edt-theme";
import { EdtTheme } from "./make-style-edt";

const theme = createTheme({
    variables: {
        neutral: "#DCE7F9",
        iconRounding: "#DEE2EB",
        white: "#FFFFFF",
        modal: "#F3F2F8",
        alertActivity: "#B6462C",
    },
    palette: {
        primary: {
            main: "#4973D2",
            light: "#2C70DE",
        },
        secondary: {
            main: "#1F4076",
        },
        background: {
            default: "#F2F1F7",
            paper: "#E4E5EF",
        },
        error: {
            main: "#D8765F",
            light: "#FCE7D8",
        },
        success: {
            main: "#C1EDC3",
        },
        info: {
            main: "#1F4076",
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
} as EdtThemeOptions) as EdtTheme;

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
