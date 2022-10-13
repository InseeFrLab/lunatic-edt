import { Radio as RadioMaterial } from "@mui/material";

export type RadioProps = {
    id?: string;
    value?: string;
    disabled?: boolean;
};
const Radio = (props: RadioProps) => {
    console.log("Radio");
    console.log(props);
    const { id, value, disabled } = props;

    return <RadioMaterial id={id} value={value} disabled={disabled}></RadioMaterial>;
};

export default Radio;
