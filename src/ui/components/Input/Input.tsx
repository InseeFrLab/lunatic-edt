import { TextField } from "@mui/material";
import { memo } from "react";
import { makeStylesEdt } from "../../theme";

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
    const { id, value, disabled, labelledBy, placeholder, mandatory, errors, maxLength, onChange } =
        props;
    const { classes } = useStyles();
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
            className={classes.input}
        />
    );
});

const useStyles = makeStylesEdt({ "name": { Input } })(() => ({
    input: {
        width: "100%",
    },
}));

export default Input;
