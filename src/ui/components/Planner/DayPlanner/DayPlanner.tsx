import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { WeeklyPlannerDataType } from "../../../../interface/WeeklyPlannerTypes";
import { makeStylesEdt } from "../../../theme";
import {
    formateDateToFrenchFormat,
    generateDateFromStringInput,
    setDateTimeToZero,
} from "../../../utils";
import ProgressBar from "../../ProgressBar";

export type DayPlannerProps = {
    date: Date;
    setDisplayDayOverview(display: boolean): void;
    setDayOverviewSelectedDate(date: Date): void;
    activityData: WeeklyPlannerDataType[];
    setActivityData(data: WeeklyPlannerDataType[]): void;
    workSumLabel?: string;
    presentButtonLabel?: string;
    futureButtonLabel?: string;
};

enum DayRelativeTimeEnum {
    Past = -1,
    Today = 0,
    Future = 1,
}

const renderDateLabel = (date: Date): string => {
    const formatedDate: string = formateDateToFrenchFormat(date);
    return formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);
};

/**
 * Returns total sum of work for the day formatted as h:mm
 * @returns
 */
const getFormatedWorkedSum = (workedHoursSum: number): string => {
    const tempDate = new Date();
    tempDate.setHours(0);
    tempDate.setMinutes(workedHoursSum);
    return (
        tempDate.getHours() +
        ":" +
        (tempDate.getMinutes() === 0 ? "00" : tempDate.getMinutes().toString())
    );
};

const setDay = (setDayRelativeTime: any, date: Date, todayDate: Date) => {
    if (date.getTime() >= todayDate.getTime()) {
        date.getTime() === todayDate.getTime()
            ? setDayRelativeTime(DayRelativeTimeEnum.Today)
            : setDayRelativeTime(DayRelativeTimeEnum.Future);
    } else setDayRelativeTime(DayRelativeTimeEnum.Past);
};

const DayPlanner = React.memo((props: DayPlannerProps) => {
    const { classes, cx } = useStyles();
    const {
        date,
        setDisplayDayOverview,
        setDayOverviewSelectedDate,
        activityData,
        setActivityData,
        workSumLabel,
        presentButtonLabel,
        futureButtonLabel,
    } = props;

    const [dayRelativeTime, setDayRelativeTime] = React.useState<DayRelativeTimeEnum>();
    const [workedHoursSum, setWorkedHoursSum] = React.useState<number>(0);
    const [hasBeenStarted, setHasBeenStarted] = React.useState<boolean>();

    const todayDate: Date = setDateTimeToZero(new Date());

    // Define DayRelativeTime for each day of the week regarding the current day
    useEffect(() => {
        setDay(setDayRelativeTime, date, todayDate);
    }, [date]);

    useEffect(() => {
        const dayBloc: WeeklyPlannerDataType = activityData.filter(
            d => setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() === date.getTime(),
        )[0];
        const sum: number = dayBloc?.detail.reduce((acc, val) => acc + val.duration, 0);
        setWorkedHoursSum(sum);
        setHasBeenStarted(dayBloc?.hasBeenStarted);
    }, [activityData]);

    /**
     * Callback for buttons and three dots icon
     */
    const buttonsOnClick = useCallback((): void => {
        const temp = [...activityData];
        const dayBloc: WeeklyPlannerDataType = temp.filter(
            d => setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() === date.getTime(),
        )[0];
        dayBloc.hasBeenStarted = true;
        setActivityData(temp);

        setDisplayDayOverview(true);
        setDayOverviewSelectedDate(date);
    }, []);

    const renderBottomPart = () => {
        if (dayRelativeTime === -1) {
            return (
                <Box className={classes.textBox}>
                    <Typography className={classes.workTimeText}>
                        {workSumLabel}
                        <span className={classes.bold}>{getFormatedWorkedSum(workedHoursSum)}</span>
                    </Typography>
                </Box>
            );
        } else if (dayRelativeTime === 0 || hasBeenStarted) {
            return (
                <Box className={classes.buttonBox}>
                    {dayRelativeTime === 0 && (
                        <ProgressBar
                            className={classes.progressBar}
                            value={Math.round((new Date().getHours() / 24) * 100)}
                        />
                    )}
                    <Button className={classes.button} onClick={buttonsOnClick}>
                        {presentButtonLabel}
                    </Button>
                </Box>
            );
        } else {
            return (
                <Box className={classes.buttonBox}>
                    <Button
                        className={cx(classes.button, classes.buttonFuture)}
                        onClick={buttonsOnClick}
                    >
                        {futureButtonLabel}
                    </Button>
                </Box>
            );
        }
    };

    const getMainContainerComplementaryClass = () => {
        return dayRelativeTime === 0 ? classes.mainContainerPresent : "";
    };
    const getDayAndDotsClass = () => {
        return dayRelativeTime === -1 ? classes.dayAndDotsContainer : "";
    };
    const renderMoreIcon = () => {
        return dayRelativeTime === -1 ? (
            <MoreHorizIcon className={classes.clickable} onClick={buttonsOnClick}></MoreHorizIcon>
        ) : (
            <></>
        );
    };

    return (
        <>
            {dayRelativeTime !== undefined ? (
                <Box
                    className={cx(classes.mainContainer, getMainContainerComplementaryClass())}
                    aria-label="dayplanner"
                >
                    <Box className={getDayAndDotsClass()}>
                        <Typography className={cx(classes.dayLabel, classes.bold)}>
                            {renderDateLabel(date)}
                        </Typography>
                        {renderMoreIcon()}
                    </Box>
                    {renderBottomPart()}
                </Box>
            ) : (
                <Box className={classes.mainContainer}>
                    <CircularProgress></CircularProgress>
                </Box>
            )}
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { DayPlanner } })(theme => ({
    mainContainer: {
        marginTop: "1.25rem",
        padding: "1rem",
        width: "350px",
        borderRadius: "5px",
        backgroundColor: theme.palette.background.paper,
    },
    mainContainerPresent: {
        backgroundColor: theme.variables.white,
    },
    dayAndDotsContainer: {
        display: "flex",
        justifyContent: "space-between",
    },
    dayLabel: {
        fontSize: "16px",
    },
    textBox: {
        marginTop: "1rem",
    },
    workTimeText: {
        fontSize: "14px",
    },
    buttonBox: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    button: {
        marginTop: "1.5rem",
        color: theme.variables.white,
        width: "100%",
        backgroundColor: theme.palette.primary.main,
    },
    buttonFuture: {
        backgroundColor: theme.palette.action.hover,
    },
    progressBar: {
        marginTop: "1rem",
    },
    clickable: {
        cursor: "pointer",
    },
    bold: {
        fontWeight: "bold",
    },
}));

export default DayPlanner;
