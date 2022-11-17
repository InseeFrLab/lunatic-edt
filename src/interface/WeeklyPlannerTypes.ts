export type WeeklyPlannerDataType = {
    date: string,
    day: string,
    detail: DayDetailType[]
}

export type DayDetailType = {
    start: string,
    end: string,
    duration: number
}