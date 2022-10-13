import { getStoryFactory } from "stories/getStory";
import { Button } from "../../ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { Button },
});

export default meta;

export const Default = getStory({ label: "Button label" });
