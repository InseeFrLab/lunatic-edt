import { AutoCompleteActiviteOption, NomenclatureActivityOption } from "./ActivityTypes";
import { CheckboxOneCustomOption } from "./CheckboxOptions";

export type ActivityLabelProps = {
    selectInCategory: string;
    addActivity: string;
    alertMessage: string;
    alertIgnore: string;
    alertComplete: string;
    alertAlticon: string;
    clickableListPlaceholder: string;
    clickableListNotFoundLabel: string;
    clickableListNotFoundComment: string;
    clickableListAddActivityButton: string;
    clickableListIconNoResultAlt: string;
    otherButton: string;
};

export type WeeklyPlannerSpecificProps = {
    surveyDate?: string;
    isSubChildDisplayed: boolean;
    setIsSubChildDisplayed(value: boolean): void;
    labels: {
        title: string;
        workSumLabel: string;
        presentButtonLabel: string;
        futureButtonLabel: string;
    };
};

export type ActivitySelecterSpecificProps = {
    categoriesIcons: { [id: string]: string };
    clickableListIconNoResult: string;
    activitesAutoCompleteRef: AutoCompleteActiviteOption[];
    backClickEvent: React.MouseEvent | undefined;
    nextClickEvent: React.MouseEvent | undefined;
    backClickCallback(): void;
    nextClickCallback(routeToGoal: boolean): void;
    setDisplayStepper(value: boolean): void;
    categoriesAndActivitesNomenclature: NomenclatureActivityOption[];
    labels: ActivityLabelProps;
    errorIcon: string;
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
        alertAlticon: string;
    };
    errorIcon: string;
};

export type CheckboxGroupSpecificProps = {
    optionsIcons: { [id: string]: string };
};

export type CheckboxOneSpecificProps = {
    options: CheckboxOneCustomOption[];
    icon?: string;
    defaultIcon?: boolean;
    labels?: CheckBoxOneSpecificPropsLabels;
    backClickEvent?: React.MouseEvent | undefined;
    nextClickEvent?: React.MouseEvent | undefined;
    backClickCallback?(): void;
    nextClickCallback?(): void;
};

export type CheckBoxOneSpecificPropsLabels = {
    otherButtonLabel?: string;
    subchildLabel?: string;
    inputPlaceholder?: string;
};
