import { Add, Extension, Search } from "@mui/icons-material";
import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Box,
    Button,
    FilterOptionsState,
    Icon,
    Paper,
    Popper,
    TextField,
} from "@mui/material";
import elasticlunr, { Index } from "elasticlunrjs";
import { AutoCompleteActiviteOption } from "interface/ActivityTypes";
import { stemmer } from "./stemmer";
import stopWords from "./stop_words_french.json";

import React, { memo, useCallback, ReactNode } from "react";
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
    isMobile?: boolean;
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
        isMobile = false,
    } = props;

    const [displayAddIcon, setDisplayAddIcon] = React.useState<boolean>(false);
    const [currentInputValue, setCurrentInputValue] = React.useState<string | undefined>();

    const skipApostrophes = (labelWithApostrophe: string) => {
        let labelWitoutApostrophe = labelWithApostrophe.toLowerCase().replace("s’", "se ");
        return labelWithApostrophe.toLowerCase().indexOf("’") >= 0
            ? labelWitoutApostrophe
            : labelWithApostrophe;
    };

    let optionsFiltered: AutoCompleteActiviteOption[] = [];

    options.forEach(opt => {
        if (optionsFiltered.find(option => option.label == opt.label) == null) {
            const newOption: AutoCompleteActiviteOption = {
                id: opt.id,
                label: skipApostrophes(opt.label),
                synonymes: opt.synonymes,
            };
            optionsFiltered.push(newOption);
        }
    });

    const [index] = React.useState<Index<AutoCompleteActiviteOption>>(() => {
        elasticlunr.clearStopWords();
        elasticlunr.addStopWords(stopWords);

        const temp: Index<AutoCompleteActiviteOption> = elasticlunr();
        temp.addField("label");
        temp.addField("synonymes");
        temp.setRef("id");

        temp.pipeline.reset();
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

        for (const doc of optionsFiltered) {
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
        const inputValue = filterStopWords(state.inputValue);
        if (inputValue.length > 2) {
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

            const results: AutoCompleteActiviteOption[] = res.map(
                r => ref.filter(o => o.id === r.ref)[0],
            );
            return results;
        }
        return [];
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
     * Remove the words included in stopwords that are in the input + spaces.
     *
     */
    const filterStopWords = (value: string | undefined): string => {
        if (value == null) return "";

        let inputWithoutStopWords = value;

        stopWords.forEach(stopWord => {
            if (inputWithoutStopWords != null && inputWithoutStopWords.includes(stopWord)) {
                inputWithoutStopWords = inputWithoutStopWords.replace(stopWord + " ", "");
            }
        });

        inputWithoutStopWords = inputWithoutStopWords.replaceAll(" ", "");
        return inputWithoutStopWords;
    };

    /**
     * Render no option component.
     * @returns
     */
    const renderNoOption = () => {
        // not counts the words included in stopwords that are in the input.
        // With this, we render noresults only when input without stopwords and spaces has a lenght > 2
        const inputWithoutStopWords = filterStopWords(currentInputValue);

        return displayAddIcon && inputWithoutStopWords && inputWithoutStopWords?.length > 2 ? (
            renderNoResults()
        ) : (
            <></>
        );
    };

    const renderListOptions = (children: ReactNode) => {
        return (
            <Paper
                className={isMobile ? classes.listOptionsMobile : classes.listOptionsDesktop}
                onMouseDown={event => event.preventDefault()}
            >
                {children}
            </Paper>
        );
    };

    /**
     * Render list of options and button for add new activity
     */
    const renderListBoxComponent = (props: any) => {
        return (
            <>
                <ul {...props} />
                <Box className={classes.noResults}>
                    <Button
                        className={classes.addActivityButton}
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => createActivity(currentInputValue)}
                    >
                        {addActivityButtonLabel}
                    </Button>
                </Box>
            </>
        );
    };

    return (
        <Autocomplete
            className={cx(classes.root, className)}
            options={optionsFiltered}
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
            filterOptions={(options, inputValue) => filterOptions(options, inputValue)}
            noOptionsText={renderNoOption()}
            onClose={() => setDisplayAddIcon(false)}
            fullWidth={true}
            popupIcon={<Icon children={renderIcon()} onClick={createActivityCallback} />}
            classes={{ popupIndicator: classes.popupIndicator }}
            PaperComponent={({ children }) => renderListOptions(children)}
            ListboxComponent={listboxProps => renderListBoxComponent(listboxProps)}
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
    listOptionsDesktop: {
        height: "60vh",
    },
    listOptionsMobile: {
        height: "85vh",
    },
}));

export default createCustomizableLunaticField(ClickableList, "ClickableList");
