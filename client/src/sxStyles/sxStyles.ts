import { SxProps } from "@mui/material"

export const sxWeightBorder = (side: "top" | "bottom" | "left" | "right", color: string = "primary.main") => {
    const border = `border${side}`
    const sx: SxProps = {
        [border]: "20px solid",
        borderColor: color
    }
    return sx
}

export const sxCenteredContainer = () => {
    const sx: SxProps = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };
    return sx
}

export const sxModalContainer = () => {
    const sx: SxProps = {
        overflow: "auto",
        maxHeight: '90%',
        maxWidth: "90%",
        borderRadius: 3,
        p: 1
    }
    return sx
}
export const sxForm = () => {
    const sx: SxProps = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space arround",
        alignItems: "center",
        margin: '0 auto',
        p: 2,
        "& *": {
            mt: 1,
            mb: 1
        }
    };
    return sx
}

export const sxbetweenContainer = () => {
    const sx: SxProps = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    }
    return sx
}

export const sxTextField = () => {
    const sx: SxProps = {
        minWidth: 250,
    }
    return sx
}

export const sxVContainer = () => {
    const sx: SxProps = {
        display: "flex",
        flexDirection: "column"
    }
    return sx
}

export const sxDefaultMargin = () => {
    const sx: SxProps = {
        m: [1, 2, 1, 2]
    }
    return sx
}

export const sxDefaultPadding = () => {
    const sx : SxProps = {
        p : 2
    }
    return sx
}

export const sxHContainer = () => {
    const sx : SxProps = {
        display : "flex",
        flexDirection : "row",
        alignItems : "center"
    }
    return sx
}

