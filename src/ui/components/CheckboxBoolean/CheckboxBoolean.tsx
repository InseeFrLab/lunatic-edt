import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { memo } from "react";
import { makeStyles } from "tss-react/mui";
import { important } from "../../utils";

export type CheckboxBooleanProps = {
    onClick(value: Boolean): void;
    id?: string;
    label?: string;
    checked?: Boolean;
    disabled?: boolean;
    className?: string;
};

const CheckboxBoolean = memo((props: CheckboxBooleanProps) => {
    const { onClick, id, label, checked, disabled, className } = props;
    const { classes, cx } = useStyles();

    const handleClick = (_event: React.MouseEvent<HTMLElement>, value: Boolean) => {
        onClick(value);
    };

    return (
        <ToggleButtonGroup
            orientation="horizontal"
            value={checked}
            exclusive
            onChange={handleClick}
            id={id}
            aria-label={label}
            className={className}
            disabled={disabled}
        >
            <ToggleButton className={classes.MuiToggleButton} value={false} aria-label="no">
                Non
            </ToggleButton>
            <ToggleButton
                className={cx(classes.MuiToggleButton, classes.separator)}
                value={true}
                aria-label="yes"
            >
                Oui
            </ToggleButton>
        </ToggleButtonGroup>
    );
});

const useStyles = makeStyles({ "name": { CheckboxBoolean } })(theme => ({
    "MuiToggleButton": {
        border: important("2px solid white"),
        borderRadius: important("6px"),
        padding: "0.5rem 3rem",
        backgroundColor: "white",
        color: theme.palette.primary.main,
        "&.Mui-selected": {
            borderColor: important(theme.palette.primary.main),
            fontWeight: "bold",
            backgroundColor: "white",
            color: theme.palette.primary.main,
        },
    },
    "separator": {
        marginLeft: important("1rem"),
    },
}));

export default CheckboxBoolean;
