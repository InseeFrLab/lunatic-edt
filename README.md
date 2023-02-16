# Technical documentation of Lunatic-EDT

## General information

EDT is a ReactTS PWA front-end application.
It was made to allow INSEE (French public services) to do surveys based on their own data management and treatment system. The opensource data engine made by INSEE is called Lunatic.
The most reusable front-end components for any surveys such as input fields have been developped inside this project repository called Lunatic-Edt and is used as a library by EDT.

> Linked repositories :
>
> -   EDT Application : https://github.com/InseeFrLab/edt
> -   Lunatic : https://github.com/InseeFr/Lunatic
> -   Lunatic-EDT : https://github.com/InseeFrLab/lunatic-edt

### Lunatic EDT usage

This lib was designed to be integrated in the future inside another MUI reusable components lib of INSEE. This lib being in development at the time of EDT development, Lunatic-EDT was created to accelerate the process.

It contains all the survey "fields" components and an associated storybook documentation (please refer to [Lunatic-EDT local install](#lunatic-edt-local-install) section to launch the storybook).

### Install local development environment

#### Lunatic EDT local install

Clone the Lunatic-EDT project from github repository :

```
> git clone https://github.com/InseeFrLab/lunatic-edt
```

Install dependencies with Yarn :

```
> cd lunatic-edt
> yarn install
```

Init husky :

```
> npx husky install
```

:::info
:information_source: Husky (https://typicode.github.io/husky/#/) is used in this project to ensure the quality of the repository. It is used to add git hooks and run it on each commit. In this project, it obligate the developer to commit meeting the conventional commit standards (https://github.com/conventional-changelog/commitlint/#what-is-commitlint). Husky also runs the `yarn lint` and `yarn format` commands to meet INSEE's code lint standards.
:::

Run the storybook on local :

```
> yarn storybook
```

You should now be able to access the app on :

[http://localhost:6006/](https://)

### Style and CSS

Lunatic-EDT is using TSS-React (https://www.tss-react.dev/) that allows to include the style directly inside de `tsx` component file. It has been developed using css flex properties as much as possible. The style is made to be responsive and is working on mobile device, tablet or desktop.

Material UI (https://mui.com/) for React is used as much as possible.
You will find the EDT material UI custom theme inside the Lunatic-EDT project under the `src/ui/theme` folder.

<details>
<summary>Theme</summary>
<br>
    
  ```
variables: {
        neutral: "#DCE7F9",
        iconRounding: "#DEE2EB",
        white: "#FFFFFF",
        modal: "#F3F2F8",
        alertActivity: "#B6462C",
    },
    palette: {
        primary: {
            main: "#4973D2",
            light: "#2C70DE",
        },
        secondary: {
            main: "#1F4076",
        },
        background: {
            default: "#F2F1F7",
            paper: "#E4E5EF",
        },
        error: {
            main: "#B6462C",
            light: "#FCE7D8",
        },
        success: {
            main: "#C1EDC3",
        },
        info: {
            main: "#1F4076",
        },
        warning: {
            main: "#F4E289",
        },
        text: {
            primary: "#1F4076",
            secondary: "#2E384D",
        },
        action: {
            hover: "#5C6F99",
        },
    },
```  
</details>

## Qualimetry and Tests

### Sonar

Sonar quality have been treated using INSEE default configuration. You can refer to the Github pipeline to see which configuration is used.

### Unit Tests

JEST Unit tests have been done to cover the complexe Lunatic-EDT components such as `ActivitySelecter` or `HourChecker`.
Run `yarn test` command inside Lunatic-EDT to execute the tests.
