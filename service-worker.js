

// const sound = new Audio('sounds/sound.mp3');

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // console.log("received message from" + JSON.stringify(sender) + ": " + JSON.stringify(request));
        switch (request.action) {
            case "play-sound":
                //sound.play();
                console.log("playing sound");
                break;
        }
    });
