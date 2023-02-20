import { Box } from "@mui/system";
import { InfoProps } from "interface";
import { memo } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";

const Info = memo((props: InfoProps) => {
    const { normalText, boldText, infoIcon, infoIconAlt, border, isAlertInfo } = props;
    const { classes, cx } = useStyles();

    return (
        <Box
            className={cx(
                classes.root,
                border ? classes.borderDashedBox : "",
                isAlertInfo ? classes.alert : classes.info,
            )}
        >
            <Box className={cx(classes.titleWithIcon)}>
                {infoIcon && (
                    <Box className={classes.iconContainer}>
                        <img src={infoIcon} alt={infoIconAlt} />
                    </Box>
                )}
                <Box>
                    {normalText && (
                        <Box>
                            <p className={classes.text}>{normalText}</p>
                        </Box>
                    )}
                    {boldText && (
                        <Box>
                            <p className={classes.textBold}>{boldText}</p>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { Info } })(theme => ({
    root: {
        border: "1px dashed " + theme.variables.neutral,
        borderRadius: "13px",
        marginTop: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "520px",
    },
    titleWithIcon: {
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        paddingTop: "0.5rem",
        justifyContent: "space-between",
    },
    iconContainer: {
        width: "25%",
        display: "flex",
        justifyContent: "center",
        paddingTop: "1rem",
    },
    text: {
        fontSize: "12px",
    },
    textBold: {
        fontSize: "12px",
        fontWeight: "bold",
    },
    borderDashedBox: {
        borderStyle: "dashed",
    },
    alert: {
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.main,
        borderColor: theme.palette.error.main,
    },
    info: {
        backgroundColor: theme.variables.white,
        color: theme.palette.action.hover,
        borderColor: theme.palette.primary.main,
    },
}));

export default createCustomizableLunaticField(Info, "Info");
