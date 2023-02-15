import { IconButton, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { InfoProps } from "interface";
import React, { memo } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Info from "../Info";

export type TooltipInfoProps = {
    infoLabels: InfoProps;
    titleLabel?: string;
    displayTooltip?: boolean;
};

const TooltipInfo = memo((props: TooltipInfoProps) => {
    const { infoLabels, titleLabel, displayTooltip } = props;
    const { classes } = useStyles();

    const [displayInfo, setDisplayInfo] = React.useState<boolean>(false);

    return (
        <Box className={classes.root}>
            <Box className={titleLabel ? classes.titleBox : classes.headerBox}>
                {titleLabel && <Typography className={classes.title}>{titleLabel}</Typography>}
                <Tooltip title="Info" className={displayTooltip ? classes.hiddenBox : classes.iconBox}>
                    <IconButton onClick={() => setDisplayInfo(!displayInfo)}>
                        <InfoOutlinedIcon className={classes.iconInfoBox} />
                    </IconButton>
                </Tooltip>
            </Box>
            {infoLabels && (
                <Box className={displayInfo || displayTooltip ? classes.infoBox : classes.hiddenBox}>
                    <Info {...infoLabels} />
                </Box>
            )}
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { TooltipInfo } })(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
    },
    title: {
        fontSize: "14px",
    },
    headerBox: {
        display: "flex",
        justifyContent: "end",
        padding: "0.5rem",
    },
    titleBox: {
        display: "flex",
        marginTop: "2rem",
    },
    infoBox: {
        margin: "1rem 0rem",
        display: "flex",
        justifyContent: "center",
    },
    iconBox: {
        padding: "0rem 0.5rem",
    },
    iconInfoBox: {
        color: theme.palette.secondary.main,
        height: "fit-content",
    },
    hiddenBox: {
        display: "none",
    },
}));

export default createCustomizableLunaticField(TooltipInfo, "TooltipInfo");
