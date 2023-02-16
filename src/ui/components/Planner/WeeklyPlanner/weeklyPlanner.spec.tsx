import "@testing-library/jest-dom";
import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { theme } from "./../../../theme";

import { ThemeProvider } from "@mui/material";
import { InfoProps, WeeklyPlannerSpecificProps } from "interface";
import { IODataStructure, WeeklyPlannerDataType } from "interface/WeeklyPlannerTypes";
import { generateStringInputFromDate } from "../../../utils";
import { transformToIODataStructure, transformToWeeklyPlannerDataType } from "./utils";
import WeeklyPlanner from "./WeeklyPlanner";

describe("weeklyPlannerComponent", () => {
    const workSumLabel = "total travaillé";
    const presentButtonLabel = "continuer";
    const futureButtonLable = "commencer";
    const title = "titre";
    const infoLabels: InfoProps = {
        normalText: "",
        boldText: "",
        infoIconAlt: "",
        infoIcon: "",
        border: false,
    };

    // Set the surveyDate to today
    let surveyDate: Date = new Date();
    surveyDate.setDate(surveyDate.getDate() - 2);
    const surveyDateString: string = generateStringInputFromDate(surveyDate);

    const todayStringValue = generateStringInputFromDate(new Date());
    const setIsSubChildDisplayed = jest.fn();
    const setDisplayedDayHeader = jest.fn();
    const saveAll = jest.fn();

    const value: IODataStructure[] = [
        { "dateJ1": todayStringValue },
        { "dateJ1_started": "true" },
        { "dateJ1_2h15": "true" },
        { "dateJ1_2h30": "true" },
        { "dateJ1_2h45": "true" },
        { "dateJ1_3h0": "true" },
    ];

    const componentProps: WeeklyPlannerSpecificProps = {
        surveyDate: surveyDateString,
        isSubChildDisplayed: false,
        setIsSubChildDisplayed: setIsSubChildDisplayed,
        setDisplayedDayHeader: setDisplayedDayHeader,
        displayedDayHeader: "",
        labels: {
            title: title,
            workSumLabel: workSumLabel,
            presentButtonLabel: presentButtonLabel,
            futureButtonLabel: futureButtonLable,
            infoLabels: infoLabels,
        },
        saveAll: saveAll,
        language: "fr",
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
        { "dateJ1": "2023-1-10" },
        { "dateJ1_started": "true" },
        { "dateJ1_0h0": "true" },
        { "dateJ1_2h15": "true" },
        { "dateJ1_2h30": "true" },
        { "dateJ2": "2023-1-11" },
        { "dateJ2_started": "true" },
        { "dateJ2_14h0": "true" },
        { "dateJ2_14h15": "true" },
        { "dateJ2_14h30": "true" },
        { "dateJ2_14h45": "true" },
        { "dateJ3": "2023-1-12" },
        { "dateJ3_started": "false" },
        { "dateJ4": "2023-1-13" },
        { "dateJ4_started": "true" },
        { "dateJ5": "2023-1-14" },
        { "dateJ5_started": "true" },
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
            hasBeenStarted: true,
            date: "2023-1-13",
            day: "vendredi",
            detail: [],
        },
        {
            hasBeenStarted: true,
            date: "2023-1-14",
            day: "samedi",
            detail: [],
        },
    ];

    it("transform to weekly planner type", () => {
        expect(transformToWeeklyPlannerDataType(IOData, "fr")).toEqual(WeeklyPlannerData);
    });

    it("transform to IO data structure", () => {
        expect(transformToIODataStructure(WeeklyPlannerData)).toEqual(IOData);
    });
});
