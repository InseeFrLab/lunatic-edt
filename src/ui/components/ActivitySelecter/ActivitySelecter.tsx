import { memo, useState, useEffect } from "react";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";
import {
    ActivitySelecterSpecificProps,
    ActivitySelection,
    SelectedActivity,
} from "interface/ActivityTypes";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    TextField,
    Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { makeStylesEdt } from "../../../ui/theme";
import { Extension, ChevronRight, Search } from "@mui/icons-material";
import ClickableList from "../ClickableList";

type ActivitySelecterProps = {
    handleChange(response: { [name: string]: string }, value: string): void;
    componentSpecificProps: ActivitySelecterSpecificProps;
    response: { [name: string]: string };
};

enum FullScreenComponent {
    Main,
    ClickableList,
    FreeInput,
}

const ActivitySelecter = memo((props: ActivitySelecterProps) => {
    let { handleChange, componentSpecificProps, response } = props;
    let {
        backClickEvent,
        nextClickEvent,
        backClickCallback,
        nextClickCallback,
        categoriesIcons,
        activitesAutoCompleteRef,
        clickableListIconNoResult,
        setDisplayStepper,
        categoriesAndActivitesNomenclature
    } = { ...props.componentSpecificProps };

    const [selectedCategories, setSelectedCategories] = useState<ActivitySelection[]>([]);
    const [createActivityValue, setCreateActivityValue] = useState<string | undefined>();
    const [selectedId, setSelectedId] = useState<string | undefined>();
    const [fullScreenComponent, setFullScreenComponent] = useState<FullScreenComponent>(
        FullScreenComponent.Main,
    );
    const [displayAlert, setDisplayAlert] = useState<boolean>(false);

    if (setDisplayStepper) {
        setDisplayStepper(
            fullScreenComponent === FullScreenComponent.Main && selectedCategories.length === 0,
        );
    }

    const { classes, cx } = useStyles();

    useEffect(() => {
        if (backClickEvent) {
            back();
        }
    }, [backClickEvent]);

    useEffect(() => {
        if (nextClickEvent) {
            next(false);
        }
    }, [nextClickEvent]);

    const categoriesActivitiesBoxClick = (selection: ActivitySelection) => {
        if (selection.subs) {
            const temp = [...selectedCategories];
            temp.push(selection);
            setSelectedCategories(temp);
        } else {
            setSelectedId(selection.id);
        }
    };

    const back = () => {
        // Go back to previous page in application navigation
        if (fullScreenComponent === FullScreenComponent.Main && selectedCategories.length === 0) {
            backClickCallback();
            return;
        }
        const temp = [...selectedCategories];

        switch (fullScreenComponent) {
            case FullScreenComponent.Main:
                setSelectedId(undefined);
                temp.pop();
                setSelectedCategories(temp);
                break;
            case FullScreenComponent.FreeInput:
                setCreateActivityValue(undefined);
                setFullScreenComponent(FullScreenComponent.Main);
                break;
            case FullScreenComponent.ClickableList:
                setSelectedId(undefined);
                setFullScreenComponent(FullScreenComponent.Main);
                break;
            default:
                break;
        }
    };

    const next = (continueWithUncompleted: boolean) => {
        const selection: SelectedActivity = {};

        switch (fullScreenComponent) {
            case FullScreenComponent.ClickableList:
            case FullScreenComponent.Main:
                if (selectedId === undefined && !continueWithUncompleted) {
                    setDisplayAlert(true);
                } else {
                    selection.id = selectedId || selectedCategories[selectedCategories.length - 1]?.id;
                    selection.isFullyCompleted = !continueWithUncompleted;
                    handleChange(response, JSON.stringify(selection));
                    nextClickCallback();
                }
                break;
            case FullScreenComponent.FreeInput:
                if (
                    (createActivityValue === undefined || createActivityValue === "") &&
                    !continueWithUncompleted
                ) {
                    setDisplayAlert(true);
                } else {
                    // If we enter free input value from "Autre" button, then save id of last selected category
                    if (selectedCategories.length > 0) {
                        selection.id = selectedCategories[selectedCategories.length - 1].id;
                    }
                    selection.label = createActivityValue;
                    selection.isFullyCompleted = !continueWithUncompleted;
                    handleChange(response, JSON.stringify(selection));
                }
                break;
            default:
                break;
        }
    };

    const getTextTitle = () => {
        if (fullScreenComponent === FullScreenComponent.FreeInput) {
            return "Ajoutez une autre activité";
        } else {
            if (selectedCategories.length === 0) {
                return "Que faisiez-vous ?";
            } else {
                return `Sélectionnez une activité dans la catégorie «${
                    selectedCategories[selectedCategories.length - 1].label
                } »`;
            }
        }
    };

    const renderRank1Category = (category: ActivitySelection) => {
        const id = Number(category.id);
        const wholeLabel = category.label;
        let mainLabel;
        let secondLabel;
        const indexOfParenthesis = wholeLabel.indexOf("(");
        if (indexOfParenthesis !== -1) {
            mainLabel = wholeLabel.substring(0, indexOfParenthesis);
            secondLabel = wholeLabel.substring(indexOfParenthesis + 1, wholeLabel.length - 1);
        } else {
            mainLabel = wholeLabel;
        }

        return (
            <Box
                className={classes.rank1Category}
                key={uuidv4()}
                onClick={() => categoriesActivitiesBoxClick(category)}
            >
                <img className={classes.icon} src={categoriesIcons[id - 1]} />
                <Typography className={classes.rank1MainLabel}>{mainLabel}</Typography>
                {secondLabel ? (
                    <Typography className={classes.rank1SecondLabel}>{secondLabel}</Typography>
                ) : null}
            </Box>
        );
    };

    const renderSubRangCategory = (category: ActivitySelection) => {
        return (
            <Box
                className={
                    !category.subs && category.label === selectedId
                        ? cx(classes.subRankCategory, classes.selectedSubRankCategory)
                        : classes.subRankCategory
                }
                key={uuidv4()}
                onClick={() => {
                    categoriesActivitiesBoxClick(category);
                }}
            >
                <Extension className={classes.optionIcon} />
                <Typography className={classes.subRankLabel}>{category.label}</Typography>
                {category.subs ? <ChevronRight className={classes.chevronIcon} /> : null}
            </Box>
        );
    };

    const createActivityCallBack = (label: string) => {
        setFullScreenComponent(FullScreenComponent.FreeInput);
        setCreateActivityValue(label);
    };

    const clickAutreButton = () => {
        setSelectedId(undefined);
        setFullScreenComponent(FullScreenComponent.FreeInput);
    };

    const handleAlertClose = () => {
        setDisplayAlert(false);
    };

    return (
        <>
            {componentSpecificProps && (
                <>
                    <Dialog
                        open={displayAlert}
                        onClose={handleAlertClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Attention ! Vous n’avez pas été au bout de cette étape. Souhaitez-vous la
                                compléter ?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => next(true)}>Ignorer</Button>
                            <Button onClick={handleAlertClose} autoFocus>
                                Compléter
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {fullScreenComponent === FullScreenComponent.ClickableList ? (
                        <ClickableList
                            className={classes.clickableList}
                            options={activitesAutoCompleteRef}
                            handleChange={setSelectedId}
                            createActivity={createActivityCallBack}
                            placeholder="Saisissez une activité"
                            notFoundLabel="Aucun résultat trouvé"
                            notFoundComment="Vous pourrez l'ajouter en cliquant sur le bouton ci-dessous, ou le bouton + ci-dessus"
                            addActivityButtonLabel="Ajouter l'activité"
                            iconNoResult={clickableListIconNoResult}
                            iconNoResultAlt="alt pour icon no result"
                            autoFocus={true}
                        ></ClickableList>
                    ) : null}

                    {fullScreenComponent === FullScreenComponent.FreeInput ? (
                        <Box className={classes.root}>
                            <Typography className={classes.title}>{getTextTitle()}</Typography>
                            <TextField
                                value={createActivityValue}
                                className={classes.freeInputTextField}
                                onChange={e => setCreateActivityValue(e.target.value)}
                                placeholder="Saisissez une activité"
                            ></TextField>
                        </Box>
                    ) : null}

                    {fullScreenComponent === FullScreenComponent.Main ? (
                        <Box className={classes.root}>
                            <Typography className={classes.title}>{getTextTitle()}</Typography>

                            {selectedCategories.length === 0 ? (
                                <Box
                                    className={classes.activityInput}
                                    onClick={() =>
                                        setFullScreenComponent(FullScreenComponent.ClickableList)
                                    }
                                >
                                    <Typography className={classes.activityInputLabel}>
                                        Saisissez une activité
                                    </Typography>
                                    <Search className={classes.activityInputIcon} />
                                </Box>
                            ) : null}

                            {selectedCategories.length === 0 ? (
                                <Box className={classes.rank1CategoriesBox}>
                                    {categoriesAndActivitesNomenclature.map(d => {
                                        return renderRank1Category(d);
                                    })}
                                </Box>
                            ) : (
                                <Box className={classes.rank1CategoriesBox}>
                                    {selectedCategories[selectedCategories.length - 1]?.subs?.map(s => {
                                        return renderSubRangCategory(s);
                                    })}
                                    <Button className={classes.buttonOther} onClick={clickAutreButton}>
                                        Autre ?
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    ) : null}
                </>
            )}
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { ActivitySelecter } })(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    title: {
        color: theme.palette.info.main,
        fontSize: "20px",
        textAlign: "center",
        marginTop: "2rem",
        marginBottom: "2rem",
    },
    activityInput: {
        width: "93%",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1rem",
        backgroundColor: theme.variables.white,
        borderRadius: "5px",
    },
    activityInputLabel: {
        fontSize: "16px",
        color: "#5A6C95",
        margin: "1rem",
    },
    activityInputIcon: {
        margin: "1rem",
    },
    clickableList: {
        width: "100%",
        marginTop: "1rem",
    },
    freeInputTextField: {
        width: "100%",
        backgroundColor: theme.variables.white,
        borderRadius: "5px",
    },
    rank1CategoriesBox: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
    },
    rank1Category: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.variables.white,
        width: "45.5%",
        marginTop: "4%",
        borderRadius: "15px",
    },
    icon: {
        width: "80px",
        height: "45px",
        marginTop: "1rem",
    },
    rank1MainLabel: {
        fontSize: "14px",
        textAlign: "center",
        color: theme.palette.text.secondary,
        fontWeight: "bold",
        marginTop: "1rem",
        marginRight: "0.5rem",
        marginBottom: "0.5rem",
        marginLeft: "0.5rem",
    },
    rank1SecondLabel: {
        fontSize: "12px",
        textAlign: "center",
        marginTop: "0.5rem",
        marginRight: "0.5rem",
        marginBottom: "1rem",
        marginLeft: "0.5rem",
    },
    subRankCategory: {
        display: "flex",
        backgroundColor: theme.variables.white,
        marginTop: "4%",
        borderRadius: "6px",
        width: "100%",
        padding: "1rem",
        alignItems: "center",
        justifyContent: "space-between",
    },
    selectedSubRankCategory: {
        border: "2px solid",
        borderColor: theme.palette.primary.main,
    },
    subRankLabel: {
        fontSize: "14px",
        color: theme.palette.text.secondary,
        width: "80%",
    },
    optionIcon: {
        marginRight: "0.5rem",
        color: theme.palette.primary.main,
        width: "10%",
    },
    chevronIcon: {
        color: theme.palette.primary.main,
        width: "10%",
    },
    buttonOther: {
        backgroundColor: theme.palette.primary.main,
        width: "60%",
        marginTop: "2rem",
        color: theme.variables.white,
    },
}));

export default createCustomizableLunaticField(ActivitySelecter, "ActivitySelecter");
