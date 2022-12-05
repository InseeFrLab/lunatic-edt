import { getStoryFactory } from "stories/getStory";
import { Timepicker } from "../../ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { Timepicker },
});

export default meta;

export const Default = getStory({ onChange: (value: any) => console.log(value) });
