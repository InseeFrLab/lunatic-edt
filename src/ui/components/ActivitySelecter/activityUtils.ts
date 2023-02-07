import {
    NomenclatureActivityOption,
    AutoCompleteActiviteOption,
    SelectedActivity,
} from "interface/ActivityTypes";
import { FullScreenComponent } from "./ActivitySelecter";

export const findItemInCategoriesNomenclature = (
    id: string | undefined,
    referentiel: NomenclatureActivityOption[],
    parent?: NomenclatureActivityOption,
): { item: NomenclatureActivityOption; parent: NomenclatureActivityOption | undefined } | undefined => {
    let categoriesFirstRang = referentiel.find(a => a.id === id);
    if (categoriesFirstRang) {
        return {
            item: categoriesFirstRang,
            parent: parent,
        };
    } else {
        for (let ref of referentiel) {
            let subsubs = ref.subs;
            if (subsubs) {
                //if category of activity have sub categories that match the selected item
                let categoriesSecondRang = findItemInCategoriesNomenclature(id, subsubs, ref);
                if (categoriesSecondRang) {
                    return categoriesSecondRang;
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

export const processActivityCategory = (
    parsedValue: SelectedActivity,
    categoriesAndActivitesNomenclature: NomenclatureActivityOption[],
    setSelectedId: (id: string | undefined) => void,
    setSelectedCategories: (cats: NomenclatureActivityOption[]) => void,
) => {
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
};

export const processActivityAutocomplete = (
    parsedValue: SelectedActivity,
    setFullScreenComponent: (screen: FullScreenComponent) => void,
    setSelectedSuggesterId: (id: string | undefined) => void,
) => {
    setFullScreenComponent(FullScreenComponent.ClickableListComp);
    setSelectedSuggesterId(parsedValue.suggesterId);
};

export const processNewActivity = (
    parsedValue: SelectedActivity,
    categoriesAndActivitesNomenclature: NomenclatureActivityOption[],
    setFullScreenComponent: (screen: FullScreenComponent) => void,
    setCreateActivityValue: (val: string | undefined) => void,
    setSelectedCategories: (cats: NomenclatureActivityOption[]) => void,
) => {
    setFullScreenComponent(FullScreenComponent.FreeInput);
    setCreateActivityValue(parsedValue.label);
    const hasId: boolean = parsedValue.id != null;

    if (categoriesAndActivitesNomenclature && hasId) {
        const res = findItemInCategoriesNomenclature(parsedValue.id, categoriesAndActivitesNomenclature);
        const resItem = res?.item ? [res?.item] : [];
        setSelectedCategories(resItem);
    }
};
