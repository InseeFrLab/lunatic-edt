export type WeeklyPlannerDataType = {
    hasBeenStarted: boolean;
    date: string;
    day: string;
    detail: DayDetailType[];
};

export type DayDetailType = {
    start: string;
    end: string;
    duration: number;
};

export type WeeklyPlannerValue = {
    data: WeeklyPlannerDataType[] | undefined;
};
