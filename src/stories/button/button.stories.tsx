import { Button } from "../../ui";
import { getStoryFactory } from "../getStory";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { Button },
});

export default meta;

export const Default = getStory({ label: "Button label" });
