import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { memo, useCallback } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField, important } from "../../utils";

export type CheckboxBooleanEdtProps = {
    onClick(value: boolean): void;
    id?: string;
    label?: string;
    checked?: boolean;
    value?: any;
    disabled?: boolean;
    className?: string;
    handleChange(response: { [name: string]: string }, value: any): void;
    response: { [name: string]: string };
};

const CheckboxBooleanEdt = memo((props: CheckboxBooleanEdtProps) => {
    const { id, label, disabled, className, value, handleChange, response } = props;
    const { classes, cx } = useStyles();
    const [localValue, setLocalValue] = React.useState(value);

    const handleOptions = useCallback((_event: React.MouseEvent<HTMLElement>, value: any) => {
        setLocalValue(value);
        handleChange(response, value);
    }, []);

    return (
        <>
            <Box className={classes.labelSpacer}>
                <label>{label}</label>
            </Box>
            <ToggleButtonGroup
                orientation="horizontal"
                value={localValue}
                exclusive
                onChange={handleOptions}
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
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { CheckboxBooleanEdt } })(theme => ({
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
    labelSpacer: {
        margin: "1rem 0rem",
    },
}));

export default createCustomizableLunaticField(CheckboxBooleanEdt, "CheckboxBooleanEdt");
