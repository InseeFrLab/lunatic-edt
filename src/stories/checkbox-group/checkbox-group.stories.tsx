import { CheckboxGroup } from "../../ui";
import { getStoryFactory } from "../getStory";

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
    handleChange: newValue => console.log(newValue),
    value: value,
    options: options,
});
