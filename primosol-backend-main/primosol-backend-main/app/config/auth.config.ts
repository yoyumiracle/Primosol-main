import dotenv from 'dotenv'
dotenv.config()

export const secret = "primosol-app-backend secret"
export const config = {
    domain: process.env.APP_DOMAIN as string | 'primosol.xyz',
    statement: 'Please sign this message to confirm your identity.',
    uri: `https//${process.env.APP_DOMAIN as string}`,
    version: '1',
};