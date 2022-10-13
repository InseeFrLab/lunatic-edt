import "@mui/material/styles";

declare module "@mui/material/styles" {
    //interface redundant to not disable eslint no-empty-interface
    interface CustomTheme {
        variables: {
            neutral: string;
            iconRounding: string;
            white: string;
        };
    }
    interface Theme {
        variables: {
            neutral: string;
            iconRounding: string;
            white: string;
        };
    }
    interface ThemeOptions {
        variables: {
            neutral: string;
            iconRounding: string;
            white: string;
        };
    }
}
