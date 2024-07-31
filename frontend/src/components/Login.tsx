import * as React from "react";

interface LoginProps {
  userId: string;
}

const Login: React.FC<LoginProps> = ({ userId }) => {
  const [status, setStatus] = React.useState<string>(
    "Checking login status..."
  );
  const [sessionId, setSessionId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, token } = event.data.pluginMessage;
      if (type === "AUTH_TOKEN") {
        setStatus("Logged in");
        console.log("Received auth token:", token);
      } else if (type === "NO_AUTH") {
        setStatus("Not logged in");
        console.log("No auth token found");
      } else if (type === "PRINT_TOKEN") {
        console.log("Stored auth token:", token);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch("https://freaky-font.com/api/keys", {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: JSON.stringify({ sessionId: userId }),
      });
      const data = await response.json();
      setSessionId(data.sessionId);
      console.log("=====data is:=====", data, "\n===========");
      console.log(sessionId);

      const redirectUrl = `https://freaky-font.com/en/login?sessionId=${data.sessionId}&writeKey=${data.writeKey}`;
      window.open(redirectUrl, "_blank");
    } catch (error) {
      console.error("Error generating keys:", error);
    }
  };

  const handleLogout = () => {
    parent.postMessage({ pluginMessage: { type: "LOGOUT" } }, "*");
  };

  const handlePrintToken = () => {
    parent.postMessage({ pluginMessage: { type: "PRINT_TOKEN" } }, "*");
  };

  const generateKeys = async () => {
    try {
      const response = await fetch("https://freaky-font.com/api/keys", {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: JSON.stringify({ sessionId: userId }),
      });
      const data = await response.json();
      console.log("=====data is:=====", data, "\n===========");
    } catch (error) {
      console.error("Error generating keys:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <p>User ID: {userId}</p>
      <p>{status}</p>
      <button onClick={handleLogin}>Login with Google</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handlePrintToken}>Print Token</button>
      <button onClick={generateKeys}>GenerateKeys</button>
    </div>
  );
};

export default Login;
