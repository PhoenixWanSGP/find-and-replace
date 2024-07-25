import * as React from "react";

const Login: React.FC = () => {
  const [status, setStatus] = React.useState<string>(
    "Checking login status..."
  );
  const [readKey, setReadKey] = React.useState<string | null>(null);
  const [writeKey, setWriteKey] = React.useState<string | null>(null);
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

  const handleLogin = () => {
    parent.postMessage({ pluginMessage: { type: "LOGIN" } }, "*");
  };

  const handleLogout = () => {
    parent.postMessage({ pluginMessage: { type: "LOGOUT" } }, "*");
  };

  const handlePrintToken = () => {
    parent.postMessage({ pluginMessage: { type: "PRINT_TOKEN" } }, "*");
  };

  const handleGenerateKeys = async () => {
    try {
      const response = await fetch("https://freaky-font.com/api/keys", {
        method: "POST",
      });
      const data = await response.json();
      setSessionId(data.sessionId);
      setReadKey(data.readKey);
      setWriteKey(data.writeKey);
      console.log("Generated session ID:", data.sessionId);
      console.log("Generated read key:", data.readKey);
      console.log("Generated write key:", data.writeKey);
    } catch (error) {
      console.error("Error generating keys:", error);
    }
  };

  const handleCheckKeys = async () => {
    if (!sessionId) {
      console.error("No session ID found");
      return;
    }
    try {
      const response = await fetch(
        `https://freaky-font.com/api/debug/keys?sessionId=${sessionId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      console.log("Session ID:", data.sessionId);
      console.log("Keys from server:", data.keys);
    } catch (error) {
      console.error("Error checking keys:", error);
    }
  };

  return (
    <div>
      <p>{status}</p>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handlePrintToken}>Print Token</button>
      <button onClick={handleGenerateKeys}>Generate Keys</button>
      <button onClick={handleCheckKeys}>Check Keys</button>
      {sessionId && <p>Session ID: {sessionId}</p>}
      {readKey && <p>Read Key: {readKey}</p>}
      {writeKey && <p>Write Key: {writeKey}</p>}
    </div>
  );
};

export default Login;
