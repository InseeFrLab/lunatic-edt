import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { theme } from "./../../../theme";
import "@testing-library/jest-dom";

import { ThemeProvider } from "@mui/material";
import WeeklyPlanner from "./WeeklyPlanner";
import { generateStringInputFromDate } from "../../../utils";
import { WeeklyPlannerSpecificProps } from "interface";
import { IODataStructure, WeeklyPlannerDataType } from "interface/WeeklyPlannerTypes";
import { transformToIODataStructure, transformToWeeklyPlannerDataType } from "./utils";

describe("weeklyPlannerComponent", () => {
    const workSumLabel = "total travaillé";
    const presentButtonLabel = "continuer";
    const futureButtonLable = "commencer";
    const title = "titre";

    // Set the surveyDate to today
    let surveyDate: Date = new Date();
    surveyDate.setDate(surveyDate.getDate() - 2);
    const surveyDateString: string = generateStringInputFromDate(surveyDate);

    const todayStringValue = generateStringInputFromDate(new Date());
    const setIsSubChildDisplayed = jest.fn();

    const value: IODataStructure[] = [
        { "day1": todayStringValue },
        { "day1_2h15": "true" },
        { "day1_2h30": "true" },
        { "day1_2h45": "true" },
        { "day1_3h0": "true" },
    ];

    const componentProps: WeeklyPlannerSpecificProps = {
        surveyDate: surveyDateString,
        isSubChildDisplayed: false,
        setIsSubChildDisplayed: setIsSubChildDisplayed,
        labels: {
            title: title,
            workSumLabel: workSumLabel,
            presentButtonLabel: presentButtonLabel,
            futureButtonLabel: futureButtonLable,
        },
    };

    const renderElement = (valueData: IODataStructure[]): RenderResult => {
        return render(
            <ThemeProvider theme={theme}>
                <WeeklyPlanner
                    handleChange={() => console.log("changed")}
                    value={valueData}
                    componentSpecificProps={componentProps}
                ></WeeklyPlanner>
            </ThemeProvider>,
        );
    };

    beforeEach(() => {
        renderElement(value);
    });

    it("renders 7 DayPlanner and 1 DayOverview with 24 Hourchecker", () => {
        expect(screen.getAllByLabelText("dayplanner")).toHaveLength(7);
        expect(screen.getAllByLabelText("dayoverview")).toHaveLength(1);
        expect(screen.getAllByLabelText("hourchecker")).toHaveLength(24);
    });

    it("renders DayPlanner items with correct DayRelativeTime", () => {
        expect(screen.getAllByText(workSumLabel)).toHaveLength(2);
        expect(screen.getAllByText(presentButtonLabel)).toHaveLength(1);
        expect(screen.getAllByText(futureButtonLable)).toHaveLength(4);
    });

    it("renders title and main ProgressBar", () => {
        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getAllByLabelText("progressbar")).toHaveLength(3);
    });

    it("renders (non)selected hours and update them", async () => {
        expect(screen.queryAllByLabelText("hourselected")).toHaveLength(0);
        expect(screen.getAllByLabelText("hournotselected")).toHaveLength(96);

        userEvent.click(screen.getByText(presentButtonLabel));

        await waitFor(() => expect(setIsSubChildDisplayed).toHaveBeenCalledTimes(1));

        expect(await screen.findAllByLabelText("hournotselected")).toHaveLength(92);
        expect(await screen.findAllByLabelText("hourselected")).toHaveLength(4);
    });

    it("updates ProgressBar label", () => {
        expect(screen.getByText("14%")).toBeInTheDocument();
    });
});

describe("weeklyPlannerFunctions", () => {
    const IOData: IODataStructure[] = [
        { "day1": "2023-1-10" },
        { "day1_0h0": "true" },
        { "day1_2h15": "true" },
        { "day1_2h30": "true" },
        { "day2": "2023-1-11" },
        { "day2_14h0": "true" },
        { "day2_14h15": "true" },
        { "day2_14h30": "true" },
        { "day2_14h45": "true" },
        { "day3": "2023-1-12" },
        { "day4": "2023-1-13" },
        { "day5": "2023-1-14" },
    ];

    const WeeklyPlannerData: WeeklyPlannerDataType[] = [
        {
            hasBeenStarted: true,
            date: "2023-1-10",
            day: "mardi",
            detail: [
                {
                    start: "0h0",
                    end: "0h0",
                    duration: 15,
                },
                {
                    start: "2h15",
                    end: "2h30",
                    duration: 30,
                },
            ],
        },
        {
            hasBeenStarted: true,
            date: "2023-1-11",
            day: "mercredi",
            detail: [
                {
                    start: "14h0",
                    end: "14h45",
                    duration: 60,
                },
            ],
        },
        {
            hasBeenStarted: false,
            date: "2023-1-12",
            day: "jeudi",
            detail: [],
        },
        {
            hasBeenStarted: false,
            date: "2023-1-13",
            day: "vendredi",
            detail: [],
        },
        {
            hasBeenStarted: false,
            date: "2023-1-14",
            day: "samedi",
            detail: [],
        },
    ];

    it("transform to weekly planner type", () => {
        expect(transformToWeeklyPlannerDataType(IOData)).toEqual(WeeklyPlannerData);
    });

    it("transform to IO data structure", () => {
        expect(transformToIODataStructure(WeeklyPlannerData)).toEqual(IOData);
    });
});
