import { Box, Button, Modal } from "@mui/material";
import { Fragment, memo } from "react";
import { makeStylesEdt } from "../../theme";

type AlertProps = {
    isAlertDisplayed: boolean;
    onCompleteCallBack(): void;
    onCancelCallBack(forceQuite: boolean): void;
    labels: {
        content: string;
        cancel: string;
        complete: string;
    };
    icon: string;
    errorIconAlt: string;
};

const Alert = memo((props: AlertProps) => {
    const { isAlertDisplayed, onCompleteCallBack, onCancelCallBack, labels, icon, errorIconAlt } = props;
    const { classes, cx } = useStyles();

    return (
        <>
            <Box
                component="div"
                className={classes.shadowBackground}
                sx={{ display: isAlertDisplayed ? "visible" : "none" }}
            ></Box>
            <Fragment>
                <Modal hideBackdrop open={isAlertDisplayed} aria-labelledby={""} aria-describedby={""}>
                    <Box className={classes.errorBox}>
                        <Box className={classes.boxCenter}>
                            <img src={icon} alt={errorIconAlt} />
                        </Box>
                        <Box className={cx(classes.boxCenter, classes.errorMessageBox)}>
                            <p>{labels.content}</p>
                        </Box>
                        <Box className={classes.boxEvenly}>
                            <Button variant="outlined" onClick={() => onCancelCallBack(true)}>
                                {labels.cancel}
                            </Button>
                            <Button variant="contained" onClick={onCompleteCallBack}>
                                {labels.complete}
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Fragment>
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { Alert } })(theme => ({
    errorBox: {
        position: "absolute",
        transform: "translate(-50%, -50%)",
        top: "50%",
        left: "50%",
        backgroundColor: theme.palette.error.light,
        border: "2px solid transparent",
        borderColor: theme.palette.error.light,
        boxShadow: "24",
        index: "2",
        padding: "1rem",
        borderRadius: "10px",
        minWidth: "300px",
        "&:focus": {
            outline: "none",
        },
    },
    shadowBackground: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "#0000004D",
        index: "1",
    },
    errorMessageBox: {
        color: theme.palette.error.main,
    },
    boxCenter: {
        display: "flex",
        justifyContent: "center",
    },
    boxEvenly: {
        display: "flex",
        justifyContent: "space-evenly",
    },
}));

export default Alert;
