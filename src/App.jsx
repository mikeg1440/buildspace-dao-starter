import { useEffect, useMemo, useState } from 'react';
import SnorlaxImage from './images/snorlax.png';

import { useWeb3 } from '@3rdweb/hooks';

const App = () => {

  const { connectWallet, address, error, provider } = useWeb3();
  console.info('+ Address: ' + address);
  
  if (!address){
    return (
      <div className="landing">
        <img src={SnorlaxImage} alt="Snorlax Icon" style={{ width: '60%', margin: 'auto' }} />
        <h1>Welcome to <span className="color-header">PokéDAO</span></h1>
        <button onClick={() => connectWallet('injected')} className='btn-hero'>
          Connect to wallet
        </button>
      </div>
    );  
  }
  
  return (
  <div className="landing">
    <h1>Wallet connected!</h1>
  </div>
  )
};

export default App;
