import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface CustomTheme {
        variables: {
            neutral: string;
        };
    }

    interface Theme extends CustomTheme {}
    interface ThemeOptions extends CustomTheme {}
}
