import {
  getDataById,
  addData,
  updateDataById,
  getAll,
  getAllData,
} from "./index.mjs";

const storeName = "tasks";

async function createTask(db, data) {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // プロパティのデフォルト値を設定
    const addData = {
      categoryId: data.categoryId || 0, // categoryに存在するかどうかの条件も追加
      memo: data.memo || "",
      limit:
        data.limit instanceof Date ? data.limit.getTime() : tomorrow.getTime(),
      amount: data.amount !== undefined ? Math.max(data.amount, 0) : 1,
      start:
        data.start instanceof Date ? data.start.getTime() : today.getTime(),
      done: data.done === 1 ? 1 : 0,
      archive: data.archive === 1 ? 1 : 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const created = await addData(db, storeName, addData);
    return created;
  } catch (error) {
    console.error("エラー:", error);
  }
}

// タスクを削除
async function deleteTask(db, taskId) {
  try {
    const taskToUpdate = await getDataById(db, storeName, taskId);
    taskToUpdate["archive"] = 1;
    taskToUpdate["updatedAt"] = Date.now();

    const updatedResult = await updateDataById(db, storeName, taskToUpdate);
    if (taskToUpdate["archive"] == 1) {
      return "delete successfly";
    }
    return "can't delete...";
  } catch (error) {
    console.error("エラー:", error);
  }
}

// タスクを上書き
async function updateTask(db, taskId, data) {
  try {
    const taskToUpdate = await getDataById(db, storeName, taskId);

    if (data.hasOwnProperty("categoryId")) {
      taskToUpdate["categoryId"] = data["categoryId"]; // categoryに存在するかどうかの条件も追加
    }
    if (data.hasOwnProperty("memo")) {
      taskToUpdate["memo"] = data["memo"];
    }
    if (data.hasOwnProperty("limit")) {
      taskToUpdate["limit"] = data["limit"];
    }
    if (data.hasOwnProperty("amount")) {
      taskToUpdate["amount"] = parseInt(data["amount"]);
    }
    if (data.hasOwnProperty("start")) {
      taskToUpdate["start"] = data["start"];
    }
    if (data.hasOwnProperty("done")) {
      taskToUpdate["done"] = data["done"] == 1 ? 1 : 0;
    }
    if (data.hasOwnProperty("archive")) {
      taskToUpdate["archive"] = data["archive"] == 1 ? 1 : 0;
    }
    taskToUpdate["updatedAt"] = Date.now();
    console.log(taskToUpdate);

    const updatedResult = await updateDataById(
      db,
      storeName,
      taskToUpdate,
      taskId
    );

    return updatedResult;
  } catch (error) {
    return "エラー:", error;
  }
}

async function getAllTasks(db) {
  try {
    const tasks = await getAllData(db, storeName);
    /* 等のフォーマット作業はこっちでやる
    let result = [];
    for(let i = 0; i < tasks.length; i++){
      if(tasks[i].archive != 1){
        result.push(tasks[i]);
      }
    }*/
    return tasks;
  } catch (error) {
    console.error("エラー:", error);
  }
}

export { createTask, deleteTask, updateTask, getAllTasks };
