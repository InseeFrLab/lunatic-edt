import Box from "@mui/material/Box";
import LinearProgress, { LinearProgressProps } from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import React, { memo } from "react";
import { makeStylesEdt } from "../../theme";

function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number; displayValue?: boolean },
) {
    let labelTranslateX = props.value - 2;
    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35, ml: 1 }}>
                {props.displayValue && (
                    <Typography
                        style={{ fontSize: "12px", transform: "translateX(" + labelTranslateX + "%)" }}
                        color="primary"
                    >
                        {props.value}%
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export type ProgressBarProps = {
    value: number;
    displayValue?: boolean;
    id?: string;
    className?: string;
    isPrimaryMainColor?: boolean;
};

const ProgressBar = memo((props: ProgressBarProps) => {
    //TODO : to complete when we know how to override/use it from lunatic
    const { value, displayValue, id, className, isPrimaryMainColor = false } = props;

    const [progress, setProgress] = React.useState(value);

    const { classes, cx } = useStyles();

    return (
        <Box
            className={cx(
                className,
                classes.root,
                isPrimaryMainColor ? classes.primaryMainColor : classes.primaryWarningColor,
            )}
        >
            <LinearProgressWithLabel id={id} value={progress} displayValue={displayValue} />
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { ProgressBar } })(theme => ({
    root: {
        width: "100%",
        "& .MuiLinearProgress-colorPrimary": {
            backgroundColor: theme.variables.neutral,
            borderRadius: "10px",
            height: "8px",
        },
        "& .MuiLinearProgress-barColorPrimary": {
            borderRadius: "10px",
        },
    },
    primaryMainColor: {
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: theme.palette.primary.main,
        },
    },
    primaryWarningColor: {
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: theme.palette.warning.main,
        },
    },
}));

export default ProgressBar;
