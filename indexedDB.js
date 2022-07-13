//create database
//create objectStore
let db;
let openreq=indexedDB.open("myDatabase");
openreq.addEventListener("success",(e)=>{
    console.log("db sucess");
    db=openreq.result;
})
openreq.addEventListener("error",(e)=>{
    console.log("db failed");
})
openreq.addEventListener("upgradeneeded",(e)=>{
    console.log("db upgraded");
    db=openreq.result;

    db.createObjectStore("video",{ keyPath: "id"});
    db.createObjectStore("image",{keyPath: "id"});
})

