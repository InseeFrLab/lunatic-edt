import { ProgressBar } from "../../ui";
import { getStoryFactory } from "../getStory";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { ProgressBar },
});

export default meta;

export const Default = getStory({ value: 20 });
