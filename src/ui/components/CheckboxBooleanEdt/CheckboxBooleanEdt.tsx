import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { CheckboxBooleanEdtSpecificProps } from "interface";
import React, { memo, useCallback, useEffect, useState } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField, important } from "../../utils";
import Alert from "../Alert";

export type CheckboxBooleanEdtProps = {
    id?: string;
    label?: string;
    checked?: boolean;
    value?: any;
    disabled?: boolean;
    className?: string;
    handleChange(response: { [name: string]: string }, value: any): void;
    response: { [name: string]: string };
    componentSpecificProps: CheckboxBooleanEdtSpecificProps;
};

const CheckboxBooleanEdt = memo((props: CheckboxBooleanEdtProps) => {
    const { id, label, disabled, className, value, handleChange, response, componentSpecificProps } =
        props;
    const { classes, cx } = useStyles();

    const {
        backClickEvent,
        nextClickEvent,
        backClickCallback,
        nextClickCallback,
        labels,
        errorIcon,
        onSelectValue,
    } = {
        ...componentSpecificProps,
    };

    const [localValue, setLocalValue] = React.useState(value);
    const [displayAlert, setDisplayAlert] = useState<boolean>(false);

    useEffect(() => {
        if (backClickEvent && backClickCallback) {
            backClickCallback();
        }
    }, [backClickEvent]);

    useEffect(() => {
        if (nextClickEvent && nextClickCallback) {
            next(false, setDisplayAlert, nextClickCallback);
        }
    }, [nextClickEvent]);

    const handleOptions = useCallback((_event: React.MouseEvent<HTMLElement>, value: any) => {
        setLocalValue(value);
        handleChange(response, value);
        if (onSelectValue && value != null) {
            onSelectValue();
        }
    }, []);

    const next = (
        continueWithUncompleted: boolean,
        setDisplayAlert: (display: boolean) => void,
        nextClickCallback: () => void,
    ) => {
        if (localValue == null && !continueWithUncompleted) {
            handleChange(response, null);
            setDisplayAlert(true);
        } else {
            nextClickCallback();
        }
    };

    const handleAlert = useCallback(() => {
        if (nextClickCallback) next(true, setDisplayAlert, nextClickCallback);
    }, [displayAlert]);

    return (
        <>
            {labels && (
                <Alert
                    isAlertDisplayed={displayAlert}
                    onCompleteCallBack={() => setDisplayAlert(false)}
                    onCancelCallBack={handleAlert}
                    labels={{
                        content: labels.alertMessage || "",
                        cancel: labels.alertIgnore || "",
                        complete: labels.alertComplete || "",
                    }}
                    icon={errorIcon || ""}
                    errorIconAlt={labels.alertAlticon || ""}
                ></Alert>
            )}
            <Box>
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
            </Box>
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
