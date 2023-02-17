import {
    NomenclatureActivityOption,
    AutoCompleteActiviteOption,
    SelectedActivity,
} from "interface/ActivityTypes";
import { FullScreenComponent } from "./ActivitySelecter";

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

    if (hasId && !hasLabel && value && categoriesAndActivitesNomenclature) {
        setSelectedId(parsedValue.id);
        const res = findItemInCategoriesNomenclature(parsedValue.id, categoriesAndActivitesNomenclature);
        const resParent = getParentFromSearchResult(res);
        const resItem = getItemFromSearchResult(res);
        const isFullyCompleted: boolean = parsedValue.isFullyCompleted;

        if (isFullyCompleted) {
            setSelectedCategories(resParent);
        } else {
            setSelectedCategories(resItem);
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
            const resItem = res?.item ? [res?.item] : [];
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

export const selectSubCategory = (
    selection: NomenclatureActivityOption,
    selectedId: string | undefined,
    selectedCategories: NomenclatureActivityOption[],
    setSelectedCategories: (activities: NomenclatureActivityOption[]) => void,
    onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void,
) => {
    const id = selectedId == selection.id ? undefined : selection.id;
    const temp = [...selectedCategories];
    temp.push(selection);
    setSelectedCategories(temp);
    onChange(false, id, undefined, undefined);
};

export const selectFinalCategory = (
    selection: NomenclatureActivityOption,
    selectedId: string | undefined,
    labelOfSelectedId: string | undefined,
    setSelectedId: (id?: string) => void,
    setLabelOfSelectedId: (label?: string) => void,
    onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void,
    onSelectValue: () => void,
) => {
    const id = selectedId == selection.id ? undefined : selection.id;
    const label = labelOfSelectedId == selection.label ? undefined : selection.label;
    onChange(true, id, undefined, undefined);
    setSelectedId(id);
    setLabelOfSelectedId(label);
    if (id != null) onSelectValue();
};