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
 */
const observeDOM = ( function() {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function( obj, callback ){
    if( !obj || obj.nodeType !== 1 ) return; 

    if( MutationObserver ){
      // define a new observer
      const mutationObserver = new MutationObserver(callback)

      // have the observer observe for changes in children
      mutationObserver.observe( obj, { childList:true, subtree:true })
      return mutationObserver;
    }
    
    // browser support fallback
    else if( window.addEventListener ){
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

// play sound, or do some other debug thing
function taskAlert(record) {
    // alert("dom change located")

    // addedNodes[0] guaranteed since addedNodes.length > 0
    const targetNode = record.addedNodes[0]
    const maybeTaskNode = targetNode.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild
    console.log("mutation record : ")
    console.log(record)
    // TODO: figure out how to identify the task node from deep within the subtree
    console.log("maybe task node: ")
    console.log(maybeTaskNode)
    // is it anything OTHER than a new task? if so, return (no sound played)
    // if (!targetNode.classList) return;
    if (!maybeTaskNode.classList.contains(taskCanvasClass)) {
        // console.log("blocked something from making sound")
        return
    }

    // catch DOMException in case the audio context fails to play (tab not in focus)
    // TODO: put a slider in the popup to enable/disable sounds playing
    sound.play()
        .then((err) => {
            if (!err) return;
            console.log("taskAlert error: ")
            console.log(err)
        })

}
