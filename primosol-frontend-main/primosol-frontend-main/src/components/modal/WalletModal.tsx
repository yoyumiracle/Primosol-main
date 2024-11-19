import React, { useEffect } from "react";
import Modal from ".";
import ActionButton from "../buttons/ActionButton";
import { ArrowRightStartOnRectangleIcon, ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccountInfo } from "../../providers/AppContext";
import { copyToClipboard, shortenAddress } from "../../libs/utils";
import { Adapter } from "@solana/wallet-adapter-base";
import { requestMessage, verify } from "../../libs/fetches";
import { Header, Payload, SIWS } from "@web3auth/sign-in-with-solana";
import bs58 from 'bs58'
import { setAuthToken } from "../../libs/api";

interface WalletModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect?: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ open, setOpen }) => {
  const { select, wallets, publicKey, connected, signMessage, connect, wallet } = useWallet();
  const { setIsSign, disconnectWallet } = useAccountInfo();

  const handleWalletConnect = async (walletAdapter: Adapter) => {
    try {
      select(walletAdapter.name);
      setOpen(false)
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  useEffect(() => {
    const getJWTToken = async () => {
      if (publicKey) {
        const domain = window.location.host;
        const origin = window.location.origin;
        const referral = localStorage.getItem('referral');
        const data = await requestMessage(publicKey.toString());
        const payload = new Payload();
        payload.domain = domain;
        payload.address = publicKey.toString();
        payload.uri = origin;
        if (data) {
          payload.statement = data.statement;
          payload.version = data.version;

          const header = new Header();
          header.t = 'sip99';
          let message = new SIWS({ header, payload });
          const messageText = message.prepareMessage();
          const messageEncoded = new TextEncoder().encode(messageText);
          signMessage!(messageEncoded)
            .then(async resp => {
              const sign = bs58.encode(resp);
              const data = await verify(sign, message.payload, referral ? referral : '');
              if (data) {
                const now = new Date().getTime().toString();
                setAuthToken(data)
                localStorage.setItem('token', data);
                localStorage.setItem('auth-time', now);
                localStorage.removeItem('referral');
                setIsSign(true);
              }
            })
            .catch(error => {
              disconnectWallet();
            });
        }
      }
    };
    let token = localStorage.getItem('token');
    const startTime = localStorage.getItem('auth-time');
    if (startTime) {
      const dur = new Date().getTime() - Number(startTime);
      if (dur > 24 * 60 * 60 * 1000) {
        token = null;
      }
    } else {
      token = null;
    }

    setIsSign(!!token);
    if (publicKey && !token) {
      getJWTToken();
    } else if (!connected) {
      setIsSign(false);
    }
  }, [connected]);

  const handleCopyAddress = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (publicKey) {
      copyToClipboard(publicKey?.toBase58(), () => {
        toast.success("Address copied");
      });
    }
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDisconnect = (event: React.MouseEvent<HTMLButtonElement>) => {
    disconnectWallet();
    setOpen(false);
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Modal
      isOpen={open}
      closeModal={() => {
        setOpen(false);
      }}
      title="Connect Wallet"
    >
      <hr className="my-3 text-light-gray" />
      <div className="grid grid-cols-1 gap-4 my-2 mt-6 rounded-sm">
        {wallets.filter(wallet => wallet.readyState === 'Installed').length > 0 ? (
          <>
            {wallets
              .filter(wallet => wallet.readyState === 'Installed')
              .map((item, index) => (
                <div
                  className={`flex items-center p-3 transition-all rounded-md cursor-pointer hover:bg-semi-white active:scale-[98%] select-none gap-2 ${connected && wallet?.adapter.name === item?.adapter.name ? "bg-mid-gray border border-light-gray" : ""}`}
                  onClick={() => {
                    handleWalletConnect(item.adapter)
                  }}
                  key={index}
                >
                  <img src={item?.adapter.icon} className="w-10 h-10" />
                  <span className="flex-grow text-white">
                    {" "}
                    {connected && wallet?.adapter.name === item?.adapter.name ? shortenAddress(publicKey?.toBase58()) : item?.adapter.name}{" "}
                  </span>
                  {connected && wallet?.adapter.name === item?.adapter.name ? (
                    <>
                      <ActionButton className="border-none bg-transparent !p-0" onClick={handleCopyAddress}>
                        <ClipboardDocumentIcon className="size-5" />
                      </ActionButton>
                      <ActionButton className="border-none bg-transparent !p-0" onClick={handleDisconnect}>
                        <ArrowRightStartOnRectangleIcon className="size-5" />
                      </ActionButton>
                    </>
                  ) : null}
                </div>
              ))}
          </>
        ) : (
          <div></div>
        )}
      </div>
    </Modal>
  );
};

export default WalletModal;
