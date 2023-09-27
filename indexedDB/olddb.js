// データベース名とバージョンを指定
const dbName = "FeatheredSchedule";
const dbVersion = 1;

// データベースを開く (もしくは作成)
const request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = function (event) {
  const db = event.target.result;

  // オブジェクトストアを作成 (タスクを格納するため)
  if (!db.objectStoreNames.contains("tasks")) {
    db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
  }
  setDB(db);
};

request.onsuccess = function (event) {
  const db = event.target.result;
  // データベースが準備できたら操作を行う関数を呼び出す
  console.log("db initialize is success full!");
  setDB(db);
};

request.onerror = function (event) {
  console.error("データベースのエラー", event.target.error);
};

function addTask(db, task) {
  const transaction = db.transaction(["tasks"], "readwrite");
  const objectStore = transaction.objectStore("tasks");

  const request = objectStore.add(task);

  request.onsuccess = function (event) {
    console.log("タスクが追加されました。");
  };

  request.onerror = function (event) {
    console.error("タスクの追加中にエラーが発生しました。", event.target.error);
  };
}

function deleteTask(db, taskId) {
  const transaction = db.transaction(["tasks"], "readwrite");
  const objectStore = transaction.objectStore("tasks");

  const request = objectStore.delete(taskId);

  request.onsuccess = function (event) {
    console.log("タスクが削除されました。");
  };

  request.onerror = function (event) {
    console.error("タスクの削除中にエラーが発生しました。", event.target.error);
  };
}

function updateTask(db, taskId, updatedTask) {
  const transaction = db.transaction(["tasks"], "readwrite");
  const objectStore = transaction.objectStore("tasks");

  const getRequest = objectStore.get(taskId);

  getRequest.onsuccess = function (event) {
    const taskToUpdate = event.target.result;

    if (taskToUpdate) {
      // タスクの内容を更新
      taskToUpdate.iconId = updatedTask.iconId;
      taskToUpdate.memo = updatedTask.memo;
      taskToUpdate.limit = updatedTask.limit;
      taskToUpdate.amount = updatedTask.amount;
      taskToUpdate.start = updatedTask.start;
      taskToUpdate.done = updatedTask.done;

      // 更新されたタスクをオブジェクトストアに保存
      const updateRequest = objectStore.put(taskToUpdate);

      updateRequest.onsuccess = function (event) {
        console.log("タスクが更新されました。");
      };

      updateRequest.onerror = function (event) {
        console.error(
          "タスクの更新中にエラーが発生しました。",
          event.target.error
        );
      };
    } else {
      console.error("指定されたタスクが見つかりませんでした。");
    }
  };

  getRequest.onerror = function (event) {
    console.error("タスクの取得中にエラーが発生しました。", event.target.error);
  };
}

function getAllTasks(db, callback) {
  const transaction = db.transaction(["tasks"], "readonly");
  const objectStore = transaction.objectStore("tasks");

  const request = objectStore.getAll();

  request.onsuccess = function (event) {
    const tasks = event.target.result;
    callback(tasks);
  };

  request.onerror = function (event) {
    console.error(
      "タスク一覧の取得中にエラーが発生しました。",
      event.target.error
    );
  };
}
