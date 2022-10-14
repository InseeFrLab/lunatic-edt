import {
    CheckBox,
    Close,
    OpenInNew,
    Downloading,
    NetworkWifi,
    PanTool,
    RadioButtonChecked,
    RadioButtonUnchecked,
    CheckBoxOutlineBlank,
} from "@mui/icons-material";

export function CheckboxCheckedIcon({ className = "", width = 32, height = 32 }) {
    return <CheckBox className={className} sx={{ width: width, height: height }}></CheckBox>;
}
export function ClosedIcon({ className = "", width = 32, height = 32 }) {
    return <Close className={className} sx={{ width: width, height: height }}></Close>;
}
export function OpenedIcon({ className = "", width = 32, height = 32 }) {
    return <OpenInNew className={className} sx={{ width: width, height: height }}></OpenInNew>;
}
export function LoadIcon({ className = "", width = 32, height = 32 }) {
    return <Downloading className={className} sx={{ width: width, height: height }}></Downloading>;
}
export function NetworkIcon({ className = "", width = 32, height = 32 }) {
    return <NetworkWifi className={className} sx={{ width: width, height: height }}></NetworkWifi>;
}
export function OnDragIcon({ className = "", width = 32, height = 32 }) {
    return <PanTool className={className} sx={{ width: width, height: height }}></PanTool>;
}
export function RadioChecked({ className = "", width = 32, height = 32 }) {
    return (
        <RadioButtonChecked
            className={className}
            sx={{ width: width, height: height }}
        ></RadioButtonChecked>
    );
}
export function RadioUnchecked({ className = "", width = 32, height = 32 }) {
    return (
        <RadioButtonUnchecked
            className={className}
            sx={{ width: width, height: height }}
        ></RadioButtonUnchecked>
    );
}
export function CheckboxUnchecked({ className = "", width = 32, height = 32 }) {
    return (
        <CheckBoxOutlineBlank
            className={className}
            sx={{ width: width, height: height }}
        ></CheckBoxOutlineBlank>
    );
}
