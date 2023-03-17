import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import { TimepickerSpecificProps } from "interface";
import React, { memo, useCallback, useEffect } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";

export type TimepickerProps = {
    disabled?: boolean;
    readOnly?: boolean;
    value?: string;
    handleChange(response: { [name: string]: string }, value: string | null): void;
    label?: string;
    tipsLabel?: string;
    id?: string;
    response: { [name: string]: string };
    componentSpecificProps?: TimepickerSpecificProps;
};

const Timepicker = memo((props: TimepickerProps) => {
    const {
        id,
        response,
        handleChange,
        value,
        readOnly,
        disabled,
        label,
        tipsLabel,
        componentSpecificProps,
    } = props;
    const { classes } = useStyles();

    const [valueLocal, setValue] = React.useState<Dayjs | undefined>();

    useEffect(() => {
        setValue(dayjs(value, componentSpecificProps?.constants.FORMAT_TIME));
    }, [value]);

    useEffect(() => {
        if (valueLocal != undefined && valueLocal?.isValid())
            handleChange(
                response,
                valueLocal?.format(componentSpecificProps?.constants.FORMAT_TIME) || null,
            );
    }, [valueLocal]);

    /**
     * Round min to next/previous interval of 5
     * @param min
     * @returns
     */
    const round5 = (min: number) => {
        const minRestTo5 = min % 5;
        if (minRestTo5 > 0) {
            return min - minRestTo5 + 5;
        } else return min;
    };

    function setValueLunatic(newValue: Dayjs | null) {
        if (newValue != undefined && newValue?.isValid()) {
            const min = newValue.minute();
            const newValueRound5 = newValue.set("minutes", round5(min));
            setValue(newValueRound5);
            handleChange(
                response,
                newValue?.format(componentSpecificProps?.constants.FORMAT_TIME) || null,
            );
        }
    }

    return (
        <>
            <Box className={classes.labelSpacer}>
                <label>{label}</label>
            </Box>
            <Box className={classes.root}>
                <Box className={classes.tipsLabel}>
                    <p>{tipsLabel}</p>
                </Box>
                <LocalizationProvider adapterLocale={"fr"} dateAdapter={AdapterDayjs}>
                    <TimePicker
                        key={id}
                        disabled={disabled}
                        readOnly={readOnly}
                        openTo="hours"
                        views={["hours", "minutes"]}
                        value={valueLocal}
                        onChange={useCallback(newValue => {
                            setValueLunatic(newValue);
                        }, [])}
                        components={{
                            OpenPickerIcon: KeyboardArrowDownIcon,
                        }}
                        renderInput={useCallback(
                            params => (
                                <TextField size="small" {...params} sx={{ svg: { color: "#1F4076" } }} />
                            ),
                            [],
                        )}
                        className={classes.input}
                        minutesStep={5}
                    />
                </LocalizationProvider>
            </Box>
        </>
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
    labelSpacer: {
        marginBottom: "1rem",
    },
    tipsLabel: {
        fontSize: "14px",
        color: theme.palette.info.main,
        fontWeight: "bold",
    },
}));

export default createCustomizableLunaticField(Timepicker, "Timepicker");
