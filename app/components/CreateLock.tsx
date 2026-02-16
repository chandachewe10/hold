"use client";
import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { SAVINGS_LOCK_ABI, SAVINGS_LOCK_ADDRESS } from './SavingsABI';

export default function CreateLock() {
    const [unlockDate, setUnlockDate] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [initialDeposit, setInitialDeposit] = useState('');

    const { data: hash, isPending, writeContract } = useWriteContract();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Convert date to timestamp
        const timestamp = unlockDate ? Math.floor(new Date(unlockDate).getTime() / 1000) : 0;
        // Convert ETH to wei
        const amountWei = targetAmount ? parseEther(targetAmount) : BigInt(0);
        const depositWei = initialDeposit ? parseEther(initialDeposit) : BigInt(0);

        writeContract({
            address: SAVINGS_LOCK_ADDRESS,
            abi: SAVINGS_LOCK_ABI,
            functionName: 'createLock',
            args: [BigInt(timestamp), amountWei],
            value: depositWei,
        });
    };

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash });

    return (
        <div className="p-4 border rounded-lg shadow-md bg-white text-black max-w-md mx-auto my-4">
            <h2 className="text-xl font-bold mb-4">Create Savings Lock</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Initial Deposit (ETH)</label>
                    <input
                        type="number"
                        step="0.0001"
                        value={initialDeposit}
                        onChange={(e) => setInitialDeposit(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                        placeholder="0.1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Unlock Date (Optional)</label>
                    <input
                        type="datetime-local"
                        value={unlockDate}
                        onChange={(e) => setUnlockDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Target Amount (ETH) (Optional)</label>
                    <input
                        type="number"
                        step="0.0001"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                        placeholder="1.0"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending || isConfirming}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {isPending ? 'Confirming...' : isConfirming ? 'Waiting for Receipt...' : 'Create Lock'}
                </button>

                {isConfirmed && <div className="text-green-600 mt-2">Lock created successfully!</div>}
            </form>
        </div>
    );
}
