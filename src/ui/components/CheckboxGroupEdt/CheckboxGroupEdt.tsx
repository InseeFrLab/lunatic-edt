import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { CheckboxGroupSpecificProps } from "interface";
import { CheckboxOption } from "interface/CheckboxOptions";
import { memo, useCallback, useEffect, useState } from "react";
import { makeStylesEdt } from "../../theme";
import { important } from "../../utils";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";
import Alert from "../Alert";

export type CheckboxGroupEdtProps = {
    label?: string;
    tipsLabel: string;
    handleChange(response: { [name: string]: string }, value: boolean): void;
    id?: string;
    responses: CheckboxOption[];
    value: { [key: string]: boolean };
    className?: string;
    componentSpecificProps?: CheckboxGroupSpecificProps;
};

const CheckboxGroupEdt = memo((props: CheckboxGroupEdtProps) => {
    const { id, value, responses, handleChange, componentSpecificProps, label, tipsLabel, className } =
        props;
    const { classes, cx } = useStyles();

    const {
        backClickEvent,
        nextClickEvent,
        backClickCallback,
        nextClickCallback,
        labels,
        errorIcon,
        helpStep,
    } = {
        ...componentSpecificProps,
    };

    const [displayAlert, setDisplayAlert] = useState<boolean>(false);
    const [optionsSelected, setOptionsSelected] = useState<string[]>([]);

    useEffect(() => {
        const options = [];
        for (const key in value) {
            if (value[key]) {
                options.push(key);
            }
        }
        setOptionsSelected(options);
    }, []);

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

    const next = (
        continueWithUncompleted: boolean,
        setDisplayAlert: (display: boolean) => void,
        nextClickCallback: () => void,
    ) => {
        const res = responses.filter(res => value[res.response.name] != null);
        if (res.length == 0 && !continueWithUncompleted) {
            setDisplayAlert(true);
        } else {
            nextClickCallback();
        }
    };

    const handleAlert = useCallback(() => {
        if (nextClickCallback) next(true, setDisplayAlert, nextClickCallback);
    }, [displayAlert]);

    const handleOptions = (_event: React.MouseEvent<HTMLElement>, selectValue: string[]) => {
        setOptionsSelected(selectValue);
        for (const key in value) {
            handleChange({ name: key }, selectValue.find(value => value == key) != null);
        }
    };

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
            <div id={id}>
                {label && (
                    <>
                        <Box className={classes.labelSpacer}></Box>
                        <h1 className={classes.h1}>{label}&nbsp;?</h1>
                    </>
                )}
                {tipsLabel && (
                    <>
                        <Box className={classes.labelSpacer}></Box>
                        <Typography className={classes.tipsLabel}>{tipsLabel}</Typography>
                    </>
                )}

                <ToggleButtonGroup
                    orientation="vertical"
                    value={optionsSelected}
                    onChange={handleOptions}
                    id={id}
                    aria-label={label}
                    className={cx(className, classes.toggleButtonGroup)}
                >
                    {responses.map((option, index) => (
                        <ToggleButton
                            className={cx(
                                classes.toggleButton,
                                helpStep == 1 && index in [2, 3, 4]
                                    ? classes.toggleButtonContentHelp
                                    : "",
                            )}
                            key={option.response.name + "-" + index}
                            value={option.response.name}
                            tabIndex={index + 1}
                            id={"checkboxgroup-" + index}
                        >
                            <Box className={classes.toggleButtonContent}>
                                {componentSpecificProps &&
                                    componentSpecificProps.optionsIcons &&
                                    componentSpecificProps.optionsIcons[option.id].icon && (
                                        <Box className={classes.iconBox}>
                                            <img
                                                className={classes.icon}
                                                src={componentSpecificProps.optionsIcons[option.id].icon}
                                                alt={
                                                    componentSpecificProps.optionsIcons[option.id]
                                                        .altIcon
                                                }
                                            />
                                        </Box>
                                    )}
                                <Typography color="textSecondary">{option.label}</Typography>
                            </Box>
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </div>
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { CheckboxGroupEdt } })(theme => ({
    root: {
        maxWidth: "100%",
        margin: "1rem 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "0.5rem",
        backgroundColor: theme.variables.white,
        padding: "0.5rem 0rem 0.25rem 1rem",
    },
    MuiCheckbox: {
        color: theme.variables.neutral,
    },
    labelSpacer: {
        height: "1rem",
    },
    tipsLabel: {
        color: theme.palette.text.secondary,
    },
    iconBox: {
        display: "flex",
        alignItems: "center",
        marginRight: "1rem",
    },
    icon: {
        width: "25px",
        height: "25px",
    },
    toggleButtonGroup: {
        marginTop: "1rem",
    },
    toggleButton: {
        marginBottom: "1rem",
        border: important("2px solid #FFFFFF"),
        borderRadius: important("6px"),
        backgroundColor: "#FFFFFF",
        color: theme.palette.secondary.main,
        justifyContent: "flex-start",
        textAlign: "left",
        fontWeight: "bold",
        "&.Mui-selected": {
            borderColor: important(theme.palette.primary.main),
            backgroundColor: "#FFFFFF",
        },
    },
    toggleButtonContent: {
        display: "flex",
    },
    toggleButtonContentHelp: {
        zIndex: "1400",
        pointerEvents: "none",
    },
    h1: {
        fontSize: "18px",
        margin: 0,
        lineHeight: "1.5rem",
        fontWeight: "bold",
    },
}));

export default createCustomizableLunaticField(CheckboxGroupEdt, "CheckboxGroupEdt");
