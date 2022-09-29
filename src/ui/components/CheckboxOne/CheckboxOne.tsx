import { memo } from "react";

const CheckBoxOne = memo((props: any) => {
    console.log("CheckBoxOne");
    console.log(props);
    return <div>This is not a Lunatic checkboxOne, it's an EDT custom one</div>;
});

export default CheckBoxOne;
