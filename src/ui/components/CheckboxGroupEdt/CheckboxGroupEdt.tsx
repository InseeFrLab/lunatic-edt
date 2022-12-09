import { Box, Checkbox, Paper, Typography } from "@mui/material";
import { CheckboxGroupSpecificProps } from "interface";
import { CheckboxOption } from "interface/CheckboxOptions";
import { memo } from "react";
import { makeStylesEdt } from "../../theme";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";

export type CheckboxGroupEdtProps = {
    label?: string;
    handleChange(response: { [name: string]: string }, value: boolean): void;
    id?: string;
    responses: CheckboxOption[];
    value: { [key: string]: boolean };
    componentSpecificProps?: CheckboxGroupSpecificProps;
};

const CheckboxGroupEdt = memo((props: CheckboxGroupEdtProps) => {
    const { id, value, responses, handleChange, componentSpecificProps, label } = props;
    console.log(props);
    const { classes } = useStyles();

    const handleOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
        value[event.target.value] = !value[event.target.value];
        handleChange({ name: event.target.value }, value[event.target.value]);
    };

    return (
        <div id={id}>
            {label && (
                <>
                    <Box className={classes.labelSpacer}></Box>
                    <label>{label}</label>
                </>
            )}
            {responses.map(option => (
                <Paper className={classes.root} elevation={0} key={"paper-" + option.id}>
                    <div style={{ display: "flex" }}>
                        {componentSpecificProps &&
                            componentSpecificProps.optionsIcons &&
                            componentSpecificProps.optionsIcons[option.id] && (
                                <img
                                    className={classes.icon}
                                    src={componentSpecificProps.optionsIcons[option.id]}
                                />
                            )}
                        <Typography color="textSecondary">{option.label}</Typography>
                    </div>

                    <Checkbox
                        key={option.id}
                        checked={value[option.response.name] ?? false}
                        value={option.response.name}
                        onChange={handleOptions}
                        className={classes.MuiCheckbox}
                    />
                </Paper>
            ))}
        </div>
    );
});

const useStyles = makeStylesEdt({ "name": { CheckboxGroupEdt } })(theme => ({
    root: {
        maxWidth: "100%",
        margin: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "0.5rem",
        backgroundColor: theme.variables.white,
    },
    MuiCheckbox: {
        color: theme.variables.neutral,
    },
    labelSpacer: {
        height: "1rem",
    },
    icon: {
        width: "25px",
        marginRight: "1rem",
    },
}));

export default createCustomizableLunaticField(CheckboxGroupEdt, "CheckboxGroupEdt");
