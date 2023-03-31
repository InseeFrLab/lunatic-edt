import { AutoCompleteActiviteOption, NomenclatureActivityOption } from "./ActivityTypes";
import { CheckboxOneCustomOption } from "./CheckboxOptions";
import { Activity } from "./TimepickerTypes";

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
    clickableListNotSearchLabel: string;
    otherButton: string;
    saveButton: string;
};

export type InfoProps = {
    normalText?: string;
    boldText?: string;
    isAlertInfo?: boolean;
    infoIcon: string;
    infoIconAlt: string;
    infoIconTop?: boolean;
    border: boolean;
};

export type WeeklyPlannerSpecificProps = {
    surveyDate?: string;
    isSubChildDisplayed: boolean;
    setIsSubChildDisplayed(value: boolean): void;
    setDisplayedDayHeader(value: string): void;
    displayedDayHeader: string;
    labels: {
        title: string;
        workSumLabel: string;
        presentButtonLabel: string;
        futureButtonLabel: string;
        editButtonLabel?: string;
        infoLabels: InfoProps;
    };
    saveAll(): void;
    language: string;
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
    setDisplayHeader?(value: boolean): void;
    categoriesAndActivitesNomenclature: NomenclatureActivityOption[];
    labels: ActivityLabelProps;
    errorIcon: string;
    addToReferentielCallBack(newItem: AutoCompleteActiviteOption): void;
    onSelectValue(): void;
    widthGlobal?: boolean;
    separatorSuggester: string;
    helpStep?: number;
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
    onSelectValue?(): void;
};

export type CheckboxGroupSpecificProps = {
    optionsIcons: { [id: string]: string };
    backClickEvent?: React.MouseEvent;
    nextClickEvent?: React.MouseEvent;
    backClickCallback?(): void;
    nextClickCallback?(): void;
    labels?: {
        alertMessage?: string;
        alertIgnore?: string;
        alertComplete?: string;
        alertAlticon?: string;
    };
    errorIcon?: string;
    helpStep?: number;
};

export type CheckboxOneSpecificProps = {
    options?: CheckboxOneCustomOption[];
    icon?: string;
    defaultIcon?: boolean;
    labelsSpecifics?: CheckBoxOneSpecificPropsLabels;
    labels?: {
        alertMessage: string;
        alertIgnore: string;
        alertComplete: string;
        alertAlticon: string;
    };
    backClickEvent?: React.MouseEvent;
    nextClickEvent?: React.MouseEvent;
    backClickCallback?(): void;
    nextClickCallback?(): void;
    errorIcon?: string;
    addToReferentielCallBack?(newItem: CheckboxOneCustomOption): void;
    onSelectValue?(): void;
};

export type CheckBoxOneSpecificPropsLabels = {
    otherButtonLabel?: string;
    subchildLabel?: string;
    inputPlaceholder?: string;
};

export type TimepickerSpecificProps = {
    activitiesAct: Activity[];
    defaultValue?: boolean;
    gapToFillIndex?: number;
    constants: any;
    helpStep?: number;
    helpImage?: string;
};

export type CheckboxBooleanEdtSpecificProps = {
    backClickEvent?: React.MouseEvent;
    nextClickEvent?: React.MouseEvent;
    backClickCallback?(): void;
    nextClickCallback?(): void;
    labels?: {
        alertMessage?: string;
        alertIgnore?: string;
        alertComplete?: string;
        alertAlticon?: string;
    };
    onSelectValue?(): void;
    errorIcon?: string;
};
