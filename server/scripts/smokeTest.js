import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");
const serverEntry = path.resolve(projectRoot, "server", "server.js");
const baseUrl = "http://127.0.0.1:5050";
const apiUrl = `${baseUrl}/api`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) {
        return;
      }
    } catch {
      // Server is still starting.
    }

    await wait(1000);
  }

  throw new Error("Server did not become ready in time.");
}

async function request(pathname, options = {}) {
  const response = await fetch(`${apiUrl}${pathname}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${pathname} failed: ${response.status} ${JSON.stringify(data)}`);
  }

  return data;
}

async function run() {
  const server = spawn(process.execPath, [serverEntry], {
    cwd: projectRoot,
    env: {
      ...process.env,
      PORT: "5050",
      JWT_SECRET: "smoke-test-secret",
      USE_IN_MEMORY_DB: "true",
    },
    stdio: "inherit",
  });

  try {
    await waitForServer();

    const alice = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Alice Tester",
        email: "alice@example.com",
        password: "Password123!",
        bio: "Smoke test user",
        skillsOffered: [{ name: "React", level: "Advanced", experience: "3 years" }],
        skillsWanted: ["UI/UX Design"],
      }),
    });

    const bob = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Bob Tester",
        email: "bob@example.com",
        password: "Password123!",
        bio: "Second smoke test user",
        skillsOffered: [{ name: "UI/UX Design", level: "Intermediate", experience: "2 years" }],
        skillsWanted: ["React"],
      }),
    });

    const aliceHeaders = { Authorization: `Bearer ${alice.token}` };
    const bobHeaders = { Authorization: `Bearer ${bob.token}` };

    const profile = await request("/user/profile", { headers: aliceHeaders });
    if (profile.email !== "alice@example.com") {
      throw new Error("Profile response did not contain the registered user.");
    }

    const members = await request("/user", { headers: aliceHeaders });
    if (!members.some((member) => member.email === "bob@example.com")) {
      throw new Error("Members list did not include Bob.");
    }

    const post = await request("/posts", {
      method: "POST",
      headers: aliceHeaders,
      body: JSON.stringify({
        skillWanted: "Figma",
        description: "Looking for UI feedback in exchange for React help.",
      }),
    });

    await request(`/posts/${post.id}/like`, {
      method: "PUT",
      headers: bobHeaders,
    });

    const swap = await request("/swaps", {
      method: "POST",
      headers: aliceHeaders,
      body: JSON.stringify({
        receiverId: bob.user.id,
        skillOffered: "React",
        skillRequested: "UI/UX Design",
        message: "Want to trade React coaching for a portfolio review?",
      }),
    });

    const updatedSwap = await request(`/swaps/${swap.id}`, {
      method: "PUT",
      headers: bobHeaders,
      body: JSON.stringify({ status: "accepted" }),
    });

    if (updatedSwap.status !== "accepted") {
      throw new Error("Swap status did not update to accepted.");
    }

    const notifications = await request("/notifications", { headers: aliceHeaders });
    if (!Array.isArray(notifications) || notifications.length === 0) {
      throw new Error("Expected at least one notification for Alice.");
    }

    console.log("Smoke test passed");
  } finally {
    server.kill("SIGTERM");
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
