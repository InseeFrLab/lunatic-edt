import { getStoryFactory } from "stories/getStory";
import { ProgressBar } from "../../ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { ProgressBar },
});

export default meta;

export const Default = getStory({});
