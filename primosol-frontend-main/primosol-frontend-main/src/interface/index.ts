
export interface ITokenPriceData {
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
    eventType: string;
    type: string;
    unixTime: number;
    symbol: string;
    address: string;
}

interface IExtensions {
    telegram: string;
    twitter: string;
    website: string;
    discord: string;
    facebook: string;
}

export interface IPoolOverview {
    poolAddress: string;
    baseMint: string;
    quoteMint: string;
    price: number;
    liquidity: number;
    mcap: number;
    reservedLp: number;
    totalLp: number;
    created: number;

    baseSymbol: string;
    baseName: string;
    baseUri: string;
    baseSupply: number;
    baseImage: string;
    baseDecimals: number;
    baseDescription: string;
    baseExtensions: IExtensions;

    quoteSymbol: string;
    quoteName: string;
    quoteUri: string;
    quoteSupply: number;
    quoteImage: string;
    quoteDecimals: number;
    quoteDescription: string;
    quoteExtensions: IExtensions;

    dex: string;
    dexImage: string;
    outerProgram: string;
    holders: number;

    history5mPrice: number;
    priceChange5mPercent: number;
    trade5m: number;
    tradeHistory5m: number;
    trade5mChangePercent: number;
    buy5m: number;
    buyHistory5m: number;
    buy5mChangePercent: number;
    sell5m: number;
    sellHistory5m: number;
    sell5mChangePercent: number;
    v5m: number;
    v5mUSD: number;
    vHistory5m: number;
    vHistory5mUSD: number;
    v5mChangePercent: number;
    vBuy5m: number;
    vBuy5mUSD: number;
    vBuyHistory5m: number;
    vBuyHistory5mUSD: number;
    vBuy5mChangePercent: number;
    vSell5m: number;
    vSell5mUSD: number;
    vSellHistory5m: number;
    vSellHistory5mUSD: number;
    vSell5mChangePercent: number;
    uniqueWallet5m: number;
    uniqueWalletHistory5m: number;
    uniqueWallet5mChangePercent: number;
    buyUniqueWallet5m: number;
    buyUniqueWalletHistory5m: number;
    buyUniqueWallet5mChangePercent: number;
    sellUniqueWallet5m: number;
    sellUniqueWalletHistory5m: number;
    sellUniqueWallet5mChangePercent: number;

    history1hPrice: number;
    priceChange1hPercent: number;
    trade1h: number;
    tradeHistory1h: number;
    trade1hChangePercent: number;
    buy1h: number;
    buyHistory1h: number;
    buy1hChangePercent: number;
    sell1h: number;
    sellHistory1h: number;
    sell1hChangePercent: number;
    v1h: number;
    v1hUSD: number;
    vHistory1h: number;
    vHistory1hUSD: number;
    v1hChangePercent: number;
    vBuy1h: number;
    vBuy1hUSD: number;
    vBuyHistory1h: number;
    vBuyHistory1hUSD: number;
    vBuy1hChangePercent: number;
    vSell1h: number;
    vSell1hUSD: number;
    vSellHistory1h: number;
    vSellHistory1hUSD: number;
    vSell1hChangePercent: number;
    uniqueWallet1h: number;
    uniqueWalletHistory1h: number;
    uniqueWallet1hChangePercent: number;
    buyUniqueWallet1h: number;
    buyUniqueWalletHistory1h: number;
    buyUniqueWallet1hChangePercent: number;
    sellUniqueWallet1h: number;
    sellUniqueWalletHistory1h: number;
    sellUniqueWallet1hChangePercent: number;

    history6hPrice: number;
    priceChange6hPercent: number;
    trade6h: number;
    tradeHistory6h: number;
    trade6hChangePercent: number;
    buy6h: number;
    buyHistory6h: number;
    buy6hChangePercent: number;
    sell6h: number;
    sellHistory6h: number;
    sell6hChangePercent: number;
    v6h: number;
    v6hUSD: number;
    vHistory6h: number;
    vHistory6hUSD: number;
    v6hChangePercent: number;
    vBuy6h: number;
    vBuy6hUSD: number;
    vBuyHistory6h: number;
    vBuyHistory6hUSD: number;
    vBuy6hChangePercent: number;
    vSell6h: number;
    vSell6hUSD: number;
    vSellHistory6h: number;
    vSellHistory6hUSD: number;
    vSell6hChangePercent: number;
    uniqueWallet6h: number;
    uniqueWalletHistory6h: number;
    uniqueWallet6hChangePercent: number;
    buyUniqueWallet6h: number;
    buyUniqueWalletHistory6h: number;
    buyUniqueWallet6hChangePercent: number;
    sellUniqueWallet6h: number;
    sellUniqueWalletHistory6h: number;
    sellUniqueWallet6hChangePercent: number;

    history24hPrice: number;
    priceChange24hPercent: number;
    trade24h: number;
    tradeHistory24h: number;
    trade24hChangePercent: number;
    buy24h: number;
    buyHistory24h: number;
    buy24hChangePercent: number;
    sell24h: number;
    sellHistory24h: number;
    sell24hChangePercent: number;
    v24h: number;
    v24hUSD: number;
    vHistory24h: number;
    vHistory24hUSD: number;
    v24hChangePercent: number;
    vBuy24h: number;
    vBuy24hUSD: number;
    vBuyHistory24h: number;
    vBuyHistory24hUSD: number;
    vBuy24hChangePercent: number;
    vSell24h: number;
    vSell24hUSD: number;
    vSellHistory24h: number;
    vSellHistory24hUSD: number;
    vSell24hChangePercent: number;
    uniqueWallet24h: number;
    uniqueWalletHistory24h: number;
    uniqueWallet24hChangePercent: number;
    buyUniqueWallet24h: number;
    buyUniqueWalletHistory24h: number;
    buyUniqueWallet24hChangePercent: number;
    sellUniqueWallet24h: number;
    sellUniqueWalletHistory24h: number;
    sellUniqueWallet24hChangePercent: number;
}

export interface IAMMInfos {
    icon: string;
    website: string;
    source: string;
    address: string;
    symbol: string;
}

export interface ITokenRatings {
    address: string;
    IsFav: boolean;
    wallet: string;
}

export interface IRecentTokens extends ITokenRatings {
    symbol: string;
    logo: string;
}

export interface ITokenTrading {
    address: string;
    date: number;
    order: 'Buy' | 'Sell' | 'Add' | 'Remove';
    usdPrice: number;
    amount: number;
    solAmount: number;
    volumeUSD: number;
    account: string;
    others: string;
    txHash: string;
    token: string;
}

export interface IUserInfo {
    wallet: string;
    deposit_wallet: string;
    sol_balance: number;
    referralCode: string;
    refUsers: string[];
    trxPriority: number;
    expire_limit: number;
}

export interface ITxData {
    wallet: string;
    type: string;
    trx: string;
    amount: number;
    timeStamp: Date
}

export interface IHoldingToken {
    mint: string;
    symbol: string;
    logo: string;
    invest: number;
    remain: number;
    sold: number;
    pnl: number;
}

export interface ILimitOrder {
    order_id?: string,
    order_type: number, //0: buy, 1: sell
    tokenAddress?: string,
    symbol?:string,
    logo?: string,
    created_price?: number,
    created_mcap?: number,
    target_value: number,
    target_price?: number,
    target_mcap?: number,
    amount: number,
    expire: number, //hours
    slippage: number, //%
    status?: number
    trxPriority: number,
    type?: number, //0: TP, 1: SL
    trigger_type: number, //0: price, 1: marketcap
    triggeredAt?: number,
    timeStamp?: number,
    trxId? : string,
}

export interface IOrderFilter {
    active: boolean;
    success: boolean;
    failed: boolean;
    buyDip: boolean;
    stopLoss: boolean;
    takeProfit: boolean;
}

export interface IHoldingFilter {
    remainToken: boolean;
    hidden: boolean;
}