<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/80216211-00ef5280-863e-11ea-81de-59f3a3d4b8e4.png">  
</p>
<p align="center">
    <i></i>
    <br>
    <br>
    <a href="https://github.com/InseeFrLab/lunatic-edt/actions">
      <img src="https://github.com/InseeFrLab/lunatic-edt/workflows/ci/badge.svg?branch=main">
    </a>
    <a href="https://bundlephobia.com/package/lunatic-edt">
      <img src="https://img.shields.io/bundlephobia/minzip/lunatic-edt">
    </a>
    <a href="https://www.npmjs.com/package/lunatic-edt">
      <img src="https://img.shields.io/npm/dw/lunatic-edt">
    </a>
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/badge/license-MIT-blue">
    </a>
</p>
<p align="center">
  <a href="https://inseefrlab.github.io/lunatic-edt/" target="_blank"><img src="https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg"></a>
</p>

[![Lunatic EDT CI](https://github.com/InseeFrLab/lunatic-edt/actions/workflows/ci.yml/badge.svg)](https://github.com/InseeFrLab/lunatic-edt/actions/workflows/ci.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=InseeFrLab_lunatic-edt&metric=coverage)](https://sonarcloud.io/dashboard?id=InseeFrLab_lunatic-edt)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=InseeFrLab_lunatic-edt&metric=alert_status)](https://sonarcloud.io/dashboard?id=InseeFrLab_lunatic-edt)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=InseeFrLab_lunatic-edt&metric=alert_status)](https://sonarcloud.io/dashboard?id=InseeFrLab_lunatic-edt)

# Install / Import

```bash
$ yarn add react @inseefr/lunatic lunatic-edt
```

```typescript
import React from "react";
import * as lunatic from "@inseefr/lunatic";
import * as lunaticEDT from "lunatic-edt";

const { Button } = lunatic;
const { ThemeProvider, ...edtComponents } = lunaticEDT;

export type Props = {
    goPrevious: () => void;
    goNext: () => void;
    isLast: boolean;
    isFirst: boolean;
};
const Pager = (props: Props) => {
    const { goPrevious, goNext, isLast, isFirst } = props;

    return (
        <div className="pagination">
            <Button onClick={goPrevious} disabled={isFirst}>
                Previous
            </Button>
            <Button onClick={goNext} disabled={isLast}>
                Next
            </Button>
        </div>
    );
};

const onLogChange = (e: React.ChangeEvent<HTMLInputElement>) => console.log("onChange", { ...e });

export type OrchestratorProps = {
    source: object;
    data?: object;
};

export const OrchestratorForStories = (props: OrchestratorProps) => {
    const { source, data } = props;

    const { getComponents, goPreviousPage, goNextPage, isFirstPage, isLastPage, getCurrentErrors } =
        lunatic.useLunatic(source, data, {
            onChange: onLogChange,
        });

    const components = getComponents();
    const currentErrors = getCurrentErrors();

    return (
        <ThemeProvider>
            <div className="components">
                {components.map(function (component: any) {
                    const { id, componentType, response, ...other } = component;
                    const Component = lunatic[componentType];
                    return (
                        <div className="lunatic lunatic-component" key={`component-${id}`}>
                            <Component
                                id={id}
                                response={response}
                                {...other}
                                {...component}
                                errors={currentErrors}
                                custom={edtComponents}
                            />
                        </div>
                    );
                })}
            </div>
            <Pager
                goPrevious={goPreviousPage}
                goNext={goNextPage}
                isLast={isLastPage}
                isFirst={isFirstPage}
            />
        </ThemeProvider>
    );
};
```
