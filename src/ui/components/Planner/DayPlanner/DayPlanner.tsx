import { Box, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import { formateDate } from "../../../utils";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export type DayPlannerProps = {
    date: Date,
    setDisplayDayOverview(display: boolean): void,
    setDayOverviewSelectedDate(date: Date): void
};

// TODO temp to have past, present and future together for dev
const todayDay: Date = new Date();
todayDay.setDate(todayDay.getDate() + 2);

enum DayRelativeTimeEnum {
    Past = -1,
    Today = 0,
    Future = 1
}

const renderDateLabel = (date: Date) => {
    const formatedDate = formateDate(date);
    return formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);
}

const DayPlanner = React.memo((props: DayPlannerProps) => {
    const { date, setDisplayDayOverview, setDayOverviewSelectedDate } = props;
    const { classes } = useStyles();
    const [dayRelativeTime, setDayRelativeTime] = React.useState<DayRelativeTimeEnum>();

    useEffect(() => {
        date.getDate() >= todayDay.getDate()
            ? date.getDate() === todayDay.getDate()
                ? setDayRelativeTime(DayRelativeTimeEnum.Today)
                : setDayRelativeTime(DayRelativeTimeEnum.Future)
            : setDayRelativeTime(DayRelativeTimeEnum.Past);
    }, [date]);

    /**
     * Callback for buttons and three dots icon
     */
    const buttonsOnClick = () => {
        setDisplayDayOverview(true);
        setDayOverviewSelectedDate(date);
    }

    const renderBottomPart = () => {
        return dayRelativeTime === -1
            ? (<Typography>Durée totale travaillée :</Typography>)
            : dayRelativeTime === 0
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