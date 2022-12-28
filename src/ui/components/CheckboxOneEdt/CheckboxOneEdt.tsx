import { Extension } from "@mui/icons-material";
import { Box, Button, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { CheckboxOneSpecificProps } from "interface";
import { CheckboxOneCustomOption } from "interface/CheckboxOptions";
import React, { memo, useCallback, useEffect } from "react";
import { makeStylesEdt } from "../../theme";
import { important } from "../../utils";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";

export type CheckboxOneProps = {
    handleChange(response: { [name: string]: string }, value: string): void;
    id?: string;
    label?: string;
    options: CheckboxOneCustomOption[];
    value: string | null;
    response: { [name: string]: string };
    className?: string;
    componentSpecificProps: CheckboxOneSpecificProps;
};

const CheckboxOneEdt = memo((props: CheckboxOneProps) => {
    const { id, value, label, options, className, handleChange, response, componentSpecificProps } =
        props;
    const { backClickEvent, nextClickEvent, backClickCallback, nextClickCallback } = {
        ...componentSpecificProps,
    };
    const { classes, cx } = useStyles();
    const [currentOption, setCurrentOption] = React.useState<string | undefined>(value ?? undefined);
    const [isSubchildDisplayed, setIsSubchildDisplayed] = React.useState<boolean>(false);
    const [newOptionValue, setNewOptionValue] = React.useState<string | undefined>(undefined);

    useEffect(() => {
        if (isSubchildDisplayed) {
            setIsSubchildDisplayed(false);
        } else if (backClickEvent && backClickCallback) {
            backClickCallback();
        }
    }, [backClickEvent]);

    useEffect(() => {
        if (nextClickEvent && nextClickCallback) {
            nextClickCallback();
        }
    }, [nextClickEvent]);

    const handleOptions = useCallback(
        (_event: React.MouseEvent<HTMLElement>, selectedOption: string) => {
            setCurrentOption(selectedOption);
            handleChange(response, selectedOption);
        },
        [],
    );

    const onAddNewOption = useCallback(() => {
        setIsSubchildDisplayed(true);
    }, []);

    const newOptionOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewOptionValue(e.target.value);
    };

    return (
        <>
            {!isSubchildDisplayed && (
                <>
                    {label && (
                        <>
                            <Box className={classes.labelSpacer}>
                                <label>{label}</label>
                            </Box>
                        </>
                    )}
                    {options && (
                        <ToggleButtonGroup
                            orientation="vertical"
                            value={currentOption}
                            exclusive
                            onChange={handleOptions}
                            id={id}
                            aria-label={label}
                            className={cx(className, classes.toggleButtonGroup)}
                        >
                            {options?.map((option: CheckboxOneCustomOption, index) => (
                                <ToggleButton
                                    className={
                                        componentSpecificProps?.icon ||
                                        componentSpecificProps?.defaultIcon
                                            ? classes.MuiToggleButtonIcon
                                            : classes.MuiToggleButton
                                    }
                                    key={option.value + "-" + index}
                                    value={option.value}
                                >
                                    {componentSpecificProps?.icon && (
                                        <Box className={classes.iconBox}>
                                            <img
                                                className={classes.icon}
                                                src={componentSpecificProps?.icon}
                                            />
                                        </Box>
                                    )}
                                    {componentSpecificProps?.defaultIcon && (
                                        <Extension className={classes.iconBox} />
                                    )}
                                    <Box>{option.label}</Box>
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    )}
                    {options && componentSpecificProps?.labels?.otherButtonLabel && (
                        <>
                            <Box className={classes.centerBox}>
                                <Button variant="contained" onClick={onAddNewOption}>
                                    {componentSpecificProps.labels?.otherButtonLabel}
                                </Button>
                            </Box>
                        </>
                    )}
                </>
            )}
            {isSubchildDisplayed && (
                <>
                    <Box className={classes.labelSpacer}>
                        <label>{componentSpecificProps.labels?.subchildLabel}</label>
                    </Box>
                    <Box className={classes.centerBox}>
                        <TextField
                            value={newOptionValue}
                            className={classes.newOptionTextField}
                            onChange={newOptionOnChange}
                            placeholder={componentSpecificProps.labels?.inputPlaceholder}
                        ></TextField>
                    </Box>
                </>
            )}
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { CheckboxOneEdt } })(theme => ({
    MuiToggleButton: {
        marginBottom: "0.5rem",
        border: important("2px solid #FFFFFF"),
        borderRadius: important("6px"),
        backgroundColor: "#FFFFFF",
        color: theme.palette.primary.main,
        "&.Mui-selected": {
            borderColor: important(theme.palette.primary.main),
            fontWeight: "bold",
            backgroundColor: "#FFFFFF",
            color: theme.palette.primary.main,
        },
    },
    MuiToggleButtonIcon: {
        marginBottom: "0.5rem",
        border: important("2px solid #FFFFFF"),
        borderRadius: important("6px"),
        backgroundColor: "#FFFFFF",
        color: theme.palette.primary.main,
        justifyContent: "flex-start",
        textAlign: "left",
        "&.Mui-selected": {
            borderColor: important(theme.palette.primary.main),
            fontWeight: "bold",
            backgroundColor: "#FFFFFF",
            color: theme.palette.primary.main,
        },
    },
    labelSpacer: {
        marginBottom: "0.5rem",
    },
    iconBox: {
        marginRight: "0.5rem",
        color: theme.palette.primary.main,
        width: "25px",
    },
    icon: {
        width: "25px",
        height: "25px",
    },
    toggleButtonGroup: {
        marginTop: "1rem",
    },
    centerBox: {
        display: "flex",
        justifyContent: "center",
    },
    newOptionTextField: {
        width: "100%",
        backgroundColor: theme.variables.white,
        borderRadius: "5px",
    },
}));

export default createCustomizableLunaticField(CheckboxOneEdt, "CheckboxOneEdt");
