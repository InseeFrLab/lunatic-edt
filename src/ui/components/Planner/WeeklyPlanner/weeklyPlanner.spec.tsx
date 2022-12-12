import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { theme } from "./../../../theme";
import "@testing-library/jest-dom";

import { ThemeProvider } from "@mui/material";
import WeeklyPlanner from "./WeeklyPlanner";
import { generateStringInputFromDate } from "../../../utils";
import { useCallback } from "react";

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
    const hasBeenStarted = "false";
    const value = `{\\"data\\":[{\\"hasBeenStarted\\":${hasBeenStarted},\\"date\\":\\"${todayStringValue}\\",\\"day\\":\\"vendredi\\",\\"detail\\":[{\\"start\\":\\"2h15\\",\\"end\\":\\"3h0\\",\\"duration\\":60}]}]}`;

    const handleChangeCallback = useCallback(() => {
        console.log("changed");
    }, []);

    const renderElement = (value: string, surveyDateString: string): RenderResult => {
        return render(
            <ThemeProvider theme={theme}>
                <WeeklyPlanner
                    handleChange={handleChangeCallback}
                    value={value}
                    surveyDate={surveyDateString}
                    isSubChildDisplayed={false}
                    setIsSubChildDisplayed={setIsSubChildDisplayed}
                    title={title}
                    workSumLabel={workSumLabel}
                    presentButtonLabel={presentButtonLabel}
                    futureButtonLabel={futureButtonLable}
                ></WeeklyPlanner>
            </ThemeProvider>,
        );
    };

    beforeEach(() => {
        renderElement(value, surveyDateString);
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

        const hasBeenStartedUpdated = "true";
        const valueUpdated = `{\\"data\\":[{\\"hasBeenStarted\\":${hasBeenStartedUpdated},\\"date\\":\\"${todayStringValue}\\",\\"day\\":\\"vendredi\\",\\"detail\\":[{\\"start\\":\\"2h15\\",\\"end\\":\\"3h0\\",\\"duration\\":60}]}]}`;
        renderElement(valueUpdated, surveyDateString);

        expect(screen.getByText("14%")).toBeInTheDocument();
    });
});
