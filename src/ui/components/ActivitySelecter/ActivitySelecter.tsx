import React, { memo, useState, useEffect } from "react";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";
import { ActivitySelection, SelectedActivity } from "interface/ActivityTypes";
import { ActivitySelecterSpecificProps } from "interface/ComponentsSpecificProps";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    TextField,
    Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { makeStylesEdt } from "../../../ui/theme";
import { Extension, ChevronRight, Search } from "@mui/icons-material";
import ClickableList from "../ClickableList";
import { splitLabelWithParenthesis } from "../../../ui/utils";

type ActivitySelecterProps = {
    handleChange(response: { [name: string]: string }, value: string): void;
    componentSpecificProps: ActivitySelecterSpecificProps;
    response: { [name: string]: string };
    label: string;
};

enum FullScreenComponent {
    Main,
    ClickableList,
    FreeInput,
}

const ActivitySelecter = memo((props: ActivitySelecterProps) => {
    let { handleChange, componentSpecificProps, response, label } = props;

    let {
        backClickEvent,
        nextClickEvent,
        backClickCallback,
        nextClickCallback,
        categoriesIcons,
        activitesAutoCompleteRef,
        clickableListIconNoResult,
        setDisplayStepper,
        categoriesAndActivitesNomenclature,
        labels,
    } = { ...componentSpecificProps };

    const [selectedCategories, setSelectedCategories] = useState<ActivitySelection[]>([]);
    const [createActivityValue, setCreateActivityValue] = useState<string | undefined>();
    const [selectedId, setSelectedId] = useState<string | undefined>();
    const [labelOfSelectedId, setLabelOfSelectedId] = useState<string | undefined>();
    const [fullScreenComponent, setFullScreenComponent] = useState<FullScreenComponent>(
        FullScreenComponent.Main,
    );
    const [displayAlert, setDisplayAlert] = useState<boolean>(false);

    if (setDisplayStepper) {
        setDisplayStepper(
            fullScreenComponent === FullScreenComponent.Main && selectedCategories.length === 0,
        );
    }

    const { classes, cx } = useStyles();

    useEffect(() => {
        if (backClickEvent) {
            back(
                fullScreenComponent,
                backClickCallback,
                selectedCategories,
                setSelectedId,
                setLabelOfSelectedId,
                setSelectedCategories,
                onChange,
                setCreateActivityValue,
                setFullScreenComponent,
            );
        }
    }, [backClickEvent]);

    useEffect(() => {
        if (nextClickEvent) {
            next(
                false,
                selectedId,
                fullScreenComponent,
                setDisplayAlert,
                selectedCategories,
                nextClickCallback,
                createActivityValue,
            );
        }
    }, [nextClickEvent]);

    const onChange = (id?: string, label?: string, isFullyCompleted?: boolean) => {
        const selection: SelectedActivity = {
            id: id,
            label: label,
            isFullyCompleted: isFullyCompleted,
        };
        handleChange(response, JSON.stringify(selection));
    };

    const createActivityCallBack = (label: string) => {
        onChange(undefined, label, true);
        setFullScreenComponent(FullScreenComponent.FreeInput);
        setCreateActivityValue(label);
    };

    const handleAlertClose = () => {
        setDisplayAlert(false);
    };

    const clickableListOnChange = (id: string | undefined) => {
        setSelectedId(id);
        let isFully = false;
        if (id) {
            isFully = true;
        }
        onChange(id, undefined, isFully);
    };

    const freeInputOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCreateActivityValue(e.target.value);
        // If we enter free input value from "Autre" button, then save id of last selected category
        let id = undefined;
        let isFully = false;
        if (selectedCategories.length > 0) {
            id = selectedCategories[selectedCategories.length - 1].id;
        }
        if (e.target.value !== "") {
            isFully = true;
        }
        onChange(id, e.target.value, isFully);
    };

    const renderSubRangCategory = (category: ActivitySelection) => {
        return (
            <Box
                className={getSubRankCategoryClassName(
                    category,
                    selectedId,
                    labelOfSelectedId,
                    classes,
                    cx,
                )}
                key={uuidv4()}
                onClick={() => {
                    categoriesActivitiesBoxClick(
                        category,
                        selectedCategories,
                        setSelectedCategories,
                        onChange,
                        setSelectedId,
                        setLabelOfSelectedId,
                    );
                }}
            >
                <Extension className={classes.optionIcon} />
                <Typography className={classes.subRankLabel}>{category.label}</Typography>
                {category.subs && <ChevronRight className={classes.chevronIcon} />}
            </Box>
        );
    };

    const renderRank1Category = (category: ActivitySelection) => {
        const id = Number(category.id);
        const { mainLabel, secondLabel } = splitLabelWithParenthesis(category.label);

        return (
            <Box
                className={classes.rank1Category}
                key={uuidv4()}
                onClick={() =>
                    categoriesActivitiesBoxClick(
                        category,
                        selectedCategories,
                        setSelectedCategories,
                        onChange,
                        setSelectedId,
                        setLabelOfSelectedId,
                    )
                }
            >
                <img className={classes.icon} src={categoriesIcons[id]} />
                <Typography className={classes.rank1MainLabel}>{mainLabel}</Typography>
                {secondLabel && (
                    <Typography className={classes.rank1SecondLabel}>{secondLabel}</Typography>
                )}
            </Box>
        );
    };

    return (
        <>
            {componentSpecificProps && categoriesAndActivitesNomenclature && (
                <>
                    <Dialog
                        open={displayAlert}
                        onClose={handleAlertClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {labels.alertMessage}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() =>
                                    next(
                                        true,
                                        selectedId,
                                        fullScreenComponent,
                                        setDisplayAlert,
                                        selectedCategories,
                                        nextClickCallback,
                                        createActivityValue,
                                    )
                                }
                            >
                                {labels.alertIgnore}
                            </Button>
                            <Button onClick={handleAlertClose} autoFocus>
                                {labels.alertComplete}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {fullScreenComponent === FullScreenComponent.ClickableList && (
                        <ClickableList
                            className={classes.clickableList}
                            options={activitesAutoCompleteRef}
                            handleChange={clickableListOnChange}
                            createActivity={createActivityCallBack}
                            placeholder={labels.clickableListPlaceholder}
                            notFoundLabel={labels.clickableListNotFoundLabel}
                            notFoundComment={labels.clickableListNotFoundComment}
                            addActivityButtonLabel={labels.clickableListAddActivityButton}
                            iconNoResult={clickableListIconNoResult}
                            iconNoResultAlt={labels.clickableListIconNoResultAlt}
                            autoFocus={true}
                        ></ClickableList>
                    )}

                    {fullScreenComponent === FullScreenComponent.FreeInput && (
                        <Box className={classes.root}>
                            <Typography className={classes.title}>
                                {getTextTitle(fullScreenComponent, selectedCategories, labels, label)}
                            </Typography>
                            <TextField
                                value={createActivityValue}
                                className={classes.freeInputTextField}
                                onChange={freeInputOnChange}
                                placeholder={labels.clickableListPlaceholder}
                            ></TextField>
                        </Box>
                    )}

                    {fullScreenComponent === FullScreenComponent.Main && (
                        <Box className={classes.root}>
                            <Typography className={classes.title}>
                                {getTextTitle(fullScreenComponent, selectedCategories, labels, label)}
                            </Typography>

                            {selectedCategories.length === 0 && (
                                <Box
                                    className={classes.activityInput}
                                    onClick={() =>
                                        setFullScreenComponent(FullScreenComponent.ClickableList)
                                    }
                                >
                                    <Typography className={classes.activityInputLabel}>
                                        {labels.clickableListPlaceholder}
                                    </Typography>
                                    <Search className={classes.activityInputIcon} />
                                </Box>
                            )}

                            {selectedCategories.length === 0 ? (
                                <Box className={classes.rank1CategoriesBox}>
                                    {categoriesAndActivitesNomenclature.map(d => {
                                        return renderRank1Category(d);
                                    })}
                                </Box>
                            ) : (
                                <Box className={classes.rank1CategoriesBox}>
                                    {selectedCategories[selectedCategories.length - 1]?.subs?.map(s => {
                                        return renderSubRangCategory(s);
                                    })}
                                    <Button
                                        className={classes.buttonOther}
                                        onClick={() =>
                                            clickAutreButton(
                                                setFullScreenComponent,
                                                selectedCategories,
                                                onChange,
                                            )
                                        }
                                    >
                                        {labels.otherButton}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}
                </>
            )}
        </>
    );
});

const back = (
    fullScreenComponent: FullScreenComponent,
    backClickCallback: () => void,
    selectedCategories: ActivitySelection[],
    setSelectedId: (id?: string) => void,
    setLabelOfSelectedId: (label?: string) => void,
    setSelectedCategories: (activities: ActivitySelection[]) => void,
    onChange: (id?: string, label?: string, isFullyCompleted?: boolean) => void,
    setCreateActivityValue: (value?: string) => void,
    setFullScreenComponent: (comp: FullScreenComponent) => void,
) => {
    // Go back to previous page in application navigation
    if (fullScreenComponent === FullScreenComponent.Main && selectedCategories.length === 0) {
        backClickCallback();
        return;
    }
    const temp = [...selectedCategories];
    setSelectedId(undefined);
    setLabelOfSelectedId(undefined);

    switch (fullScreenComponent) {
        case FullScreenComponent.Main:
            temp.pop();
            setSelectedCategories(temp);
            onChange(temp[temp.length - 1]?.id, undefined, false);
            break;
        case FullScreenComponent.FreeInput:
            setCreateActivityValue(undefined);
            setFullScreenComponent(FullScreenComponent.Main);
            onChange(selectedCategories[selectedCategories.length - 1]?.id, undefined, false);
            break;
        case FullScreenComponent.ClickableList:
            setFullScreenComponent(FullScreenComponent.Main);
            onChange(undefined, undefined, false);
            break;
        default:
            break;
    }
};

const next = (
    continueWithUncompleted: boolean,
    selectedId: string | undefined,
    fullScreenComponent: FullScreenComponent,
    setDisplayAlert: (display: boolean) => void,
    selectedCategories: ActivitySelection[],
    nextClickCallback: (routeToGoal: boolean) => void,
    createActivityValue: string | undefined,
) => {
    let routeToGoal = true;
    let displayAlert1 = selectedId === undefined && !continueWithUncompleted;
    let displayAlert2 =
        (createActivityValue === undefined || createActivityValue === "") && !continueWithUncompleted;

    switch (fullScreenComponent) {
        case FullScreenComponent.ClickableList:
        case FullScreenComponent.Main:
            if (displayAlert1) {
                setDisplayAlert(true);
                break;
            }
            if (selectedCategories[selectedCategories.length - 1]) {
                routeToGoal = false;
            }
            nextClickCallback(routeToGoal);
            break;
        case FullScreenComponent.FreeInput:
            if (displayAlert2) {
                setDisplayAlert(true);
                break;
            }
            if (selectedCategories[selectedCategories.length - 1]) {
                routeToGoal = false;
            }
            nextClickCallback(routeToGoal);
            break;
        default:
            break;
    }
};

const clickAutreButton = (
    setFullScreenComponent: (comp: FullScreenComponent) => void,
    selectedCategories: ActivitySelection[],
    onChange: (id?: string, label?: string, isFullyCompleted?: boolean) => void,
) => {
    setFullScreenComponent(FullScreenComponent.FreeInput);
    // If we enter free input value from "Autre" button, then save id of last selected category
    let id = undefined;
    if (selectedCategories.length > 0) {
        id = selectedCategories[selectedCategories.length - 1].id;
    }
    onChange(id, undefined, false);
};

const getTextTitle = (fullScreenComponent: any, selectedCategories: any, labels: any, label: any) => {
    if (fullScreenComponent === FullScreenComponent.FreeInput) {
        return labels.addActivity;
    }
    if (selectedCategories.length === 0) {
        return label;
    }
    return `${labels.selectInCategory} «${selectedCategories[selectedCategories.length - 1].label} »`;
};

const getSubRankCategoryClassName = (
    category: ActivitySelection,
    selectedId: string | undefined,
    labelOfSelectedId: string | undefined,
    classes: any,
    cx: any,
) => {
    if (category.id === selectedId && category.label === labelOfSelectedId) {
        return cx(classes.subRankCategory, classes.selectedSubRankCategory);
    }
    return classes.subRankCategory;
};

const categoriesActivitiesBoxClick = (
    selection: ActivitySelection,
    selectedCategories: ActivitySelection[],
    setSelectedCategories: (activities: ActivitySelection[]) => void,
    onChange: (id?: string, label?: string, isFullyCompleted?: boolean) => void,
    setSelectedId: (id: string) => void,
    setLabelOfSelectedId: (label: string) => void,
) => {
    if (selection.subs) {
        const temp = [...selectedCategories];
        temp.push(selection);
        setSelectedCategories(temp);
        onChange(selection.id, undefined, false);
    } else {
        onChange(selection.id, undefined, true);
        setSelectedId(selection.id);
        setLabelOfSelectedId(selection.label);
    }
};

const useStyles = makeStylesEdt({ "name": { ActivitySelecter } })(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    title: {
        color: theme.palette.info.main,
        fontSize: "20px",
        textAlign: "center",
        marginTop: "2rem",
        marginBottom: "2rem",
    },
    activityInput: {
        width: "93%",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1rem",
        backgroundColor: theme.variables.white,
        borderRadius: "5px",
    },
    activityInputLabel: {
        fontSize: "16px",
        color: "#5A6C95",
        margin: "1rem",
    },
    activityInputIcon: {
        margin: "1rem",
    },
    clickableList: {
        width: "300px",
        marginTop: "1rem",
    },
    freeInputTextField: {
        width: "100%",
        backgroundColor: theme.variables.white,
        borderRadius: "5px",
    },
    rank1CategoriesBox: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        cursor: "pointer",
    },
    rank1Category: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.variables.white,
        width: "45.5%",
        marginTop: "4%",
        borderRadius: "15px",
    },
    icon: {
        width: "80px",
        height: "45px",
        marginTop: "1rem",
    },
    rank1MainLabel: {
        fontSize: "14px",
        textAlign: "center",
        color: theme.palette.text.secondary,
        fontWeight: "bold",
        marginTop: "1rem",
        marginRight: "0.5rem",
        marginBottom: "0.5rem",
        marginLeft: "0.5rem",
    },
    rank1SecondLabel: {
        fontSize: "12px",
        textAlign: "center",
        marginTop: "0.5rem",
        marginRight: "0.5rem",
        marginBottom: "1rem",
        marginLeft: "0.5rem",
    },
    subRankCategory: {
        display: "flex",
        backgroundColor: theme.variables.white,
        marginTop: "4%",
        borderRadius: "6px",
        width: "100%",
        padding: "1rem",
        alignItems: "center",
        justifyContent: "space-between",
    },
    selectedSubRankCategory: {
        border: "2px solid",
        borderColor: theme.palette.primary.main,
    },
    subRankLabel: {
        fontSize: "14px",
        color: theme.palette.text.secondary,
        width: "80%",
    },
    optionIcon: {
        marginRight: "0.5rem",
        color: theme.palette.primary.main,
        width: "10%",
    },
    chevronIcon: {
        color: theme.palette.primary.main,
        width: "10%",
    },
    buttonOther: {
        backgroundColor: theme.palette.primary.main,
        width: "60%",
        marginTop: "2rem",
        color: theme.variables.white,
    },
}));

export default createCustomizableLunaticField(ActivitySelecter, "ActivitySelecter");
