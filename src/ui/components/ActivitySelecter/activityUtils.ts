import elasticlunr, { Index } from "elasticlunrjs";
import {
    AutoCompleteActiviteOption,
    NomenclatureActivityOption,
    SelectedActivity,
    responseType,
} from "interface/ActivityTypes";
import React from "react";
import { ActivitySelecterNavigationEnum } from "../../../enumeration/ActivitySelecterNavigationEnum";
import stopWords from "../ClickableList//stop_words_french.json";
import {
    FullScreenComponent,
    historyActivitySelecter,
    historyInputSuggester,
    selectedIdNewActivity,
    selectedLabelNewActivity,
} from "./ActivitySelecter";
import pairSynonymes from "./synonymes-misspellings.json";
import { validate } from "uuid";

/**
 * Find category of activity
 * @param id id of activity
 * @param referentiel list of categories
 * @param parent if category's activty is subcategory, list of subcategories
 * @returns category's activity and upper category's
 */
export const findItemInCategoriesNomenclature = (
    id: string | undefined,
    referentiel: NomenclatureActivityOption[],
    parent?: NomenclatureActivityOption,
): { item: NomenclatureActivityOption; parent: NomenclatureActivityOption | undefined } | undefined => {
    let categoriesFirstRank = referentiel.find(a => a.id === id);
    if (categoriesFirstRank) {
        return {
            item: categoriesFirstRank,
            parent: parent,
        };
    } else {
        for (let ref of referentiel) {
            let subsubs = ref.subs;
            if (subsubs) {
                //if category of activity have sub categories that match the selected item
                let categoriesSecondRank = findItemInCategoriesNomenclature(id, subsubs, ref);
                if (categoriesSecondRank) {
                    return categoriesSecondRank;
                }
            }
        }
    }
};

export const findItemInAutoCompleteRef = (
    id: string | undefined,
    ref: AutoCompleteActiviteOption[],
): AutoCompleteActiviteOption | undefined => {
    return ref.find(a => a.id === id);
};

export const findItemInAutoCompleteRefByLabel = (
    label: string | undefined,
    ref: AutoCompleteActiviteOption[],
): AutoCompleteActiviteOption | undefined => {
    return ref.find(a => a.label === label);
};

/**
 * Get category of upper rang of activity searched
 * @param res
 * @returns
 */
const getParentFromSearchResult = (
    res:
        | {
              item: NomenclatureActivityOption;
              parent: NomenclatureActivityOption | undefined;
          }
        | undefined,
) => {
    return res?.parent ? [res?.parent] : [];
};

/**
 * Get category of activity searched
 * @param res
 * @returns
 */
const getItemFromSearchResult = (
    res:
        | {
              item: NomenclatureActivityOption;
              parent: NomenclatureActivityOption | undefined;
          }
        | undefined,
) => {
    return res?.item ? [res?.item] : [];
};

/**
 * When selectionne activity with categories
 */
export const processActivityCategory = (
    value: { [key: string]: string | boolean },
    parsedValue: SelectedActivity,
    categoriesAndActivitesNomenclature: NomenclatureActivityOption[],
    setSelectedId: (id: string | undefined) => void,
    setSelectedCategories: (cats: NomenclatureActivityOption[]) => void,
) => {
    const hasId: boolean = parsedValue.id != null;
    const hasLabel: boolean = parsedValue.label != null;
    if (hasId && value && categoriesAndActivitesNomenclature) {
        setSelectedId(parsedValue.id);
        localStorage.setItem(selectedIdNewActivity, parsedValue?.id ?? "");
        const res = findItemInCategoriesNomenclature(parsedValue.id, categoriesAndActivitesNomenclature);
        const resParent = getParentFromSearchResult(res);
        const resItem = getItemFromSearchResult(res);
        const isFullyCompleted: boolean = parsedValue.isFullyCompleted;
        if (isFullyCompleted) {
            setSelectedCategories(resParent);
        } else {
            setSelectedCategories(resItem);
        }

        if (hasLabel && resItem) {
            const findItem = resItem[0]?.subs?.find(opt => opt.label == parsedValue.label);
            if (findItem) {
                setSelectedId(findItem?.id);
                localStorage.setItem(selectedIdNewActivity, findItem.id);
            }
        }
    }
};

/**
 * When search activity
 */
export const processActivityAutocomplete = (
    value: { [key: string]: string | boolean },
    parsedValue: SelectedActivity,
    setFullScreenComponent: (screen: FullScreenComponent) => void,
    setSelectedSuggesterId: (id: string | undefined) => void,
) => {
    const hasSuggesterId: boolean = parsedValue.suggesterId != null;
    if (hasSuggesterId && value) {
        setFullScreenComponent(FullScreenComponent.ClickableListComp);
        setSelectedSuggesterId(parsedValue.suggesterId);
    }
};

/**
 * When selectionne option new activity
 */
export const processNewActivity = (
    value: { [key: string]: string | boolean },
    parsedValue: SelectedActivity,
    categoriesAndActivitesNomenclature: NomenclatureActivityOption[],
    setFullScreenComponent: (screen: FullScreenComponent) => void,
    setCreateActivityValue: (val: string | undefined) => void,
    setSelectedCategories: (cats: NomenclatureActivityOption[]) => void,
) => {
    const hasLabel: boolean = parsedValue.label != null;

    if (hasLabel && value && categoriesAndActivitesNomenclature) {
        setFullScreenComponent(FullScreenComponent.FreeInput);
        setCreateActivityValue(parsedValue.label);
        const hasId: boolean = parsedValue.id != null;
        if (hasId) {
            const res = findItemInCategoriesNomenclature(
                parsedValue.id,
                categoriesAndActivitesNomenclature,
            );
            let resItem = res?.item ? [res?.item] : [];

            if (parsedValue.label != null && parsedValue.isFullyCompleted) {
                resItem = res?.parent ? [res?.parent] : [];
            }
            setSelectedCategories(resItem);
        }
    }
};

/**
 * Find category of rank 1 when selectionne categories of rank 2 or 3
 */
export const findRank1Category = (
    parsedValue: SelectedActivity,
    categoriesAndActivitesNomenclature: NomenclatureActivityOption[],
) => {
    const idSelected = parsedValue.id;
    const isFullyCompleted = parsedValue.isFullyCompleted;
    let category = undefined;
    //if category of 3nd rank, get category 2n rank, other get category 1r rank
    const categorySecondRank = findItemInCategoriesNomenclature(
        idSelected,
        categoriesAndActivitesNomenclature,
    );
    //if category of 2nd rank, get category 1r rank, other undefined
    const categoryFirstRank = findItemInCategoriesNomenclature(
        categorySecondRank?.parent?.id,
        categoriesAndActivitesNomenclature,
    );

    category = categoryFirstRank?.parent == null ? categorySecondRank : categoryFirstRank;

    return isFullyCompleted ? category?.parent : category?.item;
};

const saveNewOrCurrentActivity = (
    id: string | undefined,
    onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void,
    categoriesAndActivitesNomenclature: NomenclatureActivityOption[],
    isFullyCompleted: boolean,
) => {
    if (validate(id ?? "")) {
        const labelOfActivity = findItemInCategoriesNomenclature(id, categoriesAndActivitesNomenclature)
            ?.item.label;
        onChange(isFullyCompleted, id, id, labelOfActivity);
    } else onChange(isFullyCompleted, id, undefined, undefined);
};

export const selectSubCategory = (
    selectedId: string | undefined,
    selectedCategories: NomenclatureActivityOption[],
    setSelectedCategories: (activities: NomenclatureActivityOption[]) => void,
    onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void,
    handleChange: (response: responseType, value: string | boolean | undefined) => void,
    inputs: {
        selection: NomenclatureActivityOption;
        categoriesAndActivitesNomenclature: NomenclatureActivityOption[];
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType;
    },
) => {
    const id = selectedId == inputs.selection.id ? undefined : inputs.selection.id;
    const temp = [...selectedCategories];
    temp.push(inputs.selection);
    appendHistoryActivitySelecter(
        inputs.selection.label,
        inputs.separatorSuggester,
        inputs.historyActivitySelecterBindingDep,
        handleChange,
    );
    setSelectedCategories(temp);
    saveNewOrCurrentActivity(id, onChange, inputs.categoriesAndActivitesNomenclature, false);
};

export const selectFinalCategory = (
    states: {
        selectedId: string | undefined;
        labelOfSelectedId: string | undefined;
        setSelectedId: (id?: string) => void;
        setLabelOfSelectedId: (label?: string) => void;
    },
    onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void,
    onSelectValue: () => void,
    inputs: {
        selection: NomenclatureActivityOption;
        categoriesAndActivitesNomenclature: NomenclatureActivityOption[];
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType;
    },
    handleChange: (response: responseType, value: string | boolean | undefined) => void,
) => {
    const id = states.selectedId == inputs.selection.id ? undefined : inputs.selection.id;
    const label =
        states.labelOfSelectedId == inputs.selection.label ? undefined : inputs.selection.label;

    saveNewOrCurrentActivity(id, onChange, inputs.categoriesAndActivitesNomenclature, true);

    states.setSelectedId(id);
    states.setLabelOfSelectedId(label);
    appendHistoryActivitySelecter(
        label || "",
        inputs.separatorSuggester,
        inputs.historyActivitySelecterBindingDep,
        handleChange,
    );
    if (id != null) onSelectValue();
};

const pronounAbbreviations = ["l", "d", "m", "s", "t"];

/**
 * Activities with abbreviated pronouns (ex: de -> d')
 * are not searched because pronouns are not skipped
 * @param labelWithApostrophe
 * @returns activity label with pronoun + apostroph replace
 * with pronoun without abbreviation
 */
export const skipApostrophes = (labelWithApostrophe: string) => {
    let label = labelWithApostrophe.toLowerCase();
    pronounAbbreviations.forEach(abbrev => {
        if (label != null && label.includes(abbrev + "’")) {
            label = label.replace(abbrev + "’", abbrev + "e ");
        }
    });
    return label;
};

/**
 * Remove accents
 * @param value
 * @returns
 */
export const removeAccents = (value: string) => {
    return value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/'/g, " ");
};

/**
 * Add synonymes of misspellings
 * @param option
 * @returns
 */
export const addMisspellings = (option: AutoCompleteActiviteOption) => {
    let labelWithMisspelling = "";

    pairSynonymes.forEach(pairSynonyme => {
        const term = pairSynonyme.termination[0];
        pairSynonyme.misspelling.forEach(misspelling => {
            if (option.label.includes(term)) {
                const labelToReplace = option.label.replaceAll(term, misspelling) + "; ";
                labelWithMisspelling =
                    labelWithMisspelling +
                    (labelWithMisspelling.includes(labelToReplace) ? "" : labelToReplace);
            }
            if (option.label.includes(misspelling)) {
                const labelToReplace = option.label.replaceAll(misspelling, term) + "; ";
                labelWithMisspelling =
                    labelWithMisspelling +
                    (labelWithMisspelling.includes(labelToReplace) ? "" : labelToReplace);
            }
        });
    });
    option.synonymes = option.synonymes + "; " + labelWithMisspelling;

    return option;
};

export const activitesFiltredUnique = (activitesAutoCompleteRef: AutoCompleteActiviteOption[]) => {
    const optionsFiltered: AutoCompleteActiviteOption[] = activitesAutoCompleteRef.filter(
        (option, i, arr) => arr.findIndex(opt => opt.label === option.label) === i,
    );
    return optionsFiltered;
};

export const activitesFiltredMap = (optionsFiltered: AutoCompleteActiviteOption[]) => {
    const optionsFilteredMap = optionsFiltered.map(opt => {
        const newOption: AutoCompleteActiviteOption = {
            id: opt.id,
            label: removeAccents(skipApostrophes(addMisspellings(opt).label)).replaceAll("’", "'"),
            synonymes: opt.synonymes.replaceAll(";", "; "),
        };
        return newOption;
    });
    return optionsFilteredMap;
};

export const CreateIndex = (optionsFiltered: AutoCompleteActiviteOption[]) => {
    const optionsFilteredMap = activitesFiltredMap(optionsFiltered);
    return React.useState<Index<AutoCompleteActiviteOption>>(() => {
        elasticlunr.clearStopWords();
        elasticlunr.addStopWords(stopWords);

        const temp: Index<AutoCompleteActiviteOption> = elasticlunr();
        temp.addField("label");
        temp.addField("synonymes");
        temp.setRef("id");

        for (const doc of optionsFilteredMap) {
            temp.addDoc(doc);
        }
        return temp;
    })[0];
};

let inputValue: string | undefined;

export const updateNewValue = (
    value: string | undefined,
    onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void,
) => {
    onChange(true, undefined, undefined, value);
    if (value) localStorage.setItem(selectedLabelNewActivity, value);
    inputValue = value;
};

export const getInputValue = (): string | undefined => {
    return inputValue;
};

export const optionsFiltered = (activitesAutoCompleteRef: AutoCompleteActiviteOption[]) => {
    return activitesFiltredUnique(activitesAutoCompleteRef);
};

export const indexSuggester = (
    activitesAutoCompleteRef: AutoCompleteActiviteOption[],
    selectedSuggesterId: string | undefined,
) => {
    const options = optionsFiltered(activitesAutoCompleteRef);
    const selectedvalue: AutoCompleteActiviteOption = activitesAutoCompleteRef.filter(
        e => e.id === selectedSuggesterId,
    )[0];
    const index = CreateIndex(options);
    return [index, options, selectedvalue];
};

export const clickableListOnChange = (
    id: string | undefined,
    setSelectedSuggesterId: (id: string | undefined) => void,
    onChange: (
        isFullyCompleted: boolean,
        id?: string,
        suggesterId?: string,
        label?: string,
        historyInputSuggester?: string,
    ) => void,
    historyInputSug?: string,
) => {
    setSelectedSuggesterId(id);
    let isFully = false;
    if (id) {
        isFully = true;
    }
    let historyInputSuggesterValueLocal = localStorage.getItem(historyInputSuggester) ?? "";
    historyInputSuggesterValueLocal += historyInputSug;

    onChange(isFully, undefined, id, historyInputSug, historyInputSuggesterValueLocal);
    localStorage.removeItem(historyInputSuggester);
};

export const clickableListHistoryOnChange = (historyInputSug?: string) => {
    let historyInputSuggesterValueLocal = localStorage.getItem(historyInputSuggester) ?? "";

    if (historyInputSuggesterValueLocal != historyInputSug) {
        historyInputSuggesterValueLocal += historyInputSug;
        localStorage.setItem(historyInputSuggester, historyInputSuggesterValueLocal);
    }
};

export const appendHistoryActivitySelecter = (
    actionOrSelection: ActivitySelecterNavigationEnum | string,
    separatorSuggester: string,
    historyActivitySelecterBindingDep: responseType,
    handleChange: (response: responseType, value: string | boolean | undefined) => void,
) => {
    let historyActivitySelecterValue = localStorage.getItem(historyActivitySelecter) ?? "";

    const allHistoryActivitiesValues = historyActivitySelecterValue.split(separatorSuggester);
    const lastActivitySelected = allHistoryActivitiesValues[allHistoryActivitiesValues.length - 2];

    if (lastActivitySelected != actionOrSelection) {
        historyActivitySelecterValue =
            historyActivitySelecterValue + (actionOrSelection as string) + separatorSuggester;
        localStorage.setItem(historyActivitySelecter, historyActivitySelecterValue);
        handleChange(historyActivitySelecterBindingDep, historyActivitySelecterValue);
    }
};

export const createActivityCallBack = (
    states: {
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        freeInput: string | undefined;
    },
    setters: {
        setCreateActivityValue: (value?: string) => void;
        setFullScreenComponent: (comp: FullScreenComponent) => void;
        setNewValue: (value?: string) => void;
    },
    functions: {
        onChange: (
            isFullyCompleted: boolean,
            id?: string,
            suggesterId?: string,
            activityLabel?: string,
            historyInputSuggester?: string,
        ) => void;
        handleChange: (response: responseType, value: string | boolean | undefined) => void;
    },
    inputs: {
        activityLabel: string;
        newItemId: string;
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType;
    },
) => {
    let historyInputSuggesterValueLocal = localStorage.getItem(historyInputSuggester) ?? "";

    functions.onChange(
        true,
        states.selectedCategories[states.selectedCategories.length - 1]?.id,
        inputs.newItemId,
        inputs.activityLabel,
        historyInputSuggesterValueLocal,
    );

    appendHistoryActivitySelecter(
        ActivitySelecterNavigationEnum.ADD_ACTIVITY_BUTTON,
        inputs.separatorSuggester,
        inputs.historyActivitySelecterBindingDep,
        functions.handleChange,
    );
    setters.setFullScreenComponent(FullScreenComponent.FreeInput);
    setters.setCreateActivityValue(inputs.activityLabel);
    setters.setNewValue(inputs.activityLabel);

    const selectedCategory = states.selectedCategories[states.selectedCategories.length - 1];
    if (selectedCategory && selectedCategory.subs) {
        selectedCategory.subs.push({
            id: inputs.newItemId,
            rang: selectedCategory.rang + 1,
            label: inputs.activityLabel,
        });
    }
    localStorage.setItem(selectedLabelNewActivity, inputs.activityLabel);
};
