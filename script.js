document.addEventListener("DOMContentLoaded", () => {
    startLiveLogs();
    monitorNetwork();
});

function startLiveLogs() {
    const logOutput = document.getElementById("log-output");
    const logs = [
        "[12:04:23] Unauthorized access attempt detected.",
        "[12:05:10] Brute force attack mitigated.",
        "[12:06:45] Data exfiltration attempt blocked.",
        "[12:08:30] SQL Injection attempt neutralized."
    ];
    
    setInterval(() => {
        const logEntry = document.createElement("p");
        logEntry.textContent = logs[Math.floor(Math.random() * logs.length)];
        logOutput.appendChild(logEntry);
        logOutput.scrollTop = logOutput.scrollHeight;
    }, 3000);
}

function monitorNetwork() {
    const networkData = document.getElementById("network-data");
    setInterval(() => {
        const latency = Math.floor(Math.random() * 100) + 1;
        const packetLoss = Math.floor(Math.random() * 5);
        const bandwidth = Math.floor(Math.random() * 1000) + 100;
        
        networkData.textContent = `Latency: ${latency}ms | Packet Loss: ${packetLoss}% | Bandwidth: ${bandwidth} Mbps`;
    }, 2000);
}

function encryptText() {
    const inputText = document.getElementById("encrypt-input").value;
    if (!inputText) return;
    
    const encrypted = btoa(inputText);
    document.getElementById("encrypt-output").textContent = encrypted;
}
