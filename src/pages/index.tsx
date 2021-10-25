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
        <title>Solana Candy Factory</title>
        <meta name="description" content="Solana blockchain candy machine app boilerplate on top of Metaplex Candy Machine. NextJS, Tailwind, Anchor, SolanaLabs.React, dev/mainnet automation scripts." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="flex flex-col justify-center items-center flex-1 space-y-3 mt-20">
        <img
          className="rounded-md shadow-lg"
          src={`/candy.jpeg`}
          height={200}
          width={200}
          alt="Candy Image" />

        <span className="text-primary-500 font-bold text-2xl cursor-default">
          Soltopia Beach Club Gen 0
        </span>

        {!wallet.connected && <span
          className="text-primary-100 font-bold text-2xl cursor-default text-center ">
          NOT CONNECTED, PLEASE CLICK SELECT WALLET...
        </span>}

        {wallet.connected &&
          <p className="text-primary-50 font-bold text-lg cursor-default">Address: {shortenAddress(wallet.publicKey?.toBase58() || "")}</p>
        }

        {wallet.connected &&
          <>
            <p className="text-primary-50 font-bold text-lg cursor-default">Balance: {(balance || 0).toLocaleString()} SOL</p>
            <p className="text-primary-50 font-bold text-lg cursor-default">Available/Minted/Total: {nftsData.itemsRemaining}/{nftsData.itemsRedeemed}/{nftsData.itemsAvailable}</p>
          </>
        }

        <div className="flex flex-col justify-center items-center">
          {wallet.connected &&
            <button
              className="text-primary-50 bg-primary-500 hover:bg-primary-700 p-3 rounded"
              actionName="mint"
              disabled={isSoldOut || isMinting || !isActive}
              onClick={onMint}
            >
              {isSoldOut ? (
                "SOLD OUT"
              ) : isActive ?
                <span className="items-center">MINT A SOLTOPIAN {isMinting && <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2"></div>}</span> :
                <Countdown
                  date={mintStartDate}
                  onMount={({ completed }) => completed && setIsActive(true)}
                  onComplete={() => setIsActive(true)}
                  renderer={renderCounter}
                />
              }
            </button>
          }

        </div>
      </div>
    </main>
  );
};

const renderCounter = ({ days, hours, minutes, seconds }: any) => {
  return (
    <span className="text-white font-bold text-2xl cursor-default">
      Live in {days} days, {hours} hours, {minutes} minutes, {seconds} seconds
    </span>
  );
};

export default Home;
