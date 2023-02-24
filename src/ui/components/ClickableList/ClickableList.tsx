import { Add, Extension, Search } from "@mui/icons-material";
import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Box,
    Button,
    FilterOptionsState,
    Icon,
    TextField,
} from "@mui/material";
import elasticlunr, { Index } from "elasticlunrjs";
import { AutoCompleteActiviteOption } from "interface/ActivityTypes";
import { stemmer } from "./stemmer";
import stopWords from "./stop_words_french.json";

import React, { memo, useCallback } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";

export type ClickableListProps = {
    placeholder: string;
    options: AutoCompleteActiviteOption[];
    selectedId?: string;
    handleChange(id: string | undefined): void;
    createActivity(value: string | undefined): void;
    notFoundLabel: string;
    notFoundComment: string;
    addActivityButtonLabel: string;
    iconNoResult: string;
    iconNoResultAlt: string;
    className?: string;
    autoFocus?: boolean;
};

const ClickableList = memo((props: ClickableListProps) => {
    let {
        placeholder,
        options,
        selectedId,
        handleChange,
        createActivity,
        notFoundLabel,
        notFoundComment,
        addActivityButtonLabel,
        iconNoResult,
        iconNoResultAlt,
        className,
        autoFocus = false,
    } = props;

    const [displayAddIcon, setDisplayAddIcon] = React.useState<boolean>(false);
    const [currentInputValue, setCurrentInputValue] = React.useState<string | undefined>();

    const skipApostrophes = (labelWithApostrophe: string) => {
        const labelWitoutApostrophe = labelWithApostrophe.toLowerCase().replace("s’", "se ");
        return labelWithApostrophe.toLowerCase().indexOf("s’") >= 0
            ? labelWitoutApostrophe
            : labelWithApostrophe;
    };

    const [index] = React.useState<Index<AutoCompleteActiviteOption>>(() => {
        let optionsSplit = options.map(opt => {
            const newOption: AutoCompleteActiviteOption = {
                id: opt.id,
                label: skipApostrophes(opt.label),
                synonymes: opt.synonymes,
            };
            return newOption;
        });

        elasticlunr.clearStopWords();
        elasticlunr.addStopWords(stopWords);

        const temp: Index<AutoCompleteActiviteOption> = elasticlunr();
        temp.addField("label");
        temp.addField("synonymes");
        temp.setRef("id");
        temp.pipeline.add(
            elasticlunr.trimmer,
            elasticlunr.stopWordFilter,
            str =>
                str
                    .normalize("NFD")
                    .replace(/\p{Diacritic}/gu, "")
                    .replace(/'/g, " "), // remove accents
            str => stemmer(str),
        );

        for (const doc of optionsSplit) {
            temp.addDoc(doc);
        }
        return temp;
    });

    const selectedvalue: AutoCompleteActiviteOption = options.filter(e => e.id === selectedId)[0];

    const { classes, cx } = useStyles();

    /**
     * Filter options to be returned according to user search input
     * @param ref
     * @param state
     * @returns
     */
    const filterOptions = (
        ref: AutoCompleteActiviteOption[],
        state: FilterOptionsState<AutoCompleteActiviteOption>,
    ): AutoCompleteActiviteOption[] => {
        if (state.inputValue.length > 1) {
            setDisplayAddIcon(true);
        } else {
            setDisplayAddIcon(false);
        }
        setCurrentInputValue(state.inputValue);
        const value = state.inputValue.replace("'", " ");
        const res =
            index.search(value, {
                fields: {
                    label: { boost: 2 },
                    synonymes: { boost: 1 },
                },
                expand: true,
            }) || [];

        const results: AutoCompleteActiviteOption[] = res.map(r => ref.filter(o => o.id === r.ref)[0]);
        console.log(results);
        return results;
    };

    /**
     * Render icon next to textfield
     * @returns
     */
    const renderIcon = () => {
        return displayAddIcon ? <Add /> : <Search />;
    };

    /**
     * Render textfield + icon
     * @param params
     * @returns
     */
    const renderTextField = (params: AutocompleteRenderInputParams) => {
        return (
            <>
                <TextField {...params} autoFocus={autoFocus} placeholder={placeholder} />
            </>
        );
    };

    const createActivityCallback = useCallback(
        () => createActivity(currentInputValue),
        [currentInputValue],
    );

    /**
     * Render no result component
     * @returns
     */
    const renderNoResults = () => {
        return (
            <Box className={classes.noResults}>
                <img src={iconNoResult} alt={iconNoResultAlt} />
                <h3>{notFoundLabel}</h3>
                {notFoundComment}
                <Button
                    className={classes.addActivityButton}
                    variant="contained"
                    startIcon={<Add />}
                    onClick={createActivityCallback}
                >
                    {addActivityButtonLabel}
                </Button>
            </Box>
        );
    };

    /**
     * Render no option component
     * @returns
     */
    const renderNoOption = () => {
        return displayAddIcon && currentInputValue && currentInputValue?.length > 2 ? (
            renderNoResults()
        ) : (
            <></>
        );
    };

    return (
        <Autocomplete
            className={cx(classes.root, className)}
            options={options}
            defaultValue={selectedvalue}
            onChange={(_event, value) => handleChange(value?.id)}
            renderInput={params => renderTextField(params)}
            renderOption={(properties, option) => (
                <li {...properties} className={classes.option}>
                    <Extension className={classes.optionIcon} />
                    {option.label}
                </li>
            )}
            getOptionLabel={option => option.label}
            filterOptions={filterOptions}
            noOptionsText={renderNoOption()}
            onClose={() => setDisplayAddIcon(false)}
            fullWidth={true}
            popupIcon={<Icon children={renderIcon()} onClick={createActivityCallback} />}
            classes={{ popupIndicator: classes.popupIndicator }}
        />
    );
});

const useStyles = makeStylesEdt({ "name": { ClickableList } })(theme => ({
    root: {
        backgroundColor: theme.variables.white,
        borderColor: theme.variables.neutral,
        borderWidth: "3",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "4px",
    },
    popupIndicator: {
        transform: "none",
    },
    noResults: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    addActivityButton: {
        marginTop: "1rem",
    },
    option: {
        display: "flex",
        alignItems: "center",
        padding: "0.5rem",
        cursor: "pointer",
        color: theme.palette.text.secondary,
        "&:hover": {
            backgroundColor: "ghostwhite",
        },
    },
    optionIcon: {
        marginRight: "0.5rem",
        color: theme.palette.primary.main,
    },
}));

export default createCustomizableLunaticField(ClickableList, "ClickableList");
