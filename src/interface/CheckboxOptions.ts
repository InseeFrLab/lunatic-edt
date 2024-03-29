export type CheckboxOption = {
    id: string;
    label: string;
    response: CheckboxOptionResponse;
};

export type CheckboxOptionResponse = {
    name: string;
};

export type CheckboxOneCustomOption = {
    label: string;
    value: string;
    iconName?: string;
};
