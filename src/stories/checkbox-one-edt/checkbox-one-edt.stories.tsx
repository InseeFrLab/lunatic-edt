import { getStoryFactory } from "stories/getStory";
import { CheckboxOneEdt } from "ui";

const options = [
    {
        value: "1",
        label: "Item 1",
    },
    {
        value: "2",
        label: "Item 2",
    },
    {
        value: "1",
        label: "Item 3",
    },
];

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { CheckboxOneEdt },
});

export default meta;

export const Default = getStory({
    handleChange: (value: any) => console.log(value),
    value: null,
    options: options,
});
