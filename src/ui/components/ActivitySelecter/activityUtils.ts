import { NomenclatureActivityOption, AutoCompleteActiviteOption } from "interface/ActivityTypes";

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
