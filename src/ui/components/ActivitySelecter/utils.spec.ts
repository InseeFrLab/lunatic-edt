import { findItemInNomenclature } from "./utils";

describe("findItemInNomenclature", () => {
    const jsonRef = [
        {
            "label": "Temps personnel (dormir, se laver, manger …)",
            "rang": 1,
            "id": "100",
        },
        {
            "label": "Tâches domestiques (ménage, cuisine, courses …)",
            "rang": 1,
            "id": "300",
            "subs": [
                {
                    "label": "Tâches ménagères",
                    "rang": 2,
                    "id": "301",
                    "subs": [
                        {
                            "label": "Cuisine",
                            "rang": 3,
                            "id": "310",
                            "subs": [
                                {
                                    "label": "cuisiner",
                                    "rang": 4,
                                    "id": "311",
                                },
                                {
                                    "label": "mettre la table",
                                    "rang": 4,
                                    "id": "313",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    it("should find item in json referentiel", () => {
        const id = "310";
        expect(findItemInNomenclature(id, jsonRef, undefined)?.item?.id).toEqual(id);
    });

    it("should not find item in json referentiel", () => {
        expect(findItemInNomenclature("312", jsonRef, undefined)?.item).toBeUndefined();
    });

    it("should find parent in json referentiel", () => {
        const parentId = "310";
        const id = "311";
        expect(findItemInNomenclature(id, jsonRef, undefined)?.item?.id).toEqual(id);
        expect(findItemInNomenclature(id, jsonRef, undefined)?.parent?.id).toEqual(parentId);
    });

    it("should not find parent in json referentiel", () => {
        const id = "100";
        expect(findItemInNomenclature(id, jsonRef, undefined)?.item?.id).toEqual(id);
        expect(findItemInNomenclature(id, jsonRef, undefined)?.parent).toBeUndefined();
    });
});
