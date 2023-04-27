import { Box, TextField } from "@mui/material";
import { NomenclatureActivityOption } from "interface/ActivityTypes";
import { ActivityLabelProps } from "interface/ComponentsSpecificProps";
import React, { memo, useCallback, useState } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";
import { FullScreenComponent } from "../ActivitySelecter/ActivitySelecter";

type FreeInputProps = {
    states: {
        selectedCategories: NomenclatureActivityOption[];
        fullScreenComponent: FullScreenComponent;
        freeInput: string | undefined;
    };
    specifiqueProps: {
        labels: ActivityLabelProps;
        label: string;
        isMobile: boolean;
    };
    functions: {
        nextClickCallback: (routeToGoal: boolean) => void;
        freeInputOnChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
        onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void;
    };
    renderTitle: (
        fullScreenComponent: FullScreenComponent,
        selectedCategories: NomenclatureActivityOption[],
        labels: ActivityLabelProps,
        label: string,
        classes: any,
        hasQuestionMark?: boolean,
    ) => JSX.Element;
    updateNewValue: (
        value: string | undefined,
        onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void,
    ) => void;
};

const FreeInput = memo((props: FreeInputProps) => {
    const { classes, cx } = useStyles();
    let { states, specifiqueProps, functions, renderTitle, updateNewValue } = props;

    const [createActivityValue, setCreateActivityValue] = useState<string | undefined>(states.freeInput);

    const freeInputOnChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setCreateActivityValue(e.target.value);
        },
        [],
    );

    return (
        <Box className={cx(classes.root, specifiqueProps.isMobile ? classes.freeInputMobileBox : "")}>
            <Box className={classes.labelBox}>
                {renderTitle(
                    states.fullScreenComponent,
                    states.selectedCategories,
                    specifiqueProps.labels,
                    specifiqueProps.labels.addActivity,
                    classes,
                    false,
                )}
            </Box>
            <TextField
                value={createActivityValue}
                className={classes.freeInputTextField}
                onChange={freeInputOnChange}
                onBlur={e => updateNewValue(createActivityValue, functions.onChange)}
                placeholder={specifiqueProps.labels.clickableListPlaceholder}
                label={specifiqueProps.label}
                sx={{
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                    "& label": { display: "none" },
                }}
            ></TextField>
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { FreeInput } })(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    freeInputMobileBox: {
        justifyContent: "center",
        padding: "0rem 2rem",
    },
    freeInputBox: {
        height: "60vh",
        justifyContent: "center",
    },
    freeInputTextField: {
        width: "100%",
        backgroundColor: theme.variables.white,
        borderRadius: "5px",
    },
    labelBox: {
        padding: "1rem",
    },
}));

export default createCustomizableLunaticField(FreeInput, "FreeInput");
