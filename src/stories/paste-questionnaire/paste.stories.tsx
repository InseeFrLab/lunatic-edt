import { ComponentMeta, ComponentStory } from "@storybook/react";
import { OrchestratorForStories as Orchestrator } from "../orchestrator";
import simpsons from "./source.json";

export default {
    title: "Questionnaire/Paste",
    component: Orchestrator,
    "argTypes": {
        activeGoNextForMissing: {
            table: { disable: false },
            control: "boolean",
            defaultValue: true,
        },
        activeControls: {
            control: "boolean",
            defaultValue: true,
        },
        source: {
            table: { disable: false },
            control: { type: "object" },
            defaultValue: simpsons,
        },
    },
} as ComponentMeta<typeof Orchestrator>;

export const Default: ComponentStory<typeof Orchestrator> = () => <Orchestrator source={simpsons} />;
