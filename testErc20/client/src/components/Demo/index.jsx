import { useCallback, useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Cta from "./Cta";
import Contract from "./Contract";
import ContractBtns from "./ContractBtns";
import Desc from "./Desc";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

const MyForm = () => {
  const {
    state: { contract, accounts },
  } = useEth();

  const [addressTo, setAddressTo] = useState(
    "0xb8e059e976f33e6469bB2F5E009e95Ab10702cd9" // use azeaze dans mon MetaMask
  );
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);

  const getBalance = useCallback(
    async (account) => {
      const value = await contract.methods
        .balanceOf(account)
        .call({ from: account });
      setBalance(value);
    },
    [contract, setBalance]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("addressTo", addressTo);
    console.log("amount", amount);

    await contract.methods
      .transfer(addressTo, amount)
      .send({ from: accounts[0] });

    await getBalance(accounts[0]);
  };

  useEffect(() => {
    getBalance(accounts[0]);
  }, [contract, accounts, getBalance]);

  return (
    <>
      <p>Connected user: {accounts[0]}</p>
      <p>Amount disponible : {balance} POM</p>

      <form onSubmit={handleSubmit}>
        <p>
          <label>
            Address to&nbsp;
            <input
              type="text"
              name="address_to"
              onChange={(e) => setAddressTo(e.target.value)}
              value={addressTo}
            />
          </label>
        </p>

        <p>
          <label>
            Amount&nbsp;
            <input
              type="text"
              name="address_to"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </label>
        </p>

        <button type="submit">ok</button>
      </form>
    </>
  );
};

function Demo() {
  const { state } = useEth();
  const [value, setValue] = useState("?");

  const { artifact, web3, accounts, networkID, contract } = state;

  const demo = (
    <>
      <Cta />
      <div>
        {/* <pre>
          Contract address:{" "}
          {JSON.stringify(
            {
              artifact,
              // web3,
              accounts,
              networkID,
              // contract,
            },
            null,
            2
          )}
        </pre> */}
      </div>

      <MyForm />

      <div className="contract-container">
        <Contract value={value} />
        <ContractBtns setValue={setValue} />
      </div>
      <Desc />
    </>
  );

  return (
    <div className="demo">
      <Title />
      {!state.artifact ? (
        <NoticeNoArtifact />
      ) : !state.contract ? (
        <NoticeWrongNetwork />
      ) : (
        demo
      )}
    </div>
  );
}

export default Demo;
