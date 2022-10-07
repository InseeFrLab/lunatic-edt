import type { ReactNode } from "react";
import { ThemeProvider as MuiProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import MarianneRegularWoff2 from "../assets/fonts";

const theme = createTheme({
    variables: {
        neutral: "#DCE7F9",
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
        },
        info: {
            main: "#1f4076",
        },
        warning: {
            main: "#F4E289",
        },
        text: {
            primary: "#1F4076",
        },
        action: {
            hover: "#5C6F99",
        },
    },
    typography: {
        fontFamily: "Marianne, sans-serif",
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
            @font-face {
              font-family: 'Marianne';
              font-style: normal;
              font-display: swap;
              font-weight: 400;
              src: local('Marianne'), local('Marianne-Regular'), url(${MarianneRegularWoff2}) format('woff2');
              unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
            }
          `,
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
