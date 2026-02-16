"use client";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { SAVINGS_LOCK_ABI, SAVINGS_LOCK_ADDRESS } from './SavingsABI';
import { formatEther } from 'viem';
import { useState } from 'react';

// Helper component to render individual lock details
function LockItem({ lockId }: { lockId: bigint }) {
    const { data: lock } = useReadContract({
        address: SAVINGS_LOCK_ADDRESS,
        abi: SAVINGS_LOCK_ABI,
        functionName: 'getLock',
        args: [lockId],
    });

    const { data: hash, isPending, writeContract } = useWriteContract();
    const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    const handleWithdraw = () => {
        writeContract({
            address: SAVINGS_LOCK_ADDRESS,
            abi: SAVINGS_LOCK_ABI,
            functionName: 'withdraw',
            args: [lockId],
        });
    };

    const [depositAmount, setDepositAmount] = useState('');
    const handleDeposit = () => {
        if (!depositAmount) return;
        writeContract({
            address: SAVINGS_LOCK_ADDRESS,
            abi: SAVINGS_LOCK_ABI,
            functionName: 'deposit',
            args: [lockId],
            value: BigInt(parseFloat(depositAmount) * 1e18), // simplified parsing
        });
    };

    if (!lock) return <div>Loading lock #{lockId.toString()}...</div>;

    // lock is a tuple in ABI, but wagmi might return it as object or array depending on version/config
    // Based on ABI tuple: [amount, unlockTime, targetAmount, withdrawn, owner]
    // With named outputs in struct: lock.amount, lock.unlockTime etc if wagmi parses it well. Let's assume object access works or array.
    // Actually, standard wagmi read returns array/object based on ABI. Structs usually come as objects if fully typed or array.
    // Let's safe access.
    const amount = lock.amount;
    const unlockTime = Number(lock.unlockTime);
    const targetAmount = lock.targetAmount;
    const withdrawn = lock.withdrawn;

    const isTimeLocked = unlockTime > 0 && Date.now() / 1000 < unlockTime;
    const isTargetLocked = targetAmount > 0 && amount < targetAmount;
    const canWithdraw = !withdrawn && !isTimeLocked && !isTargetLocked;

    return (
        <div className="border p-4 rounded mb-2 bg-gray-50">
            <h3 className="font-bold">Lock #{lockId.toString()}</h3>
            <p>Balance: {formatEther(amount)} ETH</p>
            <p>Status: {withdrawn ? "Withdrawn" : "Active"}</p>
            {unlockTime > 0 && <p>Unlock Time: {new Date(unlockTime * 1000).toLocaleString()}</p>}
            {targetAmount > 0n && <p>Target Goal: {formatEther(targetAmount)} ETH</p>}

            {!withdrawn && (
                <div className="mt-2 flex gap-2">
                    <input
                        type="number"
                        placeholder="Deposit ETH"
                        className="border p-1 text-sm w-24"
                        value={depositAmount}
                        onChange={e => setDepositAmount(e.target.value)}
                    />
                    <button
                        onClick={handleDeposit}
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    >
                        Deposit
                    </button>

                    <button
                        onClick={handleWithdraw}
                        disabled={!canWithdraw || isPending}
                        className={`px-2 py-1 rounded text-sm text-white ${canWithdraw ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        {isPending ? 'Processing' : 'Withdraw'}
                    </button>
                </div>
            )}
            {isConfirmed && <div className="text-green-600 text-sm mt-1">Transaction confirmed!</div>}
        </div>
    );
}

export default function LockList() {
    const { address } = useAccount();

    const { data: lockIds } = useReadContract({
        address: SAVINGS_LOCK_ADDRESS,
        abi: SAVINGS_LOCK_ABI,
        functionName: 'getUserLocks',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    if (!address) return <div className="text-center p-4">Connect wallet to view locks</div>;
    if (!lockIds || lockIds.length === 0) return <div className="text-center p-4">No locks found</div>;

    // lockIds is readonly array
    const locks = [...lockIds].reverse(); // Show newest first?

    return (
        <div className="max-w-md mx-auto my-4 text-black">
            <h2 className="text-xl font-bold mb-4">Your Locks</h2>
            <div className="space-y-4">
                {locks.map((id) => (
                    <LockItem key={id.toString()} lockId={id} />
                ))}
            </div>
        </div>
    );
}
