import { CheckboxOneCustomOption, CheckboxOneSpecificProps } from "interface";
import { getStoryFactory } from "stories/getStory";
import { CheckboxOneEdt } from "ui";

const options: CheckboxOneCustomOption[] = [
    {
        value: "1",
        label: "Item 1",
    },
    {
        value: "2",
        label: "Item 2",
    },
    {
        value: "3",
        label: "Item 3",
    },
];

let componentSpecificProps: CheckboxOneSpecificProps = {
    options: options,
};

const value = "1";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { CheckboxOneEdt },
});

export default meta;

export const Default = getStory({
    handleChange: (newValue: any) => console.log(newValue),
    value: value,
    options: options,
    componentSpecificProps: componentSpecificProps,
});
