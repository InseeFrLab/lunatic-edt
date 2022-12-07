import { Box } from "@mui/system";
import { createTheme, TextField } from "@mui/material";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import React, { memo, useEffect } from "react";
import { makeStylesEdt } from "../../theme";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";

export type TimepickerProps = {
    disabled?: boolean;
    readOnly?: boolean;
    value?: string;
    handleChange(response: { [name: string]: string }, value: string | null): void;
    label?: string;
    id?: string;
    response: { [name: string]: string };
};

const Timepicker = memo((props: TimepickerProps) => {
    const { id, response, handleChange, value, readOnly, disabled, label } = props;
    const { classes } = useStyles();
    const [valueLocal, setValue] = React.useState<Dayjs | null>(dayjs(value ?? dayjs()));

    useEffect(() => {
        handleChange(response, valueLocal?.format("HH:mm") || null);
    }, []);

    function setValueLunatic(newValue: Dayjs | null) {
        setValue(newValue);
        handleChange(response, newValue?.format("HH:mm") || null);
    }

    return (
        <Box className={classes.root}>
            <Box className={classes.label}>
                <p>{label}</p>
            </Box>
            <LocalizationProvider adapterLocale={"fr"} dateAdapter={AdapterDayjs}>
                <TimePicker
                    key={id}
                    disabled={disabled}
                    readOnly={readOnly}
                    openTo="hours"
                    views={["hours", "minutes"]}
                    value={valueLocal}
                    onChange={newValue => {
                        setValueLunatic(newValue);
                    }}
                    components={{
                        OpenPickerIcon: KeyboardArrowDownIcon,
                    }}
                    renderInput={params => (
                        <TextField size="small" {...params} sx={{ svg: { color: "#1F4076" } }} />
                    )}
                    className={classes.input}
                />
            </LocalizationProvider>
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { Timepicker } })(theme => ({
    input: {
        width: "55%",
    },
    root: {
        padding: "1rem 2rem 2rem 2rem",
        backgroundColor: theme.variables.white,
        border: "1px solid transparent",
        borderRadius: "10px",
        margin: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    label: {
        fontSize: "14px",
        color: theme.palette.info.main,
        fontWeight: "bold",
    },
}));

export default createCustomizableLunaticField(Timepicker, "Timepicker");
