import { List, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { memo } from "react";
import { makeStyles } from "tss-react/mui";
import { v4 as uuidv4 } from 'uuid';
import { createCustomizableLunaticField } from "../../../utils/create-customizable-lunatic-field";
import DayOverview from "../DayOverview/DayOverview";
import DayPlanner from "../DayPlanner/DayPlanner";
import { generateDayOverviewTimelineRowData, generateDateFromStringInput, setDateTimeToZero, generateStringInputFromDate, getFrenchDayFromDate } from "../../../utils";
import { WeeklyPlannerDataType } from "../../../../interface/WeeklyPlannerTypes"

export type WeeklyPlannerProps = {
    // french format: dd/mm/yyyy
    startDate: string,
    data: WeeklyPlannerDataType[]
};

// TODO general,
// Sum of working hours for one day
// 


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
}

const WeeklyPlanner = memo((props: WeeklyPlannerProps) => {
    const { classes } = useStyles();
    let { startDate, data } = props;

    const startDateFormated: Date = setDateTimeToZero(generateDateFromStringInput(startDate));
    const dayList = generateDayList(startDateFormated);

    const [displayDayOverview, setDisplayDayOverview] = React.useState<boolean>(false);
    const [dayOverviewSelectedDate, setDayOverviewSelectedDate] = React.useState<Date>(startDateFormated);
    const [activityData, setActivityData] = React.useState<WeeklyPlannerDataType[]>([]);

    // Complete activity data with default values for all days of the week if it was not the case in data input
    useEffect(() => {
        const temp: WeeklyPlannerDataType[] = [...data];
        dayList.forEach(date => {
            let dayBloc: WeeklyPlannerDataType | undefined = temp.find(d => setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() === date.getTime());
            if (!dayBloc) {
                dayBloc = {
                    date: generateStringInputFromDate(date),
                    day: getFrenchDayFromDate(date),
                    detail: []
                }
                temp.push(dayBloc);
            }
        });
        setActivityData(temp);
    }, []);


    console.log("activityData", activityData);

    return (
        <Box>
            <DayOverview
                isDisplayed={displayDayOverview}
                setDisplayComponent={setDisplayDayOverview}
                date={dayOverviewSelectedDate}
                rawTimeLineData={generateDayOverviewTimelineRowData()}
                activityData={activityData}
                setActivityData={setActivityData}></DayOverview>
            <Box display={displayDayOverview ? "none" : "inline"}>
                <Typography className={classes.title}>Planning de votre semaine</Typography>
                <List className={classes.listContainer}>
                    {dayList.map((d =>
                        <DayPlanner
                            date={d}
                            key={uuidv4()}
                            setDisplayDayOverview={setDisplayDayOverview}
                            setDayOverviewSelectedDate={setDayOverviewSelectedDate}
                            activityData={activityData}></DayPlanner>
                    ))}
                </List>
            </Box>
        </Box>
    );
});

const useStyles = makeStyles({ "name": { WeeklyPlanner } })(_theme => ({
    listContainer: {
        display: "flex",
        flexDirection: "column",
    },
    title: {
        fontSize: "14px",
    },
}));

export default createCustomizableLunaticField(WeeklyPlanner, "WeeklyPlanner");