import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import React, { memo, useEffect } from "react";
import { makeStylesEdt } from "../../theme";

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
    const { classes } = useStyles();
    const [valueLocal, setValue] = React.useState<Dayjs | null>(dayjs(value ?? dayjs()));

    useEffect(() => {
        onChange(valueLocal?.format("YYYY-MM-DD") || null);
    }, []);

    function setValueLunatic(newValue: Dayjs | null) {
        setValue(newValue);
        onChange(newValue?.format("YYYY-MM-DD") || null);
    }

    return (
        <LocalizationProvider adapterLocale={"fr"} dateAdapter={AdapterDayjs}>
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
                className={classes.input}
            />
        </LocalizationProvider>
    );
});

const useStyles = makeStylesEdt({ "name": { Datepicker } })(() => ({
    input: {
        width: "100%",
    },
}));

export default Datepicker;
