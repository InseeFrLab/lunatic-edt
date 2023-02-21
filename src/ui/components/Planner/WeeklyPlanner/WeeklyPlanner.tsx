import { CircularProgress, List, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { WeeklyPlannerSpecificProps } from "interface";
import React, { memo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { IODataStructure, WeeklyPlannerDataType } from "../../../../interface/WeeklyPlannerTypes";
import { makeStylesEdt } from "../../../theme";
import {
    formateDateToFrenchFormat,
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

    const {
        surveyDate,
        isSubChildDisplayed,
        setIsSubChildDisplayed,
        labels,
        saveAll,
        setDisplayedDayHeader,
        language,
    } = {
        ...componentSpecificProps,
    };
    const { classes } = useStyles();

    const data: WeeklyPlannerDataType[] | undefined =
        value.length > 1 ? transformToWeeklyPlannerDataType(value, language) : undefined;
    const startDate: string = surveyDate || "";

    const startDateFormated: Date = setDateTimeToZero(generateDateFromStringInput(startDate));
    const dayList = generateDayList(startDateFormated);

    const [dayOverviewSelectedDate, setDayOverviewSelectedDate] =
        React.useState<Date>(startDateFormated);
    const [activityData, setActivityData] = React.useState<WeeklyPlannerDataType[]>([]);
    const [needSpinner, setNeedSpinner] = React.useState<boolean>(true);

    const formateDateLabel = (date: Date): string => {
        const formatedDate = formateDateToFrenchFormat(date, language);
        return formatedDate.toUpperCase();
    };

    useEffect(() => {
        setNeedSpinner(false);
    }, [isSubChildDisplayed]);

    useEffect(() => {
        setDisplayedDayHeader(formateDateLabel(dayOverviewSelectedDate));
    }, [dayOverviewSelectedDate]);

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
        // loop through saved data to check if some are out of the week range after survey date update
        const dayListAsString: string[] = dayList.map(d => generateStringInputFromDate(d));
        const clearedTemp = temp
            .filter(dayBloc => dayListAsString.includes(dayBloc.date))
            .sort((a, b) => a.date.localeCompare(b.date));

        setActivityData(clearedTemp);
        const toStore = transformToIODataStructure(clearedTemp);
        handleChange({ name: "WEEKLYPLANNER" }, toStore);
    }, []);

    useEffect(() => {
        setNeedSpinner(true);
        saveAll();
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
                handleChangeData={handleChange}
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
                                language={language}
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
        //Orchestrator content width is limited to 350px, 175px correspond to half if it
        transform: "translateX(calc(175px - 50vw))",
    },
}));

export default createCustomizableLunaticField(WeeklyPlanner, "WeeklyPlanner");
