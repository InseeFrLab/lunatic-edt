import type { Meta, Story } from "@storybook/react";
import type { ArgType } from "@storybook/addons";
import { symToStr } from "tsafe/symToStr";
import { theme, ThemeProvider } from "../ui/theme";
import { id } from "tsafe/id";
import { GlobalStyles } from "tss-react/compat";

export function getStoryFactory<Props extends Record<string, any>>(params: {
    sectionName: string;
    wrappedComponent: Record<string, (props: Props) => ReturnType<React.FC>>;
    /** https://storybook.js.org/docs/react/essentials/controls */
    argTypes?: Partial<Record<keyof Props, ArgType>>;
    defaultWidth?: number;
}) {
    const { sectionName, wrappedComponent, argTypes = {}, defaultWidth } = params;

    const Component: any = Object.entries(wrappedComponent).map(([, component]) => component)[0];

    const Template: Story<
        Props & {
            width: number;
            targetWindowInnerWidth: number;
        }
    > = ({ width, ...props }) => {
        return (
            <ThemeProvider>
                <GlobalStyles
                    styles={{
                        "html": {
                            "fontSize": "100% !important",
                        },
                        "body": {
                            "padding": `0 !important`,
                            "backgroundColor": `${theme.palette.background.default} !important`,
                        },
                    }}
                />
                <div
                    style={{
                        "width": width || undefined,
                        "border": "1px dashed #e8e8e8",
                        "display": "inline-block",
                    }}
                >
                    <Component {...props} />
                </div>
            </ThemeProvider>
        );
    };

    function getStory(props: Props): typeof Template {
        const out = Template.bind({});

        out.args = {
            "width": defaultWidth ?? 0,
            "targetWindowInnerWidth": 0,
            "chromeFontSize": "Medium (Recommended)",
            ...props,
        };

        return out;
    }

    return {
        "meta": id<Meta>({
            "title": `${sectionName}/${symToStr(wrappedComponent)}`,
            "component": Component,
            "argTypes": {
                "width": {
                    "control": {
                        "type": "range",
                        "min": 0,
                        "max": 1920,
                        "step": 1,
                    },
                },
                "targetWindowInnerWidth": {
                    "control": {
                        "type": "range",
                        "min": 0,
                        "max": 2560,
                        "step": 10,
                    },
                },
                ...argTypes,
            },
        }),
        getStory,
    };
}

export function logCallbacks<T extends string>(propertyNames: readonly T[]): Record<T, () => void> {
    const out: Record<T, () => void> = id<Record<string, never>>({});

    propertyNames.forEach(propertyName => (out[propertyName] = console.log.bind(console, propertyName)));

    return out;
}
