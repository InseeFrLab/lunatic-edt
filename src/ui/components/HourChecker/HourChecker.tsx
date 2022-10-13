import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { HourCheckerOption } from "interface/HourCheckerOptions";
import React from "react";
import { memo } from "react";
import { makeStyles } from "tss-react/mui";
import WorkIcon from "@mui/icons-material/Work";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import createCustomizableLunaticField from "../../utils/create-customizable-lunatic-field";

export type HourCheckerProps = {
    handleChange(response: { [name: string]: string }, value: boolean): void;
    id?: string;
    options: HourCheckerOption[];
    value: { [key: string]: boolean };
    label?: string;
};

const HourChecker = memo((props: HourCheckerProps) => {
    const { id, value, label, options } = props;
    const [isOpen, setIsOpen] = React.useState(false);

    const { classes, cx } = useStyles({ "width": `calc(100% / ${options.length})` });

    const optionsValues = options.map(option => option.response.name);
    const [currentOption, setCurrentOption] = React.useState(optionsValues);

    const toggleHourChecker = () => {
        setIsOpen(!isOpen);
    };

    const handleOptions = (event: any, selectedOption: string[]) => {
        setCurrentOption(selectedOption);
        value[event.target.value] = !value[event.target.value];
        // TODO : transmit to lunatic or parent after knowing wished format for Semainier
        //handleChange({ name: selectedOption }, value[selectedOption]);
    };

    return (
        <Box component="div">
            <Box sx={{ display: "flex" }} className={!isOpen ? classes.visible : classes.hidden}>
                {options.map((option, index) => (
                    <Box
                        className={cx(
                            classes.hourCheckerBox,
                            value[option.response.name] ? classes.hourSelected : classes.hourNotSelected,
                            index === 0 ? classes.leftOption : "",
                            index === options.length - 1 ? classes.rightOption : "",
                        )}
                    >
                        {index === 0 && (
                            <ExpandLessIcon
                                className={classes.clickable}
                                onClick={toggleHourChecker}
                            ></ExpandLessIcon>
                        )}
                        {index === options.length - 1 && (
                            <div className={classes.iconRounder}>
                                <WorkIcon fontSize="small"></WorkIcon>
                            </div>
                        )}
                    </Box>
                ))}
            </Box>
            <ToggleButtonGroup
                orientation="horizontal"
                value={currentOption}
                onChange={handleOptions}
                id={id}
                aria-label={label}
                className={isOpen ? classes.visible : classes.hidden}
            >
                {options.map((option, index) => (
                    <ToggleButton
                        className={classes.MuiToggleButton}
                        key={option.id}
                        value={option.response.name}
                        selected={value[option.response.name] ?? false}
                    >
                        {index !== 0 && index !== options.length - 1 && (
                            <div className={classes.noIconSpacer}></div>
                        )}
                        {index === 0 && <ExpandMoreIcon onClick={toggleHourChecker}></ExpandMoreIcon>}
                        {option.label}
                        {index === options.length - 1 && (
                            <div className={classes.iconRounder}>
                                <WorkIcon fontSize="small"></WorkIcon>
                            </div>
                        )}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Box>
    );
});

const useStyles = makeStyles<{ width: string }>({ "name": { HourChecker } })((theme, { width }) => ({
    visible: {},
    hidden: {
        visibility: "hidden",
        height: "0px",
    },
    clickable: {
        cursor: "pointer",
    },
    hourSelected: {
        color: theme.variables.white,
        backgroundColor: theme.palette.action.hover,
    },
    hourNotSelected: {
        color: theme.palette.action.hover,
        backgroundColor: theme.variables.white,
    },
    hourCheckerBox: {
        width,
        padding: "0.25rem",
        display: "flex",
        alignItems: "center",
    },
    leftOption: {
        borderTopLeftRadius: "4px",
        borderBottomLeftRadius: "4px",
        justifyContent: "start",
    },
    rightOption: {
        borderTopRightRadius: "4px",
        borderBottomRightRadius: "4px",
        justifyContent: "end",
    },
    MuiToggleButton: {
        padding: "0.25rem 0.25rem 1.5rem 0.25rem",
        textTransform: "none",
        color: theme.palette.action.hover,
        backgroundColor: theme.variables.white,
        border: "none",
        "&.Mui-selected": {
            backgroundColor: theme.palette.action.hover,
            color: theme.variables.white,
        },
    },
    iconRounder: {
        border: "1px solid transparent",
        borderRadius: "50%",
        width: "24px",
        height: "24px",
        textAlign: "center",
        float: "right",
        backgroundColor: theme.variables.iconRounding,
        "& svg": {
            width: "12px",
            color: theme.palette.primary.main,
        },
    },
    noIconSpacer: {
        width: "24px",
    },
}));

export default createCustomizableLunaticField(HourChecker);
