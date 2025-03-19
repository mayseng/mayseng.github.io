document.addEventListener("DOMContentLoaded", () => {
    startLiveLogs();
    monitorNetwork();
    generateThreatAlerts();
    scanDatabase();
    updateSystemStatus();
    simulateIntrusionReports();
    logUser Access();
    updateSecurityAudit();
});

function startLiveLogs() {
    const logOutput = document.getElementById("log-output");
    const logs = [
        "[12:04:23] Unauthorized access attempt detected.",
        "[12:05:10] Brute force attack mitigated.",
        "[12:06:45] Data exfiltration attempt blocked.",
        "[12:08:30] SQL Injection attempt neutralized.",
        "[12:09:12] Firewall detected unusual traffic from IP: 192.168.1.5.",
        "[12:10:55] New admin login from unrecognized device.",
        "[12:12:30] Suspicious process execution blocked.",
        "[12:14:00] Network packet injection detected and stopped.",
        "[12:15:45] Suspicious activity flagged in system memory.",
        "[12:17:20] Multiple failed authentication attempts detected."
    ];
    
    setInterval(() => {
        const logEntry = document.createElement("p");
        logEntry.textContent = logs[Math.floor(Math.random() * logs.length)];
        logOutput.appendChild(logEntry);
        logOutput.scrollTop = logOutput.scrollHeight;
    }, 2500);
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

function analyzeData() {
    const inputData = document.getElementById("data-input").value;
    if (!inputData) return;
    
    const words = inputData.split(" ").length;
    const chars = inputData.length;
    const timestamp = new Date().toLocaleString();
    
    document.getElementById("data-output").innerHTML = `
        <p>Data Analysis Completed at ${timestamp}</p>
        <p>Word Count: ${words}</p>
        <p>Character Count: ${chars}</p>
    `;
}

function generateThreatAlerts() {
    const alerts = [
        "DDoS attack detected from multiple IPs.",
        "Ransomware signature detected in file system.",
        "Phishing attempt reported from external source.",
        "Malware detected in user downloads.",
        "Unauthorized access to sensitive data detected."
    ];
    
    setInterval(() => {
        const alertOutput = document.createElement("p");
        alertOutput.textContent = alerts[Math.floor(Math.random() * alerts.length)];
        alertOutput.style.color = "red";
        document.getElementById("log-output").appendChild(alertOutput);
    }, 5000);
}

function scanDatabase() {
    const auditLogOutput = document.getElementById("audit-log-output");
    const vulnerabilities = [
        "SQL Injection vulnerability found in user input fields.",
        "Outdated software detected on server.",
        "Weak password policy identified.",
        "Unpatched security flaws in database software."
    ];
    
    setInterval(() => {
        const scanEntry = document.createElement("p");
        scanEntry.textContent = vulnerabilities[Math.floor(Math.random() * vulnerabilities.length)];
        auditLogOutput.appendChild(scanEntry);
        auditLogOutput.scrollTop = auditLogOutput.scrollHeight;
    }, 7000);
}

function updateSystemStatus() {
    const systemStatusOutput = document.getElementById("system-status-output");
    setInterval(() => {
        const cpuUsage = Math.floor(Math.random() * 100);
        const ramUsage = Math.floor(Math.random() * 100);
        const uptime = Math.floor(Math.random() * 1000) + " hours";
        
        systemStatusOutput.textContent = `CPU Usage: ${cpuUsage}% | RAM Usage: ${ramUsage}% | Uptime: ${uptime}`;
    }, 3000);
}

function simulateIntrusionReports() {
    const intrusionLogOutput = document.getElementById("intrusion-log-output");
    const intrusionReports = [
        "Failed login attempt from IP: 192.168.1.10.",
        "Remote execution attempt blocked.",
        "Access to restricted area attempted.",
        "Malicious file upload detected."
    ];
    
    setInterval(() => {
        const reportEntry = document.createElement("p");
        reportEntry.textContent = intrusionReports[Math.floor(Math.random() * intrusionReports.length)];
        intrusionLogOutput.appendChild(reportEntry);
        intrusionLogOutput.scrollTop = intrusionLogOutput.scrollHeight;
    }, 4000);
}

function logUser Access() {
    const userLogOutput = document.getElementById("user-log-output");
    const userAccessLogs = [
        "User  'admin' logged in at " + new Date().toLocaleTimeString(),
        "User  'guest' attempted access at " + new Date().toLocaleTimeString(),
        "User  'admin' logged out at " + new Date().toLocaleTimeString(),
        "User  'analyst' logged in at " + new Date().toLocaleTimeString()
    ];
    
    setInterval(() => {
        const accessEntry = document.createElement("p");
        accessEntry.textContent = userAccessLogs[Math.floor(Math.random() * userAccessLogs.length)];
        userLogOutput.appendChild(accessEntry);
        userLogOutput.scrollTop = userLogOutput.scrollHeight;
    }, 6000);
}

function updateSecurityAudit() {
    const auditLogOutput = document.getElementById("audit-log-output");
    const auditEntries = [
        "Security policy updated at " + new Date().toLocaleTimeString(),
        "Backup completed successfully at " + new Date().toLocaleTimeString(),
        "MFA enforced for all users at " + new Date().toLocaleTimeString(),
        "System cleanup performed at " + new Date().toLocaleTimeString()
    ];
    
    setInterval(() => {
        const auditEntry = document.createElement("p");
        auditEntry.textContent = auditEntries[Math.floor(Math.random() * auditEntries.length)];
        auditLogOutput.appendChild(auditEntry);
        auditLogOutput.scrollTop = auditLogOutput.scrollHeight;
    }, 8000);
}
