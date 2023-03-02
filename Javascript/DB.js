let DB; // name of DataBase
let openRequest = indexedDB.open("myDataBase",1); // request to open indexedDB

openRequest.addEventListener("success", (e) => {
    console.log("DB success");
    DB = openRequest.result;
})
openRequest.addEventListener("error", (e) => {
    console.log("error");
})
openRequest.addEventListener('upgradeneeded', (e) => {
    console.log(`Upgrading to version `);
    DB = openRequest.result;

    DB.createObjectStore("video", {keyPath : "id"});
    DB.createObjectStore("image", {keyPath : "id"});
})

// console.log("hello");