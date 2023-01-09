import { CircularProgress, List, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { WeeklyPlannerSpecificProps } from "interface";
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
    componentSpecificProps: WeeklyPlannerSpecificProps;
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
    let { value, handleChange, componentSpecificProps } = props;

    const { surveyDate, isSubChildDisplayed, setIsSubChildDisplayed, labels } = {
        ...componentSpecificProps,
    };

    const values: WeeklyPlannerValue = JSON.parse(value);
    const startDate: string = surveyDate || "";
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
        handleChange({ name: "WEEKLYPLANNER" }, JSON.stringify({ "data": activityData }));
        setNeedSpinner(true);
    }, [activityData]);

    /**
     * Returns number between 0 and 100 depending on how many days of the week for which editing has been started
     * at the end discrete values between 1/7 and 7/7 rounded as %
     * @returns
     */
    const getProgressBarValue = (): number => {
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
                    <Typography className={classes.title}>{labels.title}</Typography>
                    <List className={classes.listContainer}>
                        {dayList.map(d => (
                            <DayPlanner
                                date={d}
                                key={uuidv4()}
                                setDisplayDayOverview={setIsSubChildDisplayed}
                                setDayOverviewSelectedDate={setDayOverviewSelectedDate}
                                activityData={activityData}
                                setActivityData={setActivityData}
                                workSumLabel={labels.workSumLabel}
                                presentButtonLabel={labels.presentButtonLabel}
                                futureButtonLabel={labels.futureButtonLabel}
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
    },
}));

export default createCustomizableLunaticField(WeeklyPlanner, "WeeklyPlanner");
