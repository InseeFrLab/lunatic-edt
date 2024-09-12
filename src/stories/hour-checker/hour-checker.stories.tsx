import { getStoryFactory } from "../getStory";
import { HourChecker } from "../../ui";
import { responsesHourChecker } from "../../interface";
import { IODataStructure } from "../../interface/WeeklyPlannerTypes";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { HourChecker },
});

const responses = [
    {
        id: "1",
        label: "16h15",
        response: { name: "16h15" },
    },
    {
        id: "2",
        label: "16h30",
        response: { name: "16h30" },
    },
    {
        id: "3",
        label: "16h45",
        response: { name: "16h45" },
    },
    {
        id: "4",
        label: "17h00",
        response: { name: "17h00" },
    },
];

const value = {
    "16h15": true,
    "16h30": true,
    "16h45": false,
    "17h00": false,
};

export default meta;

export const Default = getStory({
    handleChange: (response: { [name: string]: string }, value: boolean) => console.log(response, value),
    responses: responses,
    value: value,
    expandLessIcon: undefined,
    expandMoreIcon: undefined,
    expandLessWhiteIcon: undefined,
    expandMoreWhiteIcon: undefined,
    workIcon: undefined,
    handleChangeData: function (response: { [name: string]: string }, value: IODataStructure[]): void {
        console.log(response, value);
    },
    store: [],
    saveHours: function (idSurvey: string, response: responsesHourChecker): void {
        console.log(idSurvey, response);
    },
    currentDate: "",
    idSurvey: "",
});
