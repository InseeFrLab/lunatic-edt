import { CircularProgress, List, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { memo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { WeeklyPlannerDataType, WeeklyPlannerValue } from "../../../../interface/WeeklyPlannerTypes";
import { makeStylesEdt } from "../../../theme";
import {
    generateDateFromStringInput,
    generateDayOverviewTimelineRawData,
    generateStringInputFromDate,
    getFrenchDayFromDate,
    setDateTimeToZero,
} from "../../../utils";
import { createCustomizableLunaticField } from "../../../utils/create-customizable-lunatic-field";
import ProgressBar from "../../ProgressBar";
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
    futureButtonLabel?: string;
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
        futureButtonLabel,
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
                    hasBeenStarted: false,
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
            JSON.stringify({ "data": activityData }),
        );
        setNeedSpinner(true);
    }, [activityData]);

    /**
     * Returns number between 0 and 100 depending on how many days of the week for which editing has been started
     * at the end discrete values between 1/7 and 7/7 rounded as %
     * @returns
     */
    const getProgressBarValue = (): number => {
        // Previously asked computation, kept if needed : Returns number between 0 and 100 depending of the situation of the current day regarding the startDate
        /* const ratio = Math.ceil((new Date().getTime() - startDateFormated.getTime()) / (1000 * 3600 * 24)) / 7
        const result = (ratio <= 0) ? 0 : (ratio >= 1) ? 100 : ratio * 100;
        return Math.round(result); */

        return Math.round((activityData.filter(a => a.hasBeenStarted === true).length / 7) * 100);
    };

    return (
        <Box>
            <DayOverview
                isDisplayed={isSubChildDisplayed}
                date={dayOverviewSelectedDate}
                rawTimeLineData={generateDayOverviewTimelineRawData()}
                activityData={activityData}
                setActivityData={setActivityData}
            ></DayOverview>
            {activityData.length !== 0 && needSpinner ? (
                <Box display={isSubChildDisplayed ? "none" : "inline"}>
                    <ProgressBar
                        className={classes.progressBar}
                        value={getProgressBarValue()}
                        showlabel={true}
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
                                setActivityData={setActivityData}
                                workSumLabel={workSumLabel}
                                presentButtonLabel={presentButtonLabel}
                                futureButtonLabel={futureButtonLabel}
                            ></DayPlanner>
                        ))}
                    </List>
                </Box>
            ) : (
                !isSubChildDisplayed && <CircularProgress />
            )}
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { WeeklyPlanner } })(theme => ({
    listContainer: {
        display: "flex",
        flexDirection: "column",
    },
    title: {
        marginTop: "5rem",
        fontSize: "14px",
    },
    progressBar: {
        padding: "1rem",
        backgroundColor: theme.variables.white,
        position: "absolute",
        left: "0",
        top: "4.1rem",
        overflowX: "hidden",
    }
}));

export default createCustomizableLunaticField(WeeklyPlanner, "WeeklyPlanner");
