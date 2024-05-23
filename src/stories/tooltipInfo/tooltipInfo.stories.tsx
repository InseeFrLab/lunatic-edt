import { getStoryFactory } from "stories/getStory";
import { TooltipInfo } from "ui";
import infoIcon from "./info.svg";

const infoLabels = {
    normalText: "this is normal text, Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    boldText:
        "this is bold text, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    infoIcon: <img src={infoIcon} aria-label={"alt pour info icon"} />,
    infoIconAlt: "alt pour info icon",
};

const titleLabel = "label title";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { TooltipInfo },
});

export default meta;

export const Default = getStory({
    titleLabel: titleLabel,
    infoLabels: infoLabels,
});
