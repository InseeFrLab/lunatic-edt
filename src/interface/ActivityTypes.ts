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
    categoriesIcons: string[];
    clickableListIconNoResult: string;
    activitesAutoCompleteRef: RawActiviteOption[];
    backClickEvent: React.MouseEvent;
    nextClickEvent: React.MouseEvent;
    backClickCallback(): void;
    nextClickCallback(): void;
    setDisplayStepper(value: boolean): void;
    categoriesAndActivitesNomenclature: ActivitySelection[];
};
