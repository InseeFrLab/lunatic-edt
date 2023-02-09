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
import { FORMAT_TIME, MINUTE_LABEL, START_TIME_DAY } from "../../utils/constants/constants";

export type ActivityTimeProps = {
    disabled?: boolean;
    readOnly?: boolean;
    value?: { START_TIME: any; END_TIME: any };
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
            time = dayjs(valueData, FORMAT_TIME);
        } else {
            if (defaultValue && activities && activities.length > 0) {
                time = dayjs(activities[activities.length - 1]?.endTime, FORMAT_TIME);
            } else {
                time = dayjs(START_TIME_DAY, FORMAT_TIME);
            }
        }

        if (time.isValid() && time.minute() % 5 != 0) {
            const iterations = Math.trunc(time.minute() / 5) + 1;
            time = time.set("minute", 0);
            time = time.add(iterations * 5, "minute");
        }
        return time;
    };
    console.log(value);
    const startTimeComputed = computeStartTime(
        componentSpecificProps?.activitiesAct,
        value?.START_TIME,
        componentSpecificProps?.defaultValue,
    );

    const [startTime] = React.useState<string | undefined>(startTimeComputed.format(FORMAT_TIME));
    const [endTime, setEndTime] = React.useState<string | undefined>(value?.END_TIME);

    useEffect(() => {
        dayjs.extend(customParseFormat);
        const startTimeComputed = computeStartTime(
            componentSpecificProps?.activitiesAct,
            value?.START_TIME,
            componentSpecificProps?.defaultValue,
        );
        if (endTime == null || startTime != value?.START_TIME) {
            let endTimeDay = startTimeComputed.add(5, MINUTE_LABEL);
            setEndTime(endTimeDay.format(FORMAT_TIME));
        }
    }, [value?.START_TIME]);

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
                value={startTime}
            />
            <Timepicker
                response={responses[1].response}
                handleChange={handleChange}
                disabled={disabled}
                readOnly={readOnly}
                tipsLabel={endTimeLabel}
                id={id}
                value={endTime}
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
