
const input = document.getElementById("upload")
input.addEventListener("change", openFile, false)
function openFile(event) {
    const audioElement = document.createElement("audio");
    const file = event.target.files[0]
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(f) {
        audioElement.src=f.target.result
        const filename = file.name
        const soundsList = chrome.storage.local.get(["soundsList"]).then((result) => {
            console.log(Object.entries(result))
            chrome.storage.local.set({"soundsList": result ? [ ...Object.entries(result), JSON.stringify(audioElement) ] : [ JSON.stringify(audioElement) ]})
        })

    };
}

// TODO: test this file uploading dealio
/*
const file = document.getElementById("upload").files[0]

const reader = new FileReader();

reader.addEventListener("onload", function(event) {
    console.log(e.target.result)
})
*/