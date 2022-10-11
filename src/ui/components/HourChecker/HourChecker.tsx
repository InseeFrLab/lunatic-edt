import { memo } from "react";
import { makeStyles } from "tss-react/mui";
import createCustomizableLunaticField from "ui/utils/create-customizable-lunatic-field";

export type HourCheckerProps = {
    handleChange(value: string): void;
    id?: string;
};

const HourChecker = memo((props: HourCheckerProps) => {
    const { id } = props;

    const { classes } = useStyles();

    return (
        <div id={id} className={classes.root}>
            Ceci est un HourChecker
        </div>
    );
});

const useStyles = makeStyles({ "name": { HourChecker } })(theme => ({
    root: {},
}));

export default createCustomizableLunaticField(HourChecker);
