
    {document.addEventListener('DOMContentLoaded', function () {
        const floatingPopup = document.getElementById('floatingVideoPopup');
        const floatingCloseButton = document.getElementById('floatingClosePopup');
        const notification = document.getElementById('notification');
        const originalVideo = document.getElementById('floatingVideo');
        const videoList = [
            'assets/videos/Cat.mp4',
            'assets/videos/ksi.mp4', 
            'assets/videos/mohawk.mp4',
        ];

        let closeCount = 0; // Track the number of "X" clicks

        floatingPopup.style.display = "block";

        function createNewPopup() {
            const mainSection = document.querySelector('.main-section');
            const mainSectionRect = mainSection.getBoundingClientRect();
            const mainSectionWidth = mainSectionRect.width;
            const mainSectionHeight = mainSectionRect.height;

            const newPopup = document.createElement('div');
            newPopup.className = 'floating-popup small-popup';
            newPopup.style.position = 'absolute';

            const topPosition = Math.random() * (mainSectionHeight - 150);
            newPopup.style.top = `${topPosition}px`;
            newPopup.style.left = `${Math.random() * (mainSectionWidth - 200)}px`;
            newPopup.style.zIndex = 1000;
            newPopup.style.padding = '5px';

            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.textContent = 'X';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '5px';
            closeButton.style.right = '5px';
            closeButton.style.background = 'red';
            closeButton.style.color = '#fff';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '50%';
            closeButton.style.cursor = 'pointer';
            closeButton.style.padding = '5px 10px';
            closeButton.style.zIndex = 1001;

            const randomVideoUrl = videoList[Math.floor(Math.random() * videoList.length)];
            const newVideo = document.createElement('video');
            newVideo.src = randomVideoUrl;
            newVideo.style.width = '200px';
            newVideo.style.height = 'auto';
            newVideo.playbackRate = 2;
            newVideo.volume = 0.03;
            newVideo.autoplay = true;
            newVideo.loop = false;
            newVideo.controls = false;
            newVideo.muted = false;

            newPopup.appendChild(closeButton);
            newPopup.appendChild(newVideo);
            mainSection.appendChild(newPopup);

            newVideo.onended = function () {
                newPopup.remove();
            };

            closeButton.addEventListener('click', function () {
                newPopup.remove();
            });
        }

        // Handle form submission
        document.getElementById('emailForm').addEventListener('submit', function (event) {
            const emailInput = document.getElementById('emailInput').value.toLowerCase();

            // Check if the input contains the word 'no'
            if (['talktuah', 'talk tuah', 'Talk Tuah', 'Talktuah'].includes(emailInput)) {
                // Hide all popups and remove video
                floatingPopup.style.display = "none";
                document.querySelectorAll('.floating-popup').forEach(popup => popup.style.display = 'none');
                document.getElementById('bouncing-image').style.display = "none";
                
                // Stop and remove the main video (originalVideo)
                if (originalVideo) {
                    originalVideo.pause(); // Stop the video
                    originalVideo.src = ''; // Clear the source to stop the video
                    originalVideo.remove(); // Remove the video from the DOM
                }

                alert("Popups and videos are now hidden.");
                event.preventDefault(); // Prevent the form from submitting
            } else {

            }
        });

        floatingCloseButton.addEventListener('click', function (event) {
            event.preventDefault();
            closeCount++; // Increment the counter on each click
            notification.textContent = `${closeCount} / 5 HAWKS HAVE BEEN TUAHED! `; // Update the notification text
            notification.style.display = "block"; // Show the notification

            // Hide the notification after 2 seconds
            setTimeout(function() {
                notification.style.display = "none";
            }, 2000);

            // Show alert when close count reaches 5
            if (closeCount === 5) {
                alert("MAYBE TRY PUTTING THE NAME OF THE PODCAST SOMEWHERE AND SUBMIT!");
            }

            createNewPopup(); // Create a new popup on every "X" click
        });

        originalVideo.muted = true;
        originalVideo.play();
        setTimeout(() => (originalVideo.muted = false), 1000);
        originalVideo.playbackRate = 0.25;
        originalVideo.volume = 0.1;
        originalVideo.controls = false;

        originalVideo.onpause = function (event) {
            event.preventDefault();
            originalVideo.play();
        };

        originalVideo.addEventListener('canplay', function () {
            originalVideo.play();
        });
    });
}