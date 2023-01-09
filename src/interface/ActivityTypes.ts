export type ActivitySelection = {
    label: string;
    id: string;
    rang: number;
    subs?: ActivitySelection[];
};

export type SelectedActivity = {
    id?: string;
    label?: string;
    isFullyCompleted?: boolean;
};
