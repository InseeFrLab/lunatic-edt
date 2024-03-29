import { AutoCompleteActiviteOption } from "interface/ActivityTypes";
import { getStoryFactory } from "stories/getStory";
import { ClickableList } from "ui";
import activites from "./activites.json";
import iconNoResult from "./puzzle.svg";

const options: AutoCompleteActiviteOption[] = activites;

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { ClickableList },
});

export default meta;

export const Default = getStory({
    options: options,
    handleChange: () => console.log("handleChange"),
    createActivity: () => console.log("createActivity"),
    placeholder: "Saisissez une activité",
    notFoundLabel: "Aucun résultat trouvé",
    notFoundComment:
        "Vous pourrez l'ajouter en cliquant sur le bouton ci-dessous, ou le bouton + ci-dessus",
    addActivityButtonLabel: "Ajouter l'activité",
    iconNoResult: iconNoResult,
    iconNoResultAlt: "alt pour icon no result",
});
