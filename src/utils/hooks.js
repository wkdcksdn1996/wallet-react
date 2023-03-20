import {useWeb3React} from "@web3-react/core";
import {injected} from  "./connectors";
import {useState, useEffect, useCallback} from "react";

export function Hooks(){
  const {activate, active} = useWeb3React();
  const [tried, setTried] = useState();

  const tryActivate = useCallback(() =>{
    async function _tryActivate(){
      const isAuthrized = await injected.isAuthorized();

      if(isAuthrized){
        try {
          await activate(injected, undefined, true)
        }catch(error){
          window.alert('Error : ' + (error && error.message))
        }
      }
      setTried(true);
    }
    _tryActivate();
  },[activate]);

  useEffect(()=>{
    tryActivate()
  },[tryActivate])

  useEffect(()=>{
    if(!tried && active){
      setTried(true)
    }
  },[tried, active])

  return tried
}

export function useInactiveListener(suppress = false){
  const {active, error, activate} = useWeb3React()

  useEffect(()=>{
    const {ethereum} = window;

    if(ethereum && ethereum.on && !active && !error && !suppress){

      const handleConnect = () =>{
        console.log('handle connect');
        activate(injected);
      }
      const handleChainChanged = (chainId) =>{
        console.log('handle chain changed', chainId)
        activate(injected);
      }
      const handleAccountChanged  = (accounts) =>{
        console.log('handle account changed', accounts);
        if(accounts.length > 0){
          activate(injected);
        }
      }

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountChanged', handleAccountChanged);

      return () =>{
        if(ethereum.removeListener){
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountChanged', handleAccountChanged);
        }
      }
    }

  },[active, error, suppress, activate]) }