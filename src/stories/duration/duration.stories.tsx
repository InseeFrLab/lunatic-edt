import { getStoryFactory } from "stories/getStory";
import { Duration } from "../../ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { Duration },
});

export default meta;

export const Default = getStory({ onChange: (value: any) => console.log(value) });
