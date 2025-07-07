// Location: src/components/Auth.tsx
'use client'

import { useAccount, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { useState } from 'react'
import { useWeb3Modal } from '@web3modal/wagmi/react'

export const AuthComponent = () => {
    const { address, chainId, isConnected } = useAccount()
    const { open } = useWeb3Modal()
    const { signMessageAsync } = useSignMessage()
    const [signInState, setSignInState] = useState<'idle' | 'signing' | 'verifying' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignIn = async () => {
        setSignInState('signing');
        setErrorMessage('');
        try {
            // 1. Get nonce from our backend
            const nonceRes = await fetch('/api/auth/nonce');
            if (!nonceRes.ok) throw new Error("Failed to fetch nonce.");
            const { nonce } = await nonceRes.json();

            // 2. Create SIWE message
            const message = new SiweMessage({
                domain: window.location.host,
                address: address,
                statement: 'Sign in with Ethereum to the DeFi Intelligence Hub.',
                uri: window.location.origin,
                version: '1',
                chainId: chainId,
                nonce: nonce
            });

            // 3. User signs message
            const signature = await signMessageAsync({ 
                message: message.prepareMessage() 
            });

            // 4. Verify signature on our backend
            setSignInState('verifying');
            const verifyRes = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, signature }),
            });
            
            if (!verifyRes.ok) {
                const { error } = await verifyRes.json();
                throw new Error(error || "Error verifying signature.");
            }

            setSignInState('success');
            // In a real app, we'd now have a session and could redirect
            // e.g., window.location.href = '/dashboard';
        } catch (error: any) {
            console.error('Sign in failed:', error);
            setSignInState('error');
            setErrorMessage(error.message);
        }
    };

    const getButtonState = () => {
        if (!isConnected) {
            return <button onClick={() => open()} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md">Connect Wallet</button>;
        }
        switch (signInState) {
            case 'signing':
                return <button disabled className="w-full bg-yellow-600 text-white font-bold py-3 px-4 rounded-md">Check Wallet...</button>;
            case 'verifying':
                return <button disabled className="w-full bg-yellow-600 text-white font-bold py-3 px-4 rounded-md">Verifying...</button>;
            case 'success':
                return <div className="text-green-400 font-bold">Sign-In Successful!</div>;
            case 'error':
                return <button onClick={handleSignIn} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md">Try Again</button>;
            default:
                return <button onClick={handleSignIn} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md">Sign-In with Ethereum</button>;
        }
    };

    return (
        <div className="p-8 bg-gray-800 rounded-lg text-center w-full max-w-sm">
            <h2 className="text-2xl font-bold text-center mb-6 text-white">Authenticate</h2>
            <div className="min-h-[60px] flex items-center justify-center">
                {getButtonState()}
            </div>
            {errorMessage && <p className="text-red-400 text-sm mt-2">{errorMessage}</p>}
        </div>
    );
};