import React from "react";

function createCustomizableLunaticField(LunaticField: any) {
    const Memoized = React.memo(LunaticField);
    const { name } = LunaticField;

    return function OverlayField(props: any) {
        const { custom, ...rest } = props;
        if (typeof custom === "object" && name in custom) {
            const CustomComponent: any = custom[name];
            return <CustomComponent {...rest} />;
        }

        return <Memoized {...props} />;
    };
}

export default createCustomizableLunaticField;