import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";

// import thirdweb
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

// select which chains we are supporting ( rinkby = 4 )
const supportedChainIds = [4];

// include type of wallet to support 
// metamask aka 'injected-wallet'
const connectors = {
  injected: {},
}
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
    connectors={connectors}
    supportedChainIds={supportedChainIds}>
    <div className="landing">
      <App />
    </div>
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
