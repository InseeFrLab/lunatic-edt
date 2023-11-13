import "@testing-library/jest-dom";
import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { theme } from "./../../../theme";

import { ThemeProvider } from "@mui/material";
import { InfoProps, responsesType, WeeklyPlannerSpecificProps } from "interface";
import { IODataStructure, WeeklyPlannerDataType } from "interface/WeeklyPlannerTypes";
import { generateStringInputFromDate } from "../../../utils";
import { transformToIODataStructure, transformToWeeklyPlannerDataType } from "./utils";
import WeeklyPlanner from "./WeeklyPlanner";

describe("weeklyPlannerComponent", () => {
    const workSumLabel = "total travaillé";
    const presentButtonLabel = "continuer";
    const futureButtonLable = "commencer";
    const editButtonLabel = "Modifier";
    const title = "titre";
    const infoLabels: InfoProps = {
        normalText: "",
        boldText: "",
        infoIconAlt: "",
        infoIcon: "",
        infoIconTooltip: "",
        infoIconTooltipAlt: "",
        border: false,
    };

    const bindingDependencies = [
        "WEEKLYPLANNER",
        "DATES",
        "DATES_STARTED",
        "00H00",
        "00H15",
        "00H30",
        "00H45",
        "01H00",
        "01H15",
        "01H30",
        "01H45",
        "02H00",
        "02H15",
        "02H30",
        "02H45",
        "03H00",
        "03H15",
        "03H30",
        "03H45",
        "04H00",
        "04H15",
        "04H30",
        "04H45",
        "05H00",
        "05H15",
        "05H30",
        "05H45",
        "06H00",
        "06H15",
        "06H30",
        "06H5",
        "07H00",
        "07H15",
        "07H30",
        "07H45",
        "08H00",
        "08H15",
        "08H30",
        "08H45",
        "09H00",
        "09H15",
        "09H30",
        "09H45",
        "10H00",
        "10H15",
        "10H30",
        "10H45",
        "11H00",
        "11H15",
        "11H30",
        "11H45",
        "12H00",
        "12H15",
        "12H30",
        "12H45",
        "13H00",
        "13H15",
        "13H30",
        "13H45",
        "14H00",
        "14H15",
        "14H30",
        "14H45",
        "15H00",
        "15H15",
        "15H30",
        "15H45",
        "16H00",
        "16H15",
        "16H30",
        "16H5",
        "17H00",
        "17H15",
        "17H30",
        "17H45",
        "18H00",
        "18H15",
        "18H30",
        "18H45",
        "19H00",
        "19H15",
        "19H30",
        "19H45",
        "20H00",
        "20H15",
        "20H30",
        "20H45",
        "21H00",
        "21H15",
        "21H30",
        "21H45",
        "22H00",
        "22H15",
        "22H30",
        "22H45",
        "23H00",
        "23H15",
        "23H30",
        "23H45",
        "ISCLOSED",
    ];

    const responses: responsesType[] = [];

    const setResponses = () => {
        bindingDependencies.forEach(dep => {
            responses.push({
                "response": {
                    "name": dep,
                },
            });
        });
    };

    // Set the surveyDate to today
    let surveyDate: Date = new Date();
    surveyDate.setDate(surveyDate.getDate() - 2);
    const surveyDateString: string = generateStringInputFromDate(surveyDate);
    const dateCurrent = new Date();

    const arrayDates = new Array(7);
    const todayStringValue = generateStringInputFromDate(dateCurrent);

    arrayDates[0] = todayStringValue;
    for (let i = 1; i < 7; i++) {
        const date = new Date();
        date.setDate(dateCurrent.getDate() + i);
        arrayDates[i] = generateStringInputFromDate(date);
    }

    const setIsSubChildDisplayed = jest.fn();
    const setDisplayedDayHeader = jest.fn();
    const saveAll = jest.fn();
    const saveHours = jest.fn();

    const value: { [key: string]: string[] | IODataStructure[] } = {
        "WEEKLYPLANNER": [
            { "dateJ1": todayStringValue },
            { "dateJ1_started": "true" },
            { "dateJ1_02h15": "true" },
            { "dateJ1_02h30": "true" },
            { "dateJ1_02h45": "true" },
            { "dateJ1_03h00": "true" },
        ],
        "DATES": arrayDates,
        "DATES_STARTED": ["true", "false", "false", "false", "false", "false", "false"],
        "02H00": ["true", "false", "false", "false", "false", "false", "false"],
        "02H15": ["true", "false", "false", "false", "false", "false", "false"],
        "02H30": ["true", "false", "false", "false", "false", "false", "false"],
        "02H45": ["true", "false", "false", "false", "false", "false", "false"],
    };

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
            editButtonLabel: editButtonLabel,
            infoLabels: infoLabels,
        },
        saveAll: saveAll,
        language: "fr",
        moreIcon: "",
        moreIconAlt: "",
        expandLessIcon: "",
        expandLessIconAlt: "",
        expandMoreIcon: "",
        expandMoreIconAlt: "",
        expandLessWhiteIcon: "",
        expandMoreWhiteIcon: "",
        workIcon: "",
        workIconAlt: "",
        saveHours: saveHours,
    };

    const renderElement = (valueData: { [key: string]: string[] | IODataStructure[] }): RenderResult => {
        return render(
            <ThemeProvider theme={theme}>
                <WeeklyPlanner
                    handleChange={() => console.log("changed")}
                    value={valueData}
                    componentSpecificProps={componentProps}
                    bindingDependencies={bindingDependencies}
                    responses={responses}
                ></WeeklyPlanner>
            </ThemeProvider>,
        );
    };

    beforeEach(() => {
        setResponses();
        renderElement(value);
    });

    it("renders 7 DayPlanner and 1 DayOverview with 24 Hourchecker", () => {
        expect(screen.getAllByLabelText("dayplanner")).toHaveLength(7);
        expect(screen.getAllByLabelText("dayoverview")).toHaveLength(1);
        expect(screen.getAllByLabelText("hourchecker")).toHaveLength(24);
    });

    it("renders DayPlanner items with correct DayRelativeTime", () => {
        expect(screen.getAllByText(workSumLabel)).toHaveLength(3);
        expect(screen.getAllByText(presentButtonLabel)).toHaveLength(1);
        expect(screen.getAllByText(futureButtonLable)).toHaveLength(4);
    });

    it("renders title and items with date current", () => {
        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getAllByText(workSumLabel)).toHaveLength(3);
    });

    it("renders (non)selected hours and update them", async () => {
        expect(screen.queryAllByLabelText("hourselected")).toHaveLength(0);
        expect(screen.getAllByLabelText("hournotselected")).toHaveLength(96);

        userEvent.click(screen.getByText(presentButtonLabel));

        await waitFor(() => expect(setIsSubChildDisplayed).toHaveBeenCalledTimes(1));
        userEvent.click(screen.getAllByLabelText("hournotselected")[0]);

        expect(await screen.findAllByLabelText("hournotselected")).toHaveLength(88);
        expect(await screen.findAllByLabelText("hourselected")).toHaveLength(8);
    });
});

describe("weeklyPlannerFunctions", () => {
    const IOData: IODataStructure[] = [
        { "dateJ1": "2023-01-10" },
        { "dateJ1_started": "true" },
        { "dateJ1_00H00": "true" },
        { "dateJ1_02H15": "true" },
        { "dateJ1_02H30": "true" },
        { "dateJ2": "2023-01-11" },
        { "dateJ2_started": "true" },
        { "dateJ2_14H00": "true" },
        { "dateJ2_14H15": "true" },
        { "dateJ2_14H30": "true" },
        { "dateJ2_14H45": "true" },
        { "dateJ3": "2023-01-12" },
        { "dateJ3_started": "false" },
        { "dateJ4": "2023-01-13" },
        { "dateJ4_started": "true" },
        { "dateJ5": "2023-01-14" },
        { "dateJ5_started": "true" },
        { "dateJ6": "2023-01-15" },
        { "dateJ6_started": "true" },
        { "dateJ7": "2023-01-16" },
        { "dateJ7_started": "true" },
    ];

    const WeeklyPlannerData: WeeklyPlannerDataType[] = [
        {
            hasBeenStarted: true,
            date: "2023-01-10",
            day: "mardi",
            detail: [
                {
                    start: "00H00",
                    end: "00H00",
                    duration: 15,
                },
                {
                    start: "02H15",
                    end: "02H15",
                    duration: 15,
                },
                {
                    start: "02H30",
                    end: "02H30",
                    duration: 15,
                },
            ],
        },
        {
            hasBeenStarted: true,
            date: "2023-01-11",
            day: "mercredi",
            detail: [
                {
                    start: "14H00",
                    end: "14H00",
                    duration: 15,
                },
                {
                    start: "14H15",
                    end: "14H15",
                    duration: 15,
                },
                {
                    start: "14H30",
                    end: "14H30",
                    duration: 15,
                },
                {
                    start: "14H45",
                    end: "14H45",
                    duration: 15,
                },
            ],
        },
        {
            hasBeenStarted: false,
            date: "2023-01-12",
            day: "jeudi",
            detail: [],
        },
        {
            hasBeenStarted: true,
            date: "2023-01-13",
            day: "vendredi",
            detail: [],
        },
        {
            hasBeenStarted: true,
            date: "2023-01-14",
            day: "samedi",
            detail: [],
        },
        {
            hasBeenStarted: true,
            date: "2023-01-15",
            day: "dimanche",
            detail: [],
        },
        {
            hasBeenStarted: true,
            date: "2023-01-16",
            day: "lundi",
            detail: [],
        },
    ];

    it("transform to weekly planner type", () => {
        expect(transformToWeeklyPlannerDataType(IOData, "fr")).toEqual(WeeklyPlannerData);
    });

    it("transform to IO data structure", () => {
        expect(transformToIODataStructure(WeeklyPlannerData)[0]).toEqual(IOData);
    });
});
