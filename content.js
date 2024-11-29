function observeLinkedInActivity() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const likeButtons = document.querySelectorAll('[aria-label*="like"]');
            likeButtons.forEach(button => {
                button.addEventListener('click', handleLike);
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function handleLike(event) {
    const postElement = event.target.closest('.feed-shared-update-v2');
    if (postElement) {
        const postContent = extractPostContent(postElement);
        // console.log('Liked post content:', postContent);
        const userData = {
            name: document.querySelector('.profile-rail-card__actor-link')?.textContent.trim() || 'User',
            email: '',
            postContent: postContent
        };
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'GET_USER_EMAIL') {
                // Try to find email on LinkedIn page
                const email = document.querySelector('[data-control-name="email"]')?.textContent?.trim();
                sendResponse({ email: email });
            }
        });
        
    }
}

function extractPostContent(postElement) {
    const textContent = postElement.querySelector('.feed-shared-text')?.textContent || '';
    return textContent.trim();
}

observeLinkedInActivity();
