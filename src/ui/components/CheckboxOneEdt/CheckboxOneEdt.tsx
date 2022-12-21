import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { CheckboxOneSpecificProps } from "interface";
import { CheckboxOneCustomOption } from "interface/CheckboxOptions";
import React, { memo, useCallback } from "react";
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
    const { classes, cx } = useStyles();
    const [currentOption, setCurrentOption] = React.useState<string | undefined>(value ?? undefined);

    const handleOptions = useCallback(
        (_event: React.MouseEvent<HTMLElement>, selectedOption: string) => {
            setCurrentOption(selectedOption);
            handleChange(response, selectedOption);
        },
        [],
    );

    return (
        <>
            {label && (
                <>
                    <Box className={classes.labelSpacer}></Box>
                    <label>{label}</label>
                </>
            )}
            {(options || componentSpecificProps?.options) && (
                <ToggleButtonGroup
                    orientation="vertical"
                    value={currentOption}
                    exclusive
                    onChange={handleOptions}
                    id={id}
                    aria-label={label}
                    className={cx(className, classes.toggleButtonGroup)}
                >
                    {(componentSpecificProps?.options ?? options)?.map(
                        (option: CheckboxOneCustomOption, index) => (
                            <ToggleButton
                                className={
                                    componentSpecificProps?.icon
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
                                <Box>{option.label}</Box>
                            </ToggleButton>
                        ),
                    )}
                </ToggleButtonGroup>
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
        height: "1rem",
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
}));

export default createCustomizableLunaticField(CheckboxOneEdt, "CheckboxOneEdt");
