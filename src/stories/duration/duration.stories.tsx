import { getStoryFactory } from "stories/getStory";
import { Duration } from "../../ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { Duration },
});

let variables = new Map<string, any>();
variables.set("START_TIME", null);
variables.set("END_TIME", null);

export default meta;

export const Default = getStory({
    onChange: (value: any) => console.log(value),
    handleChange: (value: any) => console.log(value),
    variables: new Map<string, any>(),
    responses: [],
    bindingDependencies: [],
});
