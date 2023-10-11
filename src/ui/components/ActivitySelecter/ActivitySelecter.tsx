import { Box, Button, Typography } from "@mui/material";
import {
    AutoCompleteActiviteOption,
    NomenclatureActivityOption,
    SelectedActivity,
    responseType,
    responsesType,
} from "interface/ActivityTypes";
import { ActivityLabelProps, ActivitySelecterSpecificProps } from "interface/ComponentsSpecificProps";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ActivitySelecterNavigationEnum } from "../../../enumeration/ActivitySelecterNavigationEnum";
import { makeStylesEdt } from "../../../ui/theme";
import { splitLabelWithParenthesis } from "../../../ui/utils";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";
import Alert from "../Alert";
import ClickableList from "../ClickableList";
import FreeInput from "../FreeInput";
import {
    CreateIndex,
    activitesFiltredUnique,
    findRank1Category,
    getInputValue,
    processActivityAutocomplete,
    processActivityCategory,
    processNewActivity,
    selectFinalCategory,
    selectSubCategory,
    updateNewValue,
} from "./activityUtils";

type ActivitySelecterProps = {
    handleChange(response: responseType, value: string | boolean | undefined): void;
    componentSpecificProps: ActivitySelecterSpecificProps;
    responses: [
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
    ];
    label: string;
    value: { [key: string]: string | boolean };
    variables: Map<string, any>;
    bindingDependencies: string[];
};

export enum FullScreenComponent {
    Main,
    ClickableListComp,
    FreeInput,
}

const ActivitySelecter = memo((props: ActivitySelecterProps) => {
    let {
        handleChange,
        componentSpecificProps,
        responses,
        label,
        value,
        bindingDependencies,
        variables,
    } = props;
    bindingDependencies.forEach((bindingDependency: string) => {
        value[bindingDependency] = variables.get(bindingDependency);
    });

    const idBindingDep = responses?.[0]?.response;
    const suggesterIdBindingDep = responses?.[1]?.response;
    const labelBindingDep = responses?.[2]?.response;
    const isFullyCompletedBindingDep = responses?.[3]?.response;
    const historyInputSuggesterDep = responses?.[4]?.response;
    const historyActivitySelecterBindingDep = responses?.[5]?.response;

    let {
        backClickEvent,
        nextClickEvent,
        backClickCallback,
        nextClickCallback,
        categoriesIcons,
        activitesAutoCompleteRef,
        clickableListIconNoResult,
        setDisplayStepper,
        setDisplayHeader,
        categoriesAndActivitesNomenclature,
        labels,
        errorIcon,
        addToReferentielCallBack,
        onSelectValue,
        separatorSuggester,
        helpStep,
        chevronRightIcon,
        chevronRightIconAlt,
        searchIcon,
        searchIconAlt,
        extensionIcon,
        extensionIconAlt,
        addWhiteIcon,
        addLightBlueIcon,
        addIconAlt,
        modifiable = true,
    } = { ...componentSpecificProps };

    const [selectedCategories, setSelectedCategories] = useState<NomenclatureActivityOption[]>([]);
    const [selectRank1Category, setSelectRank1Category] = useState<
        NomenclatureActivityOption | undefined
    >(undefined);
    const [createActivityValue, setCreateActivityValue] = useState<string | undefined>();
    const [selectedId, setSelectedId] = useState<string | undefined>();

    const [selectedSuggesterId, setSelectedSuggesterId] = useState<string | undefined>();
    const [labelOfSelectedId, setLabelOfSelectedId] = useState<string | undefined>();
    const [fullScreenComponent, setFullScreenComponent] = useState<FullScreenComponent>(
        FullScreenComponent.Main,
    );
    const [displayAlert, setDisplayAlert] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 667);
    const [newValue, setNewValue] = useState<string | undefined>();

    const newItemId = useRef(uuidv4());
    const { classes, cx } = useStyles({ "modifiable": modifiable });
    let historyInputSuggesterValue = "";
    let historyActivitySelecterValue = value[historyActivitySelecterBindingDep.name]
        ? (value[historyActivitySelecterBindingDep.name] as string)
        : "";

    useEffect(() => {
        setDisplayStepper &&
            setDisplayStepper(
                fullScreenComponent === FullScreenComponent.Main && selectedCategories.length === 0,
            );

        setDisplayHeader &&
            setDisplayHeader(fullScreenComponent === FullScreenComponent.ClickableListComp && !isMobile);
    }, [fullScreenComponent, selectedCategories]);

    useEffect(() => {
        const parsedValue: SelectedActivity = {
            id: value[idBindingDep.name] as string,
            suggesterId: value[suggesterIdBindingDep.name] as string,
            label: value[labelBindingDep.name] as string,
            isFullyCompleted: value[isFullyCompletedBindingDep.name] as boolean,
        };
        setNewValue(parsedValue.label);
        if (parsedValue.label) localStorage.setItem("selectionValue - label", parsedValue.label);

        if (helpStep == 3) parsedValue.id = "100";
        setSelectRank1Category(findRank1Category(parsedValue, categoriesAndActivitesNomenclature));

        processActivityCategory(
            value,
            parsedValue,
            categoriesAndActivitesNomenclature,
            setSelectedId,
            setSelectedCategories,
        );
        processActivityAutocomplete(value, parsedValue, setFullScreenComponent, setSelectedSuggesterId);
        processNewActivity(
            value,
            parsedValue,
            categoriesAndActivitesNomenclature,
            setFullScreenComponent,
            setCreateActivityValue,
            setSelectedCategories,
        );
    }, []);

    useEffect(() => {
        back(
            backClickEvent,
            fullScreenComponent,
            backClickCallback,
            appendHistoryActivitySelecter,
            selectedCategories,
            {
                setSelectedId: setSelectedId,
                setLabelOfSelectedId: setLabelOfSelectedId,
                setSelectedSuggesterId: setSelectedSuggesterId,
                setSelectedCategories: setSelectedCategories,
                setCreateActivityValue: setCreateActivityValue,
                setFullScreenComponent: setFullScreenComponent,
            },
        );
    }, [backClickEvent]);

    useEffect(() => {
        next(
            nextClickEvent,
            false,
            {
                selectedCategory: selectRank1Category?.id,
                selectedId: selectedId,
                suggesterId: selectedSuggesterId,
                fullScreenComponent: fullScreenComponent,
                selectedCategories: selectedCategories,
                createActivityValue: createActivityValue,
                freeInput: newValue,
            },
            {
                setDisplayAlert,
                nextClickCallback,
                addToReferentielCallBack,
                appendHistoryActivitySelecter,
                onChange,
            },
            newItemId.current,
        );
    }, [nextClickEvent]);

    const handleSize = useCallback(() => {
        const isMobile1 = window.innerWidth <= 667;
        setIsMobile(isMobile1);

        setDisplayHeader &&
            setDisplayHeader(fullScreenComponent === FullScreenComponent.ClickableListComp && !isMobile);
    }, [window.innerWidth, window.innerHeight]);

    useEffect(() => {
        window.addEventListener("resize", handleSize);
        return () => {
            window.removeEventListener("resize", handleSize);
        };
    });

    const onChange = (
        isFullyCompleted: boolean,
        id?: string,
        suggesterId?: string,
        activityLabel?: string,
        historyInputSuggester?: string,
    ) => {
        const selection: SelectedActivity = {
            id: id,
            suggesterId: suggesterId,
            label: activityLabel,
            isFullyCompleted: isFullyCompleted,
            historyInputSuggester: historyInputSuggester,
        };
        const label = selection.label ?? localStorage.getItem("selectionValue - label") ?? undefined;
        const idSelected = selection.id ?? localStorage.getItem("selectedIdNewActivity") ?? undefined;

        if (idSelected != null) handleChange(idBindingDep, idSelected);
        handleChange(suggesterIdBindingDep, newItemId.current);
        handleChange(labelBindingDep, label);
        handleChange(isFullyCompletedBindingDep, selection.isFullyCompleted);
        handleChange(historyInputSuggesterDep, selection.historyInputSuggester);
    };

    const createActivityCallBack = (
        activityLabel: string,
        states: {
            selectedCategories: NomenclatureActivityOption[];
            createActivityValue: string | undefined;
            fullScreenComponent: FullScreenComponent;
            selectedCategory: string | undefined;
            selectedId: string | undefined;
            suggesterId: string | undefined;
            freeInput: string | undefined;
        },
    ) => {
        onChange(
            true,
            states.selectedCategories[states.selectedCategories.length - 1]?.id,
            newItemId.current,
            activityLabel,
            historyInputSuggesterValue,
        );
        appendHistoryActivitySelecter(ActivitySelecterNavigationEnum.ADD_ACTIVITY_BUTTON);
        setFullScreenComponent(FullScreenComponent.FreeInput);
        setCreateActivityValue(activityLabel);
        setNewValue(activityLabel);
        localStorage.setItem("selectionValue - label", activityLabel);
    };

    const clickableListOnChange = (id: string | undefined, historyInputSuggester?: string) => {
        setSelectedSuggesterId(id);
        let isFully = false;
        if (id) {
            isFully = true;
        }
        historyInputSuggesterValue += historyInputSuggester;
        onChange(isFully, undefined, id, undefined, historyInputSuggesterValue);
    };

    const clickableListHistoryOnChange = (historyInputSuggester?: string) => {
        if (historyInputSuggesterValue != historyInputSuggester)
            historyInputSuggesterValue += historyInputSuggester;
    };

    const appendHistoryActivitySelecter = (
        actionOrSelection: ActivitySelecterNavigationEnum | string,
    ) => {
        historyActivitySelecterValue =
            historyActivitySelecterValue + (actionOrSelection as string) + separatorSuggester;
        handleChange(historyActivitySelecterBindingDep, historyActivitySelecterValue);
    };

    /**
     * Show categories of rank 2 or 3
     * @param category category du first rank
     * @returns
     */
    const renderSubRankCategory = (category: NomenclatureActivityOption, index: number) => {
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
                        {
                            selectedCategories,
                            selectedId,
                            labelOfSelectedId,
                            setSelectedId,
                            setLabelOfSelectedId,
                            setSelectedCategories,
                        },
                        category,
                        onChange,
                        onSelectValue,
                        appendHistoryActivitySelecter,
                        modifiable,
                    );
                }}
                tabIndex={index + 1}
                id={"subrankCategory-" + index}
            >
                <img src={extensionIcon} alt={extensionIconAlt} className={classes.optionIcon} />
                <Typography className={classes.subRankLabel}>{category.label}</Typography>
                {category.subs && (
                    <img
                        src={chevronRightIcon}
                        alt={chevronRightIconAlt}
                        className={classes.chevronIcon}
                    />
                )}
            </Box>
        );
    };

    return (
        <Box>
            {componentSpecificProps && categoriesAndActivitesNomenclature && (
                <>
                    <Alert
                        isAlertDisplayed={displayAlert}
                        onCompleteCallBack={() => setDisplayAlert(false)}
                        onCancelCallBack={() =>
                            next(
                                nextClickEvent,
                                true,
                                {
                                    selectedCategory: selectRank1Category?.id,
                                    selectedId: selectedId,
                                    suggesterId: selectedSuggesterId,
                                    fullScreenComponent: fullScreenComponent,
                                    selectedCategories: selectedCategories,
                                    createActivityValue: createActivityValue,
                                    freeInput: newValue,
                                },
                                {
                                    setDisplayAlert,
                                    nextClickCallback,
                                    addToReferentielCallBack,
                                    appendHistoryActivitySelecter,
                                    onChange,
                                },
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
                    {renderClickableList(
                        fullScreenComponent,
                        {
                            clickableListOnChange: clickableListOnChange,
                            createActivityCallBack: createActivityCallBack,
                            clickableListHistoryOnChange: clickableListHistoryOnChange,
                        },
                        {
                            selectedCategory: selectRank1Category?.id,
                            selectedId: selectedId,
                            suggesterId: selectedSuggesterId,
                            fullScreenComponent: fullScreenComponent,
                            selectedCategories: selectedCategories,
                            createActivityValue: createActivityValue,
                            freeInput: newValue,
                        },
                        {
                            activitesAutoCompleteRef,
                            selectedSuggesterId,
                            clickableListIconNoResult,
                            historyInputSuggesterValue,
                            labels,
                            isMobile,
                            separatorSuggester,
                            modifiable,
                        },
                        classes,
                        addLightBlueIcon,
                        addWhiteIcon,
                        addIconAlt,
                        extensionIcon,
                        extensionIconAlt,
                        searchIcon,
                        searchIconAlt,
                    )}

                    {renderFreeInput(
                        {
                            selectedCategories,
                            createActivityValue,
                            fullScreenComponent,
                            selectedCategory: selectRank1Category?.id,
                            selectedId: selectedId,
                            suggesterId: selectedSuggesterId,
                            freeInput: newValue,
                        },
                        {
                            labels,
                            label,
                            isMobile,
                            newItemId: newItemId.current,
                            displayAlert:
                                fullScreenComponent == FullScreenComponent.FreeInput
                                    ? (createActivityValue === undefined ||
                                          createActivityValue === "") &&
                                      !true
                                    : selectRank1Category?.id === undefined &&
                                      selectedId === undefined &&
                                      selectedSuggesterId === undefined &&
                                      !true,
                            routeToGoal: selectedCategories[selectedCategories.length - 1]
                                ? false
                                : true,
                            modifiable: modifiable,
                        },
                        {
                            nextClickCallback,
                            addToReferentielCallBack,
                            appendHistoryActivitySelecter,
                            setDisplayAlert,
                            onChange,
                            handleChange,
                        },
                        classes,
                        cx,
                        addWhiteIcon,
                        addIconAlt,
                    )}

                    {fullScreenComponent === FullScreenComponent.Main && (
                        <Box className={classes.root}>
                            {renderTitle(
                                fullScreenComponent,
                                selectedCategories,
                                labels,
                                label,
                                classes,
                            )}

                            {renderSearchInput(
                                selectedCategories,
                                setFullScreenComponent,
                                appendHistoryActivitySelecter,
                                labels,
                                helpStep,
                                classes,
                                cx,
                                searchIcon,
                                searchIconAlt,
                            )}

                            {renderCategories(
                                {
                                    selectedCategories,
                                    selectedId,
                                    labelOfSelectedId,
                                    createActivityValue,
                                    fullScreenComponent,
                                    selectedCategory: selectRank1Category?.id,
                                    suggesterId: selectedSuggesterId,
                                    setSelectedCategories,
                                    setSelectedId,
                                    setLabelOfSelectedId,
                                },
                                {
                                    setFullScreenComponent,
                                    renderSubRankCategory,
                                    appendHistoryActivitySelecter,
                                    onSelectValue,
                                },
                                {
                                    categoriesAndActivitesNomenclature,
                                    labels,
                                    categoriesIcons,
                                    helpStep,
                                    modifiable,
                                },
                                onChange,
                                classes,
                                cx,
                            )}
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
});

/**
 * Show categories of rank 1
 * @param category
 * @returns
 */
const renderRank1Category = (
    category: NomenclatureActivityOption,
    states: {
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        labelOfSelectedId: string | undefined;
        setSelectedId: (id?: string) => void;
        setLabelOfSelectedId: (label?: string) => void;
        setSelectedCategories: (activities: NomenclatureActivityOption[]) => void;
    },
    functions: {
        onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void;
        onSelectValue: () => void;
        appendHistoryActivitySelecter: (
            actionOrSelection: ActivitySelecterNavigationEnum | string,
        ) => void;
    },
    inputs: {
        categoriesAndActivitesNomenclature: NomenclatureActivityOption[];
        categoriesIcons: { [id: string]: { icon: string; altIcon: string } };
        helpStep: number | undefined;
        modifiable: boolean | undefined;
    },
    index: number,
    classes: any,
    cx: any,
) => {
    const id = Number(category.id);
    const { mainLabel, secondLabel } = splitLabelWithParenthesis(category.label);
    return (
        <Box
            className={cx(
                classes.rank1Category,
                inputs.helpStep == 1 && ["100", "200"].includes(category.id)
                    ? classes.rank1CategoryHelp
                    : "",
                states.selectedCategory == category.id ? classes.rank1CategorySelected : undefined,
                !inputs.modifiable ? classes.disabled : "",
            )}
            key={uuidv4()}
            onClick={() =>
                categoriesActivitiesBoxClick(
                    states,
                    category,
                    functions.onChange,
                    functions.onSelectValue,
                    functions.appendHistoryActivitySelecter,
                    inputs.modifiable,
                )
            }
            tabIndex={index + 1}
            id={"rankCategory-" + index}
        >
            <img
                className={classes.icon}
                src={inputs.categoriesIcons[id].icon}
                alt={inputs.categoriesIcons[id].altIcon}
            />
            <Typography className={classes.rank1MainLabel}>{mainLabel}</Typography>
            {secondLabel && <Typography className={classes.rank1SecondLabel}>{secondLabel}</Typography>}
        </Box>
    );
};

/**
 * When category selected,
 * if exist subcategories, save category selectionned uncompleted
 * other save category completed
 * @param selection
 * @param onChange
 * @param onSelectValue
 */
const categoriesActivitiesBoxClick = (
    states: {
        selectedCategories: NomenclatureActivityOption[];
        selectedId: string | undefined;
        labelOfSelectedId: string | undefined;
        setSelectedId: (id?: string) => void;
        setLabelOfSelectedId: (label?: string) => void;
        setSelectedCategories: (activities: NomenclatureActivityOption[]) => void;
    },
    selection: NomenclatureActivityOption,
    onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void,
    onSelectValue: () => void,
    appendHistoryActivitySelecter: (actionOrSelection: ActivitySelecterNavigationEnum | string) => void,
    modifiable: boolean | undefined,
) => {
    if (modifiable) {
        if (selection.subs) {
            selectSubCategory(
                selection,
                states.selectedId,
                states.selectedCategories,
                states.setSelectedCategories,
                onChange,
                appendHistoryActivitySelecter,
            );
        } else {
            selectFinalCategory(
                selection,
                states,
                onChange,
                onSelectValue,
                appendHistoryActivitySelecter,
            );
        }
    }
};

const renderTitle = (
    fullScreenComponent: FullScreenComponent,
    selectedCategories: NomenclatureActivityOption[],
    labels: ActivityLabelProps,
    label: string,
    classes: any,
    hasQuestionMark = true,
) => {
    return selectedCategories.length === 0 ? (
        <Typography className={classes.title}>
            {label}
            {hasQuestionMark ? <>&nbsp;?</> : <></>}
        </Typography>
    ) : (
        <Typography className={classes.title}>
            {getTextTitle(fullScreenComponent, selectedCategories, labels, label)}
        </Typography>
    );
};

const renderCategories = (
    states: {
        selectedCategories: NomenclatureActivityOption[];
        selectedId: string | undefined;
        labelOfSelectedId: string | undefined;
        createActivityValue: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategory: string | undefined;
        suggesterId: string | undefined;
        setSelectedId: (id?: string) => void;
        setLabelOfSelectedId: (label?: string) => void;
        setSelectedCategories: (activities: NomenclatureActivityOption[]) => void;
    },
    functions: {
        setFullScreenComponent: (comp: FullScreenComponent) => void;
        renderSubRankCategory: (category: NomenclatureActivityOption, index: number) => JSX.Element;
        appendHistoryActivitySelecter: (
            actionOrSelection: ActivitySelecterNavigationEnum | string,
        ) => void;
        onSelectValue: () => void;
    },
    inputs: {
        categoriesIcons: { [id: string]: { icon: string; altIcon: string } };
        categoriesAndActivitesNomenclature: NomenclatureActivityOption[];
        labels: ActivityLabelProps;
        helpStep: number | undefined;
        modifiable: boolean | undefined;
    },
    onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void,
    classes: any,
    cx: any,
) => {
    return states.selectedCategories.length === 0 ? (
        <Box className={classes.rank1CategoriesBox}>
            {inputs.categoriesAndActivitesNomenclature.map((d, index) => {
                return renderRank1Category(
                    d,
                    states,
                    {
                        appendHistoryActivitySelecter: functions.appendHistoryActivitySelecter,
                        onChange: onChange,
                        onSelectValue: functions.onSelectValue,
                    },
                    inputs,
                    index,
                    classes,
                    cx,
                );
            })}
        </Box>
    ) : (
        <Box className={classes.rank1CategoriesBox}>
            {states.selectedCategories[states.selectedCategories.length - 1]?.subs?.map((s, index) => {
                return functions.renderSubRankCategory(s, index);
            })}
            <Button
                className={classes.buttonOther}
                onClick={() =>
                    clickAutreButton(
                        functions.setFullScreenComponent,
                        states.selectedCategories,
                        onChange,
                        functions.appendHistoryActivitySelecter,
                    )
                }
            >
                {inputs.labels.otherButton}
            </Button>
        </Box>
    );
};

const renderSearchInput = (
    selectedCategories: NomenclatureActivityOption[],
    setFullScreenComponent: (comp: FullScreenComponent) => void,
    appendHistoryActivitySelecter: (actionOrSelection: ActivitySelecterNavigationEnum | string) => void,
    labels: ActivityLabelProps,
    helpStep: number | undefined,
    classes: any,
    cx: any,
    searchIcon: string,
    searchIconAlt: string,
) => {
    return (
        selectedCategories.length === 0 && (
            <Box
                className={cx(classes.activityInput, helpStep == 2 ? classes.activityInputHelp : "")}
                onClick={() => {
                    appendHistoryActivitySelecter(ActivitySelecterNavigationEnum.SUGGESTER);
                    setFullScreenComponent(FullScreenComponent.ClickableListComp);
                }}
            >
                {
                    <Typography className={classes.activityInputLabel}>
                        {labels.clickableListPlaceholder}
                    </Typography>
                }
                <img src={searchIcon} alt={searchIconAlt} className={classes.activityInputIcon} />
            </Box>
        )
    );
};

const renderFreeInput = (
    states: {
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        freeInput: string | undefined;
    },
    props: {
        labels: ActivityLabelProps;
        label: string;
        isMobile: boolean;
        newItemId: string;
        displayAlert: boolean;
        routeToGoal: boolean;
        modifiable: boolean;
    },
    functions: {
        nextClickCallback: (routeToGoal: boolean) => void;
        addToReferentielCallBack: (
            newItem: AutoCompleteActiviteOption,
            categoryId: string,
            newActivity: string,
        ) => void;
        appendHistoryActivitySelecter: (
            actionOrSelection: ActivitySelecterNavigationEnum | string,
        ) => void;
        setDisplayAlert: (display: boolean) => void;
        onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void;
        handleChange(response: responseType, value: string | boolean | undefined): void;
    },
    classes: any,
    cx: any,
    addIcon: string,
    addIconAlt: string,
) => {
    return (
        states.fullScreenComponent === FullScreenComponent.FreeInput && (
            <Box className={cx(classes.freeInputBox, props.isMobile ? classes.freeInputBoxMobile : "")}>
                <FreeInput
                    states={states}
                    specifiqueProps={props}
                    functions={functions}
                    renderTitle={renderTitle}
                    updateNewValue={updateNewValue}
                />
                <Button
                    className={classes.addActivityButton}
                    variant="contained"
                    startIcon={<img src={addIcon} alt={addIconAlt} />}
                    onClick={() => {
                        navNextStep(
                            getInputValue(),
                            functions.onChange,
                            functions.nextClickCallback,
                            props.routeToGoal,
                        );
                        nextStepFreeInput(
                            states,
                            functions,
                            props.newItemId,
                            props.displayAlert,
                            props.routeToGoal,
                        );
                    }}
                    disabled={!props.modifiable}
                >
                    {props.labels.saveButton}
                </Button>
            </Box>
        )
    );
};

const renderClickableList = (
    fullScreenComponent: FullScreenComponent,
    functions: {
        clickableListOnChange: (id: string | undefined, historyInputSuggester?: string) => void;
        createActivityCallBack: (activityLabel: string, states: any) => void;
        clickableListHistoryOnChange: (historyInputSuggester: string) => void;
    },
    states: {
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        freeInput: string | undefined;
    },
    inputs: {
        activitesAutoCompleteRef: AutoCompleteActiviteOption[];
        selectedSuggesterId: string | undefined;
        clickableListIconNoResult: string;
        historyInputSuggesterValue: string;
        labels: ActivityLabelProps;
        isMobile: boolean;
        separatorSuggester: string;
        modifiable: boolean;
    },
    classes: any,
    iconAddLightBlue: string,
    iconAddWhite: string,
    iconAddAlt: string,
    iconExtension: string,
    iconExtensionAlt: string,
    iconSearch: string,
    iconSearchAlt: string,
) => {
    const optionsFiltered: AutoCompleteActiviteOption[] = activitesFiltredUnique(
        inputs.activitesAutoCompleteRef,
    );
    const selectedvalue: AutoCompleteActiviteOption = inputs.activitesAutoCompleteRef.filter(
        e => e.id === inputs.selectedSuggesterId,
    )[0];
    const index = CreateIndex(optionsFiltered);

    return (
        fullScreenComponent == FullScreenComponent.ClickableListComp && (
            <ClickableList
                className={inputs.isMobile ? classes.clickableListMobile : classes.clickableList}
                optionsFiltered={optionsFiltered}
                index={index}
                selectedValue={selectedvalue}
                historyInputSuggesterValue={inputs.historyInputSuggesterValue}
                handleChange={functions.clickableListOnChange}
                handleChangeHistorySuggester={functions.clickableListHistoryOnChange}
                createActivity={(label: string) => functions.createActivityCallBack(label, states)}
                placeholder={inputs.labels.clickableListPlaceholder}
                notFoundLabel={inputs.labels.clickableListNotFoundLabel}
                notFoundComment={inputs.labels.clickableListNotFoundComment}
                notSearchLabel={inputs.labels.clickableListNotSearchLabel}
                addActivityButtonLabel={inputs.labels.clickableListAddActivityButton}
                iconNoResult={inputs.clickableListIconNoResult}
                iconNoResultAlt={inputs.labels.clickableListIconNoResultAlt}
                autoFocus={true}
                isMobile={inputs.isMobile}
                separatorSuggester={inputs.separatorSuggester}
                iconAddWhite={iconAddWhite}
                iconAddLightBlue={iconAddLightBlue}
                iconAddAlt={iconAddAlt}
                iconExtension={iconExtension}
                iconExtensionAlt={iconExtensionAlt}
                iconSearch={iconSearch}
                iconSearchAlt={iconSearchAlt}
                modifiable={inputs.modifiable}
            />
        )
    );
};

const back = (
    backClickEvent: React.MouseEvent | undefined,
    fullScreenComponent: FullScreenComponent,
    backClickCallback: () => void,
    appendHistoryActivitySelecter: (actionOrSelection: ActivitySelecterNavigationEnum | string) => void,
    selectedCategories: NomenclatureActivityOption[],
    setters: {
        setSelectedId: (id?: string) => void;
        setLabelOfSelectedId: (label?: string) => void;
        setSelectedSuggesterId: (id?: string) => void;
        setSelectedCategories: (activities: NomenclatureActivityOption[]) => void;
        setCreateActivityValue: (value?: string) => void;
        setFullScreenComponent: (comp: FullScreenComponent) => void;
    },
) => {
    if (backClickEvent) {
        // Go back to previous page in application navigation
        if (fullScreenComponent === FullScreenComponent.Main && selectedCategories.length === 0) {
            backClickCallback();
            return;
        }
        const temp = [...selectedCategories];
        appendHistoryActivitySelecter(ActivitySelecterNavigationEnum.PREVIOUS_BUTTON);

        switch (fullScreenComponent) {
            case FullScreenComponent.Main:
                setters.setSelectedId(undefined);
                setters.setLabelOfSelectedId(undefined);
                temp.pop();
                setters.setSelectedCategories(temp);
                break;
            case FullScreenComponent.FreeInput:
                setters.setSelectedId(undefined);
                setters.setLabelOfSelectedId(undefined);
                setters.setCreateActivityValue(undefined);
                setters.setFullScreenComponent(FullScreenComponent.Main);
                break;
            case FullScreenComponent.ClickableListComp:
                setters.setSelectedSuggesterId(undefined);
                setters.setFullScreenComponent(FullScreenComponent.Main);
                break;
            default:
                break;
        }
    }
};

const nextStepClickableList = (
    states: {
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
    },
    setDisplayAlert: (display: boolean) => void,
    nextClickCallback: (routeToGoal: boolean) => void,
    displayAlert1: boolean,
    routeToGoal: boolean,
) => {
    if (displayAlert1) {
        setDisplayAlert(true);
    } else {
        if (!states.suggesterId) {
            routeToGoal = false;
        }
        nextClickCallback(routeToGoal);
    }
};

const nextStepMain = (
    setDisplayAlert: (display: boolean) => void,
    nextClickCallback: (routeToGoal: boolean) => void,
    displayAlert1: boolean,
) => {
    if (displayAlert1) {
        setDisplayAlert(true);
    } else nextClickCallback(false);
};

const navNextStep = (
    value: string | undefined,
    onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void,
    nextClickCallback: (routeToGoal: boolean) => void,
    routeToGoal: boolean,
) => {
    updateNewValue(value, onChange);
    nextClickCallback(routeToGoal);
};

const nextStepFreeInput = (
    states: {
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
        freeInput: string | undefined;
    },
    functions: {
        setDisplayAlert: (display: boolean) => void;
        nextClickCallback: (routeToGoal: boolean) => void;
        addToReferentielCallBack: (
            newItem: AutoCompleteActiviteOption,
            categoryId: string,
            newActivity: string,
        ) => void;
        appendHistoryActivitySelecter: (
            actionOrSelection: ActivitySelecterNavigationEnum | string,
        ) => void;
        onChange: (
            isFullyCompleted: boolean,
            id?: string,
            suggesterId?: string,
            activityLabel?: string,
            historyInputSuggester?: string,
        ) => void;
    },
    newItemId: string,
    displayAlert2: boolean,
    routeToGoal: boolean,
) => {
    if (displayAlert2) {
        functions.setDisplayAlert(true);
    } else {
        if (states.selectedCategories[states.selectedCategories.length - 1]) {
            routeToGoal = false;
        }
        const label = states.freeInput ?? localStorage.getItem("selectionValue - label") ?? undefined;

        functions.addToReferentielCallBack(
            {
                id: newItemId,
                label: label || "",
                synonymes: "",
            },
            states.selectedCategories[states.selectedCategories.length - 1]?.id,
            newItemId,
        );

        functions.onChange(
            true,
            states.selectedCategories[states.selectedCategories.length - 1]?.id,
            newItemId,
            label,
        );
        functions.appendHistoryActivitySelecter(ActivitySelecterNavigationEnum.SAVE_BUTTON);
        functions.appendHistoryActivitySelecter(states.createActivityValue || "");
        functions.nextClickCallback(routeToGoal);
    }
};

const nextStep = (
    states: {
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
        freeInput: string | undefined;
    },
    functions: {
        setDisplayAlert: (display: boolean) => void;
        nextClickCallback: (routeToGoal: boolean) => void;
        addToReferentielCallBack: (
            newItem: AutoCompleteActiviteOption,
            categoryId: string,
            newActivity: string,
        ) => void;
        appendHistoryActivitySelecter: (
            actionOrSelection: ActivitySelecterNavigationEnum | string,
        ) => void;
        onChange: (
            isFullyCompleted: boolean,
            id?: string,
            suggesterId?: string,
            activityLabel?: string,
            historyInputSuggester?: string,
        ) => void;
    },
    newItemId: string,
    continueWithUncompleted: boolean,
) => {
    let routeToGoal = true;
    let selectedActId =
        localStorage.getItem("selectedIdNewActivity") != "" || states.selectedId === undefined;
    let displayAlert =
        states.fullScreenComponent == FullScreenComponent.FreeInput
            ? (states.freeInput === undefined || states.freeInput === "") && !continueWithUncompleted
            : states.selectedCategory === undefined &&
              selectedActId === undefined &&
              states.suggesterId === undefined &&
              !continueWithUncompleted;
    switch (states.fullScreenComponent) {
        //option clickable list - when activity selected is one of sub category
        case FullScreenComponent.ClickableListComp:
            nextStepClickableList(
                states,
                functions.setDisplayAlert,
                functions.nextClickCallback,
                displayAlert,
                routeToGoal,
            );
            break;
        //option page principal - when activity selected is one category of first rank
        case FullScreenComponent.Main:
            if (states.selectedCategories.length === 0) {
                displayAlert =
                    states.selectedCategory === undefined &&
                    states.suggesterId === undefined &&
                    !continueWithUncompleted;
                console.log(displayAlert);
                functions.onChange(false, states.selectedCategory, undefined, undefined);
            } else {
                displayAlert =
                    selectedActId === undefined &&
                    states.suggesterId === undefined &&
                    !continueWithUncompleted;
                console.log(displayAlert);
                functions.onChange(
                    states.selectedId != null,
                    states.selectedId ?? states.selectedCategory,
                    undefined,
                    undefined,
                );
            }
            nextStepMain(functions.setDisplayAlert, functions.nextClickCallback, displayAlert);
            break;
        //option free input - when new activity or activity searched
        case FullScreenComponent.FreeInput:
            nextStepFreeInput(states, functions, newItemId, displayAlert, routeToGoal);
            break;
        default:
            break;
    }
};

/**
 * Next step if doesn't need display alert
 * @param continueWithUncompleted
 * @param states
 * @param setDisplayAlert
 * @param nextClickCallback
 * @param addToReferentielCallBack
 * @param newItemId
 */
const next = (
    nextClickEvent: React.MouseEvent | undefined,
    continueWithUncompleted: boolean,
    states: {
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
        freeInput: string | undefined;
    },
    functions: {
        setDisplayAlert: (display: boolean) => void;
        nextClickCallback: (routeToGoal: boolean) => void;
        addToReferentielCallBack: (
            newItem: AutoCompleteActiviteOption,
            categoryId: string,
            newActivity: string,
        ) => void;
        appendHistoryActivitySelecter: (
            actionOrSelection: ActivitySelecterNavigationEnum | string,
        ) => void;
        onChange: (
            isFullyCompleted: boolean,
            id?: string,
            suggesterId?: string,
            activityLabel?: string,
            historyInputSuggester?: string,
        ) => void;
    },
    newItemId: string,
) => {
    if (nextClickEvent) {
        nextStep(states, functions, newItemId, continueWithUncompleted);
    }
};

const clickAutreButton = (
    setFullScreenComponent: (comp: FullScreenComponent) => void,
    selectedCategories: NomenclatureActivityOption[],
    onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void,
    appendHistoryActivitySelecter: (actionOrSelection: ActivitySelecterNavigationEnum | string) => void,
) => {
    appendHistoryActivitySelecter(ActivitySelecterNavigationEnum.OTHER_BUTTON);
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
    const selectedActId = localStorage.getItem("selectedIdNewActivity");
    if (category.id === selectedId || category.id === selectedActId) {
        return cx(classes.subRankCategory, classes.selectedSubRankCategory);
    }
    return cx(classes.subRankCategory, category.id == "130" ? classes.rank1CategoryHelp : "");
};

const useStyles = makeStylesEdt<{ modifiable: boolean }>({ "name": { ActivitySelecter } })(
    (theme, { modifiable }) => ({
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
            marginBottom: "1rem",
        },
        activityInput: {
            width: "93%",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
            backgroundColor: theme.variables.white,
            borderRadius: "5px",
        },
        activityInputHelp: {
            zIndex: "1400",
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
        clickableListMobile: {
            width: "100%",
            marginTop: "0rem",
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
            padding: "1rem",
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
        rank1CategoryHelp: {
            zIndex: "1400",
            color: !modifiable ? "rgba(0, 0, 0, 0.38)" : "",
            cursor: !modifiable ? "default" : "",
        },
        rank1CategorySelected: {
            border: "2px solid #4973D2 !important",
            fontWeight: "bold",
            color: !modifiable ? "rgba(0, 0, 0, 0.38)" : "",
            cursor: !modifiable ? "default" : "",
        },
        icon: {
            width: "80px",
            height: "45px",
            marginTop: "1rem",
        },
        rank1MainLabel: {
            fontSize: "14px",
            textAlign: "center",
            color: !modifiable ? "rgba(0, 0, 0, 0.38)" : theme.palette.text.secondary,
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
            color: !modifiable ? "rgba(0, 0, 0, 0.38)" : "",
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
            color: !modifiable ? "rgba(0, 0, 0, 0.38)" : "",
            cursor: !modifiable ? "default" : "",
        },
        subRankCategoryMobile: {
            marginTop: "3rem",
        },
        selectedSubRankCategory: {
            borderColor: theme.palette.primary.main,
            color: !modifiable ? "rgba(0, 0, 0, 0.38)" : "",
            cursor: !modifiable ? "default" : "",
        },
        subRankLabel: {
            fontSize: "14px",
            color: !modifiable ? "rgba(0, 0, 0, 0.38)" : theme.palette.text.secondary,
            width: "80%",
            paddingLeft: "0.5rem",
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
        addActivityButton: {
            margin: "2rem 0rem",
        },
        freeInputBox: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        freeInputBoxMobile: {
            height: "85vh",
            justifyContent: "center",
        },
    }),
);

export default createCustomizableLunaticField(ActivitySelecter, "ActivitySelecter");
