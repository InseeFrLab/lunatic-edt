import { memo } from "react";
import { Button } from "@mui/material";

export type PagerProps = {
    goPrevious: () => void;
    goNext: () => void;
    isLast: boolean;
    isFirst: boolean;
    previousIcon: React.ReactNode;
    nextIcon: React.ReactNode;
    previousButtonText: string;
    nextButtonText: string;
};

export const Pager = memo((props: PagerProps) => {
    const {
        goPrevious,
        goNext,
        isLast,
        isFirst,
        previousIcon,
        previousButtonText,
        nextIcon,
        nextButtonText,
    } = props;
    return (
        <div className="pagination">
            <Button onClick={goPrevious} disabled={isFirst} startIcon={previousIcon}>
                {previousButtonText}
            </Button>
            <Button onClick={goNext} disabled={isLast} endIcon={nextIcon}>
                {nextButtonText}
            </Button>
        </div>
    );
});

export default Pager;
