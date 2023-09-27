// データベース名とバージョンを指定
const dbName = "FeatheredSchedule";
const dbVersion = 2;

async function getDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = function (event) {
      const store = event.target.result;
      const tasksStore = store.createObjectStore("tasks", {
        autoIncrement: true,
      });
      const categoryStore = store.createObjectStore("categories", {
        autoIncrement: true,
      });
      const usualStore = store.createObjectStore("usuals", {
        autoIncrement: true,
      });
      const workStore = store.createObjectStore("works", {
        autoIncrement: true,
      });
      resolve(db);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      console.log("db initialize is successful!");
      resolve(db);
    };

    request.onerror = function (event) {
      console.error("データベースのエラー", event.target.error);
      alert("データベースとの接続時にエラーが発生しました。");
      reject(event.target.error);
    };
  });
}

async function addData(db, storeName, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);

    const request = objectStore.add(data);

    request.onsuccess = function (event) {
      const newTask = event.target.result;
      console.log(newTask);
      resolve(newTask);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}
async function getDataById(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);

    const request = objectStore.get(id);

    request.onsuccess = function (event) {
      const getedTask = event.target.result;
      resolve(getedTask);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

async function updateDataById(db, storeName, data, taskId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);

    // 更新されたタスクをオブジェクトストアに保存
    const request = objectStore.put(data, taskId);

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

async function getAllData(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();
    request.onsuccess = function (event) {
      const tasks = event.target.result;
      resolve(tasks);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}
export { getDB, getDataById, addData, updateDataById, getAllData };
