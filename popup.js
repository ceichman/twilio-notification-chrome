
const input = document.getElementById("upload")
input.addEventListener("change", openFile, false)
function openFile(event) {
    const file = event.target.files[0]
    var reader = new FileReader();
    reader.onload = function(f) {
        return function(e) {
            console.log(f)
            const audio = new Audio();
            audio.src = f;
            audio.play();
        }
    }(file);
    reader.readAsDataURL(file);
}

/*
const file = document.getElementById("upload").files[0]

const reader = new FileReader();

reader.addEventListener("onload", function(event) {
    console.log(e.target.result)
})
*/