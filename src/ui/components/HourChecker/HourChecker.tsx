import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WorkIcon from "@mui/icons-material/Work";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { HourCheckerOption } from "interface/HourCheckerOptions";
import React, { memo } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";

export type HourCheckerProps = {
    handleChange(response: { [name: string]: string }, value: boolean): void;
    id?: string;
    responses: HourCheckerOption[];
    value: { [key: string]: boolean };
    label?: string;
};

const HourChecker = memo((props: HourCheckerProps) => {
    const { id, value, label, responses, handleChange } = props;
    const [isOpen, setIsOpen] = React.useState(false);

    const { classes, cx } = useStyles({ "width": `calc(100% / ${responses.length})` });

    const responsesValues = responses.map((option: HourCheckerOption) => option.response.name);
    const [currentOption, setCurrentOption] = React.useState(responsesValues);

    const getSelectAllValue = (): boolean => {
        let selectOrUnselectAllValue = true;
        responsesValues.forEach((key: string) => {
            selectOrUnselectAllValue = selectOrUnselectAllValue && value[key];
        });
        return selectOrUnselectAllValue;
    };

    const [selectAll, setSelectAll] = React.useState(getSelectAllValue);

    const calculateSelectAllValue = () => {
        setSelectAll(getSelectAllValue);
    };

    const selectOrUnselectAll = (currentlySelected: boolean) => {
        let selectedOptions: string[] = [];
        responsesValues.forEach((name: string) => {
            value[name] = !currentlySelected;
            selectedOptions.push(name);
        });
        setCurrentOption(selectedOptions);
        setSelectAll(!selectAll);
        saveLunaticData();
    };

    const toggleHourChecker = (e: any) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleOptions = (event: any, selectedOption: string[]) => {
        setCurrentOption(selectedOption);
        value[event.target.value] = !value[event.target.value];
        calculateSelectAllValue();
        saveLunaticData();
    };

    const saveLunaticData = () => {
        responsesValues.forEach((name: string) => {
            handleChange({ name: name }, value[name]);
        });
    };

    return (
        <Box className={classes.globalBox} component="div">
            <Box
                sx={{ display: "flex", cursor: "pointer" }}
                className={!isOpen ? classes.visible : classes.hidden}
                onClick={() => selectOrUnselectAll(selectAll)}
            >
                {responses.map((option, index) => (
                    <Box
                        key={index + "-" + option.id}
                        className={cx(
                            classes.hourCheckerBox,
                            value[option.response.name] ? classes.hourSelected : classes.hourNotSelected,
                            index === 0 ? classes.leftOption : "",
                            index === responses.length - 1 ? classes.rightOption : "",
                        )}
                    >
                        {index === 0 && (
                            <ExpandLessIcon
                                className={classes.clickable}
                                onClick={toggleHourChecker}
                            ></ExpandLessIcon>
                        )}
                        {index === responses.length - 1 && (
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
                sx={{ width: "100%" }}
                className={isOpen ? classes.visible : classes.hidden}
            >
                {responses.map((option, index) => (
                    <ToggleButton
                        className={cx(
                            classes.MuiToggleButton,
                            index === 0 || index === responses.length - 1
                                ? classes.toggleWithIcon
                                : classes.toggleWithoutIcon,
                        )}
                        key={option.id}
                        value={option.response.name}
                        selected={value[option.response.name] ?? false}
                    >
                        {index !== 0 && index !== responses.length - 1 && (
                            <div className={classes.noIconSpacer}></div>
                        )}
                        {index === 0 && <ExpandMoreIcon onClick={toggleHourChecker} />}
                        {index !== responses.length - 1 ? option.label : <span>&nbsp;</span>}
                        {index === responses.length - 1 && (
                            <div className={classes.iconRounder}>
                                <WorkIcon fontSize="small" />
                            </div>
                        )}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Box>
    );
});

const useStyles = makeStylesEdt<{ width: string }>({ "name": { HourChecker } })((theme, { width }) => ({
    globalBox: {
        maxWidth: "1024px",
        width: "100%",
    },
    visible: {},
    hidden: {
        visibility: "hidden",
        height: "0px",
    },
    clickable: {
        cursor: "pointer",
        index: "1",
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
        display: "flex",
        padding: "0.25rem 0.25rem 1.5rem 0.25rem",
        textTransform: "none",
        width,
        color: theme.palette.action.hover,
        backgroundColor: theme.variables.white,
        borderColor: theme.variables.white,
        "&.Mui-selected": {
            backgroundColor: theme.palette.action.hover,
            color: theme.variables.white,
        },
        "&:hover": {
            color: theme.palette.action.hover,
        },
    },
    toggleWithIcon: {
        justifyContent: "space-between",
    },
    toggleWithoutIcon: {
        justifyContent: "flex-end",
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

export default createCustomizableLunaticField(HourChecker, "HourChecker");
