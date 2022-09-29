import { getStoryFactory } from "stories/getStory";
import { CheckboxGroup } from "ui";

const options = [
    {
        id: "1",
        label: "Item 1",
        response: { name: "CHECKBOXGR1" },
    },
    {
        id: "2",
        label: "Item 2",
        response: { name: "CHECKBOXGR2" },
    },
    {
        id: "1",
        label: "Item 3",
        response: { name: "CHECKBOXGR3" },
    },
];

const value = {
    "CHECKBOXGR1": true,
    "CHECKBOXGR2": false,
    "CHECKBOXGR3": true,
};

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { CheckboxGroup },
});

export default meta;

export const Default = getStory({
    handleChange: value => console.log(value),
    value: value,
    options: options,
});
