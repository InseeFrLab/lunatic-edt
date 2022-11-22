import { List, Typography, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import React, { memo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { WeeklyPlannerDataType, WeeklyPlannerValue } from "../../../../interface/WeeklyPlannerTypes";
import ProgressBar from "../../ProgressBar";
import { makeStylesEdt } from "../../../theme";
import {
    generateDateFromStringInput,
    generateDayOverviewTimelineRowData,
    generateStringInputFromDate,
    getFrenchDayFromDate,
    setDateTimeToZero,
} from "../../../utils";
import { createCustomizableLunaticField } from "../../../utils/create-customizable-lunatic-field";
import DayOverview from "../DayOverview/DayOverview";
import DayPlanner from "../DayPlanner/DayPlanner";

export type WeeklyPlannerProps = {
    handleChange(response: { [name: string]: string }, value: string): void;
    value: string;
    surveyDate: string;
    isSubChildDisplayed: boolean;
    setIsSubChildDisplayed(value: boolean): void;
    title: string;
    workSumLabel?: string;
    presentButtonLabel?: string;
    pastButtonLabel?: string;
};

/**
 * Generates a week of date starting from the startDate
 * @param startDate
 * @returns
 */
const generateDayList = (startDate: Date): Date[] => {
    const dayList: Date[] = [startDate];
    for (let i = 1; i < 7; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i);
        dayList.push(newDate);
    }
    return dayList;
};

const WeeklyPlanner = memo((props: WeeklyPlannerProps) => {
    const { classes } = useStyles();
    let {
        value,
        handleChange,
        surveyDate,
        isSubChildDisplayed,
        setIsSubChildDisplayed,
        title,
        workSumLabel,
        presentButtonLabel,
        pastButtonLabel,
    } = props;

    const values: WeeklyPlannerValue = JSON.parse(value);
    const startDate: string = surveyDate;
    const data: WeeklyPlannerDataType[] | undefined = values?.data;

    const startDateFormated: Date = setDateTimeToZero(generateDateFromStringInput(startDate));
    const dayList = generateDayList(startDateFormated);

    const [dayOverviewSelectedDate, setDayOverviewSelectedDate] =
        React.useState<Date>(startDateFormated);
    const [activityData, setActivityData] = React.useState<WeeklyPlannerDataType[]>([]);
    const [needSpinner, setNeedSpinner] = React.useState<boolean>(true);

    useEffect(() => {
        setNeedSpinner(false);
    }, [isSubChildDisplayed]);

    // Complete activity data with default values for all days of the week if it was not the case in data input
    useEffect(() => {
        const temp: WeeklyPlannerDataType[] = data ? [...data] : [];
        dayList.forEach(date => {
            let dayBloc: WeeklyPlannerDataType | undefined = temp.find(
                d => setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() === date.getTime(),
            );
            if (!dayBloc) {
                dayBloc = {
                    date: generateStringInputFromDate(date),
                    day: getFrenchDayFromDate(date),
                    detail: [],
                };
                temp.push(dayBloc);
            }
        });
        setActivityData(temp);
    }, []);

    useEffect(() => {
        handleChange(
            { name: "WEEKLYPLANNER" },
            JSON.stringify({ "startDate": startDate, "data": activityData }),
        );
        setNeedSpinner(true);
    }, [activityData]);

    return (
        <Box>
            <DayOverview
                isDisplayed={isSubChildDisplayed}
                date={dayOverviewSelectedDate}
                rawTimeLineData={generateDayOverviewTimelineRowData()}
                activityData={activityData}
                setActivityData={setActivityData}
            ></DayOverview>
            {(activityData.length !== 0 && needSpinner) ?
                <Box display={isSubChildDisplayed ? "none" : "inline"}>
                    <ProgressBar
                        className={classes.progressBar}
                        value={25}
                        displayValue={true}
                    />
                    <Typography className={classes.title}>{title}</Typography>
                    <List className={classes.listContainer}>
                        {dayList.map(d => (
                            <DayPlanner
                                date={d}
                                key={uuidv4()}
                                setDisplayDayOverview={setIsSubChildDisplayed}
                                setDayOverviewSelectedDate={setDayOverviewSelectedDate}
                                activityData={activityData}
                                workSumLabel={workSumLabel}
                                presentButtonLabel={presentButtonLabel}
                                pastButtonLabel={pastButtonLabel}
                            ></DayPlanner>
                        ))}
                    </List>
                </Box>
                : <CircularProgress></CircularProgress>}
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { WeeklyPlanner } })((theme) => ({
    listContainer: {
        display: "flex",
        flexDirection: "column",
    },
    title: {
        marginTop: "2rem",
        fontSize: "14px",
    },
    progressBar: {
        marginTop: "1rem",
        marginBottom: "1rem",
        padding: "1rem",
        backgroundColor: theme.variables.white,
        position: "absolute",
        top: "4.25rem",
        left: "0rem"
    },
}));

export default createCustomizableLunaticField(WeeklyPlanner, "WeeklyPlanner");
