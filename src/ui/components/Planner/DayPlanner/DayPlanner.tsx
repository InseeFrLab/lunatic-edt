import { Box, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import { formateDateToFrenchFormat, setDateTimeToZero, generateDateFromStringInput } from "../../../utils";
import { WeeklyPlannerDataType } from "../../../../interface/WeeklyPlannerTypes";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export type DayPlannerProps = {
    date: Date,
    setDisplayDayOverview(display: boolean): void,
    setDayOverviewSelectedDate(date: Date): void,
    activityData: WeeklyPlannerDataType[]
};

enum DayRelativeTimeEnum {
    Past = -1,
    Today = 0,
    Future = 1
}

const renderDateLabel = (date: Date): string => {
    const formatedDate: string = formateDateToFrenchFormat(date);
    return formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);
}

const DayPlanner = React.memo((props: DayPlannerProps) => {
    const { classes } = useStyles();
    const { date, setDisplayDayOverview, setDayOverviewSelectedDate, activityData } = props;

    const [dayRelativeTime, setDayRelativeTime] = React.useState<DayRelativeTimeEnum>();
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
        const dayBloc: WeeklyPlannerDataType = activityData.filter(d => setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() === date.getTime())[0];
        const sum: number = dayBloc?.detail.reduce((sum, val) => sum + val.duration, 0);
        setWorkedHoursSum(sum);
    }, [activityData])

    /**
     * Callback for buttons and three dots icon
     */
    const buttonsOnClick = (): void => {
        setDisplayDayOverview(true);
        setDayOverviewSelectedDate(date);
    }

    const renderBottomPart = () => {
        return dayRelativeTime === -1
            ? (<Typography>Durée totale travaillée : {workedHoursSum} minutes</Typography>)
            : dayRelativeTime === 0 || workedHoursSum !== 0
                ? (<Button className={classes.buttonPresent} onClick={buttonsOnClick}>Continuer</Button>)
                : (<Button className={classes.buttonFuture} onClick={buttonsOnClick}>Commencer</Button>)
    }

    return (
        <>
            <Box className={dayRelativeTime === 0 ? classes.mainContainerPresent : classes.mainContainer}>
                <Box className={dayRelativeTime === -1 ? classes.dayAndDotsContainer : ""}>
                    <Typography className={classes.dayLabel}>
                        {renderDateLabel(date)}
                    </Typography>
                    {dayRelativeTime === -1 ? <MoreHorizIcon onClick={buttonsOnClick}></MoreHorizIcon> : <></>}
                </Box>
                {renderBottomPart()}
            </Box>
        </>
    );
});

const useStyles = makeStyles({ "name": { DayPlanner } })(theme => ({
    mainContainer: {
        marginTop: "20px",
        width: "50%",
        borderRadius: "5px",
        backgroundColor: theme.palette.background.paper
    },
    mainContainerPresent: {
        marginTop: "20px",
        width: "50%",
        borderRadius: "5px",
        backgroundColor: theme.variables.white,
    },
    dayAndDotsContainer: {
        display: "flex",
        justifyContent: "space-between"
    },
    dayLabel: {
        fontSize: "16px",
        fontWeight: "bold",
    },
    buttonPresent: {
        backgroundColor: theme.palette.primary.main,
        color: theme.variables.white,
        width: "80%",
        height: "32px",
        margin: "5%"
    },
    buttonFuture: {
        backgroundColor: theme.palette.action.hover,
        color: theme.variables.white,
        width: "80%",
        height: "32px",
        margin: "5%"
    },
}));

export default DayPlanner;