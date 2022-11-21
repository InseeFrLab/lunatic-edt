import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { WeeklyPlannerDataType } from "../../../../interface/WeeklyPlannerTypes";
import { makeStylesEdt } from "../../../theme";
import {
    formateDateToFrenchFormat,
    generateDateFromStringInput,
    setDateTimeToZero,
} from "../../../utils";

export type DayPlannerProps = {
    date: Date;
    setDisplayDayOverview(display: boolean): void;
    setDayOverviewSelectedDate(date: Date): void;
    activityData: WeeklyPlannerDataType[];
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

const DayPlanner = React.memo((props: DayPlannerProps) => {
    const { classes, cx } = useStyles();
    const { date, setDisplayDayOverview, setDayOverviewSelectedDate, activityData } = props;

    const [dayRelativeTime, setDayRelativeTime] = React.useState<DayRelativeTimeEnum>(-1);
    const [workedHoursSum, setWorkedHoursSum] = React.useState<number>(0);

    const todayDate: Date = setDateTimeToZero(new Date());

    // Define DayRelativeTime for each day of the week regarding the current day
    useEffect(() => {
        date.getTime() >= todayDate.getTime()
            ? date.getTime() === todayDate.getTime()
                ? setDayRelativeTime(DayRelativeTimeEnum.Today)
                : setDayRelativeTime(DayRelativeTimeEnum.Future)
            : setDayRelativeTime(DayRelativeTimeEnum.Past);
    }, [date]);

    useEffect(() => {
        const dayBloc: WeeklyPlannerDataType = activityData.filter(
            d => setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() === date.getTime(),
        )[0];
        const sum: number = dayBloc?.detail.reduce((sum, val) => sum + val.duration, 0);
        setWorkedHoursSum(sum);
    }, [activityData]);

    /**
     * Callback for buttons and three dots icon
     */
    const buttonsOnClick = (): void => {
        setDisplayDayOverview(true);
        setDayOverviewSelectedDate(date);
    };

    const renderBottomPart = () => {
        return dayRelativeTime === -1 ? (
            <Box className={classes.textBox}>
                <Typography className={classes.workTimeText}>
                    Durée totale travaillée : <span className={classes.bold}>{workedHoursSum}</span>{" "}
                    minutes
                </Typography>
            </Box>
        ) : dayRelativeTime === 0 || workedHoursSum !== 0 ? (
            <Box className={classes.buttonBox}>
                <Button className={classes.button} onClick={buttonsOnClick}>
                    Continuer
                </Button>
            </Box>
        ) : (
            <Box className={classes.buttonBox}>
                <Button className={cx(classes.button, classes.buttonFuture)} onClick={buttonsOnClick}>
                    Commencer
                </Button>
            </Box>
        );
    };

    return (
        <>
            <Box
                className={cx(
                    classes.mainContainer,
                    dayRelativeTime === 0 ? classes.mainContainerPresent : "",
                )}
            >
                <Box className={dayRelativeTime === -1 ? classes.dayAndDotsContainer : ""}>
                    <Typography className={cx(classes.dayLabel, classes.bold)}>
                        {renderDateLabel(date)}
                    </Typography>
                    {dayRelativeTime === -1 ? (
                        <MoreHorizIcon
                            className={classes.clickable}
                            onClick={buttonsOnClick}
                        ></MoreHorizIcon>
                    ) : (
                        <></>
                    )}
                </Box>
                {renderBottomPart()}
            </Box>
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { DayPlanner } })(theme => ({
    mainContainer: {
        marginTop: "1.25rem",
        padding: "1rem",
        width: "100%",
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
        justifyContent: "center",
        marginTop: "2rem",
    },
    button: {
        color: theme.variables.white,
        width: "100%",
        backgroundColor: theme.palette.primary.main,
    },
    buttonFuture: {
        backgroundColor: theme.palette.action.hover,
    },
    clickable: {
        cursor: "pointer",
    },
    bold: {
        fontWeight: "bold",
    },
}));

export default DayPlanner;
