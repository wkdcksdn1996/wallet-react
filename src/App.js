import {useWeb3React} from '@web3-react/core';
import {injected } from "./lib/connectors";
import './App.css';
import {useEffect, useState} from "react";
import { ethers } from "ethers";
function App() {
  const {
    chainId,
    account,
    active,
    activate,
    deactivate,
    library,
    connector
    } = useWeb3React();
  const [balance, setBalance] = useState('');

  const connectWallet = async () => {
    // const block = await provider.getBlockNumber()
    try {
      await activate(injected, (error) => {
        // 크롬 익스텐션 없을 경우 오류 핸들링
        if ('/No Ethereum provider was found on window.ethereum/')
          throw new Error('Metamask 익스텐션을 설치해주세요');
      });
    } catch (err) {
      alert(err);
      window.open('https://metamask.io/download.html');
    }
  };

  useEffect(() => {
    if (account) {
      library
        ?.getBalance(account)
        .then((result) => setBalance(result._hex));
    }
    // if (active){
    //   deactivate();
    //   return
    // }
  }, [account, library]);

  return (
    <div className="App">
      <div>
        <p>Account : {account}</p>
        <p>ChainId : {chainId}</p>
      </div>
      <div>
        <button onClick={connectWallet}>{active ? 'disconnect' : 'connect'}</button>
        <h1>{balance && Number().toFixed(4)}
          ETH
        </h1>
        <p>{balance}</p>
        <p>{active}</p>

      </div>
    </div>
  );
}

export default App;
