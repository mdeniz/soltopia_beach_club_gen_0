import Head from 'next/head'

import { useState } from "react";
import { Toaster } from 'react-hot-toast';
import { useWallet } from "@solana/wallet-adapter-react";
import useCandyMachine from '../hooks/use-candy-machine';
import Header from '../components/header';
import Footer from '../components/footer';
import useWalletBalance from '../hooks/use-wallet-balance';
import { shortenAddress } from '../utils/candy-machine';
import Countdown from 'react-countdown';
import { RecaptchaButton } from '../components/recaptcha-button';

const Home = () => {
  const [balance] = useWalletBalance()
  const [isActive, setIsActive] = useState(false);
  const wallet = useWallet();

  const { isSoldOut, mintStartDate, isMinting, onMint, onMintMultiple, nftsData } = useCandyMachine()

  return (
    <main className="p-5 shadow-md rounded-md">
      <Toaster />
      <Head>
        <title>Minting Soltopia Beach Club Gen 0</title>
        <meta name="description" content="Minting website for Soltopia Beach Club Gen 0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="flex flex-col justify-center items-center flex-1 space-y-3 mt-10">
        <span className="text-purple-500 font-bold text-2xl cursor-default">
          Soltopia Beach Club Gen 0
        </span>

        <span className="text-green-500 font-bold text-xl cursor-default">
          First Presale
        </span>

        <img
          className="rounded-md shadow-lg"
          src={`/soltopian_silhouette_beach.png`}
          height={250}
          width={250}
          alt="Soltopia Beach Club" />


        {!wallet.connected && <span
          className="text-purple-100 font-bold text-xl cursor-default text-center ">
          NOT CONNECTED, PLEASE CLICK SELECT WALLET...
        </span>}

        {wallet.connected &&
          <p className="text-purple-50 font-bold text-lg cursor-default">Address: {shortenAddress(wallet.publicKey?.toBase58() || "")}</p>
        }

        {wallet.connected &&
          <p className="text-purple-50 font-bold text-lg cursor-default">Balance: {(balance || 0).toLocaleString()} SOL</p>
        }

        {wallet.connected && !isSoldOut &&
          <p className="text-purple-50 font-bold text-lg cursor-default">Still {nftsData.itemsRemaining} Soltopians can be minted</p>
        }

        <div className="flex flex-col justify-center items-center">
          {wallet.connected && !isSoldOut && isActive &&
            <button
              className="font-bold text-purple-50 bg-purple-500 hover:bg-purple-700 disabled:opacity-30 p-3 rounded"
              disabled={isMinting || !isActive}
              onClick={onMint}
            >
              <span>
                <img className={isMinting ? 'animate-spin' : 'animate-pulse'} src={`/soltopian_silhouette.png`}/>
                {isMinting ?
                  "Minting..." :
                  "Mint a Soltopian!"
                }
              </span>
            </button>
          }

          {wallet.connected && !isActive &&
            <div
              className="text-sm text-left text-white bg-yellow-500 h-12 flex items-center p-4 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="flex-shrink-0 w-6 h-6 mx-2 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
              <Countdown
                  date={mintStartDate}
                  onMount={({ completed }) => completed && setIsActive(true)}
                  onComplete={() => setIsActive(true)}
                  renderer={renderCounter}
                />
            </div>
          }
          {wallet.connected && isSoldOut &&
            <div
              className="font-bold text-sm text-left text-white bg-red-500 h-12 flex items-center p-4 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-6 h-6 mx-2 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              Sale Finished
            </div>
          }
        </div>
      </div>
    </main>
  );
};

const renderCounter = ({ days, hours, minutes, seconds }: any) => {
  return (
    <span className="text-white font-bold cursor-default">
      Minting will be live in {days} days, {hours} hours, {minutes} minutes, {seconds} seconds
    </span>
  );
};

export default Home;
