// Lunatic default Input: https://github.com/InseeFr/Lunatic/blob/v2-master/src/components/button/lunatic-button.js

import { memo } from "react";
import { Button as ButtonMaterial } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export type ButtonProps = {
    id?: string;
    label?: string;
    className?: string;
};

const Button = memo((props: any) => {
    console.log("Button");
    console.log(props);
    const { id, label, className } = props;

    const { classes, cx } = useStyles();

    return (
        <ButtonMaterial id={id} className={cx(classes.MuiButton, className)}>
            {label}
        </ButtonMaterial>
    );
});

const useStyles = makeStyles({ "name": { Button } })(() => ({
    "MuiButton": {
        textDecoration: "none",
    },
}));

export default Button;
