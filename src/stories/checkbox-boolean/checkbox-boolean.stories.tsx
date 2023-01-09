import { getStoryFactory } from "stories/getStory";
import { CheckboxBoolean } from "ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { CheckboxBoolean },
});

export default meta;

export const Default = getStory({
    onClick: value => console.log(value),
});
