export type ActivitySelection = {
    label: string;
    id: string;
    rang: number;
    subs?: ActivitySelection[];
};

export type SelectedActivity = {
    id?: string;
    suggesterId?: string;
    label?: string;
    isFullyCompleted: boolean;
};
