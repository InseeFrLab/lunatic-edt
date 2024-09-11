import { getStoryFactory } from "../getStory";
import { CheckboxGroupEdt } from "../../ui";

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
    "wrappedComponent": { CheckboxGroupEdt },
});

export default meta;

export const Default = getStory({
    handleChange: (newValue: any) => console.log(newValue),
    value: value,
    responses: options,
    bindingDependencies: [],
    tipsLabel: "",
    variables: undefined,
});
