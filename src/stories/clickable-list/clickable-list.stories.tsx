/* eslint @typescript-eslint/no-var-requires: "off" */
import { RawActiviteOption } from "interface/RawActiviteOption";
import { getStoryFactory } from "stories/getStory";
import { ClickableList } from "ui";
import activites from "./activites.json";

const options: RawActiviteOption[] = activites;
const iconNoResult = require("./puzzle.svg") as string;

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
