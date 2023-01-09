export interface Activity {
    label: string;
    startTime?: string;
    endTime?: string;
}

export type TimepickerSpecificProps = {
    activitiesAct: Activity[];
};
