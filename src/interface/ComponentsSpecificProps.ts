import { ReactElement } from "react";
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
    clickableListPlaceholder: string;
    clickableListNotFoundLabel: string;
    clickableListNotFoundComment: string;
    clickableListAddActivityButton: string;
    clickableListNotSearchLabel: string;
    otherButton: string;
    saveButton: string;
    validateButton: string;
};

export type InfoProps = {
    normalText?: string;
    boldText?: string;
    isAlertInfo?: boolean;
    infoIcon?: ReactElement<any>;
    infoIconTooltip?: ReactElement<any>;
    infoIconTop?: boolean;
    border: boolean;
    boldFirst?: boolean;
};

export type WeeklyPlannerSpecificProps = {
    surveyDate?: string;
    isSubChildDisplayed: boolean;
    setIsSubChildDisplayed(value: boolean): void;
    isPlaceWorkDisplayed: boolean;
    setIsPlaceWorkDisplayed(value: boolean): void;
    setDisplayedDayHeader(value: string): void;
    displayedDayHeader: string;
    labels: {
        title: string;
        workSumLabel: string;
        presentButtonLabel: string;
        futureButtonLabel: string;
        editButtonLabel?: string;
        infoLabels: InfoProps;
        dates: string;
        datesStarted: string;
    };
    saveAll(idSurvey: string, data: [IODataStructure[], string[], string[], any[]]): void;
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
    saveHours(idSurvey: string, response: responsesHourChecker): void;
    optionsIcons: { [id: string]: { icon: string; altIcon: string } };
    idSurvey: string;
};

export type responsesHourChecker = {
    names: string[];
    values: {
        [key: string]: boolean;
    };
    date: string;
};

export type ActivitySelecterSpecificProps = {
    categoriesIcons: {
        [id: string]: { icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>; altIcon: string };
    };
    clickableListIconNoResult: ReactElement<any>;
    activitesAutoCompleteRef: AutoCompleteActiviteOption[];
    backClickEvent: React.MouseEvent | undefined;
    nextClickEvent: React.MouseEvent | undefined;
    backClickCallback(): void;
    nextClickCallback(routeToGoal: boolean): void;
    setDisplayStepper(value: boolean): void;
    setDisplayHeader?(value: boolean): void;
    categoriesAndActivitesNomenclature: NomenclatureActivityOption[];
    labels: ActivityLabelProps;
    errorIcon: ReactElement<any>;
    addToReferentielCallBack(
        newItem: AutoCompleteActiviteOption,
        categoryId: string | undefined,
        newActivity: string,
    ): void;
    onSelectValue(): void;
    widthGlobal?: boolean;
    separatorSuggester: string;
    helpStep?: number;
    chevronRightIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    chevronRightIconAlt: string;
    searchIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    searchIconAlt: string;
    extensionIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    extensionIconAlt: string;
    addLightBlueIcon: ReactElement<any>;
    addWhiteIcon: ReactElement<any>;
    modifiable?: boolean;
};

export type IconGridCheckBoxOneSpecificProps = {
    optionsIcons: {
        [id: string]: { icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>; altIcon: string };
    };
    backClickEvent: React.MouseEvent | undefined;
    nextClickEvent: React.MouseEvent | undefined;
    backClickCallback(): void;
    nextClickCallback(): void;
    labels: {
        alertMessage: string;
        alertIgnore: string;
        alertComplete: string;
    };
    errorIcon: ReactElement<any>;
    onSelectValue?(): void;
    modifiable?: boolean;
};

export type CheckboxGroupSpecificProps = {
    optionsIcons: {
        [id: string]: { icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>; altIcon: string };
    };
    backClickEvent?: React.MouseEvent;
    nextClickEvent?: React.MouseEvent;
    backClickCallback?(): void;
    nextClickCallback?(): void;
    labels?: {
        alertMessage?: string;
        alertIgnore?: string;
        alertComplete?: string;
    };
    errorIcon?: ReactElement<any>;
    helpStep?: number;
    modifiable?: boolean;
};

export type CheckboxOneSpecificProps = {
    options?: CheckboxOneCustomOption[];
    //icon?: string;
    //altIcon?: string;
    icon: ReactElement<any>;
    defaultIcon?: boolean;
    labelsSpecifics?: CheckBoxOneSpecificPropsLabels;
    labels?: {
        alertMessage: string;
        alertIgnore: string;
        alertComplete: string;
    };
    backClickEvent?: React.MouseEvent;
    nextClickEvent?: React.MouseEvent;
    backClickCallback?(): void;
    nextClickCallback?(): void;
    errorIcon?: ReactElement<any>;
    addToReferentielCallBack?(newItem: CheckboxOneCustomOption): void;
    onSelectValue?(): void;
    extensionIcon: ReactElement<any>;
    //extensionIcon: string;
    //extensionIconAlt: string;
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
        clickableListIconNoResult: ReactElement<any>;
        iconAddWhite: ReactElement<any>;
        iconAddLightBlue: ReactElement<any>;
        iconExtension: ReactElement<any>;
        iconSearch: ReactElement<any>;
        /*clickableListIconNoResult: string;
        clickableListIconNoResultAlt: string;
        iconAddWhite: string;
        iconAddLightBlue: string;
        iconAddAlt: string;
        iconExtension: string;
        iconExtensionAlt: string;
        iconSearch: string;
        iconSearchAlt: string;*/
    };
};

export type CheckBoxOneSpecificPropsLabels = {
    otherButtonLabel?: string;
    subchildLabel?: string;
    inputPlaceholder?: string;
    validateButton?: string;
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
    labels: {
        cancelLabel: string;
        validateLabel: string;
        ariaLabelTimepicker: string;
    };
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
    };
    onSelectValue?(): void;
    errorIcon?: ReactElement<any>;
    modifiable?: boolean;
};
