"use client"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { Container, ContainerProps, CssBaseline } from "@mui/material";
import { grey,blueGrey } from "@mui/material/colors";
export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary : {
            light : blueGrey[200],
            main : blueGrey[600],
            dark : blueGrey[900],
        },
        background : {
            default : blueGrey[50],
            paper  : blueGrey[100]
        }
    }
})

lightTheme.palette.background


export function ThemeContainer(props: ContainerProps) {
    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <Container maxWidth={props.maxWidth}>
                {props.children}
            </Container>
        </ThemeProvider>
    )
}