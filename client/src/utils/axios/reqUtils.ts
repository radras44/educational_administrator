import axios, { AxiosProxyConfig, AxiosRequestConfig } from "axios"

export const api_url = process.env.NEXT_PUBLIC_API_URL

export const getErrorMsg = (error: any): string => {
    if (error && error.response && error.response.data && error.response.data.error) {
        return error.response.data.error
    } else {
        return "no hay mensaje de error personalizado"
    }
}

export const generateErrorMsg = (msg : string) => {
    return {response : {data : {error : msg}}}
}

export const getOne = async (entity: string, headers: AxiosRequestConfig, id: number) => {
    try {
        const url = `${api_url}/${entity}/${id}`
        const res = await axios.get(url, headers)
        return {
            status: true,
            result: res.data.result
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            error: error
        }
    }
}

export const getAll = async (entity: string, headers: AxiosRequestConfig, setFunction: React.SetStateAction<any> | null) => {
    try {
        const url = `${api_url}/${entity}/all`
        const res = await axios.get(url, headers)

        const result = res.data.result
        if (setFunction) {
            setFunction(result)
        }
        return {
            status: true,
            result: result
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            error: error
        }
    }
}

export const updateEntity = async (entity: string, headers: AxiosRequestConfig, data: any, id: number) => {
    try {
        const url = `${api_url}/${entity}/${id}`
        await axios.put(url, { data: data }, headers)
        return {
            status: true
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            error: error
        }
    }

}

export const createEntity = async (entity: string, headers: AxiosRequestConfig, data: any) => {
    try {
        const url = `${api_url}/${entity}/`
        const res = await axios.post(url, { data: data }, headers)
        return {
            status: true
        }
    } catch (error) {
        return {
            status: false,
            error: error
        }
    }
}


export async function updateManyToMany(entity: string, relation: string, headers: AxiosRequestConfig, add: number[], remove: number[], id: number) {
    try {
        const url = `${api_url}/${entity}/${relation}/${id}`
        await axios.put(url, { add: add, remove: remove }, headers)
        return {
            status: true
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            error: error
        }
    }
}

export async function getAllRelated(entity: string, relation: string, headers: AxiosRequestConfig, id: number, setFunction: React.Dispatch<React.SetStateAction<any>> | null = null) {
    try {
        const url = `${api_url}/${entity}/all/related/${relation}/${id}`
        const res = await axios.get(url, headers)
        const result = res.data.result
        if (setFunction) {
            setFunction(result)
        }
        return {
            status: true,
            result: result
        }
    } catch (error) {
        return {
            status: false,
            error: error
        }
    }
}

export async function deleteRegister(entity: string, headers: AxiosRequestConfig, id: number) {
    try {
        const url = `${api_url}/${entity}/${id}`
        const res = await axios.delete(url, headers)
        const result = res.data.result
        return {
            status: true,
            result: result
        }
    } catch (error) {
        return {
            status: false,
            error: error
        }
    }
}