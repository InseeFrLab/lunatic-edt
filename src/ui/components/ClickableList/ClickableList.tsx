import React from "react";
import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Button,
    FilterOptionsState,
    Icon,
    TextField,
} from "@mui/material";
import { RawActiviteOption } from "interface/RawActiviteOption";
import { memo } from "react";
import { makeStyles } from "tss-react/mui";
import createCustomizableLunaticField from "../../utils/create-customizable-lunatic-field";
import activites from "../../../activites.json";
import { Search, Add, Extension } from "@mui/icons-material";

export type ClickableListProps = {
    options: RawActiviteOption[];
    selectedId: string;
    handleChange(value: RawActiviteOption | null): void;
    createActivity(value: string | undefined): void;
};

const ClickableList = memo((props: ClickableListProps) => {
    let { options, selectedId, createActivity } = props;
    // For now fill options with activites.json file
    options = activites;
    createActivity = value => console.log("Ajout activité :" + value);

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
            const stateInput = state.inputValue;
            const deaccentedLabel = removeAccents(element.label.toLowerCase());
            const deaccentedSynonymes = removeAccents(element.synonymes.toLowerCase()).replace(",", "");
            const deaccentedStateInput = removeAccents(stateInput.toLowerCase());

            if (
                stateInput.length > 1 &&
                (deaccentedLabel.includes(deaccentedStateInput) ||
                    deaccentedSynonymes.includes(deaccentedStateInput))
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
                <TextField {...params} placeholder="Saisissez une activité" />
                <Icon children={renderIcon()} onClick={createActivity.bind(this, currentInputValue)} />
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
                <h3>Aucun résultat trouvé</h3>
                Vous pourrez l'ajouter en cliquant sur le bouton ci-dessous, ou le bouton + ci-dessus
                <Button onClick={createActivity.bind(this, currentInputValue)}>
                    Ajouter l'activité
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
            popupIcon={<></>}
            noOptionsText={renderNoOption()}
            onClose={() => setDisplayAddIcon(false)}
            fullWidth={true}
        />
    );
});

const useStyles = makeStyles({ "name": { ClickableList } })(_theme => ({
    root: {
        backgroundColor: "#FFFFFF",
        borderColor: "#DCE7F9",
        borderWidth: "3",
        width: 300,
        margin: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "4px",
    },
    noResults: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));

export default createCustomizableLunaticField(ClickableList);
