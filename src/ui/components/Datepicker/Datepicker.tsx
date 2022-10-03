import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { memo } from "react";

export type DatepickerProps = {
    disabled: boolean;
    readOnly: boolean;
    value: string;
    onChange(value: string): void;
    labelId: string;
    id: string;
    min: string;
    max: string;
};

const Datepicker = memo((props: DatepickerProps) => {
    console.log("Datepicker");
    console.log(props);
    const { id, onChange, value, readOnly, disabled } = props;

    const [valueLocal, setValue] = React.useState<Dayjs | null>(dayjs(value ?? dayjs()));

    function setValueLunatic(newValue: any) {
        setValue(newValue);
        onChange(newValue);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                key={id}
                disableFuture
                disabled={disabled}
                readOnly={readOnly}
                openTo="year"
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
