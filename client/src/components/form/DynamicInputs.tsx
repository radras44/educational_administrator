import { sxDefaultMargin, sxTextField } from "@/sxStyles/sxStyles";
import { AttributesType } from "@/utils/interfaces/interfaces";
import { Box, MenuItem, TextField } from "@mui/material";

interface GeneratorProps {
    attributes: AttributesType[]
    currentData: any
    setCurrentData: React.Dispatch<React.SetStateAction<any>>
}

export function TextFieldGenerator(props: GeneratorProps) {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column"
        }}>
            {props.attributes.map((attribute, index) => (
                attribute.inputType === "textField" ?
                    <TextField
                        key={index}
                        sx={{ ...sxTextField(),...sxDefaultMargin() }}
                        label={attribute.label}
                        value={props.currentData[attribute.label] || ""}
                        required={attribute.required}
                        onChange={(e) => {
                            props.setCurrentData((prevState: typeof props.currentData) => ({
                                ...prevState,
                                [attribute.label]: e.target.value
                            }))
                        }}
                    />
                    :
                    null
            ))}
        </Box>
    )
}

export function SelectGenerator(props: GeneratorProps) {
    return (
        <Box sx={{
            display: "flex",
            flexDirection : "column"
        }}>
            {props.attributes.map((attribute, index) => (
                attribute.inputType === "select" ?
                    <TextField
                        key={index}
                        sx={{ ...sxTextField(),...sxDefaultMargin() }}
                        select
                        label={attribute.label}
                        value={props.currentData[attribute.label] || ""}
                        required={attribute.required}
                        SelectProps={{
                            MenuProps: { style: { maxHeight: 350 } }
                        }}
                        onChange={(e) => {
                            props.setCurrentData((prevState: typeof props.currentData) => ({
                                ...prevState,
                                [attribute.label]: e.target.value
                            }))
                        }}
                    >
                        {attribute.options.map((option, optionIdx) => (
                            <MenuItem
                                key={optionIdx}
                                value={option.id}
                            >
                                {option[attribute.label]}
                            </MenuItem>
                        ))}
                    </TextField>
                    : null
            ))}
        </Box>
    )
}
