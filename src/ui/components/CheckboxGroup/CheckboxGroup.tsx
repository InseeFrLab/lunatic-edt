import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { CheckboxOption } from "interface/CheckboxOptions";
import React from "react";
import { memo } from "react";
import { makeStyles } from "tss-react/mui";
import { important } from "../../utils/utils";

export type CheckboxGroupProps = {
    handleChange(value: any): void;
    id?: string;
    label?: string;
    options: CheckboxOption[];
    value: { [key: string]: boolean };
    className?: string;
};

const CheckboxGroup = memo((props: CheckboxGroupProps) => {
    const { id, value, label, options, className, handleChange } = props;

    const { classes } = useStyles();

    const optionsValues = options.map(option => option.response.name);
    const [currentOptions, setCurrentOptions] = React.useState(() => optionsValues);
    const handleOptions = (event: any, newOptions: string[]) => {
        setCurrentOptions(newOptions);
        value[event.target.value] = !value[event.target.value];
        handleChange(value);
    };

    return (
        <ToggleButtonGroup
            orientation="vertical"
            value={currentOptions}
            onChange={handleOptions}
            id={id}
            aria-label={label}
            className={className}
        >
            {options.map(option => (
                <ToggleButton
                    className={classes.MuiToggleButton}
                    key={option.id}
                    selected={value[option.response.name] ?? false}
                    value={option.response.name}
                >
                    {option.label}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
});

const useStyles = makeStyles({ "name": { CheckboxGroup } })(theme => ({
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
}));

export default CheckboxGroup;
