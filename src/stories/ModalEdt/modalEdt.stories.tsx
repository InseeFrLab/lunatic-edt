import { ModalEdt } from "../../ui";
import { getStoryFactory } from "../getStory";

const labels = {
    title: "TITLE LABEL",
    content: "CONTENT LABEL",
    endContent: "END CONTENT LABEL",
    buttonLabel: "BUTTON LABEL",
};

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { ModalEdt },
});

export default meta;

export const Default = getStory({
    isModalDisplayed: true,
    onCompleteCallBack: () => console.log("MODAL CALLBACK"),
    labels: labels,
    icon: null,
    iconAlt: null,
});
