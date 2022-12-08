import React, { memo, useState, useEffect } from "react";
import { createCustomizableLunaticField } from "../../utils/create-customizable-lunatic-field";
import { ActivitySelection, SelectedActivity } from "interface/ActivityTypes";
import { ActivitySelecterSpecificProps } from "interface/ComponentsSpecificProps";
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
    label: string;
};

enum FullScreenComponent {
    Main,
    ClickableList,
    FreeInput,
}

const ActivitySelecter = memo((props: ActivitySelecterProps) => {
    let { handleChange, componentSpecificProps, response, label } = props;

    let {
        backClickEvent,
        nextClickEvent,
        backClickCallback,
        nextClickCallback,
        categoriesIcons,
        activitesAutoCompleteRef,
        clickableListIconNoResult,
        setDisplayStepper,
        categoriesAndActivitesNomenclature,
        labels,
    } = { ...componentSpecificProps };

    const [selectedCategories, setSelectedCategories] = useState<ActivitySelection[]>([]);
    const [createActivityValue, setCreateActivityValue] = useState<string | undefined>();
    const [selectedId, setSelectedId] = useState<string | undefined>();
    const [labelOfSelectedId, setLabelOfSelectedId] = useState<string | undefined>();
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
        } else {
            onChange(undefined, undefined, false);
        }
    }, [nextClickEvent]);

    const onChange = (id?: string, label?: string, isFullyCompleted?: boolean) => {
        const selection: SelectedActivity = {
            id: id,
            label: label,
            isFullyCompleted: isFullyCompleted,
        };
        handleChange(response, JSON.stringify(selection));
    };

    const back = () => {
        // Go back to previous page in application navigation
        if (fullScreenComponent === FullScreenComponent.Main && selectedCategories.length === 0) {
            backClickCallback();
            return;
        }
        const temp = [...selectedCategories];
        setSelectedId(undefined);
        setLabelOfSelectedId(undefined);

        switch (fullScreenComponent) {
            case FullScreenComponent.Main:
                temp.pop();
                setSelectedCategories(temp);
                onChange(temp[temp.length - 1]?.id, undefined, false);
                break;
            case FullScreenComponent.FreeInput:
                setCreateActivityValue(undefined);
                setFullScreenComponent(FullScreenComponent.Main);
                onChange(selectedCategories[selectedCategories.length - 1]?.id, undefined, false);
                break;
            case FullScreenComponent.ClickableList:
                setFullScreenComponent(FullScreenComponent.Main);
                onChange(undefined, undefined, false);
                break;
            default:
                break;
        }
    };

    const next = (continueWithUncompleted: boolean) => {
        switch (fullScreenComponent) {
            case FullScreenComponent.ClickableList:
            case FullScreenComponent.Main:
                if (selectedId === undefined && !continueWithUncompleted) {
                    setDisplayAlert(true);
                } else {
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
                    nextClickCallback();
                }
                break;
            default:
                break;
        }
    };

    const categoriesActivitiesBoxClick = (selection: ActivitySelection) => {
        if (selection.subs) {
            const temp = [...selectedCategories];
            temp.push(selection);
            setSelectedCategories(temp);
            onChange(selection.id, undefined, false);
        } else {
            onChange(selection.id, undefined, true);
            setSelectedId(selection.id);
            setLabelOfSelectedId(selection.label);
        }
    };

    const createActivityCallBack = (label: string) => {
        onChange(undefined, label, true);
        setFullScreenComponent(FullScreenComponent.FreeInput);
        setCreateActivityValue(label);
    };

    const clickAutreButton = () => {
        setFullScreenComponent(FullScreenComponent.FreeInput);
        // If we enter free input value from "Autre" button, then save id of last selected category
        let id = undefined;
        if (selectedCategories.length > 0) {
            id = selectedCategories[selectedCategories.length - 1].id;
        }
        onChange(id, undefined, false);
    };

    const handleAlertClose = () => {
        setDisplayAlert(false);
    };

    const clickableListOnChange = (id: string | undefined) => {
        setSelectedId(id);
        if (id) {
            onChange(id, undefined, true);
        } else {
            onChange(id, undefined, false);
        }
    };

    const freeInputOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCreateActivityValue(e.target.value);
        // If we enter free input value from "Autre" button, then save id of last selected category
        let id = undefined;
        if (selectedCategories.length > 0) {
            id = selectedCategories[selectedCategories.length - 1].id;
        }
        if (e.target.value !== "") {
            onChange(id, e.target.value, true);
        } else {
            onChange(id, e.target.value, false);
        }
    };

    const getTextTitle = () => {
        if (fullScreenComponent === FullScreenComponent.FreeInput) {
            return labels.addActivity;
        } else {
            if (selectedCategories.length === 0) {
                return label;
            } else {
                return `${labels.selectInCategory} «${
                    selectedCategories[selectedCategories.length - 1].label
                } »`;
            }
        }
    };

    const renderSubRangCategory = (category: ActivitySelection) => {
        return (
            <Box
                className={
                    !category.subs && category.id === selectedId && category.label === labelOfSelectedId
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
                <img className={classes.icon} src={categoriesIcons[id]} />
                <Typography className={classes.rank1MainLabel}>{mainLabel}</Typography>
                {secondLabel ? (
                    <Typography className={classes.rank1SecondLabel}>{secondLabel}</Typography>
                ) : null}
            </Box>
        );
    };

    return (
        <>
            {componentSpecificProps && categoriesAndActivitesNomenclature && (
                <>
                    <Dialog
                        open={displayAlert}
                        onClose={handleAlertClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {labels.alertMessage}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => next(true)}>{labels.alertIgnore}</Button>
                            <Button onClick={handleAlertClose} autoFocus>
                                {labels.alertComplete}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {fullScreenComponent === FullScreenComponent.ClickableList && (
                        <ClickableList
                            className={classes.clickableList}
                            options={activitesAutoCompleteRef}
                            handleChange={clickableListOnChange}
                            createActivity={createActivityCallBack}
                            placeholder={labels.clickableListPlaceholder}
                            notFoundLabel={labels.clickableListNotFoundLabel}
                            notFoundComment={labels.clickableListNotFoundComment}
                            addActivityButtonLabel={labels.clickableListAddActivityButton}
                            iconNoResult={clickableListIconNoResult}
                            iconNoResultAlt="alt pour icon no result"
                            autoFocus={true}
                        ></ClickableList>
                    )}

                    {fullScreenComponent === FullScreenComponent.FreeInput && (
                        <Box className={classes.root}>
                            <Typography className={classes.title}>{getTextTitle()}</Typography>
                            <TextField
                                value={createActivityValue}
                                className={classes.freeInputTextField}
                                onChange={freeInputOnChange}
                                placeholder={labels.clickableListPlaceholder}
                            ></TextField>
                        </Box>
                    )}

                    {fullScreenComponent === FullScreenComponent.Main && (
                        <Box className={classes.root}>
                            <Typography className={classes.title}>{getTextTitle()}</Typography>

                            {selectedCategories.length === 0 && (
                                <Box
                                    className={classes.activityInput}
                                    onClick={() =>
                                        setFullScreenComponent(FullScreenComponent.ClickableList)
                                    }
                                >
                                    <Typography className={classes.activityInputLabel}>
                                        {labels.clickableListPlaceholder}
                                    </Typography>
                                    <Search className={classes.activityInputIcon} />
                                </Box>
                            )}

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
                                        {labels.otherButton}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}
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
        width: "300px",
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
        cursor: "pointer",
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
