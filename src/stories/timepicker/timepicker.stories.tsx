import { Timepicker } from "../../ui";
import { getStoryFactory } from "../getStory";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { Timepicker },
});

export default meta;

export const Default = getStory({
    handleChange: (value: any) => console.log(value),
    response: {},
});
