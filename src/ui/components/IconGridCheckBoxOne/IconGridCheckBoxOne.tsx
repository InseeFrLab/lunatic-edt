import { Box } from "@mui/system";
import { CheckboxOneCustomOption } from "interface/CheckboxOptions";
import { memo, useEffect, useState, useCallback } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";
import { v4 as uuidv4 } from "uuid";
import { Typography } from "@mui/material";
import { IconGridCheckBoxOneSpecificProps } from "interface";
import Alert from "../Alert";

type IconGridCheckBoxOneProps = {
    handleChange(response: { [name: string]: string }, value: string): void;
    componentSpecificProps: IconGridCheckBoxOneSpecificProps;
    response: { [name: string]: string };
    label: string;
    options: CheckboxOneCustomOption[];
    value: string;
};

const IconGridCheckBoxOne = memo((props: IconGridCheckBoxOneProps) => {
    const { handleChange, componentSpecificProps, response, label, options, value } = props;
    const {
        optionsIcons,
        backClickEvent,
        nextClickEvent,
        backClickCallback,
        nextClickCallback,
        labels,
        errorIcon,
    } = { ...componentSpecificProps };

    const [selectedValue, setSelectedValue] = useState<string>(value);
    const [displayAlert, setDisplayAlert] = useState<boolean>(false);

    const { classes, cx } = useStyles();

    useEffect(() => {
        if (backClickEvent && backClickCallback) {
            backClickCallback();
        }
    }, [backClickEvent]);

    useEffect(() => {
        if (nextClickEvent) {
            next(false);
        }
    }, [nextClickEvent]);

    const next = (continueWithUncompleted: boolean) => {
        if (nextClickCallback) {
            if ((selectedValue === null || selectedValue === "") && !continueWithUncompleted) {
                handleChange(response, "");
                setDisplayAlert(true);
            } else {
                nextClickCallback();
            }
        }
    };

    const optionOnClick = (option: CheckboxOneCustomOption) => {
        setSelectedValue(option.value);
        handleChange(response, option.value);
    };

    const handleAlert = useCallback(() => next(true), []);

    const renderOption = (option: CheckboxOneCustomOption) => {
        return (
            <Box
                className={
                    selectedValue === option.value
                        ? cx(classes.option, classes.selectedOption)
                        : classes.option
                }
                key={uuidv4()}
                onClick={useCallback(() => optionOnClick(option), [])}
            >
                {optionsIcons && <img className={classes.icon} src={optionsIcons[option.value]} />}
                <Typography className={classes.optionLabel}>{option.label}</Typography>
            </Box>
        );
    };

    return (
        <>
            {componentSpecificProps && labels && optionsIcons && (
                <>
                    <Alert
                        isAlertDisplayed={displayAlert}
                        onCompleteCallBack={() => setDisplayAlert(false)}
                        onCancelCallBack={handleAlert}
                        labels={{
                            content: labels.alertMessage,
                            cancel: labels.alertIgnore,
                            complete: labels.alertComplete,
                        }}
                        icon={errorIcon}
                        errorIconAlt={labels.alertAlticon}
                    ></Alert>
                    <Box className={classes.root}>
                        <Typography className={classes.title}>{label}</Typography>
                    </Box>

                    <Box className={classes.optionsBox}>
                        {options.map(o => {
                            return renderOption(o);
                        })}
                    </Box>
                </>
            )}
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { IconGridCheckBoxOne } })(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    title: {
        color: theme.palette.info.main,
        fontSize: "20px",
        textAlign: "center",
        marginTop: "2rem",
        marginBottom: "2rem",
    },
    optionsBox: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        cursor: "pointer",
    },
    option: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.variables.white,
        width: "45.5%",
        marginTop: "4%",
        borderRadius: "15px",
    },
    selectedOption: {
        border: "2px solid",
        borderColor: theme.palette.primary.main,
    },
    optionLabel: {
        fontSize: "14px",
        textAlign: "center",
        color: theme.palette.text.secondary,
        fontWeight: "bold",
        marginTop: "1rem",
        marginRight: "0.5rem",
        marginBottom: "0.5rem",
        marginLeft: "0.5rem",
    },
    icon: {
        width: "80px",
        height: "45px",
        marginTop: "1rem",
    },
}));

export default createCustomizableLunaticField(IconGridCheckBoxOne, "IconGridCheckBoxOne");
