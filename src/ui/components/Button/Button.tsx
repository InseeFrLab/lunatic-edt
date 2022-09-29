// Lunatic default Input: https://github.com/InseeFr/Lunatic/blob/v2-master/src/components/button/lunatic-button.js

import { memo } from "react";
import { Button as ButtonMaterial } from "@mui/material";

const Button = memo((props: any) => {
    console.log("Button");
    console.log(props);
    return <ButtonMaterial>This is not a Lunatic Button, it's an EDT custom one</ButtonMaterial>;
});

export default Button;
