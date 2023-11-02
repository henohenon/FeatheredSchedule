async function getDB(dbName, dbVersion, upgradeFunc) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = function (event) {
      upgradeFunc(event);
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

    data["createdAt"] = Date.now();
    data["updatedAt"] = Date.now();
    const request = objectStore.add(data);

    request.onsuccess = async function (event) {
      const newDataId = event.target.result;
      try {
        await updateDataById(db, storeName, { id: newDataId }, newDataId);
        const addedData = await getDataById(db, storeName, newDataId);
        resolve(addedData);
      } catch (error) {
        reject(error);
      }
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}
async function getDataById(db, storeName, dataId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);

    const request = objectStore.get(dataId); // idは0はじまりなのだがputやgetは1始まりになってる。キモイ。

    request.onsuccess = function (event) {
      const getedData = event.target.result;
      resolve(getedData);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

async function updateDataById(db, storeName, updatedFields, dataId) {
  return new Promise(async (resolve, reject) => {
    try {
      const existingData = await getDataById(db, storeName, dataId);
      const updatedData = { ...existingData, ...updatedFields };
      updatedData.updatedAt = Date.now();

      console.log(updatedData);

      const transaction = db.transaction([storeName], "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.put(updatedData, dataId); // idは0はじまりなのだがputやgetは1始まりになってる。キモイ。

      request.onsuccess = function (event) {
        resolve(request.result);
      };

      request.onerror = function (event) {
        reject(event.target.error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

async function deleteDataById(db, storeName, dataId) {
  return new Promise(async (resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);

    const request = objectStore.delete(dataId);

    request.onsuccess = function (event) {
      resolve(request.result);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

async function getAllStoreData(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();
    request.onsuccess = function (event) {
      const datas = event.target.result;
      resolve(datas);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

async function clearAllStoreData(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const clearRequest = objectStore.clear();

    clearRequest.onsuccess = function (event) {
      const datas = event.target.result;
      resolve(datas);
    };

    clearRequest.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

export {
  getDB,
  getDataById,
  addData,
  updateDataById,
  deleteDataById,
  getAllStoreData,
  clearAllStoreData,
};
