/*
 * matches string for manifest.json.content-scripts[0].matches
 * "matches": [ "*://flex.twilio.com/agent-desktop/" ]
 *
 * html class of panel1: Twilio-Splitter-Pane
 * html class of task item: Twilio-TaskListBaseItem
 *
 * detect changes in DOM using MutationObserver: 
 * https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
 *
 * play audio (vanilla js):
 * https://stackoverflow.com/questions/9419263/how-to-play-audio
 *
 */

/*
 *  use like: observeDOM(HTMLElement target, function(mutationRecordList) => { callback })
 *
 */

let muted = false;
chrome.storage.local.get(["muted"]).then((result) => {
    muted = result;
});

const observeDOM = ( function() {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function( obj, callback ) {
    if( !obj || obj.nodeType !== 1 ) return; 

    if( MutationObserver ) {
      // define a new observer
      const mutationObserver = new MutationObserver(callback)

      // have the observer observe for changes in children
      mutationObserver.observe( obj, { childList:true, subtree:true })
      return mutationObserver;
    }
    
    // browser support fallback
    else if( window.addEventListener )
    {
      obj.addEventListener('DOMNodeInserted', callback, false)
      obj.addEventListener('DOMNodeRemoved', callback, false)
    }
  }
})();

const sound = new Audio(chrome.runtime.getURL('sounds/sound.mp3'));

const frameSelector = ".Twilio-Splitter-Pane";

let tasksFrame = document.querySelector(frameSelector);
const resetTasksFrame = () => {
    if (!(tasksFrame) || !(tasksFrame.style)) {
        // if the selector missed
        // console.log("frame selector missed on: ", JSON.stringify(tasksFrame));
        // console.log(tasksFrame)
        setTimeout(() => {
            tasksFrame = document.querySelector(frameSelector);
            resetTasksFrame();
        }, 1000);
    }
    else {
        // if it hit
        console.log("got the task frame: " + JSON.stringify(tasksFrame))
        console.log(tasksFrame)

        // register dom observer
        observeDOM(tasksFrame, function(mutations) {
            for (let record of mutations) {
                if (record.addedNodes.length) {
                    taskAlert(record);
                    break;
                }
            }
        });


    }
}
resetTasksFrame();


const taskCanvasClass = "Twilio-TaskListBaseItem"

// What happens when a splitter-pane child is added.
function taskAlert(record) {
    // alert("dom change located")

    // addedNodes[0] guaranteed since addedNodes.length > 0
    const targetNode = record.addedNodes[0]
    const levels = 7;
    const isTaskElement = findClassInSubtree(targetNode, taskCanvasClass, levels);
    console.log("mutation record : ")
    console.log(record)
    console.log(`found task element in targetNode subtree: ${isTaskElement}`);
    // is it anything OTHER than a new task? if so, return (no sound played)
    if (!isTaskElement) {
        console.log("blocked something from making sound")
        return;
    }

    requestNotification();

    if (!muted) {
        // catch DOMException in case the audio context fails to play (tab not in focus)
        try {
            sound.play();
        }
        catch (error) {
            console.error(error);
        }
    }

}

function requestNotification() {
    fetch('https://twilio.girlslab.org:3000/send-notification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: "You received a task!" }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Notification sent to provider server:', data);
    })
    .catch(err => {
        console.error('Failed to send notification:', err);
    });
}

// To be called on an HTMLElement. Searches its classList for a particular targetClassName.
function hasClassName(element, targetClassName) {
    const classList = element.classList;
    if (classList) {
        for (const className of classList) {
            if (className === targetClassName) {
                return true;
            }
        }
    }
    // if no classList, or target class wasn't found
    return false;
}

// Finds a targetClassName in a DOM subtree of given element.
function findClassInSubtree(element, targetClassName, levels = 7) {
    if (levels === 0) {   // base case
        return hasClassName(element, targetClassName);
    }
    else {  // recursive case
        // if an intermediate node has it, return true early (don't traverse to bottom of tree)
        if (hasClassName(element, targetClassName)) return true;
        if (!element.children) return false;
        let result = false;
        for (const child of element.children) {
            result |= findClassInSubtree(child, targetClassName, levels - 1);
        }
        return result;
    }
}

// Update mute options settings when changed in chrome.storage.local.
chrome.storge.onChanged.addEventListener((changes, area) => {
    if (area === "sync" && changes.mute?.newValue) {
        muted = changes.mute.newValue;
    }
})
