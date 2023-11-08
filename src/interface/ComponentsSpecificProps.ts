import { AutoCompleteActiviteOption, NomenclatureActivityOption } from "./ActivityTypes";
import { CheckboxOneCustomOption } from "./CheckboxOptions";
import { Activity } from "./TimepickerTypes";
import { IODataStructure } from "./WeeklyPlannerTypes";

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
    infoIconTooltip: string;
    infoIconTooltipAlt: string;
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
    saveAll(data: IODataStructure[]): void;
    language: string;
    helpStep?: number;
    moreIcon: string;
    moreIconAlt: string;
    expandLessIcon: string;
    expandLessIconAlt: string;
    expandMoreIcon: string;
    expandMoreIconAlt: string;
    expandLessWhiteIcon: string;
    expandMoreWhiteIcon: string;
    workIcon: string;
    workIconAlt: string;
    modifiable?: boolean;
};

export type ActivitySelecterSpecificProps = {
    categoriesIcons: { [id: string]: { icon: string; altIcon: string } };
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
    addToReferentielCallBack(
        newItem: AutoCompleteActiviteOption,
        categoryId: string | undefined,
        newActivity: string,
    ): void;
    onSelectValue(): void;
    widthGlobal?: boolean;
    separatorSuggester: string;
    helpStep?: number;
    chevronRightIcon: string;
    chevronRightIconAlt: string;
    searchIcon: string;
    searchIconAlt: string;
    extensionIcon: string;
    extensionIconAlt: string;
    addLightBlueIcon: string;
    addWhiteIcon: string;
    addIconAlt: string;
    modifiable?: boolean;
};

export type IconGridCheckBoxOneSpecificProps = {
    optionsIcons: { [id: string]: { icon: string; altIcon: string } };
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
    modifiable?: boolean;
};

export type CheckboxGroupSpecificProps = {
    optionsIcons: { [id: string]: { icon: string; altIcon: string } };
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
    modifiable?: boolean;
};

export type CheckboxOneSpecificProps = {
    options?: CheckboxOneCustomOption[];
    icon?: string;
    altIcon?: string;
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
    extensionIcon: string;
    extensionIconAlt: string;
    modifiable?: boolean;
    activitesAutoCompleteRef?: AutoCompleteActiviteOption[];
    separatorSuggester?: string;
    labelsClickableList?: {
        clickableListPlaceholder: string;
        clickableListNotFoundLabel: string;
        clickableListNotFoundComment: string;
        clickableListNotSearchLabel: string;
        clickableListAddActivityButton: string;
        otherButton: string;
        saveButton: string;
        addActivity: string;
    };
    icons?: {
        clickableListIconNoResult: string;
        clickableListIconNoResultAlt: string;
        iconAddWhite: string;
        iconAddLightBlue: string;
        iconAddAlt: string;
        iconExtension: string;
        iconExtensionAlt: string;
        iconSearch: string;
        iconSearchAlt: string;
    };
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
    arrowDownIcon: string;
    arrowDownIconAlt: string;
    modifiable?: boolean;
    defaultLanguage: string;
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
    modifiable?: boolean;
};
