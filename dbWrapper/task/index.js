import {
  getDB,
  addData,
  getDataById,
  updateDataById,
  getAllData,
} from "../../indexedDB/index.js";

async function initialize() {
  const dbName = "FeatheredScheduleTimer";
  const dbVersion = 1;
  return await getDB(dbName, dbVersion);
}

async function addTask(db, data) {
  try {
    const addData = getDefaultTask();

    Object.keys(data).forEach((key) => {
      if (key in addData) {
        addData[key] = data[key];
      }
    });
    return await addData(db, "tasks", addData);
  } catch (error) {
    throw error;
  }
}

async function getTask(db, id) {
  try {
    return await getDataById(db, "tasks", id);
  } catch (error) {
    throw error;
  }
}

async function updateTask(db, data, id) {
  try {
    return await updateDataById(db, "tasks", data, id);
  } catch (error) {
    throw error;
  }
}

async function archiveTask(db, id) {
  try {
    return await updateDataById(db, "tasks", { archive: 1 }, id);
  } catch (error) {
    throw error;
  }
}

async function getAllTask(db) {
  try {
    return await getAllData(db, "tasks");
  } catch (error) {
    throw error;
  }
}

function getDefaultTask() {
  // 今日の0時のタイムスタンプを取得
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfDayTimestamp = startOfDay.getTime();

  // 今日の24時のタイムスタンプを取得
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const endOfDayTimestamp = endOfDay.getTime();
  return {
    categoryId: 0,
    memo: "",
    limit: endOfDayTimestamp,
    amount: 1,
    start: startOfDayTimestamp,
    done: 0,
    archive: 0,
  };
}

export { initialize, addTask, getTask, updateTask, archiveTask, getAllTask };
