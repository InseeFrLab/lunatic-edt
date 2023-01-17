import { Box, List, Typography } from "@mui/material";
import React, { memo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { TimeLineRowType } from "../../../../interface/DayOverviewTypes";
import { LunaticMultiSelectionValues } from "../../../../interface/LunaticMultiSelectionValues";
import {
    DayDetailType,
    IODataStructure,
    WeeklyPlannerDataType,
} from "../../../../interface/WeeklyPlannerTypes";
import { makeStylesEdt } from "../../../theme";
import {
    convertTime,
    formateDateToFrenchFormat,
    generateDateFromStringInput,
    setDateTimeToZero,
} from "../../../utils";
import HourChecker from "../../HourChecker";
import ProgressBar from "../../ProgressBar";
import { INTERVAL, transformToIODataStructure } from "../WeeklyPlanner/utils";

export type DayOverviewProps = {
    date: Date;
    isDisplayed: boolean;
    rawTimeLineData: TimeLineRowType[];
    activityData: WeeklyPlannerDataType[];
    setActivityData(data: WeeklyPlannerDataType[]): void;
    handleChangeData(response: { [name: string]: string }, value: IODataStructure[]): void;
};

/**
 * Returns a formated string from Date
 * @param date
 * @returns
 */
const formateDateLabel = (date: Date): string => {
    const formatedDate = formateDateToFrenchFormat(date);
    return formatedDate.toUpperCase();
};

/**
 * Converts DayDetail array to values as LunaticMultiSelectionValues
 * @param details
 * @returns
 */
const fromDayDetailsToValues = (details: DayDetailType[]): LunaticMultiSelectionValues => {
    const values: LunaticMultiSelectionValues = {};

    details.forEach(b => {
        const time: Date = new Date();
        const splittedTime = b.start.split("h");
        time.setHours(Number(splittedTime[0]));
        time.setMinutes(Number(splittedTime[1]));

        for (let i = 0; i < b.duration / INTERVAL; i++) {
            const key = convertTime(time);
            values[key] = true;
            time.setMinutes(time.getMinutes() + INTERVAL);
        }
    });
    return values;
};

const DayOverview = memo((props: DayOverviewProps) => {
    const { classes } = useStyles();
    const { date, isDisplayed, rawTimeLineData, activityData, setActivityData, handleChangeData } =
        props;

    const [componentDisplay, setComponentDisplay] = React.useState<string>("none");
    const [timeLineData, setTimeLineData] = React.useState<TimeLineRowType[]>(rawTimeLineData);

    // Update timeLineData for HourCheckers from activityData
    useEffect(() => {
        const temp: TimeLineRowType[] = JSON.parse(JSON.stringify(rawTimeLineData));
        const dayBloc: WeeklyPlannerDataType | undefined = activityData.find(
            d => setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() === date.getTime(),
        );
        let values: LunaticMultiSelectionValues = {};

        if (dayBloc) {
            values = fromDayDetailsToValues(dayBloc.detail);
        }

        Object.entries(values).forEach(v => {
            const row: TimeLineRowType | undefined = temp.find((t: TimeLineRowType) => {
                return t.options.find(o => o.response.name === v[0]);
            });
            if (row) {
                row.value[v[0]] = v[1];
            }
        });
        setTimeLineData(temp);
    }, [date]);

    useEffect(() => {
        if (activityData.length !== 0 && !isDisplayed) {
            updateValue();
        }
        isDisplayed ? setComponentDisplay("flex") : setComponentDisplay("none");
    }, [isDisplayed]);

    /**
     * Callback triggered when a value is changed in one HourChecker
     * Updates the parent activityData state
     */
    const updateValue = () => {
        const temp: WeeklyPlannerDataType[] = [...activityData];
        let dayBloc: WeeklyPlannerDataType = temp.filter(
            d => setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() === date.getTime(),
        )[0];
        let valuesList: LunaticMultiSelectionValues = {};

        // Create list of all LunaticMultiSelectionValues for this day
        timeLineData
            .map(t => t.value)
            .forEach(t => {
                Object.entries(t).forEach(([key, value]) => {
                    valuesList[key] = value;
                });
            });

        let details: DayDetailType[] = [];

        let startHour = "start";
        let endHour = "end";
        let durationTime = 0;

        Object.entries(valuesList).forEach(([key, value]) => {
            if (value && startHour === "start") {
                startHour = key;
                endHour = key;
                durationTime = durationTime + INTERVAL;
            } else if (value) {
                durationTime = durationTime + INTERVAL;
                endHour = key;
            }
            if (!value && endHour !== "end") {
                details.push({
                    start: startHour,
                    end: endHour,
                    duration: durationTime,
                });
                startHour = "start";
                endHour = "end";
                durationTime = 0;
            }
        });

        if (endHour !== "end") {
            details.push({
                start: startHour,
                end: endHour,
                duration: durationTime,
            });
        }

        dayBloc.detail = details;

        const toStore = transformToIODataStructure(temp);
        handleChangeData({ name: "WEEKLYPLANNER" }, toStore);

        setActivityData(temp);
    };

    const renderRow = (h: TimeLineRowType): any => {
        return (
            <Box className={classes.rowContainer} key={uuidv4()}>
                <Box className={classes.rowLabel}>
                    <Typography className={classes.hourLabel}>{h.label}</Typography>
                </Box>

                <HourChecker responses={h.options} value={h.value} />
            </Box>
        );
    };

    return (
        <Box className={classes.mainContainer} display={componentDisplay} aria-label="dayoverview">
            <Box className={classes.absoluteBox}>
                <Box className={classes.headerContainer}>
                    <Typography className={classes.dayLabel}>{formateDateLabel(date)}</Typography>
                    <ProgressBar
                        className={classes.progressBar}
                        value={Math.round((new Date().getHours() / 24) * 100)}
                        isPrimaryMainColor={true}
                    />
                </Box>
            </Box>

            <List className={classes.listContainer}>{timeLineData.map(l => renderRow(l))}</List>
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { DayOverview } })(theme => ({
    mainContainer: {
        flexDirection: "column",
    },
    absoluteBox: {
        position: "absolute",
        left: "0",
        top: "0",
        overflowX: "hidden",
        width: "100%",
        zIndex: "1",
    },
    headerContainer: {
        backgroundColor: theme.variables.white,
        width: "100%",
        paddingBottom: "1rem",
    },
    dayLabel: {
        color: theme.palette.info.main,
        fontSize: "14px",
        padding: "1rem",
    },
    progressBar: {
        paddingLeft: "1rem",
        paddingRight: "1rem",
    },
    listContainer: {
        display: "flex",
        flexDirection: "column",
        paddingTop: "2rem",
        paddingBottom: "6rem",
    },
    rowContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "0.5rem",
    },
    rowLabel: {
        width: "50px",
    },
    hourLabel: {
        color: theme.palette.info.main,
        fontSize: "12px",
    },
}));

export default DayOverview;
