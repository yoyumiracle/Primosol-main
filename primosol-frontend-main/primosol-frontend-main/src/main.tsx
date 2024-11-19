import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SkeletonTheme } from 'react-loading-skeleton';

import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.min.css";

import './styles/index.scss'
import PageLayout from './layouts/PageLayout';
import Home from './pages/Home';
import Trade from './pages/Trade';
import NewPairs from './pages/NewPairs';
import Pair from './pages/Pair';
import Trending from './pages/Trending';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Wallets } from './providers/Wallets';
import { WebsocketProvider } from './providers/WebsocketProvider';
import { AppContextProvider } from './providers/AppContext';
import TokenDataProvider from './providers/TokenData';
import TransferFund from './pages/Account/TransferFund';
import LeaderBoard from './pages/LeaderBoard';
import Referral from './pages/Account/Referral';
import Order from './pages/Account/Order';
import Holding from './pages/Account/Holding';

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);
const queryClient = new QueryClient({});

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Wallets>
        <AppContextProvider>
          <TokenDataProvider>
            <WebsocketProvider>
              <BrowserRouter>
                <SkeletonTheme baseColor="#ffffff06" highlightColor="#ffffff10" borderRadius="4px">
                  <Routes>
                    <Route path="/" element={<PageLayout />}>
                      <Route index element={<Home />} />
                      <Route path='/trade' element={<Trade />} />
                      <Route path='/discover' element={<NewPairs />} />
                      <Route path='/pair/:poolAddress' element={<Pair />} />
                      <Route path='/trending' element={<Trending />} />
                      <Route path='/team' element={<LeaderBoard />} />
                      <Route path='/transfer_funds' element={<TransferFund />} />
                      <Route path='/referral' element={<Referral />} />
                      <Route path='/holding' element={<Holding />} />
                      <Route path='/order' element={<Order />} />
                      <Route path='/leaderboard' element={<LeaderBoard />} />
                    </Route>
                  </Routes>
                </SkeletonTheme>
              </BrowserRouter>
            </WebsocketProvider>
          </TokenDataProvider>
        </AppContextProvider>
      </Wallets>
    </QueryClientProvider>
  </StrictMode>,
)
