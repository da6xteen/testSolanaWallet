import React, { FC, useMemo, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, Keypair } from '@solana/web3.js';

const WalletContent: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [balance, setBalance] = useState<number | null>(null);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [newWallet, setNewWallet] = useState<string | null>(null);

    useEffect(() => {
        if (!publicKey) {
            setBalance(null);
            return;
        }

        const fetchBalance = async () => {
            const bal = await connection.getBalance(publicKey);
            setBalance(bal / LAMPORTS_PER_SOL);
        };

        fetchBalance();
        const id = connection.onAccountChange(publicKey, (account) => {
            setBalance(account.lamports / LAMPORTS_PER_SOL);
        });

        return () => {
            connection.removeAccountChangeListener(id);
        };
    }, [publicKey, connection]);

    const handleSend = async () => {
        if (!publicKey || !recipient || !amount) return;

        try {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(recipient),
                    lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
                })
            );

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'processed');
            alert('Transaction successful! Signature: ' + signature);
        } catch (error) {
            console.error(error);
            alert('Transaction failed: ' + (error as any).message);
        }
    };

    const createLocalWallet = () => {
        const kp = Keypair.generate();
        setNewWallet(`Public Key: ${kp.publicKey.toBase58()}\nSecret Key: [${kp.secretKey.toString()}]`);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                <WalletMultiButton />
                <WalletDisconnectButton />
            </div>

            {publicKey && (
                <div className="card">
                    <p>Connected: {publicKey.toBase58()}</p>
                    <p>Balance: {balance !== null ? `${balance} SOL` : 'Loading...'}</p>

                    <div style={{ marginTop: '20px' }}>
                        <h3>Transfer SOL</h3>
                        <input
                            placeholder="Recipient Address"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                        />
                        <input
                            placeholder="Amount (SOL)"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button onClick={handleSend}>Send SOL</button>
                    </div>
                </div>
            )}

            <div className="card">
                <h3>Create New Solana Wallet (Keypair)</h3>
                <button onClick={createLocalWallet}>Generate Keypair</button>
                {newWallet && (
                    <pre style={{ textAlign: 'left', background: '#333', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
                        {newWallet}
                    </pre>
                )}
            </div>
        </div>
    );
};

const App: FC = () => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], [network]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <h1>Solana Wallet App</h1>
                    <WalletContent />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
