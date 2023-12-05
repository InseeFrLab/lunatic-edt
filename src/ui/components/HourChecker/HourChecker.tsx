import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { responsesHourChecker } from "interface";
import { HourCheckerOption } from "interface/HourCheckerOptions";
import { IODataStructure } from "interface/WeeklyPlannerTypes";
import React, { memo, useCallback, useEffect } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";

export type HourCheckerProps = {
    handleChange?(response: { [name: string]: string }, value: boolean): void;
    id?: string;
    responses: HourCheckerOption[];
    value: { [key: string]: boolean };
    label?: string;
    helpStep?: number;
    expandLessIcon: string;
    expandLessIconAlt: string;
    expandMoreIcon: string;
    expandMoreIconAlt: string;
    expandLessWhiteIcon: string;
    expandMoreWhiteIcon: string;
    workIcon: string;
    workIconAlt: string;
    handleChangeData(response: { [name: string]: string }, value: IODataStructure[]): void;
    store: IODataStructure[];
    saveHours(response: responsesHourChecker): void;
    currentDate: string;
    setIsPlaceWorkDisplayed(value: boolean): void;
};

const getSelectAllValue = (value: { [key: string]: boolean }, responsesValues: string[]): boolean => {
    let selectOrUnselectAllValue = true;
    responsesValues.forEach((key: string) => {
        selectOrUnselectAllValue = selectOrUnselectAllValue && value[key];
    });
    return selectOrUnselectAllValue;
};

const calculateSelectAllValue = (
    setSelectAll: any,
    value: { [key: string]: boolean },
    responsesValues: string[],
) => {
    setSelectAll(getSelectAllValue(value, responsesValues));
};

/**
 * Select all line (hour complet)
 */
const selectOrUnselectAll = (
    currentlySelected: boolean,
    value: { [key: string]: boolean },
    responsesValues: string[],
    setCurrentOption: any,
    setSelectAll: any,
    saveLunaticData: any,
) => {
    let selectedOptions: string[] = [];
    responsesValues.forEach((name: string) => {
        value[name] = !currentlySelected;
        selectedOptions.push(name);
    });
    setCurrentOption(selectedOptions);
    setSelectAll(!currentlySelected);
    saveLunaticData();
};

const getClassName = (cx: any, className: any, classVisible: any, classHidden: any, isOpen: boolean) => {
    return cx(className, isOpen ? classVisible : classHidden);
};

/**
 * This component is used to select fraction of hours.
 * The entire hour is selectable at once clicking on the entire component
 * After toggle the arrow button, the hour is divided per the size of reponses props,
 * each fraction is individualy selectable.
 */
const HourChecker = memo((props: HourCheckerProps) => {
    const {
        id,
        value,
        label,
        responses,
        handleChange,
        helpStep,
        expandLessIcon,
        expandLessIconAlt,
        expandMoreIcon,
        expandMoreIconAlt,
        expandLessWhiteIcon,
        expandMoreWhiteIcon,
        workIcon,
        workIconAlt,
        saveHours,
        currentDate,
        setIsPlaceWorkDisplayed
    } = props;
    const [isOpen, setIsOpen] = React.useState(false);

    const { classes, cx } = useStyles({ "width": `calc(100% / ${responses.length})` });

    const responsesValues = responses.map((option: HourCheckerOption) => option.response.name);
    const [currentOption, setCurrentOption] = React.useState(responsesValues);

    const [selectAll, setSelectAll] = React.useState(getSelectAllValue(value, responsesValues));

    useEffect(() => {
        if (helpStep == 4 && value["5h15"]) {
            setIsOpen(true);
        }
    }, [isOpen]);

    useEffect(() => {
        localStorage.setItem("HOURCHECKED_DISPLAYED", "true");
    }, []);

    const toggleHourChecker = (e: any) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleOptions = useCallback((event: any, selectedOption: string[]) => {
        setCurrentOption(selectedOption);
        value[event.target.value] = !value[event.target.value];
        calculateSelectAllValue(setSelectAll, value, responsesValues);
        saveLunaticData();
    }, []);

    const saveLunaticData = () => {
        const responses: responsesHourChecker = {
            names: responsesValues,
            values: value,
            date: currentDate,
        };
        if (saveHours) {
            saveHours(responses);
        }
        if (handleChange) {
            responsesValues.forEach((responseName: string) => {
                handleChange({ name: responseName }, value[responseName]);
            });
        }
    };

    return (
        <Box className={classes.globalBox} component="div" aria-label="hourchecker">
            <Box
                className={getClassName(cx, classes.closedBox, classes.visible, classes.hidden, !isOpen)}
                onClick={() =>
                    selectOrUnselectAll(
                        selectAll,
                        value,
                        responsesValues,
                        setCurrentOption,
                        setSelectAll,
                        saveLunaticData,
                    )
                }
                aria-label={isOpen ? "hourcheckeropen" : "hourcheckerclosed"}
            >
                {responses.map((option, index) => (
                    <Box
                        key={option.id}
                        className={cx(
                            classes.hourCheckerBox,
                            value[option.response.name] ? classes.hourSelected : classes.hourNotSelected,
                            index === 0 ? classes.leftOption : "",
                            index === responses.length - 1 ? classes.rightOption : "",
                        )}
                        aria-label={value[option.response.name] ? "hourselected" : "hournotselected"}
                    >
                        {index === 0 && (
                            <img
                                src={value[option.response.name] ? expandMoreWhiteIcon : expandMoreIcon}
                                alt={expandMoreIconAlt}
                                className={classes.clickable}
                                onClick={toggleHourChecker}
                                aria-label="hourcheckertoogle"
                            />
                        )}
                        {index === responses.length - 1 && (
                            <div className={classes.iconRounder}>
                                <img src={workIcon} alt={workIconAlt} />
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
                className={getClassName(cx, classes.openedBox, classes.visible, classes.hidden, isOpen)}
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
                        {index === 0 && (
                            <img
                                src={value[option.response.name] ? expandLessWhiteIcon : expandLessIcon}
                                alt={expandLessIconAlt}
                                onClick={toggleHourChecker}
                            />
                        )}
                        {index !== responses.length - 1 ? option.label : <span>&nbsp;</span>}
                        {index === responses.length - 1 && (
                            <div className={classes.iconRounder}>
                                <img src={workIcon} alt={workIconAlt} />
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
    closedBox: {
        display: "flex",
        cursor: "pointer",
    },
    openedBox: {
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
            "&:hover": {
                backgroundColor: theme.palette.action.hover,
                color: theme.variables.white,
            },
        },
        "&:hover": {
            backgroundColor: theme.variables.white,
            color: theme.palette.action.hover,
        },
        fontSize: "11px",
        fontWeight: "bold",
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
