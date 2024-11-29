// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get button element
    const button = document.getElementById('myButton');
    const resultDiv = document.getElementById('result');

    // Add click event listener
    button.addEventListener('click', function() {
        // Example function
        resultDiv.textContent = 'Button clicked!';
        
        // Example: Get current tab
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let currentTab = tabs[0];
            // Do something with the current tab
            console.log(currentTab.url);
        });
    });

    // Example: Message passing to content script
    /*
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getData"}, function(response) {
            console.log(response);
        });
    });
    */
});
