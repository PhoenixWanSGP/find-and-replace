import * as React from "react";

interface LoginProps {
  userId: string;
  sessionId: string | null;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  readKey: string | null;
  setReadKey: React.Dispatch<React.SetStateAction<string | null>>;
  writeKey: string | null;
  setWriteKey: React.Dispatch<React.SetStateAction<string | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const Login: React.FC<LoginProps> = ({
  userId,
  sessionId,
  setSessionId,
  readKey,
  setReadKey,
  writeKey,
  setWriteKey,
  token,
  setToken,
}) => {
  // const [status, setStatus] = React.useState<string>(
  //   "Checking login status..."
  // );
  const pollInterval = 5000; // 轮询间隔（毫秒）
  const timeoutDuration = 60000; // 超时时间（毫秒）

  // 使用轮询来持续检查 token
  const checkToken = async () => {
    if (!readKey || !sessionId) {
      console.log("Missing sessionId or readKey, skipping checkToken.");
      return false; // 表示未进行轮询
    }

    try {
      const response = await fetch("https://freaky-font.com/api/token", {
        method: "POST",
        body: JSON.stringify({ sessionId, readKey }),
      });
      const data = await response.json();

      if (data.token) {
        setToken(data.token);
        // setStatus("Logged in");
        console.log("Token acquired:", data.token);

        // 发送 LOGIN 消息到插件主线程
        parent.postMessage(
          {
            pluginMessage: {
              type: "LOGIN", // 消息类型
              payload: {
                token: data.token, // 将 token 放在 payload 中
              },
            },
          },
          "*"
        );

        return true; // 表示成功获取 token
      } else {
        console.log("No token found, retrying...");
        return false; // 表示未获取到 token
      }
    } catch (error) {
      console.error("Error checking token:", error);
      return false; // 表示未获取到 token
    }
  };

  // 启动轮询逻辑
  const startPolling = () => {
    // setStatus("Attempting to retrieve token...");

    const intervalId = setInterval(async () => {
      const tokenAcquired = await checkToken();
      if (tokenAcquired) {
        clearInterval(intervalId);
      }
    }, pollInterval);

    // 超时处理
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      // setStatus("Token retrieval timed out.");
      console.log("Failed to acquire token within the time limit.");
    }, timeoutDuration);

    // 清理计时器
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  };

  React.useEffect(() => {
    if (!token && readKey && sessionId) {
      // 确保 readKey 和 sessionId 都存在
      const cleanup = startPolling();
      return cleanup;
    }
  }, [readKey, sessionId, token]);

  const handleLogin = async () => {
    try {
      const response = await fetch("https://freaky-font.com/api/keys", {
        method: "POST",
        body: JSON.stringify({ sessionId: `figma_${userId}` }),
      });
      const data = await response.json();
      setSessionId(data.sessionId);
      setWriteKey(data.writeKey);
      setReadKey(data.readKey);
      setToken(null); // 将 token 设置为 null
      console.log("=====data is:=====", data, "\n===========");

      const redirectUrl = `https://freaky-font.com/en/login?sessionId=${data.sessionId}&writeKey=${data.writeKey}`;
      window.open(redirectUrl, "_blank");
    } catch (error) {
      console.error("Error generating keys:", error);
    }
  };

  const handleLogout = () => {
    setToken(null); // 清除 token 状态
    // setStatus("Not logged in"); // 更新状态为未登录
    parent.postMessage({ pluginMessage: { type: "LOGOUT" } }, "*");
  };

  // 新增函数用于打印当前的 sessionId、readKey、writeKey 和 token
  const handlePrintCurrentState = () => {
    console.log("Current State:");
    console.log("Session ID:", sessionId);
    console.log("Read Key:", readKey);
    console.log("Write Key:", writeKey);
    console.log("Token:", token);
  };
  const handlePrintUserInfo = async () => {
    try {
      const response = await fetch(
        "https://freaky-font.com/api/token-to-user",
        {
          method: "POST",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          body: JSON.stringify({ sessionId, token }),
        }
      );

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }

      const data = await response.json();

      if (data.error) {
        console.error("Error retrieving user info:", data.error);
      } else {
        const userInfo = data.userInfo;
        console.log("====User Info====");
        console.log(`UUID: ${userInfo.uuid}`);
        console.log(`Email: ${userInfo.email}`);
        console.log(
          `Created At: ${new Date(userInfo.created_at).toLocaleString()}`
        );
        console.log(`Nickname: ${userInfo.nickname}`);
        console.log(`Avatar URL: ${userInfo.avatar_url}`);
        console.log(`Locale: ${userInfo.locale || "Not specified"}`);
        console.log(`Sign-in Type: ${userInfo.signin_type}`);
        console.log(`Sign-in IP: ${userInfo.signin_ip || "Not specified"}`);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  return (
    <div className="flex flex-col">
      {/* <p>User ID: {userId}</p> */}
      {/* <p>Token:{token}</p> */}
      {/* <p>{status}</p> */}
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
      {/* <button onClick={handlePrintToken}>Print Token</button>
      <button onClick={generateKeys}>GenerateKeys</button> */}
      {/* 新增按钮 */}
      <button onClick={handlePrintCurrentState}>Print Current State</button>
      <button onClick={handlePrintUserInfo}>Print User Info</button>
      {/* 新增按钮用于主动发起 checkToken 请求 */}
      {/* <button onClick={checkToken}>Check Token</button> */}
    </div>
  );
};

export default Login;
