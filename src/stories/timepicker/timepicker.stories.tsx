import { getStoryFactory } from "stories/getStory";
import { Timepicker } from "../../ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { Timepicker },
});

export default meta;

export const Default = getStory({
    onChange: (value: any) => console.log(value),
    handleChange: (value: any) => console.log(value),
    variables: new Map<string, any>(),
    responses: [],
    bindingDependencies: [],
});
