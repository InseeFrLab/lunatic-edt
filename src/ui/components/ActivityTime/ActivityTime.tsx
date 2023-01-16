import { Box } from "@mui/system";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { TimepickerSpecificProps } from "interface";
import { Activity } from "interface/TimepickerTypes";
import React, { memo, useEffect } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";
import Timepicker from "../Timepicker/Timepicker";
import customParseFormat from "dayjs/plugin/customParseFormat";

export type ActivityTimeProps = {
    disabled?: boolean;
    readOnly?: boolean;
    value?: { STARTTIME: any; ENDTIME: any };
    handleChange(response: { [name: string]: string }, value: string | null): void;
    label?: string;
    startTimeLabel?: string;
    endTimeLabel?: string;
    id?: string;
    responses: { response: { [name: string]: string } }[];
    componentSpecificProps?: TimepickerSpecificProps;
};

const ActivityTime = memo((props: ActivityTimeProps) => {
    const {
        id,
        responses,
        handleChange,
        readOnly,
        disabled,
        label,
        value,
        startTimeLabel,
        endTimeLabel,
        componentSpecificProps,
    } = props;
    const { classes } = useStyles();

    const computeStartTime = (
        activities: Activity[] | undefined,
        valueData: string | undefined,
        defaultValue: boolean | undefined,
    ) => {
        let time;
        if (valueData) {
            time = dayjs(valueData, "HH:mm");
        } else {
            if (defaultValue && activities && activities.length > 0) {
                time = dayjs(activities[activities.length - 1]?.endTime, "HH:mm");
            } else {
                time = dayjs();
            }
        }

        if (time.isValid() && time.minute() % 5 != 0) {
            const iterations = Math.trunc(time.minute() / 5) + 1;
            time = time.set("minute", 0);
            time = time.add(iterations * 5, "minute");
        }
        return time;
    };

    const startTimeComputed = computeStartTime(
        componentSpecificProps?.activitiesAct,
        value?.STARTTIME,
        componentSpecificProps?.defaultValue,
    );

    const [startTime, setStartTime] = React.useState<string | undefined>(
        startTimeComputed.format("HH:mm"),
    );
    const [endTime, setEndTime] = React.useState<string | undefined>();

    const changeValueEndTime = () => {
        const startTimeComputed = computeStartTime(
            componentSpecificProps?.activitiesAct,
            value?.STARTTIME,
            componentSpecificProps?.defaultValue,
        );
        let endTimeDay = startTimeComputed.add(5, "minute");
        setEndTime(endTimeDay.format("HH:mm"));
    };

    useEffect(() => {
        dayjs.extend(customParseFormat);
        const startTimeComputed = computeStartTime(
            componentSpecificProps?.activitiesAct,
            value?.STARTTIME,
            componentSpecificProps?.defaultValue,
        );

        if (value?.ENDTIME == null) {
            let endTimeDay = startTimeComputed.add(5, "minute");
            setEndTime(endTimeDay.format("HH:mm"));
        }
    }, [value?.STARTTIME]);

    React.useEffect(() => {
        document.addEventListener("click", changeValueEndTime, true);
        return () => document.removeEventListener("click", changeValueEndTime, true);
    }, [value?.STARTTIME]);

    return (
        <>
            <Box className={classes.labelSpacer}>
                <label>{label}</label>
            </Box>
            <Timepicker
                response={responses[0].response}
                handleChange={handleChange}
                disabled={disabled}
                readOnly={readOnly}
                tipsLabel={startTimeLabel}
                id={id}
                value={startTime ?? value?.STARTTIME}
            />
            <Timepicker
                response={responses[1].response}
                handleChange={handleChange}
                disabled={disabled}
                readOnly={readOnly}
                tipsLabel={endTimeLabel}
                id={id}
                value={endTime ?? value?.ENDTIME}
            />
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { ActivityTime } })(theme => ({
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

export default createCustomizableLunaticField(ActivityTime, "ActivityTime");
