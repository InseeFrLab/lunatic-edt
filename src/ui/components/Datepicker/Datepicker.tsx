import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { memo } from "react";

export type DatepickerProps = {
    disabled?: boolean;
    readOnly?: boolean;
    value?: string;
    onChange(value: string | null): void;
    labelId?: string;
    id?: string;
    min?: string;
    max?: string;
};

const Datepicker = memo((props: DatepickerProps) => {
    const { id, onChange, value, readOnly, disabled } = props;

    const [valueLocal, setValue] = React.useState<Dayjs | null>(dayjs(value ?? dayjs()));

    function setValueLunatic(newValue: Dayjs | null) {
        setValue(newValue);
        onChange(newValue?.format("YYYY-MM-DD") || null);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                key={id}
                disabled={disabled}
                readOnly={readOnly}
                openTo="day"
                views={["day", "month", "year"]}
                value={valueLocal}
                onChange={newValue => {
                    setValueLunatic(newValue);
                }}
                renderInput={params => <TextField {...params} />}
            />
        </LocalizationProvider>
    );
});

export default Datepicker;
