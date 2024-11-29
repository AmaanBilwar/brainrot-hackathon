// popup.js
document.addEventListener('DOMContentLoaded', async () => {
    const storage = await chrome.storage.local.get(null);
    const activityLog = document.getElementById('activityLog');
    
    // Display stored activities
    Object.entries(storage)
        .filter(([key]) => key.startsWith('email_sent_'))
        .sort((a, b) => b[1].timestamp.localeCompare(a[1].timestamp))
        .forEach(([key, data]) => {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML = `
                <p>Email sent to: ${data.to}</p>
                <p>Job Title: ${data.jobPost.title}</p>
                <p>Time: ${new Date(data.timestamp).toLocaleString()}</p>
            `;
            activityLog.appendChild(entry);
        });
});
