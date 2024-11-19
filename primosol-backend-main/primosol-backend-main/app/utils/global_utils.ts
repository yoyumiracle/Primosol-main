import { Request, Response } from 'express';
import crypto from 'crypto'
import * as aes_crypto from './aes'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export const sendResponse = (res: Response, statusCode: number, success: boolean, data = {}, message: string) => {
    const response = {
        success,
        data,
        message,
    };
    return res.status(statusCode).json(response);
};

export const generateReferralCode = (wallet: string) => {
    const hash = crypto.createHash("sha256");
    hash.update(wallet);
    return hash.digest("hex").substring(0, 24);
};

export const encryptPKey = (text: string) => {
    if (text.startsWith('0x')) {
        text = text.substring(2)
    }
    return aes_crypto.aesEncrypt(text, process.env.CRYPT_KEY as string)
}

export const decryptPKey = (text: string) => {
    return aes_crypto.aesDecrypt(text, process.env.CRYPT_KEY as string)
}

export const fetchAPI = async (url: string, method: string, data = {}) => {
    return new Promise(resolve => {
        if (method === "POST") {
            axios.post(url, data).then(response => {
                let json = response.data;
                resolve(json);
            }).catch(error => {
                // console.error('[fetchAPI]', error)
                resolve(null);
            });
        } else {
            axios.get(url).then(response => {
                let json = response.data;
                resolve(json);
            }).catch(error => {
                // console.error('fetchAPI', error);
                resolve(null);
            });
        }
    });
};

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const validateUserUpdate = (schema: any, req: { body: any }) => {
    // Parse and validate the data
    const result = schema.safeParse(req.body);

    if (!result.success) {
        // Handle validation errors
        console.error(result.error);
        return null; // Or throw an error, depending on your application's error handling
    } else {
        // Use valid data
        return result.data;
    }
}

export const isJson = (str: any) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};