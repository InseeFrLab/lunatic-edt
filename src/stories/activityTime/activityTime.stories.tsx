import { getStoryFactory } from "stories/getStory";
import { ActivityTime } from "../../ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { ActivityTime },
});

export default meta;

export const Default = getStory({ onChange: (value: any) => console.log(value) });
