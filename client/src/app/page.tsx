"use client"
import { sxCenteredContainer, sxForm } from "@/sxStyles/sxStyles"
import { Fade, Typography, Button, Box, Card, Container, Avatar, Grid } from "@mui/material"
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithGoogle } from "@/utils/firebase/firebaseConnect";
import { firebaseInit } from "@/utils/firebase/firebaseConnect";
import axios from "axios";
import { api_url, getErrorMsg } from "@/utils/axios/reqUtils";
import { useRouter } from "next/navigation";
import { useSessionContext } from "./providers/sessionProvider";
import { useState } from "react";

export default function SignIn() {
    const sessionContext = useSessionContext()
    const router = useRouter()
    if (sessionContext && sessionContext.session) {
        router.push("dashboard")
    } else {
        return (
            <Container maxWidth="xl" sx={{ ...(sxCenteredContainer()) }}>
                <SignInPanel />
            </Container>
        )
    }
}

export function SignInPanel() {
    const sessionContext = useSessionContext()
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    async function handleGooglesignIn() {
        const initRes = firebaseInit()
        if (!initRes.status) {
            setErrorMsg(initRes.error)
        }else{
            setErrorMsg(null)
        }

        try {
            const signInRes = await signInWithGoogle()
            if (!signInRes.status) {
                setErrorMsg(getErrorMsg(signInRes.error))
            }
            if (signInRes.result) {
                const res = await axios.post(`${api_url}/auth/signIn/firebase`, {
                    userObj: signInRes.result.user,
                    idToken: signInRes.result.token
                })

                const sessionToken: string = res.data.sessionToken
                window.localStorage.setItem("sessionToken", sessionToken)
                sessionContext.verifySession()
            }
        } catch (error) {
            const errorMsg = getErrorMsg(error) || null
            console.log(error)
            if (error) {
                setErrorMsg(errorMsg)
            }
        }
    }
    return (
        <Fade in={true}>
            <Box sx={{ ...sxCenteredContainer(), height: "90vh" }}>
                <Card elevation={5} sx={{
                    ...(sxForm()),
                    width: 400,
                }}>
                    <Avatar sx={{ minWidth: 100, height: 100 }}></Avatar>
                    <Typography variant="h5" sx={{ m: 2 }}>Iniciar session con</Typography>
                    <Button onClick={handleGooglesignIn} startIcon={<GoogleIcon />} variant="contained" color="error" sx={{
                        m: 2,
                        pl: 5, pr: 5
                    }}>Google</Button>
                    <Typography variant="subtitle1" color="error">{errorMsg}</Typography>
                </Card>
            </Box>
        </Fade>
    )
}