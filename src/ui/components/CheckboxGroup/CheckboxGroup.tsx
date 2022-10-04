import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { CheckboxGroupOption } from "interface/CheckboxGroupOptions";
import React from "react";
import { memo } from "react";
import { makeStyles } from "tss-react/mui";

export type CheckboxGroupProps = {
    handleChange(response: { [name: string]: string }, value: boolean): void;
    id?: string;
    label?: string;
    options: CheckboxGroupOption[];
    value: { [key: string]: boolean };
    className?: string;
};

const CheckboxGroup = memo((props: CheckboxGroupProps) => {
    console.log("CheckboxGroup");
    console.log(props);
    const { id, value, label, options, className, handleChange } = props;

    const { classes } = useStyles();

    const optionsValues: string[] = options.map(option => option.response.name);
    const [currentOptions, setCurrentOptions] = React.useState<string[]>(() => optionsValues);

const handleOptions = (event: any, newOptions: string[]) => {
    setCurrentOptions(newOptions);
    // update value with the opposite of its current value
    value[event.target.value] = !value[event.target.value];
    handleChange({ name: event.target.value }, value[event.target.value]);
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

// TODO : To move to global utils folder (issues when tried)
function important(str: string): string {
    return (str + " !important") as string;
}

export default CheckboxGroup;
