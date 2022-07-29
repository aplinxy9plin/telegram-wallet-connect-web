import "./styles.css";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3'

//  Create WalletConnect Provider

const connect = async () => {
  const provider = new WalletConnectProvider({
    infuraId: "6860c8330f19440e8fc89a8724780538" // Required
  });

  //  Enable session (triggers QR Code modal)
  await provider.enable();

  console.log("Provider: ", provider);
  return provider
  // window.Telegram.WebApp.sendData(JSON.stringify(provider.accounts));
};

// connect();

const testFunc = () => {
  connect()
  // window.Telegram.WebApp.sendData("GAVNO");
}

const init = async () => {
  if(window.location.search.includes("?data=")) {
    const data = JSON.parse(window.decodeURIComponent(window.location.search.split("?data=")[1]))
    if(data?.type){
      const provider = await connect()
      const web3 = new Web3(provider)
      switch (data.type) {
        case "eth_sendTransaction":
          data.params.from = provider.accounts[0]
          try {
            const text = document.createElement("h1")
            text.innerText = "Sending transaction..."
            document.body.appendChild(text)
            await web3.eth.sendTransaction(data.params)
            window.Telegram.WebApp.sendData(JSON.stringify({
              type: "send_tx",
              accounts: provider.accounts,
              textData: "Transaction sent"
            }));
          } catch (error) {
            window.Telegram.WebApp.sendData(JSON.stringify({
              type: "send_tx",
              accounts: provider.accounts,
              error: error.message
            }));
          }
          break;
        default:
          break;
      }
    }
  }else{
    try {
      const provider = await connect()
      window.Telegram.WebApp.sendData(JSON.stringify({
        type: "get_balance",
        accounts: provider.accounts,
      }));
    } catch (error) {
      window.Telegram.WebApp.sendData(JSON.stringify({
        type: "get_balance",
        error: error.message
      }));
    }
  }
}

init()