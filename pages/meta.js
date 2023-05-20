import { useState } from 'react';
import Link from 'next/link';

const MetamaskLogin = ({ userRole, onLogin }) => {
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);

  const connectMetamask = async () => {
    try {
      // check if metamask is installed
      if (window.ethereum) {
        // connect to metamask
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsMetamaskConnected(true);
        // call onLogin function with new user role
        onLogin(userRole);
      } else {
        alert('Please install Metamask to use this feature');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectMetamask = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ 
        method: 'wallet_requestPermissions', 
        params: [{ eth_accounts: {} }], 
        callback: () => {
          setIsMetamaskConnected(false);
          onLogin(null);
        }
      });
    }
  };
  

  const handleLogout = () => {
    disconnectMetamask();
    onLogin(null);
  };

  return (
    <>
      {isMetamaskConnected ? (
        <>
          <p>Metamask connected as {userRole}</p>
         <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link href={`/${userRole}`}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#0070f3',
              color: '#fff',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
            }}
          >
            Login as {userRole}
          </button>
        </Link>
      )}
    </>
  );
};

export default MetamaskLogin;
