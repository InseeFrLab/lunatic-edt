import { ActivitySelection } from "./ActivityTypes";
import { RawActiviteOption } from "./RawActiviteOption";

export type ActivitySelecterSpecificProps = {
    categoriesIcons: { [id: string]: string };
    clickableListIconNoResult: string;
    activitesAutoCompleteRef: RawActiviteOption[];
    backClickEvent: React.MouseEvent | undefined;
    nextClickEvent: React.MouseEvent | undefined;
    backClickCallback(): void;
    nextClickCallback(): void;
    setDisplayStepper(value: boolean): void;
    categoriesAndActivitesNomenclature: ActivitySelection[];
    labels: {
        selectInCategory: string;
        addActivity: string;
        alertMessage: string;
        alertIgnore: string;
        alertComplete: string;
        clickableListPlaceholder: string;
        clickableListNotFoundLabel: string;
        clickableListNotFoundComment: string;
        clickableListAddActivityButton: string;
        otherButton: string;
    };
};

export type LocationSelecterSpecificProps = {
    optionsIcons: { [id: string]: string };
    backClickEvent: React.MouseEvent | undefined;
    nextClickEvent: React.MouseEvent | undefined;
    backClickCallback(): void;
    nextClickCallback(): void;
    labels: {
        alertMessage: string;
        alertIgnore: string;
        alertComplete: string;
    };
};
