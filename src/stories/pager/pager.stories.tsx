import { getStoryFactory } from "stories/getStory";
import { Pager } from "../../ui";

const { meta, getStory } = getStoryFactory({
    sectionName: "Questionnaire",
    "wrappedComponent": { Pager },
});

export default meta;

export const Default = getStory({
    goPrevious: () => console.log("previous"),
    goNext: () => console.log("next"),
    isLast: false,
    isFirst: false,
    previousButtonText: "Précédent",
    nextButtonText: "Suivant",
});
