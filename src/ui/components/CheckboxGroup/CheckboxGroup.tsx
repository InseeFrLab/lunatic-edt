import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { CheckboxGroupOption } from "interface/CheckboxGroupOptions";
import React from "react";
import { memo } from "react";

export type CheckboxGroupProps = {
    handleChange(response: any, value: boolean): void;
    id?: string;
    label?: string;
    options: CheckboxGroupOption[];
    value: { [key: string]: boolean };
};

const CheckboxGroup = memo((props: CheckboxGroupProps) => {
    console.log("CheckboxGroup");
    console.log(props);
    const { id, value, label, options } = props;
    //remove null
    for (let key in value) {
        value[key] ?? (value[key] = false);
    }
    const optionsValues = options.map(option => option.response.name);
    const [currentOptions, setCurrentOptions] = React.useState(() => optionsValues);
    const handleOptions = (event: any, newOptions: string[]) => {
        setCurrentOptions(newOptions);
        //update value
        console.log(event);
        value[event.target.value] = !value[event.target.value];
        console.log(value);
        console.log(newOptions);
        //handleChange(event.target.value, value[event.target.value]);
    };

    return (
        <ToggleButtonGroup
            orientation="vertical"
            value={currentOptions}
            onChange={handleOptions}
            id={id}
            aria-label={label}
        >
            {options.map(option => (
                <ToggleButton
                    className={
                        value[option.response.name]
                            ? "edt-custom-toggle-button edt-custom-toggle-button-active"
                            : "edt-custom-toggle-button"
                    }
                    key={option.id}
                    selected={value[option.response.name]}
                    value={option.response.name}
                >
                    {option.label}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
});

export default CheckboxGroup;
