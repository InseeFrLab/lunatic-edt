import { Box, Checkbox, Paper, Typography } from "@mui/material";
import { CheckboxGroupSpecificProps } from "interface";
import { CheckboxOption } from "interface/CheckboxOptions";
import { memo, useCallback, useEffect, useState } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";
import Alert from "../Alert";

export type CheckboxGroupEdtProps = {
    label?: string;
    tipsLabel: string;
    handleChange(response: { [name: string]: string }, value: boolean): void;
    id?: string;
    responses: CheckboxOption[];
    value: { [key: string]: boolean };
    componentSpecificProps?: CheckboxGroupSpecificProps;
};

const CheckboxGroupEdt = memo((props: CheckboxGroupEdtProps) => {
    const { id, value, responses, handleChange, componentSpecificProps, label, tipsLabel } = props;
    const { classes } = useStyles();

    const { backClickEvent, nextClickEvent, backClickCallback, nextClickCallback, labels, errorIcon } = {
        ...componentSpecificProps,
    };

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

    const handleOptions = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        value[event.target.value] = !value[event.target.value];
        handleChange({ name: event.target.value }, value[event.target.value]);
    }, []);

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
                        <label>{label}</label>
                    </>
                )}
                {tipsLabel && (
                    <>
                        <Box className={classes.labelSpacer}></Box>
                        <Typography className={classes.tipsLabel}>{tipsLabel}</Typography>
                    </>
                )}
                {responses.map(option => (
                    <Paper className={classes.root} elevation={0} key={"paper-" + option.id}>
                        <div style={{ display: "flex" }}>
                            {componentSpecificProps &&
                                componentSpecificProps.optionsIcons &&
                                componentSpecificProps.optionsIcons[option.id] && (
                                    <Box className={classes.iconBox}>
                                        <img
                                            className={classes.icon}
                                            src={componentSpecificProps.optionsIcons[option.id]}
                                        />
                                    </Box>
                                )}
                            <Typography color="textSecondary">{option.label}</Typography>
                        </div>

                        <Checkbox
                            key={option.id}
                            checked={value[option.response.name] ?? false}
                            value={option.response.name}
                            onChange={handleOptions}
                            className={classes.MuiCheckbox}
                        />
                    </Paper>
                ))}
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
}));

export default createCustomizableLunaticField(CheckboxGroupEdt, "CheckboxGroupEdt");
