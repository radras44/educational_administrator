import {AxiosRequestConfig} from "axios"

const emptyHeaders = {
    headers : {}
}

export function defaultHeaders () : AxiosRequestConfig {
    const headers = {

    }
    return headers
}

export function idTokenHeaders (idToken:string) : AxiosRequestConfig {
    const headers = {
        headers : {
            idtoken : idToken
        }
    }
    return headers
}

export function sessionHeaders () : AxiosRequestConfig {
    const sessionToken = window.localStorage.getItem("sessionToken")
    if(!sessionToken){
        return emptyHeaders
    }
    const sessionTokenHeader = `Bearer ${sessionToken}`
    const headers = {
        headers : {
            sessionToken : sessionTokenHeader
        }
    }

    return headers
}