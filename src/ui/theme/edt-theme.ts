import { Theme, ThemeOptions } from "@mui/material";

export interface EdtTheme extends Theme {
    variables: {
        neutral: string;
        iconRounding: string;
        white: string;
        modal: string;
    };
}

export interface EdtThemeOptions extends ThemeOptions {
    variables: {
        neutral: string;
        iconRounding: string;
        white: string;
        modal: string;
    };
}
