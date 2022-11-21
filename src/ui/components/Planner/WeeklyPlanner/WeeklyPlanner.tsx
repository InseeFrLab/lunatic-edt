import { List, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { memo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { WeeklyPlannerDataType, WeeklyPlannerValue } from "../../../../interface/WeeklyPlannerTypes";
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
    let { value, handleChange, surveyDate, isSubChildDisplayed, setIsSubChildDisplayed } = props;

    const values: WeeklyPlannerValue = JSON.parse(value);
    const startDate: string = surveyDate;
    const data: WeeklyPlannerDataType[] | undefined = values?.data;

    const startDateFormated: Date = setDateTimeToZero(generateDateFromStringInput(startDate));
    const dayList = generateDayList(startDateFormated);

    const [dayOverviewSelectedDate, setDayOverviewSelectedDate] =
        React.useState<Date>(startDateFormated);
    const [activityData, setActivityData] = React.useState<WeeklyPlannerDataType[]>([]);

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
            <Box display={isSubChildDisplayed ? "none" : "inline"}>
                <Typography className={classes.title}>Planning de votre semaine</Typography>
                <List className={classes.listContainer}>
                    {dayList.map(d => (
                        <DayPlanner
                            date={d}
                            key={uuidv4()}
                            setDisplayDayOverview={setIsSubChildDisplayed}
                            setDayOverviewSelectedDate={setDayOverviewSelectedDate}
                            activityData={activityData}
                        ></DayPlanner>
                    ))}
                </List>
            </Box>
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { WeeklyPlanner } })(() => ({
    listContainer: {
        display: "flex",
        flexDirection: "column",
    },
    title: {
        marginTop: "2rem",
        fontSize: "14px",
    },
}));

export default createCustomizableLunaticField(WeeklyPlanner, "WeeklyPlanner");
