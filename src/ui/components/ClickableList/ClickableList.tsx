import { Add, Extension, Search } from "@mui/icons-material";
import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Button,
    FilterOptionsState,
    Icon,
    TextField,
} from "@mui/material";
import { RawActiviteOption } from "interface/RawActiviteOption";
import React, { memo } from "react";
import { makeStyles } from "tss-react/mui";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";

export type ClickableListProps = {
    placeholder: string;
    options: RawActiviteOption[];
    selectedId?: string;
    handleChange(value: RawActiviteOption | null): void;
    createActivity(value: string | undefined): void;
    notFoundLabel: string;
    notFoundComment: string;
    addActivityButtonLabel: string;
};

const ClickableList = memo((props: ClickableListProps) => {
    let {
        placeholder,
        options,
        selectedId,
        createActivity,
        notFoundLabel,
        notFoundComment,
        addActivityButtonLabel,
    } = props;

    const [displayAddIcon, setDisplayAddIcon] = React.useState<boolean>(false);
    const [currentInputValue, setCurrentInputValue] = React.useState<string | undefined>();

    const selectedvalue: RawActiviteOption = options.filter(e => e.id === selectedId)[0];

    const { classes } = useStyles();

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
                <TextField {...params} placeholder={placeholder} />
            </>
        );
    };

    /**
     * Render no result component
     * @returns
     */
    const renderNoResults = () => {
        return (
            <div className={classes.noResults}>
                <Extension />
                <h3>{notFoundLabel}</h3>
                {notFoundComment}
                <Button onClick={createActivity.bind(this, currentInputValue)}>
                    {addActivityButtonLabel}
                </Button>
            </div>
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
            className={classes.root}
            options={options}
            defaultValue={selectedvalue}
            onChange={(_event, value) => console.log(value)}
            renderInput={params => renderTextField(params)}
            getOptionLabel={option => option.label}
            filterOptions={filterOptions}
            noOptionsText={renderNoOption()}
            onClose={() => setDisplayAddIcon(false)}
            fullWidth={true}
            popupIcon={
                <Icon children={renderIcon()} onClick={createActivity.bind(this, currentInputValue)} />
            }
            classes={{ popupIndicator: classes.popupIndicator }}
        />
    );
});

const useStyles = makeStyles({ "name": { ClickableList } })(theme => ({
    root: {
        backgroundColor: theme.variables.white,
        borderColor: theme.variables.neutral,
        borderWidth: "3",
        width: 300,
        margin: "1rem",
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
}));

export default createCustomizableLunaticField(ClickableList, "ClickableList");
