import { TimeLineRowType } from "../../interface/DayOverviewTypes";

export const important = (value: string): string => {
    return value + " !important";
};

/**
 * Formate date to french format
 * @param date 
 * @returns 
 */
export const formateDate = (date: Date): string => {
    const dateOptions: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString("fr-FR", dateOptions);
}

/**
 * Generates options and default values for DayOverview HourChecker components
 * @returns 
 */
export const generateDayOverviewTimelineRowData = (): TimeLineRowType[] => {
    const rowData: TimeLineRowType[] = [];
    for (let h = 0; h < 24; h++) {
        const date = new Date();
        date.setHours(h);
        date.setMinutes(0);
        const row: TimeLineRowType = { label: "", options: [], value: {} };

        if (date.getHours() === 0) {
            row.label = "minuit";
        } else if (date.getHours() === 12) {
            row.label = "midi";
        } else {
            row.label = date.getHours() + "h00";
        }

        for (let i = 1; i <= 4; i++) {
            date.setMinutes(date.getMinutes() + 15);
            const key = date.getHours().toString() + "h" + date.getMinutes().toString();
            row.options.push(
                {
                    id: i.toString(),
                    label: key,
                    response: { name: key }
                }
            );
            row.value[key] = false;
        }
        rowData.push(row);
    }
    return rowData;
}