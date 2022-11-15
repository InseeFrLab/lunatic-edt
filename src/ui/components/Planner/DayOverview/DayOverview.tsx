import { Close } from "@mui/icons-material";
import { Box, List, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { memo } from "react";
import { makeStyles } from "tss-react/mui";
import { formateDateToFrenchFormat, generateDateFromStringInput, setDateTimeToZero, convertTime } from "../../../utils";
import { TimeLineRowType } from "../../../../interface/DayOverviewTypes";
import { LunaticMultiSelectionValues } from "../../../../interface/LunaticMultiSelectionValues";
import { WeeklyPlannerDataType, DayDetailType } from "../../../../interface/WeeklyPlannerTypes";
import HourChecker from "../../HourChecker"

export type DayOverviewProps = {
    date: Date,
    isDisplayed: boolean,
    setDisplayComponent(display: boolean): void,
    rawTimeLineData: TimeLineRowType[],
    activityData: WeeklyPlannerDataType[],
    setActivityData(data: WeeklyPlannerDataType[]): void
};

/**
 * Returns a formated string from Date
 * @param date 
 * @returns 
 */
const formateDateLabel = (date: Date): string => {
    const formatedDate = formateDateToFrenchFormat(date);
    return formatedDate.toUpperCase();
}


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

        const intervalInMinutes = 15;

        for (let i = 0; i < b.duration / intervalInMinutes; i++) {
            const key = convertTime(time);
            values[key] = true;
            time.setMinutes(time.getMinutes() + intervalInMinutes);
        }
    });
    return values;
}

const DayOverview = memo((props: DayOverviewProps) => {
    const { classes } = useStyles();
    const { date, isDisplayed, setDisplayComponent, rawTimeLineData, activityData, setActivityData } = props;

    const [componentDisplay, setComponentDisplay] = React.useState<string>("none");
    const [timeLineData, setTimeLineData] = React.useState<TimeLineRowType[]>(rawTimeLineData);

    useEffect(() => {
        isDisplayed ? setComponentDisplay("flex") : setComponentDisplay("none");
    }, [isDisplayed]);

    // Update timeLineData for HourCheckers from activityData
    useEffect(() => {
        const temp: TimeLineRowType[] = JSON.parse(JSON.stringify(timeLineData));
        const dayBloc: WeeklyPlannerDataType | undefined = activityData.find(d => setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() === date.getTime());
        let values: LunaticMultiSelectionValues = {};

        if (dayBloc) {
            values = fromDayDetailsToValues(dayBloc.detail);
        }

        Object.entries(values).forEach((v) => {
            const row: TimeLineRowType | undefined = temp.find((t: TimeLineRowType) => {
                return t.options.find(o => o.response.name === v[0])
            });
            if (row) {
                row.value[v[0]] = v[1];
            }
        })
        setTimeLineData(temp);
    }, [date]);

    /**
     * callBack on component close
     */
    const closeComponent = () => {
        setTimeLineData(rawTimeLineData);
        setDisplayComponent(false);
    }

    /**
     * Callback triggered when a value is changed in one HourChecker
     * Updates the parent activityData state
     */
    const updateValue = () => {
        const temp: WeeklyPlannerDataType[] = [...activityData];
        let dayBloc: WeeklyPlannerDataType = temp.filter(d => setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() === date.getTime())[0];
        let valuesList: LunaticMultiSelectionValues = {};

        // Create list of all LunaticMultiSelectionValues for this day
        timeLineData.map(t => t.value).forEach(t => {
            Object.entries(t).forEach(([key, value]) => {
                valuesList[key] = value;
            })
        });

        let details: DayDetailType[] = [];

        let startHour: string = "start";
        let endHour: string = "end";
        let durationTime: number = 0;

        Object.entries(valuesList).forEach(([key, value]) => {
            if (value && startHour === "start") {
                startHour = key;
                endHour = key;
                durationTime = durationTime + 15;
            } else if (value) {
                durationTime = durationTime + 15;
                endHour = key;
            }
            if (!value && endHour !== "end") {
                details.push({
                    start: startHour,
                    end: endHour,
                    duration: durationTime
                });
                startHour = "start";
                endHour = "end";
                durationTime = 0;
            }
        });

        dayBloc.detail = details;
        setActivityData(temp);
    }

    const renderRow = (h: TimeLineRowType): any => {
        return (<Box className={classes.rowContainer} key={uuidv4()}>
            <Typography className={classes.rowLabel}>{h.label}</Typography>
            <HourChecker responses={h.options} value={h.value} handleChange={() => updateValue()}></HourChecker>
        </Box>
        );
    }

    return (
        <Box className={classes.mainContainer} display={componentDisplay}>
            <Box className={classes.headerContainer}>
                <Typography className={classes.dayLabel}>{formateDateLabel(date)}</Typography>
                <Close onClick={closeComponent}></Close>
            </Box>
            <List className={classes.listContainer}>
                {timeLineData.map((l => renderRow(l)))}
            </List>
        </Box>
    );
});

const useStyles = makeStyles({ "name": { DayOverview } })(theme => ({
    mainContainer: {
        width: "50%",
        height: "100%",
        flexDirection: "column",
    },
    headerContainer: {
        backgroundColor: theme.variables.white,
        width: "100%",
        display: "flex",
        justifyContent: "space-between"
    },
    dayLabel: {
        color: theme.palette.info.main,
        fontSize: "14px",
    },
    listContainer: {
        display: "flex",
        flexDirection: "column",
    },
    rowContainer: {
        display: "flex",
        justifyContent: "space-between"
    },
    rowLabel: {
        color: theme.palette.info.main,
        fontSize: "12px",
    },
    rowHourChecker: {
        // TODO set width correctly
        width: "80%"
    }
}));

export default DayOverview;