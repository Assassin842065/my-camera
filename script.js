let video = document.querySelector("video");
let recordBtn=document.querySelector(".record-btn");
let photoBtn=document.querySelector(".photo-btn");
let recordFlag=false;
let filterColor="transparent";
let recorder;
let chunks=[];
let constraints = {
    video: true,
    audio: true
}

navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
     video.srcObject = stream;

     recorder= new MediaRecorder(stream);

     recorder.addEventListener("start",(e)=>{
        chunks=[];
     })
     recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
     })
     recorder.addEventListener("stop",(e)=>{
        let blob=new Blob(chunks,{type: "video/mp4"});

        if(db){
            let shortId=shortid();
            let videoId=`vid-${shortId}`;
            let dbTransaction=db.transaction("video","readwrite");
            let videoStore=dbTransaction.objectStore("video");
            let videoData={
                id: videoId,
                blobData: blob,
            }
            videoStore.add(videoData);
        }
     })
})

recordBtn.addEventListener("click",(e)=>{
    if(!recorder){
        return;
    }
     recordFlag=!recordFlag;
     if(recordFlag){
        recorder.start();
        startTimer();
        recordBtn.classList.add("record-animate");
     }else{
        recorder.stop();
        stopTimer();
        recordBtn.classList.remove("record-animate");
     }
})
photoBtn.addEventListener("click",(e)=>{ 
    photoBtn.classList.add("photo-animate");
    
    let canvas=document.createElement("canvas");
    let tool=canvas.getContext("2d");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    tool.drawImage(video,0,0,canvas.width,canvas.height);
    
    tool.fillStyle=filterColor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    let imageUrl=canvas.toDataURL();
    if(db){
        let shortId=shortid();
        let imgId=`img-${shortId}`;
        let dbTransaction=db.transaction("image","readwrite");
        let imgStore=dbTransaction.objectStore("image");
        let imgData={
            id: imgId,
            url: imageUrl,
        }
        imgStore.add(imgData);
    }
    setTimeout(() => {
        photoBtn.classList.remove("photo-animate");
    }, 1000);
})

let timerId;
let timer=document.querySelector(".timer");
let counter;
function startTimer() {
    counter=0;
    timer.style.display="block";
    timerId=setInterval(() => {
        let totSecond=counter;

        let hr=Number.parseInt(totSecond/3600);
        totSecond=totSecond%3600;
        
        let mint=Number.parseInt(totSecond/60);
        totSecond=totSecond%60;

        let seconds=totSecond;

        hr=(hr<10)? `0${hr}`: hr;
        mint=(mint<10)? `0${mint}`:mint;
        seconds=(seconds<10)? `0${seconds}`:seconds;

        timer.innerText=`${hr}:${mint}:${seconds}`;

        counter++;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    timer.innerText="00:00:00";
    timer.style.display="none";
}

let allfilters=document.querySelectorAll(".filter");
let filterLayer=document.querySelector(".filter-layer");
allfilters.forEach(filterEle => {
    filterEle.addEventListener("click",(e)=>{
        filterColor=getComputedStyle(filterEle).getPropertyValue('background-color');
        filterLayer.style.backgroundColor = filterColor;
    })
});


