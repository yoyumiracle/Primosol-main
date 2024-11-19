import { Request, Response } from 'express';
import { sendResponse, generateReferralCode, encryptPKey } from '../utils/global_utils';
import { config, secret } from '../config/auth.config';
import { Header, Payload, SIWS } from '@web3auth/sign-in-with-solana';
import jwt from 'jsonwebtoken';
import { addUser, getUser } from '../models';
import { generateNewWallet } from '../utils/sol_utils';

interface IRequestMessageBody {
    wallet: string;
}

interface IVerifyRequestBody {
    sign: string;
    payload: {
        domain: string;
        address: string;
        uri: string;
        statement: string;
        version: string;
        issuedAt: string;
        nonce: string;
    };
    referral?: string;
}

export const requestMessage = async (req: Request, res: Response) => {
    try {
        const { wallet } = req.body as IRequestMessageBody;

        const payload: Record<string, string> = {
            domain: config.domain,
            address: wallet,
            uri: config.uri,
            statement: config.statement,
            version: config.version
        };
        console.log("request message", payload)
        return sendResponse(
            res,
            200,
            true,
            { data: payload },
            "User was registered successfully!"
        );
    } catch (error: any) {
        console.error("request-message", error);
        return sendResponse(
            res,
            400,
            false,
            { error: error.message },
            "Request error!"
        );
    }
};

export const verify = (req: Request, res: Response) => {
    try {
        const { sign, payload, referral } = req.body as IVerifyRequestBody;
        const new_payload = new Payload();

        new_payload.domain = payload.domain;
        new_payload.address = payload.address;
        new_payload.uri = payload.uri;
        new_payload.statement = payload.statement;
        new_payload.version = payload.version;
        new_payload.issuedAt = payload.issuedAt;
        new_payload.nonce = payload.nonce;

        const header = new Header();
        header.t = "sip99";

        let message = new SIWS({ header, payload: new_payload });

        const signature = {
            t: "sip99",
            s: sign
        };

        message?.verify({ payload: new_payload, signature }).then(async (resp: { success: boolean }) => {
            if (resp.success) {
                const wallet = new_payload.address;
                let user = await getUser({ wallet });
                if (!user) {
                    const referralCode = generateReferralCode(wallet);
                    const { publicKey, secretKey } = generateNewWallet()
                    const encryptPK = encryptPKey(secretKey)
                    if (referral) {
                        const referralUser = await getUser({ referralCode: referral });
                        if (referralUser) {
                            const referredTimestamp = Date.now();
                            user = await addUser({
                                wallet,
                                deposit_wallet: publicKey,
                                deposit_pk: encryptPK,
                                referralCode,
                                referredBy: referralUser.wallet,
                                referredTimestamp
                            });
                        } else {
                            user = await addUser({ wallet, referralCode, deposit_wallet: publicKey, deposit_pk: encryptPK });
                        }
                    } else {
                        user = await addUser({ wallet, referralCode, deposit_wallet: publicKey, deposit_pk: encryptPK });
                    }
                }

                if (user) {
                    const token = jwt.sign({ id: user._id }, secret, {
                        algorithm: "HS256",
                        allowInsecureKeySizes: true,
                        expiresIn: '1d', // 24 hours
                    });

                    return sendResponse(
                        res,
                        200,
                        true,
                        { data: token },
                        "User was registered successfully!"
                    );
                }
            }
        });
    } catch (error: any) {
        console.error("verify", error);
        return sendResponse(
            res,
            400,
            false,
            { error: "not verified" },
            "verify error!"
        );
    }
};