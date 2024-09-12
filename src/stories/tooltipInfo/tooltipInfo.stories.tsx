import { TooltipInfo } from "../../ui";
import { getStoryFactory } from "../getStory";
import infoIcon from "./info.svg";

const infoLabels = {
    normalText: "this is normal text, Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    boldText:
        "this is bold text, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    infoIcon: <img src={infoIcon} aria-label={"alt pour info icon"} />,
    infoIconAlt: "alt pour info icon",
    border: false,
};

const titleLabel = "label title";

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { TooltipInfo },
});

export default meta;

export const Default = getStory({
    infoLabels: infoLabels,
});
