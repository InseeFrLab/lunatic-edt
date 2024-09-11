import { getStoryFactory } from "../getStory";
import { Input } from "../../ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { Input },
});

export default meta;

export const Default = getStory({
    onChange: value => console.log(value),
    bindingDependencies: ["TEST"],
});
