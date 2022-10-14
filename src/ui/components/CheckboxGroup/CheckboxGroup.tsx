import { Checkbox, Paper, Typography } from "@mui/material";
import { CheckboxOption } from "interface/CheckboxOptions";
import { memo } from "react";
import { makeStyles } from "tss-react/mui";

export type CheckboxGroupProps = {
    handleChange(response: { [name: string]: string }, value: boolean): void;
    id?: string;
    options: CheckboxOption[];
    value: { [key: string]: boolean };
};

const CheckboxGroup = memo((props: CheckboxGroupProps) => {
    const { id, value, options, handleChange } = props;

    const { classes } = useStyles();

    const handleOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
        value[event.target.value] = !value[event.target.value];
        handleChange({ name: event.target.value }, value[event.target.value]);
    };

    return (
        <div id={id}>
            {options.map(option => (
                <Paper className={classes.root} elevation={0} key={"paper-" + option.id}>
                    <div style={{ display: "flex" }}>
                        {/* TODO : replace when we know in which way we send icons label */}
                        <span>IC&nbsp;&nbsp;</span>
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

const useStyles = makeStyles({ "name": { CheckboxGroup } })(theme => ({
    root: {
        maxWidth: "100%",
        margin: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "0.5rem",
    },
    MuiCheckbox: {
        color: theme.variables.neutral,
    },
}));

export default CheckboxGroup;
