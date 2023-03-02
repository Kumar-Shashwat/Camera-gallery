let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");


let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;

let trnasparentColor = "transparent";



let recorder;
let chunks = []; // media data in chunks.


let constraints = {
    video: true,
    audio: true
};

// navigator is a global brower info.

// 1st brower api is mediaDevices 
// ------------------------------------------------------------------------------
window.navigator.mediaDevices.getUserMedia(constraints).then( (stream) => {
    video.srcObject= stream;

    recorder = new MediaRecorder(stream); 

    recorder.addEventListener("start", (e) => {
        chunks = [];
    })

    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
    })

    recorder.addEventListener("stop", (e) => {
        // conversion to media data in chunks to video.

        let blob = new Blob(chunks, { type: "video.mp4"});

        if(DB){
            // console.log("hello in the DB");
            let videoId  = shortid();
            let DBTransaction  = DB.transaction("video", "readwrite");
    
            let videoStore = DBTransaction.objectStore("video");
            let videoEntry = {
                id : `vid-${videoId }`,
                blobData : blob
            }

            videoStore.add(videoEntry);
        }

        // let videoURL = URL.createObjectURL(blob);

        // let a = document.createElement("a");

        // a.href = videoURL;

        // a.download = "stream.mp4";
        // a.click();
    })

})


recordBtnCont.addEventListener("click", (e) => {

    if(!recorder) return; // if camera is not on and no data in recorder.

    recordFlag= !recordFlag;

    if(recordFlag === true){ // start recording.
        
        recorder.start();
        startTimer();
        recordBtn.classList.add("scale-record");

    }
    else{       
             
        recorder.stop();     // stop recording.
        stopTimer();
        recordBtn.classList.remove("scale-record");
    }

});

// videos are the collection of frames. We can take a fame to create an image.
captureBtn.addEventListener('click', (e) => {
    
    captureBtn.classList.add("scale-capture");
    

    let canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height );

    // Fitering
    tool.fillStyle = trnasparentColor;
    tool.fillRect(0,0,canvas.width, canvas.height); 

    let imageURL = canvas.toDataURL();

    if(DB){
        // console.log("hello in the DB");
        let imageId  = shortid();
        let DBTransaction  = DB.transaction("image", "readwrite");

        let imageStore = DBTransaction.objectStore("image");
        let imageEntry = {
            id : `img-${imageId}`,
            url : imageURL
        }

        imageStore.add(imageEntry);
    }
    

    // let a = document.createElement("a");
    // a.href = imageURL;
    // a.download = "image.jpg";
    // a.click();

    setTimeout( () => {
        captureBtn.classList.remove("scale-capture");
    }, 500)
    

});

let timerID ;
let counter = 0;
let timer = document.querySelector(".timer");
timer.style.display = "none";
function startTimer(){

    timer.style.display = "block";
    function displayTimer(){
        let totalSecond = counter;

        let hours = Number.parseInt(totalSecond / 3600); // getting hours.

        // remaining values.
        totalSecond = totalSecond %3600;
        let minutes = Number.parseInt(totalSecond / 60);
        
        // again remaining seconds

        totalSecond = totalSecond %60;
        let seconds = parseInt(totalSecond%60);

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;
    }
    timerID = setInterval(displayTimer, 1000);
}

function stopTimer(){

    clearInterval(timerID);
    timer.innerText  = "00:00:00";
    timer.style.display = "none";

}

// Filtering Logic.

let filterLayer = document.querySelector(".filter-layer");

let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        // transparentColor = filterElem.style.backgroundColor;  // syntax for seting backgroound color.

        // for getting the backgroundColor 
        trnasparentColor = window.getComputedStyle(filterElem).getPropertyValue("background-Color");
        filterLayer.style.backgroundColor = trnasparentColor;
    })
})