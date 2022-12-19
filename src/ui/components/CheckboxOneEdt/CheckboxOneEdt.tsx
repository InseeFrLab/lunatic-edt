import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
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
};

const CheckboxOneEdt = memo((props: CheckboxOneProps) => {
    const { id, value, label, options, className, handleChange, response } = props;

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
            {options &&
                <ToggleButtonGroup
                    orientation="vertical"
                    value={currentOption}
                    exclusive
                    onChange={handleOptions}
                    id={id}
                    aria-label={label}
                    className={cx(className, classes.toggleButtonGroup)}
                >
                    {options.map(option => (
                        <ToggleButton
                            className={classes.MuiToggleButton}
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            }
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { CheckboxOneEdt } })(theme => ({
    "MuiToggleButton": {
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
    labelSpacer: {
        height: "1rem",
    },
    toggleButtonGroup: {
        marginTop: "1rem",
    },
}));

export default createCustomizableLunaticField(CheckboxOneEdt, "CheckboxOneEdt");
