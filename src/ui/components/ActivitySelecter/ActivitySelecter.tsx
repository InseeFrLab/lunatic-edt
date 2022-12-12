import React, { memo, useState, useEffect, useCallback } from "react";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";
import { ActivitySelection, SelectedActivity } from "interface/ActivityTypes";
import { ActivityLabelProps, ActivitySelecterSpecificProps } from "interface/ComponentsSpecificProps";
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

const nextClickableList = (
    continueWithUncompleted: boolean,
    selectedId: string | undefined,
    setDisplayAlert: any,
    nextClickCallback: any,
) => {
    if (selectedId === undefined && !continueWithUncompleted) {
        setDisplayAlert(true);
    } else {
        nextClickCallback(true);
    }
};

const nextMain = (
    continueWithUncompleted: boolean,
    selectedId: string | undefined,
    selectedCategories: ActivitySelection[],
    setDisplayAlert: any,
    nextClickCallback: any,
) => {
    if (selectedId === undefined && !continueWithUncompleted) {
        setDisplayAlert(true);
    } else {
        if (selectedCategories[selectedCategories.length - 1]) {
            nextClickCallback(false);
        } else {
            nextClickCallback(true);
        }
    }
};

const nextInput = (
    continueWithUncompleted: boolean,
    createActivityValue: string | undefined,
    selectedCategories: ActivitySelection[],
    setDisplayAlert: any,
    nextClickCallback: any,
) => {
    if ((createActivityValue === undefined || createActivityValue === "") && !continueWithUncompleted) {
        setDisplayAlert(true);
    } else {
        if (selectedCategories[selectedCategories.length - 1]) {
            nextClickCallback(false);
        } else {
            nextClickCallback(true);
        }
    }
};

const next = useCallback(
    (
        continueWithUncompleted: boolean,
        fullScreenComponent: FullScreenComponent,
        selectedId: string | undefined,
        selectedCategories: ActivitySelection[],
        createActivityValue: string | undefined,
        setDisplayAlert: any,
        nextClickCallback: any,
    ) => {
        switch (fullScreenComponent) {
            case FullScreenComponent.ClickableList:
                nextClickableList(
                    continueWithUncompleted,
                    selectedId,
                    setDisplayAlert,
                    nextClickCallback,
                );
                break;
            case FullScreenComponent.Main:
                nextMain(
                    continueWithUncompleted,
                    selectedId,
                    selectedCategories,
                    setDisplayAlert,
                    nextClickCallback,
                );
                break;
            case FullScreenComponent.FreeInput:
                nextInput(
                    continueWithUncompleted,
                    createActivityValue,
                    selectedCategories,
                    setDisplayAlert,
                    nextClickCallback,
                );
                break;
            default:
                break;
        }
    },
    [],
);

const getTextTitle = (
    fullScreenComponent: FullScreenComponent,
    labels: ActivityLabelProps,
    selectedCategories: ActivitySelection[],
    label: string,
) => {
    if (fullScreenComponent === FullScreenComponent.FreeInput) {
        return labels.addActivity;
    } else {
        if (selectedCategories.length === 0) {
            return label;
        } else {
            return `${labels.selectInCategory} «${
                selectedCategories[selectedCategories.length - 1].label
            } »`;
        }
    }
};

const backMain = (temp: ActivitySelection[], setSelectedCategories: any, onChange: any) => {
    temp.pop();
    setSelectedCategories(temp);
    onChange(temp[temp.length - 1]?.id, undefined, false);
};

const backInput = (
    selectedCategories: ActivitySelection[],
    setCreateActivityValue: any,
    setFullScreenComponent: any,
    onChange: any,
) => {
    setCreateActivityValue(undefined);
    setFullScreenComponent(FullScreenComponent.Main);
    onChange(selectedCategories[selectedCategories.length - 1]?.id, undefined, false);
};

const backClickableList = (setFullScreenComponent: any, onChange: any) => {
    setFullScreenComponent(FullScreenComponent.Main);
    onChange(undefined, undefined, false);
};

const displayStepper = (
    fullScreenComponent: FullScreenComponent,
    selectedCategories: ActivitySelection[],
    setDisplayStepper: any,
) => {
    if (setDisplayStepper) {
        setDisplayStepper(
            fullScreenComponent === FullScreenComponent.Main && selectedCategories.length === 0,
        );
    }
};

const renderSubRangCategory = (
    category: ActivitySelection,
    selectedId: string | undefined,
    labelOfSelectedId: string | undefined,
    classes: any,
    cx: any,
    handleCategoriesActivitiesBox: any,
) => {
    return (
        <Box
            className={
                !category.subs && category.id === selectedId && category.label === labelOfSelectedId
                    ? cx(classes.subRankCategory, classes.selectedSubRankCategory)
                    : classes.subRankCategory
            }
            key={uuidv4()}
            onClick={handleCategoriesActivitiesBox(category)}
        >
            <Extension className={classes.optionIcon} />
            <Typography className={classes.subRankLabel}>{category.label}</Typography>
            {category.subs ? <ChevronRight className={classes.chevronIcon} /> : null}
        </Box>
    );
};

const renderRank1Category = (
    category: ActivitySelection,
    categoriesIcons: { [id: string]: string },
    classes: any,
    handleCategoriesActivitiesBox: any,
) => {
    const id = Number(category.id);
    const wholeLabel = category.label;
    let mainLabel;
    let secondLabel;
    const indexOfParenthesis = wholeLabel.indexOf("(");
    if (indexOfParenthesis !== -1) {
        mainLabel = wholeLabel.substring(0, indexOfParenthesis);
        secondLabel = wholeLabel.substring(indexOfParenthesis + 1, wholeLabel.length - 1);
    } else {
        mainLabel = wholeLabel;
    }

    return (
        <Box
            className={classes.rank1Category}
            key={uuidv4()}
            onClick={handleCategoriesActivitiesBox(category)}
        >
            <img className={classes.icon} src={categoriesIcons[id]} />
            <Typography className={classes.rank1MainLabel}>{mainLabel}</Typography>
            {secondLabel ? (
                <Typography className={classes.rank1SecondLabel}>{secondLabel}</Typography>
            ) : null}
        </Box>
    );
};

const freeInputOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    selectedCategories: ActivitySelection[],
    setCreateActivityValue: any,
    onChange: any,
) => {
    setCreateActivityValue(e.target.value);
    // If we enter free input value from "Autre" button, then save id of last selected category
    let id = undefined;
    if (selectedCategories.length > 0) {
        id = selectedCategories[selectedCategories.length - 1].id;
    }
    onChange(id, e.target.value, e.target.value !== "");
};

const getSelectedCategoriesId = (selectedCategories: ActivitySelection[]): string | undefined => {
    if (selectedCategories.length > 0) {
        return selectedCategories[selectedCategories.length - 1].id;
    } else return undefined;
};

const haveBackClickEvent = (backClickEvent: React.MouseEvent | undefined, back: any) => {
    if (backClickEvent) {
        back();
    }
};

const haveNextClickEvent = (
    nextClickEvent: React.MouseEvent | undefined,
    fullScreenComponent: FullScreenComponent,
    selectedId: string | undefined,
    selectedCategories: ActivitySelection[],
    createActivityValue: string | undefined,
    setDisplayAlert: any,
    nextClickCallback: any,
) => {
    if (nextClickEvent) {
        next(
            false,
            fullScreenComponent,
            selectedId,
            selectedCategories,
            createActivityValue,
            setDisplayAlert,
            nextClickCallback,
        );
    }
};

const categoriesActivitiesBoxClick = (
    selection: ActivitySelection,
    selectedCategories: ActivitySelection[],
    setSelectedCategories: any,
    onChange: any,
    setSelectedId: any,
    setLabelOfSelectedId: any,
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

    displayStepper(fullScreenComponent, selectedCategories, setDisplayStepper);

    const { classes, cx } = useStyles();

    useEffect(() => {
        haveBackClickEvent(backClickEvent, back);
    }, [backClickEvent]);

    useEffect(() => {
        haveNextClickEvent(
            nextClickEvent,
            fullScreenComponent,
            selectedId,
            selectedCategories,
            createActivityValue,
            setDisplayAlert,
            nextClickCallback,
        );
    }, [nextClickEvent]);

    const onChange = (id?: string, label?: string, isFullyCompleted: boolean) => {
        const selection: SelectedActivity = {
            id: id,
            label: label,
            isFullyCompleted: isFullyCompleted,
        };
        handleChange(response, JSON.stringify(selection));
    };

    const back = () => {
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
                backMain(temp, setSelectedCategories, onChange);
                break;
            case FullScreenComponent.FreeInput:
                backInput(selectedCategories, setCreateActivityValue, setFullScreenComponent, onChange);
                break;
            case FullScreenComponent.ClickableList:
                backClickableList(setFullScreenComponent, onChange);
                break;
            default:
                break;
        }
    };

    const createActivityCallBack = useCallback((label: string) => {
        onChange(undefined, label, true);
        setFullScreenComponent(FullScreenComponent.FreeInput);
        setCreateActivityValue(label);
    }, []);

    const clickAutreButton = useCallback(() => {
        setFullScreenComponent(FullScreenComponent.FreeInput);
        // If we enter free input value from "Autre" button, then save id of last selected category
        onChange(getSelectedCategoriesId(selectedCategories), undefined, false);
    }, []);

    const handleAlertClose = useCallback(() => {
        setDisplayAlert(false);
    }, []);

    const clickableListOnChange = useCallback((id: string | undefined) => {
        setSelectedId(id);
        onChange(id, undefined, id != null);
    }, []);

    const handleFullScreen = useCallback(
        () => setFullScreenComponent(FullScreenComponent.ClickableList),
        [],
    );

    const handleCategoriesActivitiesBox = useCallback(
        (category: ActivitySelection) =>
            categoriesActivitiesBoxClick(
                category,
                selectedCategories,
                setSelectedCategories,
                onChange,
                setSelectedId,
                setLabelOfSelectedId,
            ),
        [],
    );

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
                                onClick={next(
                                    true,
                                    fullScreenComponent,
                                    selectedId,
                                    selectedCategories,
                                    createActivityValue,
                                    setDisplayAlert,
                                    nextClickCallback,
                                )}
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
                                {getTextTitle(fullScreenComponent, labels, selectedCategories, label)}
                            </Typography>
                            <TextField
                                value={createActivityValue}
                                className={classes.freeInputTextField}
                                onChange={e =>
                                    freeInputOnChange(
                                        e,
                                        selectedCategories,
                                        setCreateActivityValue,
                                        onChange,
                                    )
                                }
                                placeholder={labels.clickableListPlaceholder}
                            ></TextField>
                        </Box>
                    )}

                    {fullScreenComponent === FullScreenComponent.Main && (
                        <Box className={classes.root}>
                            <Typography className={classes.title}>
                                {getTextTitle(fullScreenComponent, labels, selectedCategories, label)}
                            </Typography>

                            {selectedCategories.length === 0 && (
                                <Box className={classes.activityInput} onClick={handleFullScreen}>
                                    <Typography className={classes.activityInputLabel}>
                                        {labels.clickableListPlaceholder}
                                    </Typography>
                                    <Search className={classes.activityInputIcon} />
                                </Box>
                            )}

                            {selectedCategories.length === 0 ? (
                                <Box className={classes.rank1CategoriesBox}>
                                    {categoriesAndActivitesNomenclature.map(d => {
                                        return renderRank1Category(
                                            d,
                                            categoriesIcons,
                                            classes,
                                            handleCategoriesActivitiesBox,
                                        );
                                    })}
                                </Box>
                            ) : (
                                <Box className={classes.rank1CategoriesBox}>
                                    {selectedCategories[selectedCategories.length - 1]?.subs?.map(s => {
                                        return renderSubRangCategory(
                                            s,
                                            selectedId,
                                            labelOfSelectedId,
                                            classes,
                                            cx,
                                            handleCategoriesActivitiesBox,
                                        );
                                    })}
                                    <Button className={classes.buttonOther} onClick={clickAutreButton}>
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
