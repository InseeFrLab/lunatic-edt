import { Close } from "@mui/icons-material";
import { Box, List, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { memo } from "react";
import { makeStyles } from "tss-react/mui";
import { formateDate } from "../../../utils";
import { TimeLineRowType } from "../../../../interface/DayOverviewTypes";
import { LunaticMultiSelectionValues } from "../../../../interface/LunaticMultiSelectionValues";
import HourChecker from "../../HourChecker"

export type DayOverviewProps = {
    date: Date,
    isDisplayed: boolean,
    setDisplayComponent(display: boolean): void,
    rawTimeLineData: TimeLineRowType[],
    values: LunaticMultiSelectionValues
};

const formateDateLabel = (date: Date) => {
    const formatedDate = formateDate(date);
    return formatedDate.toUpperCase();
}

const DayOverview = memo((props: DayOverviewProps) => {
    const { date, isDisplayed, setDisplayComponent, rawTimeLineData, values } = props;
    const { classes } = useStyles();

    const [componentDisplay, setComponentDisplay] = React.useState<string>("none");
    const [timeLineData, setTimeLineData] = React.useState<TimeLineRowType[]>(rawTimeLineData);

    useEffect(() => {
        isDisplayed ? setComponentDisplay("flex") : setComponentDisplay("none");
    }, [isDisplayed]);

    useEffect(() => {
        const temp: TimeLineRowType[] = JSON.parse(JSON.stringify(timeLineData));
        // TODO manage wrong values
        Object.entries(values).forEach((v) => {
            const row: TimeLineRowType = temp.filter((t: TimeLineRowType) => {
                return t.options.filter(o => o.response.name === v[0])[0]
            })[0];
            row.value[v[0]] = v[1];  
        })

        setTimeLineData(temp);
    }, [values]);

    const closeComponent = () => {
        setDisplayComponent(false);
    }

    const renderRow = (h: TimeLineRowType): any => {
        return (<Box className={classes.rowContainer} key={uuidv4()}>
            <Typography className={classes.rowLabel}>{h.label}</Typography>
            <HourChecker responses={h.options} value={h.value} /*TODO temp */handleChange={() => console.log("change value")}></HourChecker>
        </Box>
        );
    }

    return (
        <Box className={classes.mainContainer} display={componentDisplay}>
            <Box className={classes.headerContainer}>
                <Typography className={classes.dayLabel}>{formateDateLabel(date)}</Typography>
                <Close onClick={closeComponent}></Close>
            </Box>
            <List className={classes.listContainer}>
                {timeLineData.map((l => renderRow(l)))}
            </List>
        </Box>
    );
});

const useStyles = makeStyles({ "name": { DayOverview } })(theme => ({
    mainContainer: {
        width: "50%",
        height: "100%",
        flexDirection: "column",
    },
    headerContainer: {
        backgroundColor: theme.variables.white,
        width: "100%",
        display: "flex",
        justifyContent: "space-between"
    },
    dayLabel: {
        color: theme.palette.info.main,
        fontSize: "14px",
    },
    listContainer: {
        display: "flex",
        flexDirection: "column",
    },
    rowContainer: {
        display: "flex",
        justifyContent: "space-between"
    },
    rowLabel: {
        color: theme.palette.info.main,
        fontSize: "12px",
    },
    rowHourChecker: {
        // TODO set width correctly
        width: "80%"
    }
}));

export default DayOverview;