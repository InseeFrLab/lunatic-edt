import { memo } from "react";
import { TextField } from "@mui/material";

export type InputProps = {
    id?: string;
    value?: string;
    disabled?: boolean;
    label?: string;
    labelledBy?: string;
    placeholder?: string;
    onChange(value: string): void;
    mandatory?: boolean;
    maxLength?: number;
    errors?: { errorMessage: string };
};

export const Input = memo((props: InputProps) => {
    console.log(props);
    const { id, value, disabled, labelledBy, placeholder, mandatory, errors, maxLength, onChange } =
        props;
    return (
        <TextField
            id={id}
            aria-required={mandatory}
            labelled-by={labelledBy}
            disabled={disabled}
            placeholder={placeholder}
            required={mandatory}
            value={value ?? ""}
            error={errors ? true : false}
            helperText={errors?.errorMessage}
            inputProps={{ maxLength: maxLength ?? 100 }}
            onChange={event => onChange(event.target.value)}
            size="small"
            variant="outlined"
        />
    );
});

export default Input;
