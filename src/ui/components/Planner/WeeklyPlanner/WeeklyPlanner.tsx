import { List, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { memo } from "react";
import { makeStyles } from "tss-react/mui";
import { v4 as uuidv4 } from 'uuid';
import { createCustomizableLunaticField } from "../../../utils/create-customizable-lunatic-field";
import DayOverview from "../DayOverview/DayOverview";
import DayPlanner from "../DayPlanner/DayPlanner";
import { generateDayOverviewTimelineRowData } from "../../../utils";

export type WeeklyPlannerProps = {
    startDate: Date,
};

const generateDayList = (startDate: Date): Date[] => {
    const dayList = [startDate];
    for (let i = 1; i < 7; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i);
        dayList.push(newDate);
    }
    return dayList;
}

const WeeklyPlanner = memo((props: WeeklyPlannerProps) => {
    let { startDate } = props;
    // TODO temp
    startDate = new Date();
    const { classes } = useStyles();

    const [displayDayOverview, setDisplayDayOverview] = React.useState<boolean>(false);
    const [dayOverviewSelectedDate, setDayOverviewSelectedDate] = React.useState<Date>(new Date());

    return (
        <Box>
            <DayOverview 
                isDisplayed={displayDayOverview} 
                setDisplayComponent={setDisplayDayOverview} 
                date={dayOverviewSelectedDate} 
                rawTimeLineData={generateDayOverviewTimelineRowData()} 
                /*TODO temp*/values= {{"16h15": true}}></DayOverview>
            <Box display={displayDayOverview ? "none" : "inline"}>
                <Typography className={classes.title}>Planning de votre semaine</Typography>
                <List className={classes.listContainer}>
                    {generateDayList(startDate).map((d => 
                    <DayPlanner 
                        date={d} 
                        key={uuidv4()} 
                        setDisplayDayOverview={setDisplayDayOverview} 
                        setDayOverviewSelectedDate={setDayOverviewSelectedDate}></DayPlanner>
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