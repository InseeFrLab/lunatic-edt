import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Box,
    Button,
    FilterOptionsState,
    Icon,
    Paper,
    TextField,
} from "@mui/material";
import elasticlunr from "elasticlunrjs";
import { AutoCompleteActiviteOption } from "interface/ActivityTypes";
import React, { ReactNode, memo, useCallback } from "react";
import { makeStylesEdt } from "../../theme";
import { important } from "../../utils";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";
import stopWords from "./stop_words_french.json";

export type ClickableListProps = {
    placeholder: string;
    optionsFiltered: AutoCompleteActiviteOption[];
    index: elasticlunr.Index<AutoCompleteActiviteOption>;
    selectedValue: AutoCompleteActiviteOption;
    historyInputSuggesterValue: string;
    handleChange(id: string | undefined, historyInputSuggester?: string): void;
    handleChangeHistorySuggester(historyInputSuggester?: string): void;
    createActivity(value: string | undefined): void;
    notFoundLabel: string;
    notFoundComment: string;
    addActivityButtonLabel: string;
    notSearchLabel: string;
    iconNoResult: string;
    iconNoResultAlt: string;
    separatorSuggester: string;
    className?: string;
    autoFocus?: boolean;
    isMobile?: boolean;
    iconAddWhite: string;
    iconAddLightBlue: string;
    iconAddAlt: string;
    iconExtension: string;
    iconExtensionAlt: string;
    iconSearch: string;
    iconSearchAlt: string;
    modifiable?: boolean;
};

const ClickableList = memo((props: ClickableListProps) => {
    let {
        placeholder,
        optionsFiltered,
        index,
        selectedValue,
        historyInputSuggesterValue,
        handleChange,
        handleChangeHistorySuggester,
        createActivity,
        notFoundLabel,
        notFoundComment,
        addActivityButtonLabel,
        notSearchLabel,
        iconNoResult,
        iconNoResultAlt,
        separatorSuggester,
        className,
        autoFocus = false,
        isMobile = false,
        iconAddWhite,
        iconAddLightBlue,
        iconAddAlt,
        iconExtension,
        iconExtensionAlt,
        iconSearch,
        iconSearchAlt,
        modifiable = true,
    } = props;

    const [displayAddIcon, setDisplayAddIcon] = React.useState<boolean>(false);
    const [currentInputValue, setCurrentInputValue] = React.useState<string | undefined>();
    const separator = separatorSuggester;
    let values = historyInputSuggesterValue;

    const { classes, cx } = useStyles();

    /**
     * Set history of input
     */
    const setInputSuggester = (inputValue: string) => {
        const historyInputSuggesterValues = values.length != 0 ? values?.split(separator) : null;

        if (
            values == null ||
            values.length == 0 ||
            (historyInputSuggesterValues != null &&
                historyInputSuggesterValues.length > 2 &&
                historyInputSuggesterValues[historyInputSuggesterValues.length - 2] != inputValue)
        ) {
            if (inputValue != null) {
                values += (inputValue ?? "") + separator;
                handleChangeHistorySuggester(values);
            }
        }
    };

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
        setCurrentInputValue(state.inputValue);

        if (inputValue.length > 3) {
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
            setInputSuggester(state.inputValue);

            return results;
        }
        return [];
    };

    /**
     * Render icon next to textfield
     * @returns
     */
    const renderIcon = () => {
        return displayAddIcon ? (
            <img src={iconAddLightBlue} alt={iconAddAlt} />
        ) : (
            <img src={iconSearch} alt={iconSearchAlt} />
        );
    };

    /**
     * Render textfield + icon
     * @param params
     * @returns
     */
    const renderTextField = (params: AutocompleteRenderInputParams) => {
        return (
            <>
                <TextField
                    {...params}
                    autoFocus={autoFocus}
                    placeholder={placeholder}
                    label={placeholder}
                    sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                        "& label": { display: "none" },
                    }}
                />
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
                    startIcon={<img src={iconAddWhite} alt={iconAddAlt} />}
                    onClick={createActivityCallback}
                    disabled={!modifiable}
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
            if (inputWithoutStopWords != null && inputWithoutStopWords.includes(stopWord + " ")) {
                inputWithoutStopWords = inputWithoutStopWords.replace(stopWord + " ", "");
            }
        });
        inputWithoutStopWords = inputWithoutStopWords.replaceAll("'", "");
        inputWithoutStopWords = inputWithoutStopWords.replaceAll(" ", "");
        return inputWithoutStopWords;
    };

    /**
     * Render no option component.
     * @returns
     */
    const renderNoOption = () => {
        // not counts the words included in stopwords that are in the input.
        // With this, we render noresults only when input without stopwords and spaces has a lenght > 3
        const inputWithoutStopWords = filterStopWords(currentInputValue);
        return displayAddIcon && inputWithoutStopWords && inputWithoutStopWords?.length > 3 ? (
            renderNoResults()
        ) : (
            <>{notSearchLabel}</>
        );
    };

    const renderListOptions = (children: ReactNode) => {
        const className = cx(
            isMobile ? classes.listOptionsMobile : classes.listOptionsDesktop,
            filterStopWords(currentInputValue)?.length <= 3 ? classes.notSearch : "",
        );
        return (
            <Paper className={className} onMouseDown={event => event.preventDefault()}>
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
                        startIcon={<img src={iconAddWhite} alt={iconAddAlt} />}
                        onClick={() => createActivity(currentInputValue)}
                        disabled={!modifiable}
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
            defaultValue={selectedValue}
            onChange={(_event, value) => handleChange(value?.id, value?.label)}
            renderInput={params => renderTextField(params)}
            renderOption={(properties, option) => (
                <li {...properties} className={classes.option}>
                    <img src={iconExtension} alt={iconExtensionAlt} className={classes.optionIcon} />
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
            ListboxProps={{
                style: {
                    maxHeight: isMobile ? "75vh" : "50vh",
                },
            }}
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
    notSearch: {
        height: important("10vh"),
    },
}));

export default createCustomizableLunaticField(ClickableList, "ClickableList");
