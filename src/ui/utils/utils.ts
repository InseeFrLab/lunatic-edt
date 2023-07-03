import { TimeLineRowType } from "../../interface/DayOverviewTypes";

export const important = (value: string): string => {
    return value + " !important";
};

/**
 * Returns string of date with french format
 * e.g. mercredi 14 juin 2022
 * @param date
 * @returns
 */
export const formateDateToFrenchFormat = (date: Date, language: string, dateOptions?: any): string => {
    if (!dateOptions) {
        dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    }
    return date.toLocaleDateString(language, dateOptions);
};

/**
 * Returns french day from date
 * e.g. lundi
 * @param date
 */
export const getFrenchDayFromDate = (date: Date): string => {
    const dateOptions: any = { weekday: "long" };
    return date.toLocaleDateString("fr-FR", dateOptions);
};

/**
 * Returns a date from string of date formatted as:
 * yyyy-mm-dd
 * @param input
 * @returns
 */
export const generateDateFromStringInput = (input: string): Date => {
    const splittedDate = input.split("-");
    const date = new Date();
    date.setDate(Number(splittedDate[2]));
    date.setUTCMonth(Number(splittedDate[1]) - 1, Number(splittedDate[2]));
    date.setFullYear(Number(splittedDate[0]));
    return date;
};

/**
 * Returns a string with format: yyyy-mm-dd
 * @param date
 * @returns
 */
export const generateStringInputFromDate = (date: Date): string => {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
};

/**
 * Sets hours, minutes, seconds and milliseconds to 0 to allow comparison at date level
 * @param date
 * @returns
 */
export const setDateTimeToZero = (date: Date): Date => {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
};

/**
 * Returns time from Date, with format: hhhmm
 * @param t
 * @returns
 */
export const convertTime = (t: Date): string => {
    return t.getHours().toString() + "h" + t.getMinutes().toString();
};

/**
 * Generates options and default values for DayOverview HourChecker components
 * Returns a TimeLineRowType for each timeline interval
 * @returns
 */
export const generateDayOverviewTimelineRawData = (): TimeLineRowType[] => {
    const rowData: TimeLineRowType[] = [];
    for (let h = 0; h < 24; h++) {
        const date = new Date();
        date.setHours(h);
        date.setMinutes(0);
        const row: TimeLineRowType = { label: "", options: [], value: {} };

        if (date.getHours() === 0) {
            row.label = "Minuit";
        } else if (date.getHours() === 12) {
            row.label = "Midi";
        } else {
            row.label = date.getHours() + "h00";
        }

        for (let i = 1; i <= 4; i++) {
            date.setMinutes(date.getMinutes() + 15);
            const key = convertTime(date);
            row.options.push({
                id: i.toString(),
                label: key,
                response: { name: key },
            });
            row.value[key] = false;
        }
        rowData.push(row);
    }
    return rowData;
};

/**
 * Splits a label (e.g. of categories) in two if it has some parenthesis
 * @param fullLabel
 * @returns
 */
export const splitLabelWithParenthesis = (
    fullLabel: string,
): { mainLabel: string; secondLabel: string | undefined } => {
    let mainLabel;
    let secondLabel;
    const indexOfParenthesis = fullLabel.indexOf("(");
    if (indexOfParenthesis !== -1) {
        mainLabel = fullLabel.substring(0, indexOfParenthesis);
        secondLabel = fullLabel.substring(indexOfParenthesis + 1, fullLabel.length - 1);
    } else {
        mainLabel = fullLabel;
    }
    return {
        mainLabel: mainLabel,
        secondLabel: secondLabel,
    };
};
