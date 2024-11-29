// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'POST_LIKED') {
        handlePostLike(message.data);
    }
});

async function handlePostLike(userData) {
    const userEmail = await getUserEmail();
    if (!userEmail) {
        console.error('Could not find user email');
        return;
    }

    const fakeJob = generateFakeJob(userData.postContent);
    await sendEmail(userEmail, fakeJob);
}

function generateFakeJob(postContent) {
    const keywords = extractKeywords(postContent);
    
    return {
        title: `Senior ${keywords[0] || 'Professional'} Position`,
        company: `${keywords[1] || 'Tech'} Solutions Inc.`,
        description: `Exciting opportunity for a skilled professional in ${keywords.join(', ')}...`,
        salary: '$120,000 - $180,000',
        location: 'Remote / Hybrid'
    };
}

function extractKeywords(text) {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to'];
    return text
        .toLowerCase()
        .split(/\W+/)
        .filter(word => word.length > 3 && !commonWords.includes(word))
        .slice(0, 5);
}

async function getUserEmail() {
    try {
        const stored = await chrome.storage.local.get('userEmail');
        if (stored.userEmail) {
            return stored.userEmail;
        }

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_USER_EMAIL' });
        
        if (response && response.email) {
            await chrome.storage.local.set({ userEmail: response.email });
            return response.email;
        }

        return null;
    } catch (error) {
        console.error('Failed to get user email:', error);
        return null;
    }
}

async function sendEmail(toEmail, jobPost) {
    if (!toEmail) {
        console.error('No email address provided');
        return;
    }

    const emailContent = generateEmailHTML(jobPost);
    const email = btoa(
        `To: ${toEmail}\r\n` +
        `Subject: Job Opportunity: ${jobPost.title}\r\n` +
        `Content-Type: text/html\r\n\r\n` +
        emailContent
    ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    try {
        const token = await chrome.identity.getAuthToken({ interactive: true });
        
        const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ raw: email })
        });

        if (!response.ok) {
            throw new Error(`Email send failed: ${response.statusText}`);
        }

        chrome.storage.local.set({
            [`email_sent_${Date.now()}`]: {
                to: toEmail,
                jobPost: jobPost,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Failed to send email:', error);
    }
}

function generateEmailHTML(jobPost) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Exciting Job Opportunity</h2>
            <h3>${jobPost.title}</h3>
            <p><strong>Company:</strong> ${jobPost.company}</p>
            <p><strong>Location:</strong> ${jobPost.location}</p>
            <p><strong>Salary Range:</strong> ${jobPost.salary}</p>
            <h4>Job Description:</h4>
            <p>${jobPost.description}</p>
            <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5;">
                <p><small>This position matches your recent LinkedIn activity.</small></p>
            </div>
        </div>
    `;
}
