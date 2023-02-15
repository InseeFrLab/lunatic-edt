import { Box } from "@mui/system";
import { InfoProps } from "interface";
import { memo } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";

const Info = memo((props: InfoProps) => {
    const { normalText, boldText, infoIcon, infoIconAlt, border } = props;
    const { classes, cx } = useStyles();

    return (
        <Box className={cx(classes.root, border ? classes.borderDashedBox : "")}>
            <Box className={cx(classes.titleWithIcon)}>
                {infoIcon && (
                    <Box className={classes.iconContainer}>
                        <img src={infoIcon} alt={infoIconAlt} />
                    </Box>
                )}
                <Box>
                    {normalText && (
                        <Box className={classes.title}>
                            <p className={classes.text}>{normalText}</p>
                        </Box>
                    )}
                    {boldText && (
                        <Box className={classes.tips}>
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
        backgroundColor: theme.variables.white,
        border: "1px dashed " + theme.variables.neutral,
        borderRadius: "13px",
        //margin: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        //padding: "1rem 1rem 1rem 0",
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
    title: {
        //width: "85%",
    },
    tips: {
        //width: "85%",
    },
    text: {
        color: theme.palette.action.hover,
        fontSize: "12px",
    },
    textBold: {
        color: theme.palette.action.hover,
        fontSize: "12px",
        fontWeight: "bold",
    },
    borderDashedBox: {
        borderStyle: "dashed",
        borderColor: theme.palette.primary.main,
    },
}));

export default createCustomizableLunaticField(Info, "Info");
