import { getStoryFactory } from "../getStory";
import { Datepicker } from "../../ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { Datepicker },
});

export default meta;

export const Default = getStory({ onChange: value => console.log(value) });
