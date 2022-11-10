import Box from "@mui/material/Box";
import LinearProgress, { LinearProgressProps } from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import React, { memo } from "react";
import { makeStylesEdt } from "../../theme";

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    let labelTranslateX = props.value - 2;
    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35, ml: 1 }}>
                <Typography
                    style={{ transform: "translateX(" + labelTranslateX + "%)" }}
                    color="primary"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

export type ProgressBarProps = {
    id?: string;
};

const ProgressBar = memo((props: ProgressBarProps) => {
    //TODO : to complete when we know how to override/use it from lunatic
    const { id } = props;

    const [progress, setProgress] = React.useState(10);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prevProgress => (prevProgress >= 100 ? 10 : prevProgress + 10));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, []);

    const { classes } = useStyles();

    return (
        <Box sx={{ width: "100%" }} className={classes.root}>
            <LinearProgressWithLabel id={id} value={progress} />
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { ProgressBar } })(theme => ({
    root: {
        "& .MuiLinearProgress-colorPrimary": {
            backgroundColor: theme.variables.neutral,
            borderRadius: "10px",
            height: "8px",
        },
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: theme.palette.warning.main,
            borderRadius: "10px",
        },
    },
}));

export default ProgressBar;
