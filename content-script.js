/*
 * matches string for manifest.json.content-scripts[0].matches
 * "matches": [ "*://flex.twilio.com/agent-desktop/" ]
 *
 * html class of panel1: Twilio-AgentDesktopView.Panel1
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

const tasksFrame = document.querySelector(".target");

observeDOM(tasksFrame, function(mutations) {
    for (record of mutations) {
        if (record.addedNodes.length) {
            // play sound, or do some other debug thing
            // sound.play();
            chrome.runtime.sendMessage( {action: "play-sound"} );
            break;
        }
    }
});
