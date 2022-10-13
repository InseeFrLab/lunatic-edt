import { getStoryFactory } from "stories/getStory";
import { HourChecker } from "ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { HourChecker },
});

const options = [
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
    handleChange: (value: string) => console.log(value),
    options: options,
    value: value,
});
