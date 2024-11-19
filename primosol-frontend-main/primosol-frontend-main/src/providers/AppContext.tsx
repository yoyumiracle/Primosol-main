import React, { useState, createContext, ReactNode, useContext, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useInfiniteQuery, UseInfiniteQueryResult, InfiniteData, useQuery, UseQueryResult } from "@tanstack/react-query";
import { getHoldingTokens, getLimitOrders, getTxData, getUserInfo } from "../libs/fetches";
import { IHoldingFilter, IHoldingToken, ILimitOrder, IOrderFilter, ITxData, IUserInfo } from "../interface";

interface AppContextType {
  loading: string | Boolean
  setLoading: Function
  isSign: Boolean
  setIsSign: React.Dispatch<React.SetStateAction<boolean>>
  disconnectWallet: () => void
  useUserInfo: () => UseQueryResult<IUserInfo | null, Error>
  useTxData: (filter: string[]) => UseQueryResult<ITxData[] | null, Error>
  useHoldingTokens: (filters: IHoldingFilter) => UseQueryResult<IHoldingToken[] | null, Error>,
  useInfiniteOrdersHistory: (limit: number, filters: IOrderFilter) => 
    UseInfiniteQueryResult<InfiniteData<{ hasNext: boolean; nextCursor: number; items: ILimitOrder[] }, unknown>, Error>,
  priority: number
  slippage: number
  setPriority: Function
  setSlippage: Function
}

const initialState: AppContextType = {
  loading: false,
  setLoading: () => {},
  isSign: false,
  setIsSign: () => {},
  disconnectWallet: () => {},
  useUserInfo: () => ({} as UseQueryResult<IUserInfo | null, Error>),
  useTxData: () => ({} as UseQueryResult<ITxData[] | null, Error>),
  useHoldingTokens: () => ({} as UseQueryResult<IHoldingToken[] | null, Error>),
  useInfiniteOrdersHistory: () => 
    ({} as UseInfiniteQueryResult<InfiniteData<{ hasNext: boolean; nextCursor: number; items: ILimitOrder[] }, unknown>, Error>),
  priority: 0,
  slippage: 0,
  setPriority: () => {},
  setSlippage: () => {},
};

const AppContext = createContext<AppContextType>(initialState);

export const useAccountInfo = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAccountInfo must be used within a AccountInfoProvider');
  }
  return context;
};

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<string | Boolean>(false);
  const [isSign, setIsSign] = useState(false);
  const { publicKey, disconnect, connected } = useWallet();

  const [priority, setPriority] = useState<number>(0.001);
  const [slippage, setSlippage] = useState<number>(20);

  const disconnectWallet = async () => {
    disconnect();
    localStorage.removeItem('token');
  };

  const useUserInfo = () => {
    return useQuery<IUserInfo | null>({
      queryKey: ['USERINFO', publicKey, isSign],
      queryFn: () => (publicKey && isSign ? getUserInfo() : Promise.resolve(null)),
    });
  }

  const useTxData = (filter: string[]) => { //'deposit' | 'withdraw' | 'swap'
    return useQuery<ITxData[] | null>({
      queryKey: ['TxData', publicKey, isSign],
      queryFn: () => (publicKey && isSign ? getTxData(filter) : Promise.resolve([])),
    });
  }

  const useHoldingTokens = (filters: IHoldingFilter) => { //'deposit' | 'withdraw' | 'swap'
    return useQuery<IHoldingToken[] | null>({
      queryKey: ['HoldingTokens', publicKey, isSign],
      queryFn: () => (publicKey && isSign ? getHoldingTokens(filters) : Promise.resolve([])),
    });
  }

  const fetchOrders = async (limit: number, filters: IOrderFilter, offset: number): Promise<{ hasNext: boolean; nextCursor: number; items: ILimitOrder[] }> => {
    const data = await getLimitOrders(offset, limit, filters);
    let orders: any = {}
    if (data) {
      orders.items = data
      if (data.length > 0) {
        orders.hasNext = true
        orders.nextCursor = offset + 1;
      }
    } else {
      orders.items = []
      orders.hasNext = false
      orders.nextCursor = offset
    }
    return orders;
  };

  const useInfiniteOrdersHistory = (limit = 20, filters: IOrderFilter) => {
    return useInfiniteQuery<{ hasNext: boolean; nextCursor: number; items: ILimitOrder[] }>({
      queryKey: ['LimitOrder', publicKey, isSign],
      queryFn: async ({ pageParam }) => await fetchOrders(limit, filters, pageParam as number),
      initialPageParam: 0,
      getNextPageParam: lastPage => lastPage.nextCursor ?? false,
      refetchOnWindowFocus: false,
    });
  };

  return (
    <AppContext.Provider
      value={{
        loading: loading,
        setLoading: setLoading,
        isSign,
        setIsSign,
        disconnectWallet,
        useUserInfo,
        useTxData,
        useHoldingTokens,
        useInfiniteOrdersHistory,
        priority,
        setPriority,
        slippage,
        setSlippage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
