import {
  getDB,
  getDataById,
  addData,
  updateDataById,
  deleteDataById,
  getAllStoreData,
  clearAllStoreData,
} from "../../indexedDB/index.js";

const dbName = "FeatheredScheduleTimer";
const dbVersion = 1;
const storeName = "timeres";

function getTimerDB() {
  return getDB(dbName, dbVersion, upgradeTimerDB);
}

function upgradeTimerDB(event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains("timeres")) {
    db.createObjectStore("timeres", {
      autoIncrement: true,
    });
  }
}

function putTime(db, day, time, dataId) {
  return new Promise(async (resolve, reject) => {
    try {
      const existingData = await getDataById(db, storeName, dataId);
      if (!existingData.times) {
        existingData.times = {};
      }
      existingData.times[day] = time;
      existingData.updatedAt = Date.now();

      console.log(existingData);

      const transaction = db.transaction([storeName], "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.put(existingData, dataId); // idは0はじまりなのだがputやgetは1始まりになってる。キモイ。

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

export {
  getTimerDB,
  getDataById,
  addData,
  putTime,
  updateDataById,
  deleteDataById,
  getAllStoreData,
  clearAllStoreData,
};
