import React from "react";
import { RawActiviteOption } from "./RawActiviteOption";

export type ActivitySelection = {
    label: string;
    id: string;
    rang: number;
    subs?: ActivitySelection[];
};

export type SelectedActivity = {
    id?: string;
    label?: string;
    isFullyCompleted?: boolean;
};

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
