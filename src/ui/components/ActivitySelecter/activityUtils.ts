import {
    NomenclatureActivityOption,
    AutoCompleteActiviteOption,
    SelectedActivity,
    responseType,
} from "interface/ActivityTypes";
import { FullScreenComponent } from "./ActivitySelecter";

export const findItemInCategoriesNomenclature = (
    id: string | undefined,
    ref: NomenclatureActivityOption[],
    parent?: NomenclatureActivityOption,
): { item: NomenclatureActivityOption; parent: NomenclatureActivityOption | undefined } | undefined => {
    let res = ref.find(a => a.id === id);
    if (res) {
        return {
            item: res,
            parent: parent,
        };
    } else {
        for (let i = 0; i < ref.length; i++) {
            let subsubs = ref[i].subs;
            if (subsubs) {
                let res2 = findItemInCategoriesNomenclature(id, subsubs, ref[i]);
                if (res2) {
                    return res2;
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

export const processSelectedValue = (
    value: { [key: string]: string | boolean },
    idBindingDep: responseType,
    suggesterIdBindingDep: responseType,
    labelBindingDep: responseType,
    isFullyCompletedBindingDep: responseType,
    categoriesAndActivitesNomenclature: NomenclatureActivityOption[],
    setFullScreenComponent: (screen: FullScreenComponent) => void,
    setSelectedId: (id: string | undefined) => void,
    setSelectedSuggesterId: (id: string | undefined) => void,
    setCreateActivityValue: (val: string | undefined) => void,
    setSelectedCategories: (cats: NomenclatureActivityOption[]) => void,
) => {
    const parsedValue: SelectedActivity = {
        id: value[idBindingDep.name] as string,
        suggesterId: value[suggesterIdBindingDep.name] as string,
        label: value[labelBindingDep.name] as string,
        isFullyCompleted: value[isFullyCompletedBindingDep.name] as boolean,
    };
    const hasId: boolean = parsedValue.id != null;
    const hasSuggesterId: boolean = parsedValue.suggesterId != null;
    const hasLabel: boolean = parsedValue.label != null;
    const isFullyCompleted: boolean = parsedValue.isFullyCompleted;

    if (hasId && !hasLabel) {
        setSelectedId(parsedValue.id);

        const res = findItemInCategoriesNomenclature(parsedValue.id, categoriesAndActivitesNomenclature);
        const resParent = getParentFromSearchResult(res);
        const resItem = getItemFromSearchResult(res);
        if (isFullyCompleted) {
            setSelectedCategories(resParent);
        } else {
            setSelectedCategories(resItem);
        }
    }
    if (hasSuggesterId) {
        setFullScreenComponent(FullScreenComponent.ClickableListComp);
        setSelectedSuggesterId(parsedValue.suggesterId);
    }
    if (hasLabel) {
        setFullScreenComponent(FullScreenComponent.FreeInput);
        setCreateActivityValue(parsedValue.label);
        if (categoriesAndActivitesNomenclature && hasId) {
            const res = findItemInCategoriesNomenclature(
                parsedValue.id,
                categoriesAndActivitesNomenclature,
            );
            const resItem = res?.item ? [res?.item] : [];
            setSelectedCategories(resItem);
        }
    }
};
