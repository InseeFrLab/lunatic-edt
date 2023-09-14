import { Box, Button, CircularProgress, Popover, Typography } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { IODataStructure, WeeklyPlannerDataType } from "../../../../interface/WeeklyPlannerTypes";
import { makeStylesEdt } from "../../../theme";
import {
    formateDateToFrenchFormat,
    generateDateFromStringInput,
    setDateTimeToZero,
} from "../../../utils";
import { responseType } from "interface";

export type DayPlannerProps = {
    date: Date;
    setDisplayDayOverview(display: boolean): void;
    setDayOverviewSelectedDate(date: Date): void;
    activityData: WeeklyPlannerDataType[];
    setActivityData(data: WeeklyPlannerDataType[]): void;
    workSumLabel?: string;
    presentButtonLabel?: string;
    futureButtonLabel?: string;
    editButtonLabel?: string;
    language: string;
    getFormatedWorkedSum: (workedHoursSum: number) => string;
    moreIcon: string;
    moreIconAlt: string;
    modifiable?: boolean;
    dataCopy: IODataStructure[];
    handleChange(response: responseType, value: IODataStructure[]): void;
};

enum DayRelativeTimeEnum {
    Past = -1,
    Today = 0,
    Future = 1,
}

const renderDateLabel = (date: Date, language: string): string => {
    const formatedDate: string = formateDateToFrenchFormat(date, language);
    return formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);
};

const setDay = (setDayRelativeTime: any, date: Date, todayDate: Date) => {
    if (date.getTime() >= todayDate.getTime()) {
        date.getTime() === todayDate.getTime()
            ? setDayRelativeTime(DayRelativeTimeEnum.Today)
            : setDayRelativeTime(DayRelativeTimeEnum.Future);
    } else setDayRelativeTime(DayRelativeTimeEnum.Past);
};

/**
 * This component is the one shown inside WeeklyPlanner component when the user still have to
 * choose a day to fullfil.
 * It allows the user to select the day he wants to fullfil and also give information about the status
 * of the completion of this day.
 */
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
        editButtonLabel,
        language,
        getFormatedWorkedSum,
        moreIcon,
        moreIconAlt,
        modifiable = true,
        dataCopy,
        handleChange,
    } = props;

    const [dayRelativeTime, setDayRelativeTime] = React.useState<DayRelativeTimeEnum>();
    const [workedHoursSum, setWorkedHoursSum] = React.useState<number>(0);
    const [hasBeenStarted, setHasBeenStarted] = React.useState<boolean>(false);

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const openPopOver = Boolean(anchorEl);
    const id = openPopOver ? "edit-popover" : undefined;

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
        setHasBeenStarted(dayBloc?.hasBeenStarted ?? false);
    }, [activityData]);

    /**
     * Callback for buttons and three dots icon
     */
    const buttonsOnClick = useCallback((): void => {
        const temp = [...activityData];
        console.log(activityData);
        const dayBloc: WeeklyPlannerDataType = temp.filter(
            d => setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() === date.getTime(),
        )[0];
        dayBloc.hasBeenStarted = true;
        setActivityData(temp);

        setDisplayDayOverview(true);
        setDayOverviewSelectedDate(date);
        handleChange({ name: "WEEKLYPLANNER" }, dataCopy);
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
                        <Box className={classes.textBox}>
                            <Typography className={classes.workTimeText}>
                                {workSumLabel}
                                <span className={classes.bold}>
                                    {getFormatedWorkedSum(workedHoursSum)}
                                </span>
                            </Typography>
                        </Box>
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

    const onEditCard = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget as HTMLButtonElement);
    }, []);

    const handleClose = useCallback(
        (e: React.MouseEvent) => {
            setAnchorEl(null);
            e.stopPropagation();
        },
        [anchorEl],
    );

    const renderMoreIcon = () => {
        return dayRelativeTime === -1 ? (
            <Box>
                <img
                    src={moreIcon}
                    alt={moreIconAlt}
                    className={classes.clickable}
                    onClick={onEditCard}
                />
                <Popover
                    id={id}
                    open={openPopOver}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    className={classes.popOver}
                >
                    <Typography onClick={buttonsOnClick} className={classes.clickableText}>
                        {editButtonLabel}
                    </Typography>
                </Popover>
            </Box>
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
                            {renderDateLabel(date, language)}
                        </Typography>
                        {modifiable && renderMoreIcon()}
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
    popOver: {
        "& .MuiPopover-paper": {
            backgroundColor: theme.variables.white,
            padding: "0.5rem",
        },
    },
    clickableText: {
        cursor: "pointer",
        "&:hover": {
            color: theme.palette.primary.light,
        },
    },
}));

export default DayPlanner;
