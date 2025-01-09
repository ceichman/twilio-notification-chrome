
const input = document.getElementById("upload")
input.addEventListener("change", openFile, false)
const muteSwitch = document.getElementById("mute-switch")
muteSwitch.addEventListener("change", setMute, false)
// set mute position from storage
chrome.storage.sync.get(["mute"]).then((result) => {
    muteSwitch.checked = result.mute;
});
function openFile(event) {
    const audioElement = document.createElement("audio");
    const file = event.target.files[0]
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(f) {
        audioElement.src=f.target.result
        const filename = file.name
        const soundsList = chrome.storage.sync.get(["soundsList"]).then((result) => {
            console.log(Object.entries(result))
            chrome.storage.sync.set({"soundsList": result ? [ ...Object.entries(result), JSON.stringify(audioElement) ] : [ JSON.stringify(audioElement) ]})
        })

    };
}