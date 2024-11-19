export interface ITokenInfo {
  id: number
  logo: string
  name: string
  symbol: string
  price: number
  priceChange: number
  address: string
  website?: string
  twitter?: string
  telegram?: string
}

export interface IPairInfo {
  id: number
  tokenInfo: ITokenInfo
  poolAddress: string
  dexType: number
  createdAt: number
  liquidity: number
  initialLiquidity: number
  marketCap: number
  txns: number
  volume: number
  buyTax: number
  sellTax: number
  audit: {
    mintAuth: boolean
    freezeAuth: boolean
    lpBurned: boolean
    top10Holders: boolean
  }
}