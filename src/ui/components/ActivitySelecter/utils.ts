import { ActivitySelection } from "interface/ActivityTypes";

export const findItemInNomenclature = (
    id: string | undefined,
    subs: ActivitySelection[],
    parent: ActivitySelection | undefined,
): any => {
    let res = subs.find(a => a.id === id);
    if (res) {
        return {
            item: res,
            parent: parent,
        };
    } else {
        for (let i = 0; i < subs.length; i++) {
            let subsubs = subs[i].subs;
            if (subsubs) {
                let res2 = findItemInNomenclature(id, subsubs, subs[i]);
                if (res2) {
                    return res2;
                }
            }
        }
    }
};
