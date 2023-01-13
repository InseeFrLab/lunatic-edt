import { DayDetailType, IODataStructure, WeeklyPlannerDataType } from "interface/WeeklyPlannerTypes";
import { convertTime, generateDateFromStringInput, getFrenchDayFromDate } from "../../../utils";

export const INTERVAL = 15;
const DAY_TIME_SEPARATOR = "_";
const STARTED_LABEL = "started";

const convertTimeAsDate = (time: string): Date => {
    const result: Date = new Date();
    const splittedTime = time.split("h");
    result.setHours(Number(splittedTime[0]));
    result.setMinutes(Number(splittedTime[1]));
    result.setSeconds(0);
    result.setMilliseconds(0);
    return result;
};

export const transformToWeeklyPlannerDataType = (input: IODataStructure[]): WeeklyPlannerDataType[] => {
    const result: WeeklyPlannerDataType[] = [];
    let currentDay: WeeklyPlannerDataType = {
        hasBeenStarted: false,
        date: "",
        day: "",
        detail: [],
    };
    let currentDetail: DayDetailType | undefined = undefined;
    let previousTime: Date;

    input &&
        input.length > 1 &&
        input.forEach(i => {
            const key = Object.keys(i)[0];
            const value = Object.values(i)[0];
            if (!key.includes(DAY_TIME_SEPARATOR)) {
                if (currentDetail) {
                    currentDay.detail.push(currentDetail);
                }
                currentDetail = undefined;
                currentDay = {
                    hasBeenStarted: false,
                    date: value,
                    day: getFrenchDayFromDate(generateDateFromStringInput(value)),
                    detail: [],
                };
                result.push(currentDay);
            } else if (key.includes(STARTED_LABEL)) {
                currentDay.hasBeenStarted = value === "true";
            } else {
                const timeAsString = key.split(DAY_TIME_SEPARATOR)[1];
                const timeAsDate = convertTimeAsDate(timeAsString);
                currentDay.hasBeenStarted = true;
                if (!currentDetail) {
                    currentDetail = {
                        start: timeAsString,
                        end: timeAsString,
                        duration: INTERVAL,
                    };
                } else {
                    const nextSlot = previousTime;
                    nextSlot.setMinutes(nextSlot.getMinutes() + INTERVAL);
                    if (nextSlot.getTime() === timeAsDate.getTime()) {
                        currentDetail.end = timeAsString;
                        currentDetail.duration = currentDetail.duration + INTERVAL;
                    } else {
                        currentDay.detail.push(currentDetail);
                        currentDetail = {
                            start: timeAsString,
                            end: timeAsString,
                            duration: INTERVAL,
                        };
                    }
                }
                previousTime = timeAsDate;
            }
        });

    if (currentDetail) {
        currentDay.detail.push(currentDetail);
    }
    return result;
};

export const transformToIODataStructure = (data: WeeklyPlannerDataType[]): IODataStructure[] => {
    const result: IODataStructure[] = [];
    for (let i = 0; i < data.length; i++) {
        const dayKey = `dateJ${i + 1}`;
        result.push({ [dayKey]: data[i].date });
        const dayStarted = `${dayKey}${DAY_TIME_SEPARATOR}${STARTED_LABEL}`;
        result.push({ [dayStarted]: data[i].hasBeenStarted.toString() });
        data[i].detail.forEach(d => {
            const time: Date = new Date();
            const splittedTime = d.start.split("h");
            time.setHours(Number(splittedTime[0]));
            time.setMinutes(Number(splittedTime[1]));

            for (let j = 0; j < d.duration / INTERVAL; j++) {
                const timeKey = `${dayKey}${DAY_TIME_SEPARATOR}${convertTime(time)}`;
                result.push({ [timeKey]: "true" });
                time.setMinutes(time.getMinutes() + INTERVAL);
            }
        });
    }
    return result;
};

/**
 * Returns number between 0 and 100 depending on how many days of the week for which editing has been started
 * at the end discrete values between 1/7 and 7/7 rounded as %
 * @returns
 */
export const getProgressBarValue = (activityData: WeeklyPlannerDataType[]): number => {
    return Math.round((activityData.filter(a => a.hasBeenStarted === true).length / 7) * 100);
};
