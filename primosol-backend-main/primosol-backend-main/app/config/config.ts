export const CONFIG = {
    port: {
        https: 18000,
        wss: 18001
    },
    sslPath: {
        privatekey:
            "",
        certificate:
            "",
    },
    FEE_WALLET: "",
    FEE: 1, //1%
    MAINNET_RPC: "",
    SEND_RPC: "",
    TOKEN_SOCKET_URL: "",
    TOKEN_API_URL: "",
};

export const SOL_CONFIG = {
    SLIPPAGE: 5,
    MAX_REQ_COUNT_PER_SECOND_KEY: 4,
    BASE_FEE: 5000,
    WSOL_ADDRESS: "So11111111111111111111111111111111111111112",
    WSOL_DECIMALS: 9
}