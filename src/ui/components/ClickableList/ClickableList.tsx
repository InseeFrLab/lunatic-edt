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
import { RawActiviteOption } from "interface/RawActiviteOption";
import React, { memo, useCallback } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";

export type ClickableListProps = {
    placeholder: string;
    options: RawActiviteOption[];
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

    const selectedvalue: RawActiviteOption = options.filter(e => e.id === selectedId)[0];

    const { classes, cx } = useStyles();

    /**
     * Remove accents from string
     * @param value
     * @returns
     */
    const removeAccents = (value: string): string => {
        return value.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    };

    /**
     * Filter options to be returned according to user search input
     * @param options
     * @param state
     * @returns
     */
    const filterOptions = (
        options: RawActiviteOption[],
        state: FilterOptionsState<RawActiviteOption>,
    ) => {
        let newOptions: RawActiviteOption[] = [];

        if (state.inputValue.length > 1) {
            setDisplayAddIcon(true);
            setCurrentInputValue(state.inputValue);
        } else {
            setDisplayAddIcon(false);
        }

        options.forEach((element: RawActiviteOption) => {
            const stateInputValue = state.inputValue;
            const label = removeAccents(element.label.toLowerCase());
            const synonymes = removeAccents(element.synonymes.toLowerCase()).replace(",", "");
            const stateInput = removeAccents(stateInputValue.toLowerCase());

            if (
                stateInputValue.length > 1 &&
                (label.includes(stateInput) || synonymes.includes(stateInput))
            ) {
                newOptions.push(element);
            }
        });
        return newOptions;
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
                    onClick={useCallback(() => createActivity(currentInputValue), [])}
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
        return displayAddIcon ? renderNoResults() : <></>;
    };

    return (
        <Autocomplete
            className={cx(classes.root, className)}
            options={options}
            defaultValue={selectedvalue}
            onChange={useCallback(
                (_event: React.SyntheticEvent<Element, Event>, value: RawActiviteOption | null) => {
                    handleChange(value?.id);
                },
                [],
            )}
            renderInput={useCallback(
                (params: AutocompleteRenderInputParams) => renderTextField(params),
                [],
            )}
            renderOption={useCallback(
                (properties: React.HTMLAttributes<HTMLLIElement>, option: RawActiviteOption) => (
                    <li {...properties} className={classes.option}>
                        <Extension className={classes.optionIcon} />
                        {option.label}
                    </li>
                ),
                [],
            )}
            getOptionLabel={useCallback((option: RawActiviteOption) => option.label, [])}
            filterOptions={useCallback(filterOptions, [])}
            noOptionsText={renderNoOption()}
            onClose={useCallback(() => setDisplayAddIcon(false), [])}
            fullWidth={true}
            popupIcon={
                <Icon
                    children={renderIcon()}
                    onClick={useCallback(() => createActivity(currentInputValue), [])}
                />
            }
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
