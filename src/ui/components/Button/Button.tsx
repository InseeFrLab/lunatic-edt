// Lunatic default Input: https://github.com/InseeFr/Lunatic/blob/v2-master/src/components/button/lunatic-button.js

import { memo } from "react";
import { Button as ButtonMaterial } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export type ButtonProps = {
    id?: string;
    label?: string;
    className?: string;
    disabled?: boolean;
    onClick(): void;
};

const Button = memo((props: any) => {
    const { id, label, disabled, className, onClick } = props;

    const { classes, cx } = useStyles();

    return (
        <ButtonMaterial
            id={id}
            className={cx(classes.MuiButton, className)}
            variant="contained"
            disabled={disabled}
            onClick={onClick}
            disableElevation
        >
            {label}
        </ButtonMaterial>
    );
});

const useStyles = makeStyles({ "name": { Button } })(() => ({
    "MuiButton": {
        textTransform: "none",
    },
}));

export default Button;
