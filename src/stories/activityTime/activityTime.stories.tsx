import { getStoryFactory } from "stories/getStory";
import { ActivityTime } from "../../ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { ActivityTime },
});

let variables = new Map<string, any>();
variables.set("START_TIME", null);
variables.set("END_TIME", null);
let responses: { response: { [name: string]: string } }[];

responses = [
    {
        "response": {
            "name": "START_TIME",
        },
    },
    {
        "response": {
            "name": "END_TIME",
        },
    },
];

export default meta;

export const Default = getStory({
    onChange: (value: any) => console.log(value),
    handleChange: (value: any) => console.log(value),
    variables: variables,
    responses: responses,
});
