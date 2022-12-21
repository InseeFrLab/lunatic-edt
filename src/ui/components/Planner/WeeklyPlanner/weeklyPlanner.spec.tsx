import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { theme } from "./../../../theme";
import "@testing-library/jest-dom";

import { ThemeProvider } from "@mui/material";
import WeeklyPlanner from "./WeeklyPlanner";
import { generateStringInputFromDate } from "../../../utils";
import { WeeklyPlannerSpecificProps } from "interface";

describe("weeklyPlanner", () => {
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
    const data = {
        data: [
            {
                hasBeenStarted: false,
                date: todayStringValue,
                day: "vendredi",
                detail: [
                    {
                        start: "2h15",
                        end: "3h0",
                        duration: 60,
                    },
                ],
            },
        ],
    };

    const value = JSON.stringify(data);

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

    const renderElement = (value: string): RenderResult => {
        return render(
            <ThemeProvider theme={theme}>
                <WeeklyPlanner
                    handleChange={() => console.log("changed")}
                    value={value}
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
        expect(screen.getByText("0%")).toBeInTheDocument();

        const dataUpdated = {
            data: [
                {
                    hasBeenStarted: true,
                    date: todayStringValue,
                    day: "vendredi",
                    detail: [
                        {
                            start: "2h15",
                            end: "3h0",
                            duration: 60,
                        },
                    ],
                },
            ],
        };

        const value2 = JSON.stringify(dataUpdated);
        renderElement(value2);
        expect(screen.getByText("14%")).toBeInTheDocument();
    });
});
