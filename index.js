import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = contractBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connectButton.innerHTML = "Connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    connectButton.innerHTML = "Please Install Metamask";
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  const sentValue = ethers.utils.parseEther(ethAmount);
  console.log(`Funding with ${ethAmount} ETH...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: sentValue,
      });
      await listenForTransactionMine(transactionResponse, provider);
      console.log("done");
    } catch (error) {
      console.log(error);
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask";
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining  ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const transaction = await contract.withdraw();
    await listenForTransactionMine(transaction, provider);
    console.log("Funds withdrawn");
  } else {
    console.log("Please connect wallet");
  }
}

async function contractBalance() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const balance = await provider.getBalance(contractAddress);

  console.log(ethers.utils.formatEther(balance));
}
