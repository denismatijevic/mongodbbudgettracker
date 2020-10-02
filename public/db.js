// declaring variables
let db;
const request = indexedDB.open("budget", 1);
// set autoIncrement and pending opject
request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore("pending", {
    autoIncrement: true
  })
};
// check online status before pulling from database
request.onsuccess = function(event) {
  db = event.target.result;
  if(navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log("Whoops! " + event.target.errorCode);
};
// pending db readwrite access
function saveRecord(record) {
  const transaction = db.transaction (["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  store.add(record);
}
// pending db transaction, access and records
function checkDatabase() {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();
}

getAll.onsuccess = function() {
  if (getAll.result.length > 0) {
    fetch("/api/transactions/bulk", {
      methon: "POST",
      body: JSON.stringify(getAll.result),
      headers: {
        accept: "application/json, text/plain, *?*",
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(()=> {
      const transaction = db.transaction(["pending"], "readWrite");
      const store = transaction.objectStore("pending");
    });
  };
}
window.addEventListener("online", checkDatabase);