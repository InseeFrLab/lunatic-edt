import { ChevronRight, Extension, Search } from "@mui/icons-material";
import { Box, Button, TextField, Typography } from "@mui/material";
import {
    AutoCompleteActiviteOption,
    NomenclatureActivityOption,
    SelectedActivity,
} from "interface/ActivityTypes";
import { ActivityLabelProps, ActivitySelecterSpecificProps } from "interface/ComponentsSpecificProps";
import React, { memo, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { makeStylesEdt } from "../../../ui/theme";
import { splitLabelWithParenthesis } from "../../../ui/utils";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";
import Alert from "../Alert";
import ClickableList from "../ClickableList";
import { processSelectedValue } from "./activityUtils";

type ActivitySelecterProps = {
    handleChange(response: { [name: string]: string }, value: string): void;
    componentSpecificProps: ActivitySelecterSpecificProps;
    response: { [name: string]: string };
    label: string;
    value: string;
};

export enum FullScreenComponent {
    Main,
    ClickableListComp,
    FreeInput,
}

const ActivitySelecter = memo((props: ActivitySelecterProps) => {
    let { handleChange, componentSpecificProps, response, label, value } = props;

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
        errorIcon,
        addToReferentielCallBack,
        onClick,
    } = { ...componentSpecificProps };

    const [selectedCategories, setSelectedCategories] = useState<NomenclatureActivityOption[]>([]);
    const [createActivityValue, setCreateActivityValue] = useState<string | undefined>();
    const [selectedId, setSelectedId] = useState<string | undefined>();
    const [selectedSuggesterId, setSelectedSuggesterId] = useState<string | undefined>();
    const [labelOfSelectedId, setLabelOfSelectedId] = useState<string | undefined>();
    const [fullScreenComponent, setFullScreenComponent] = useState<FullScreenComponent>(
        FullScreenComponent.Main,
    );
    const [displayAlert, setDisplayAlert] = useState<boolean>(false);
    const newItemId = useRef(uuidv4());

    useEffect(() => {
        setDisplayStepper &&
            setDisplayStepper(
                fullScreenComponent === FullScreenComponent.Main && selectedCategories.length === 0,
            );
    }, [fullScreenComponent, selectedCategories]);

    const { classes, cx } = useStyles();

    useEffect(() => {
        value &&
            categoriesAndActivitesNomenclature &&
            processSelectedValue(
                value,
                categoriesAndActivitesNomenclature,
                setFullScreenComponent,
                setSelectedId,
                setSelectedSuggesterId,
                setCreateActivityValue,
                setSelectedCategories,
            );
    }, []);

    useEffect(() => {
        backClickEvent &&
            back(
                fullScreenComponent,
                backClickCallback,
                selectedCategories,
                {
                    setSelectedId: setSelectedId,
                    setLabelOfSelectedId: setLabelOfSelectedId,
                    setSelectedSuggesterId: setSelectedSuggesterId,
                    setSelectedCategories: setSelectedCategories,
                    setCreateActivityValue: setCreateActivityValue,
                    setFullScreenComponent: setFullScreenComponent,
                },
                onChange,
            );
    }, [backClickEvent]);

    useEffect(() => {
        nextClickEvent &&
            next(
                false,
                {
                    selectedId: selectedId,
                    suggesterId: selectedSuggesterId,
                    fullScreenComponent: fullScreenComponent,
                    selectedCategories: selectedCategories,
                    createActivityValue: createActivityValue,
                },
                setDisplayAlert,
                nextClickCallback,
                addToReferentielCallBack,
                newItemId.current,
            );
    }, [nextClickEvent]);

    const onChange = (
        isFullyCompleted: boolean,
        id?: string,
        suggesterId?: string,
        activityLabel?: string,
    ) => {
        const selection: SelectedActivity = {
            id: id,
            suggesterId: suggesterId,
            label: activityLabel,
            isFullyCompleted: isFullyCompleted,
        };
        handleChange(response, JSON.stringify(selection));
    };

    const createActivityCallBack = (activityLabel: string) => {
        onChange(true, undefined, undefined, activityLabel);
        setFullScreenComponent(FullScreenComponent.FreeInput);
        setCreateActivityValue(activityLabel);
    };

    const clickableListOnChange = (id: string | undefined) => {
        setSelectedSuggesterId(id);
        let isFully = false;
        if (id) {
            isFully = true;
        }
        onChange(isFully, undefined, id);
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
        onChange(isFully, id, undefined, e.target.value);
    };

    const renderSubRangCategory = (category: NomenclatureActivityOption) => {
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
                        onClick,
                    );
                }}
            >
                <Extension className={classes.optionIcon} />
                <Typography className={classes.subRankLabel}>{category.label}</Typography>
                {category.subs && <ChevronRight className={classes.chevronIcon} />}
            </Box>
        );
    };

    const renderRank1Category = (category: NomenclatureActivityOption) => {
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
                        onClick,
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
                    <Alert
                        isAlertDisplayed={displayAlert}
                        onCompleteCallBack={() => setDisplayAlert(false)}
                        onCancelCallBack={() =>
                            next(
                                true,
                                {
                                    selectedId: selectedId,
                                    suggesterId: selectedSuggesterId,
                                    fullScreenComponent: fullScreenComponent,
                                    selectedCategories: selectedCategories,
                                    createActivityValue: createActivityValue,
                                },
                                setDisplayAlert,
                                nextClickCallback,
                                addToReferentielCallBack,
                                newItemId.current,
                            )
                        }
                        labels={{
                            content: labels.alertMessage,
                            cancel: labels.alertIgnore,
                            complete: labels.alertComplete,
                        }}
                        icon={errorIcon}
                        errorIconAlt={labels.alertAlticon}
                    ></Alert>

                    {fullScreenComponent === FullScreenComponent.ClickableListComp && (
                        <ClickableList
                            className={classes.clickableList}
                            options={activitesAutoCompleteRef}
                            selectedId={selectedSuggesterId}
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
                                        setFullScreenComponent(FullScreenComponent.ClickableListComp)
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
    selectedCategories: NomenclatureActivityOption[],
    setters: {
        setSelectedId: (id?: string) => void;
        setLabelOfSelectedId: (label?: string) => void;
        setSelectedSuggesterId: (id?: string) => void;
        setSelectedCategories: (activities: NomenclatureActivityOption[]) => void;
        setCreateActivityValue: (value?: string) => void;
        setFullScreenComponent: (comp: FullScreenComponent) => void;
    },
    onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void,
) => {
    // Go back to previous page in application navigation
    if (fullScreenComponent === FullScreenComponent.Main && selectedCategories.length === 0) {
        backClickCallback();
        return;
    }
    const temp = [...selectedCategories];

    switch (fullScreenComponent) {
        case FullScreenComponent.Main:
            setters.setSelectedId(undefined);
            setters.setLabelOfSelectedId(undefined);
            temp.pop();
            setters.setSelectedCategories(temp);
            onChange(false, temp[temp.length - 1]?.id, undefined);
            break;
        case FullScreenComponent.FreeInput:
            setters.setSelectedId(undefined);
            setters.setLabelOfSelectedId(undefined);
            setters.setCreateActivityValue(undefined);
            setters.setFullScreenComponent(FullScreenComponent.Main);
            onChange(false, selectedCategories[selectedCategories.length - 1]?.id, undefined, undefined);
            break;
        case FullScreenComponent.ClickableListComp:
            setters.setSelectedSuggesterId(undefined);
            setters.setFullScreenComponent(FullScreenComponent.Main);
            onChange(false, undefined, undefined, undefined);
            break;
        default:
            break;
    }
};

const next = (
    continueWithUncompleted: boolean,
    states: {
        selectedId: string | undefined;
        suggesterId: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
    },
    setDisplayAlert: (display: boolean) => void,
    nextClickCallback: (routeToGoal: boolean) => void,
    addToReferentielCallBack: (newItem: AutoCompleteActiviteOption) => void,
    newItemId: string,
) => {
    let routeToGoal = true;
    let displayAlert1 =
        states.selectedId === undefined && states.suggesterId === undefined && !continueWithUncompleted;
    let displayAlert2 =
        (states.createActivityValue === undefined || states.createActivityValue === "") &&
        !continueWithUncompleted;

    switch (states.fullScreenComponent) {
        case FullScreenComponent.ClickableListComp:
            if (displayAlert1) {
                setDisplayAlert(true);
                break;
            }
            if (!states.suggesterId) {
                routeToGoal = false;
            }
            nextClickCallback(routeToGoal);
            break;
        case FullScreenComponent.Main:
            if (displayAlert1) {
                setDisplayAlert(true);
                break;
            }
            nextClickCallback(false);
            break;
        case FullScreenComponent.FreeInput:
            if (displayAlert2) {
                setDisplayAlert(true);
                break;
            }
            if (states.selectedCategories[states.selectedCategories.length - 1]) {
                routeToGoal = false;
            }
            addToReferentielCallBack({
                id: newItemId,
                label: states.createActivityValue || "",
                synonymes: "",
            });
            nextClickCallback(routeToGoal);
            break;
        default:
            break;
    }
};

const clickAutreButton = (
    setFullScreenComponent: (comp: FullScreenComponent) => void,
    selectedCategories: NomenclatureActivityOption[],
    onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void,
) => {
    setFullScreenComponent(FullScreenComponent.FreeInput);
    // If we enter free input value from "Autre" button, then save id of last selected category
    let id = undefined;
    if (selectedCategories.length > 0) {
        id = selectedCategories[selectedCategories.length - 1].id;
    }
    onChange(false, id, undefined);
};

const getTextTitle = (
    fullScreenComponent: FullScreenComponent,
    selectedCategories: NomenclatureActivityOption[],
    labels: ActivityLabelProps,
    label: string,
) => {
    if (fullScreenComponent === FullScreenComponent.FreeInput) {
        return labels.addActivity;
    }
    if (selectedCategories.length === 0) {
        return label;
    }
    return `${labels.selectInCategory} «${selectedCategories[selectedCategories.length - 1]?.label} »`;
};

const getSubRankCategoryClassName = (
    category: NomenclatureActivityOption,
    selectedId: string | undefined,
    _labelOfSelectedId: string | undefined,
    classes: any,
    cx: any,
) => {
    if (category.id === selectedId) {
        return cx(classes.subRankCategory, classes.selectedSubRankCategory);
    }
    return classes.subRankCategory;
};

const categoriesActivitiesBoxClick = (
    selection: NomenclatureActivityOption,
    selectedCategories: NomenclatureActivityOption[],
    setSelectedCategories: (activities: NomenclatureActivityOption[]) => void,
    onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void,
    setSelectedId: (id: string) => void,
    setLabelOfSelectedId: (label: string) => void,
    onClick: () => void,
) => {
    if (selection.subs) {
        const temp = [...selectedCategories];
        temp.push(selection);
        setSelectedCategories(temp);
        onChange(false, selection.id, undefined, undefined);
    } else {
        onChange(true, selection.id, undefined, undefined);
        setSelectedId(selection.id);
        setLabelOfSelectedId(selection.label);
        onClick();
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
        border: "2px solid transparent",
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
