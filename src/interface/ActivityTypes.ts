export type NomenclatureActivityOption = {
    label: string;
    id: string;
    rang: number;
    subs?: NomenclatureActivityOption[];
};

export type SelectedActivity = {
    id?: string;
    suggesterId?: string;
    label?: string;
    isFullyCompleted: boolean;
};

export type AutoCompleteActiviteOption = {
    id: string;
    label: string;
    synonymes: string;
};
