import { Box, InputLabel, MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import React, { memo, useEffect } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";

export type DurationProps = {
    value?: string;
    handleChange(response: { [name: string]: string }, value: string | null): void;
    label?: string;
    hourLabel?: string;
    andLabel?: string;
    minLabel?: string;
    response: { [name: string]: string };
};

const enum DurationEnum {
    HOUR = "h",
    MINUTES = "m",
}

const getNumElements = (typeDuration: string) => {
    if (DurationEnum.HOUR == typeDuration) {
        return 24;
    } else if (DurationEnum.MINUTES == typeDuration) {
        return 60;
    } else {
        return 0;
    }
};

const Duration = memo((props: DurationProps) => {
    const { handleChange, value, label, hourLabel, andLabel, minLabel, response } = props;

    const { classes } = useStyles();

    const [hour, setHour] = React.useState("");
    const [minutes, setMinutes] = React.useState("");

    useEffect(() => {
        const time = dayjs(value, "HH:mm");
        setHour(time.hour().toString());
        setMinutes(time.minute().toString());
    }, []);

    useEffect(() => {
        if (hour != undefined && minutes != undefined) {
            handleChange(response, hour + ":" + minutes || null);
        }
    }, [hour, minutes]);

    function setValueLunatic(newHour: string, newMin: string) {
        if (newHour != undefined) {
            setHour(newHour);
        }

        if (newMin != undefined) {
            setMinutes(newMin);
        }

        const newValue = newHour + ":" + newMin;
        handleChange(response, newValue);
    }

    const listHourElements: number[] = Array.from(Array(getNumElements("h")).keys());
    const listMinElements: number[] = Array.from(Array(getNumElements("m")).keys());

    return (
        <>
            <Box className={classes.labelSpacer}>
                <label>{label}</label>
            </Box>
            <Box className={classes.containerBox}>
                <Box className={classes.durationBox}>
                    <Box className={classes.durationInnerBox}>
                        {hourLabel && (
                            <InputLabel id={"durationHour-label"} className={classes.innerLabel}>
                                {hourLabel}
                            </InputLabel>
                        )}
                        <Select
                            className={classes.selectBox}
                            labelId={hourLabel ? "durationHour-label" : undefined}
                            id={"durationHour-select"}
                            value={hour}
                            onChange={newValue => setValueLunatic(newValue.target.value, minutes)}
                            MenuProps={{
                                PopoverClasses: {
                                    root: classes.menuSelectBox,
                                },
                            }}
                        >
                            {listHourElements?.map(option => {
                                return (
                                    <MenuItem key={"durationHour-" + option} value={option}>
                                        {option}h
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </Box>
                    <Box className={classes.innerLabel}>
                        <InputLabel id={"durationAnd-label"} className={classes.innerLabel}>
                            {andLabel}
                        </InputLabel>
                    </Box>
                    <Box className={classes.durationInnerBox}>
                        {minLabel && (
                            <InputLabel id={"durationHour-label"} className={classes.innerLabel}>
                                {minLabel}
                            </InputLabel>
                        )}
                        <Select
                            className={classes.selectBox}
                            labelId={minLabel ? "durationMin-label" : undefined}
                            id={"durationMin-select"}
                            value={minutes}
                            onChange={newValue => setValueLunatic(minutes, newValue.target.value)}
                            MenuProps={{
                                PopoverClasses: {
                                    root: classes.menuSelectBox,
                                },
                            }}
                        >
                            {listMinElements?.map(option => {
                                return (
                                    <MenuItem key={"durationMin-" + option} value={option}>
                                        {option}mn
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </Box>
                </Box>
            </Box>
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { Duration } })(theme => ({
    labelSpacer: {
        marginBottom: "1rem",
        textAlign: "center",
    },
    innerLabel: {
        fontSize: "14px !important",
        color: theme.palette.info.main,
        fontWeight: "bold",
        display: "flex",
        justifyContent: "center",
    },
    containerBox: {
        backgroundColor: theme.variables.white,
        padding: "2rem 3rem",
        display: "flex",
        justifyContent: "center",
    },
    durationBox: {
        display: "flex",
        justifyContent: "space-between",
        width: "85%",
    },
    durationInnerBox: {
        width: "46%",
    },
    selectBox: {
        width: "100%",
        ".MuiOutlinedInput-input": {
            minHeight: "1rem !important",
            height: "1rem !important",
        },
    },
    menuSelectBox: {
        height: "30%",
    },
}));

export default createCustomizableLunaticField(Duration, "Duration");
