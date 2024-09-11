import React, { FC, memo, MemoExoticComponent } from 'react';

const notLunaticComponents: Map<string, MemoExoticComponent<FC<any>>> = new Map();

function createCustomizableLunaticField<P extends object>(LunaticField: FC<P>, name: string) {
    const Memoized = memo(LunaticField);
    notLunaticComponents.set(name, Memoized);  

    return function OverlayField(props: P & { custom?: { [key: string]: FC<P> } }) {
        const { custom, ...rest } = props;

        // If custom component is provided for this name, use it
        if (custom && custom[name]) {
            const CustomComponent = custom[name];
            return <CustomComponent {...(rest as P)} />;
        }

        // Otherwise, use the memoized default component
        return <Memoized {...(rest as P)} />;
    };
}

export default createCustomizableLunaticField;
