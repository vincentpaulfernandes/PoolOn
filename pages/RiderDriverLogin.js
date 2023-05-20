import { useState } from 'react';
import MetamaskLogin from './meta';

const RiderDriverLogin = () => {
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (newUserRole) => {
    setUserRole(newUserRole);
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      backgroundColor: "#212121", 
      color: "#fff", 
      height: "100vh"
    }}>
      <div style={{ 
        width: "100%", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "20px 40px",
        backgroundColor: "#0070f3",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1
      }}>
        <h1 style={{ 
          fontFamily: "Arial", 
          fontWeight: "bold", 
          fontSize: "3rem",
          color: "#fff",
          margin: 0,
          padding: 0
        }}>PoolUs</h1>
        <nav style={{ display: "flex" }}>
        <a href="#" style={{ color: "#fff", textDecoration: "none", marginRight: "20px" }} onClick={() => window.location.reload()}>Home</a>
          <a href="#" style={{ color: "#fff", textDecoration: "none" }}>About</a>
        </nav>
      </div>
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "100px"
      }}>
        {userRole === null ? (
          <>
            <h2 style={{ marginBottom: "20px", fontSize: "2.5rem" }}>Choose your role:</h2>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <button 
                style={{ 
                  margin: "10px", 
                  padding: "20px 40px", 
                  fontSize: "1.5rem", 
                  borderRadius: "5px", 
                  background: "#fff", 
                  color: "#0070f3", 
                  cursor: "pointer" 
                }} 
                onClick={() => handleLogin('rider')}
              >
                Rider
              </button>
              <button 
                style={{ 
                  margin: "10px", 
                  padding: "20px 40px", 
                  fontSize: "1.5rem", 
                  borderRadius: "5px", 
                  background: "#fff", 
                  color: "#0070f3", 
                  cursor: "pointer" 
                }} 
                onClick={() => handleLogin('driver')}
              >
                Driver
              </button>
            </div>
          </>
        ) : userRole === "rider" ? (
          <>
            <h2 style={{ marginBottom: "20px", fontSize: "2.5rem" }}>Continue As Rider</h2>
            {/* render rider component here */}
          </>
        ) : (
          <>
            <h2 style={{ marginBottom: "20px", fontSize: "2.5rem" }}>Continue As driver</h2>
            {/* render driver component here */}
          </>
        )}
        {userRole && (
          <MetamaskLogin
            userRole={userRole}
            onLogin={(newUserRole) => handleLogin(newUserRole)}
          />
        )}
      </div>
    </div>
  );
};

export default RiderDriverLogin;
