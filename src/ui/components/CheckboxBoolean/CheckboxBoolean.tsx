import { memo } from "react";

export type CheckboxBooleanProps = {
    onClick(valueOption: any): void;
    id?: string;
    checked?: boolean;
    disabled?: boolean;
    label?: string;
};

const CheckboxBoolean = memo((props: CheckboxBooleanProps) => {
    console.log("CheckboxBoolean");
    console.log(props);
    const { label } = props;
    return (
        <div>
            {label}
            <div></div>
            <div></div>
        </div>
    );
});

export default CheckboxBoolean;
