import { getStoryFactory } from "stories/getStory";
import { Info } from "ui";
import infoIcon from "./info.svg";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { Info },
});

export default meta;

export const Default = getStory({
    normalText: "this is normal text, Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    boldText:
        "this is bold text, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    infoIcon: infoIcon,
    infoIconAlt: "alt pour info icon",
});
