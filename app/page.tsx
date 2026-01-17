"use client";
import styles from "./page.module.css";
import { Wallet, ConnectWallet, WalletDropdown, WalletDropdownLink, WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet";
import { Identity, Avatar, Name, Address, EthBalance } from "@coinbase/onchainkit/identity";
import CreateLock from "./components/CreateLock";
import LockList from "./components/LockList";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <div className="flex justify-between w-full p-4">
          <h1 className="text-2xl font-bold">Hold</h1>
          <Wallet>
            <ConnectWallet>
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
                Wallet
              </WalletDropdownLink>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </header>

      <main className={styles.content + " flex flex-col gap-8"}>
        <div className="w-full max-w-2xl bg-white/10 p-6 rounded-xl">
          <p className="mb-4 text-center">
            Lock your funds for a specific time or until a target amount is reached.
            <br />
            <b>Self-custodial. Immutable. Secure.</b>
          </p>

          <CreateLock />

          <div className="my-8 border-t border-gray-600" />

          <LockList />
        </div>
      </main>
    </div>
  );
}
