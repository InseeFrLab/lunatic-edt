import { CircularProgress, List, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { WeeklyPlannerSpecificProps } from "interface";
import React, { memo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { WeeklyPlannerDataType, IODataStructure } from "../../../../interface/WeeklyPlannerTypes";
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
import {
    getProgressBarValue,
    transformToIODataStructure,
    transformToWeeklyPlannerDataType,
} from "./utils";

export type WeeklyPlannerProps = {
    handleChange(response: { [name: string]: string }, value: IODataStructure[]): void;
    value: IODataStructure[];
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
    let { value, handleChange, componentSpecificProps } = props;

    const { surveyDate, isSubChildDisplayed, setIsSubChildDisplayed, labels } = {
        ...componentSpecificProps,
    };
    const rootBoxWidth = document.getElementById("root-box")?.parentElement?.clientWidth;
    const halfRootBoxWidthPx = (rootBoxWidth ? (rootBoxWidth / 2).toString() : "0") + "px";
    const { classes } = useStyles({
        "transform": `translateX(calc(${halfRootBoxWidthPx} - 50vw))`,
    });

    const data: WeeklyPlannerDataType[] | undefined =
        value.length > 1 ? transformToWeeklyPlannerDataType(value) : undefined;
    const startDate: string = surveyDate || "";

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
        const toStore = transformToIODataStructure(activityData);
        handleChange({ name: "WEEKLYPLANNER" }, toStore);
        setNeedSpinner(true);
    }, [activityData]);

    const getMainDisplay = () => {
        return isSubChildDisplayed ? "none" : "inline";
    };

    return (
        <Box id="root-box">
            <DayOverview
                isDisplayed={isSubChildDisplayed}
                date={dayOverviewSelectedDate}
                rawTimeLineData={generateDayOverviewTimelineRawData()}
                activityData={activityData}
                setActivityData={setActivityData}
            ></DayOverview>
            {activityData.length !== 0 && needSpinner ? (
                <Box display={getMainDisplay()}>
                    <ProgressBar
                        className={classes.progressBar}
                        value={getProgressBarValue(activityData)}
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

const useStyles = makeStylesEdt<{ transform: string }>({ "name": { WeeklyPlanner } })(
    (theme, { transform }) => ({
        listContainer: {
            display: "flex",
            flexDirection: "column",
            paddingBottom: "6rem",
        },
        title: {
            marginTop: "2rem",
            fontSize: "14px",
        },
        progressBar: {
            padding: "1rem",
            backgroundColor: theme.variables.white,
            position: "relative",
            width: "100vw !important",
            overflowX: "hidden",
            transform,
        },
    }),
);

export default createCustomizableLunaticField(WeeklyPlanner, "WeeklyPlanner");
