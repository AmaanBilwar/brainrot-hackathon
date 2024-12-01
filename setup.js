document.addEventListener('DOMContentLoaded', async () => {
    const stored = await chrome.storage.local.get(['userEmail', 'sendgridApiKey']);
    
    if (stored.userEmail) {
        document.getElementById('userEmail').value = stored.userEmail;
    }
    if (stored.sendgridApiKey) {
        document.getElementById('apiKey').value = stored.sendgridApiKey;
    }

    document.getElementById('saveButton').addEventListener('click', async () => {
        const userEmail = document.getElementById('userEmail').value;
        const apiKey = document.getElementById('apiKey').value;

        if (!userEmail || !apiKey) {
            alert('Please fill in all fields');
            return;
        }

        await chrome.storage.local.set({
            userEmail: userEmail,
            sendgridApiKey: apiKey
        });

        alert('Settings saved successfully!');
        window.close();
    });
});
