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
    required?: boolean;
    maxLength?: number;
    errors?: { errorMessage: string };
};

export const Input = memo((props: InputProps) => {
    const { id, value, disabled, placeholder, required, errors } = props;

    return (
        <TextField
            id={id}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            value={value}
            error={errors ? true : false}
            helperText={errors?.errorMessage}
            size="small"
            variant="outlined"
        />
    );
});

export default Input;
