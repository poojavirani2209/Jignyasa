import { app, BrowserWindow } from "electron";
import path from "path";
import { spawn, spawnSync } from "child_process";
import { fileURLToPath } from "url";
let mainWindow;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("heye");
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false, // keep false for safety
            contextIsolation: true,
        },
    });
    const indexPath = path.join(__dirname, "../client/dist/index.html");
    mainWindow.loadFile(indexPath).catch(console.error);
    mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDesc) => {
        console.error("Failed to load:", errorDesc);
    });
}
app.whenReady().then(() => {
    const rootPath = path.resolve(__dirname, "..");
    // 🔹 Step 1: Run seed script synchronously
    const seedScriptPath = path.join(rootPath, "server", "dist-scripts", "scripts", "seedDb.js");
    console.log("Running seed script:", seedScriptPath);
    const seedResult = spawnSync("node", [seedScriptPath], {
        cwd: rootPath,
        shell: true,
        encoding: "utf-8",
    });
    if (seedResult.stdout) {
        console.log(seedResult.stdout.toString());
    }
    if (seedResult.stderr) {
        console.error(seedResult.stderr.toString());
    }
    if (seedResult.status !== 0) {
        console.error("❌ Seeding failed. Aborting server start.");
        return;
    }
    console.log("✅ DB seeding complete. Starting server...");
    // 🔹 Step 2: Start the server
    const serverPath = path.join("server", "dist", "server.js");
    const serverProcess = spawn("node", [serverPath], {
        cwd: path.resolve(__dirname, ".."),
        shell: true,
    });
    serverProcess.stdout.setEncoding("utf8");
    serverProcess.stderr.setEncoding("utf8");
    serverProcess.stdout.on("data", (data) => {
        console.log(`[server stdout]: ${data}`);
    });
    serverProcess.stderr.on("data", (data) => {
        console.error(`[server stderr]: ${data}`);
    });
    serverProcess.on("error", (err) => {
        console.error("❌ Failed to start server process:", err);
    });
    serverProcess.on("exit", (code) => {
        console.log(`⚠️ Server process exited with code ${code}`);
    });
    createWindow();
});
//# sourceMappingURL=electron.js.map