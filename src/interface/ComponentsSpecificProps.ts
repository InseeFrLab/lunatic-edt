import { ActivitySelection } from "./ActivityTypes";
import { RawActiviteOption } from "./RawActiviteOption";

export type ActivitySelecterSpecificProps = {
    categoriesIcons: { [id: string]: string };
    clickableListIconNoResult: string;
    activitesAutoCompleteRef: RawActiviteOption[];
    backClickEvent: React.MouseEvent | undefined;
    nextClickEvent: React.MouseEvent | undefined;
    backClickCallback(): void;
    nextClickCallback(routeToGoal: boolean): void;
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
        clickableListIconNoResultAlt: string;
        otherButton: string;
    };
};

export type IconGridCheckBoxOneSpecificProps = {
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

export type CheckboxGroupSpecificProps = {
    optionsIcons: { [id: string]: string };
};
