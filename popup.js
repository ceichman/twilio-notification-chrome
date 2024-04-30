
const input = document.getElementById("upload")
input.addEventListener("change", openFile, false)
function openFile(event) {
    const audioElement = document.createElement("audio");
    const file = event.target.files[0]
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(f) {
        audioElement.src=f.target.result
        const filename = file.name
    };
}

/*
const file = document.getElementById("upload").files[0]

const reader = new FileReader();

reader.addEventListener("onload", function(event) {
    console.log(e.target.result)
})
*/