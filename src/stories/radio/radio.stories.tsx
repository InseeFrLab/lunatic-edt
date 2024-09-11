import { getStoryFactory } from "../getStory";
import { Radio } from "../../ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { Radio },
});

export default meta;

export const Default = getStory({});
