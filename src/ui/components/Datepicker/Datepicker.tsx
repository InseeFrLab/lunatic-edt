import { Box, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import React, { memo, useCallback, useEffect } from "react";
import { makeStylesEdt } from "../../theme";

export type DatepickerProps = {
    disabled?: boolean;
    readOnly?: boolean;
    value?: string;
    onChange(value: string | null): void;
    labelId?: string;
    tipsLabel?: string;
    id?: string;
    min?: string;
    max?: string;
};

const Datepicker = memo((props: DatepickerProps) => {
    const { id, onChange, value, readOnly, disabled, tipsLabel } = props;
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
        <>
            {tipsLabel && (
                <>
                    <Box className={classes.labelSpacer}>
                        <label>{tipsLabel}&nbsp;?</label>
                    </Box>
                </>
            )}
            <>
                <LocalizationProvider adapterLocale={"fr"} dateAdapter={AdapterDayjs}>
                    <DatePicker
                        key={id}
                        disabled={disabled}
                        readOnly={readOnly}
                        openTo="day"
                        views={["day"]}
                        value={valueLocal}
                        label=" "
                        onChange={useCallback(newValue => {
                            setValueLunatic(newValue);
                        }, [])}
                        renderInput={useCallback(
                            params => (
                                <TextField {...params} />
                            ),
                            [],
                        )}
                        componentsProps={{
                            actionBar: {
                                actions: ["accept"],
                            },
                        }}
                        className={classes.input}
                    />
                </LocalizationProvider>
            </>
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { Datepicker } })(() => ({
    input: {
        width: "100%",
        legend: {
            display: "none",
        },
    },
    labelSpacer: {
        marginBottom: "1rem",
    },
}));

export default Datepicker;
