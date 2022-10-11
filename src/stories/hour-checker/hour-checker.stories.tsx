import { getStoryFactory } from "stories/getStory";
import { HourChecker } from "ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { HourChecker },
});

export default meta;

export const Default = getStory({
    handleChange: (value: string) => console.log(value),
});
