

import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { LinkIdentity_CONTRACT_ADDRESS, abi } from "../constants";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [verifyTwitter, setverifyTwitter] = useState(false);
  const [twitterProfile, setTwitterProfile] = useState();
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();


  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Polygon Mumbai Testnet");
      throw new Error("Change network to Polygon Mumbai Testnet");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  
  const verifyTwitterAccount = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      const TwitterVerifyContract = new Contract(
        LinkIdentity_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const tx = await TwitterVerifyContract.LinkYourAddressToTwitter(session.user.name, {
        gasLimit: 100000,
      });
      setverifyTwitter(true);
      // wait for the transaction to get mined
      await tx.wait(5);
    } catch (err) {
      console.error(err);
    }
  };

  const showverifiedTwitterAccount = async () => {
    try{
      const signer = await getProviderOrSigner(true);
      const TwitterVerifyContract = new Contract(
        LinkIdentity_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const address = await signer.getAddress();
      const readTwitterAddress = await TwitterVerifyContract.showLinkedCredentialsTwitter(address);
      setTwitterProfile(readTwitterAddress)
      console.log(`github account linked is https://github.com/${twitterProfile}`)
    }
    catch(err){
      console.log(err);
    }
  }

  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
    if (walletConnected) {
      if (verifyTwitter) {
        return (
          <div>
          <div className={styles.description}>
            You have successfully linked your Github account to your wallet address!
            Your twitter account is https://github.com/{twitterProfile}
          </div>
          <div></div>
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Your transaction is getting mined. This might take a few seconds</button>;
      } else {
        return (
          <div><button onClick={verifyTwitterAccount} className={styles.button}>
          Connect twitter account
        </button>
        <button onClick={showverifiedTwitterAccount} className={styles.button}>
          check your twitter account 
        </button>
        <div>

        </div>
        </div>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);


  const { data: session } = useSession()
  if(session) {
    return <>
      Signed in as {session.user.name} <br/>
      <button onClick={() => signOut()}>Sign out</button>
      <div>{renderButton()}</div>  
    </>
  }

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Verse</h1>
          <div className={styles.description}>
          </div>
          <div className={styles.description}>
          </div>
        </div>
        Not signed in <br/>
        <button onClick={() => signIn()}>Sign in</button>
      </div>

      
    </div>
  );
}