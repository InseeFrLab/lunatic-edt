import { AutoCompleteActiviteOption } from "../../interface";
import { ClickableList } from "../../ui";
import { getStoryFactory } from "../getStory";
import activites from "./activites.json";
import iconNoResult from "./puzzle.svg";

const options: AutoCompleteActiviteOption[] = activites;

const { meta, getStory } = getStoryFactory({
    sectionName: "Composants",
    "wrappedComponent": { ClickableList },
});

export default meta;

export const Default = getStory({
    //options: options,
    handleChange: () => console.log("handleChange"),
    createActivity: () => console.log("createActivity"),
    placeholder: "Saisissez une activité",
    notFoundLabel: "Aucun résultat trouvé",
    notFoundComment:
        "Vous pourrez l'ajouter en cliquant sur le bouton ci-dessous, ou le bouton + ci-dessus",
    addActivityButtonLabel: "Ajouter l'activité",
    iconNoResult: iconNoResult,
    optionsFiltered: [],
    index: undefined,
    selectedValue: {
        id: "",
        label: "",
        synonymes: "",
    },
    historyInputSuggesterValue: "",
    handleChangeHistorySuggester: function (historyInputSuggester?: string): void {
        throw new Error("Function not implemented.");
    },
    notSearchLabel: "",
    separatorSuggester: "",
    iconAddWhite: undefined,
    iconAddLightBlue: undefined,
    iconExtension: undefined,
    iconSearch: undefined,
});
