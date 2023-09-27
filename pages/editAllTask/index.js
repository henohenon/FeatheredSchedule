const myOrigin = window.location.origin;

function taskRowClicked(task) {
  const editIframe = document.getElementById("selectedTaskEdit");
  const editIframeDocument = editIframe.contentWindow.document;
  const inputIframe = editIframeDocument.getElementById("inputTask");
  const inputIframeDocument = inputIframe.contentWindow.document;

  setTaskInput(
    inputIframeDocument,
    task["memo"],
    task["limit"],
    task["amount"],
    task["start"],
    task["done"]
  );
}

/*
  // 全タスク取得
  getAllTasks().then((result) => {
    // タスクテーブルにタスクを描画
    createTaskTableContents(taskTableiframeDoc, result);
    setTaskRowClickedEvent(taskTableiframeDoc, selectTask);
  });

  // 編集ボタン、削除ボタンを取得
  const editButton = taskEditIframeDoc.getElementById("editTaskButton");
  const deleteButton = taskEditIframeDoc.getElementById("deleteTaskButton");
  // 押されたときのイベントを追加
  editButton.addEventListener("click", function () {
    const taskInputIframe = taskEditIframeDoc.getElementById("inputTask");
    const taskInputIframeDoc = taskInputIframe.contentWindow.document;
    const data = getTaskInput(taskInputIframeDoc);
    updateTask(1, data).then((result) => {
      console.log(result);
    });
  });
  deleteButton.addEventListener("click", function () {
    console.log("fa");
  });
};*/

function selectTask(elem) {
  // タスク入力を取得
  const taskInputIframe = taskEditIframeDoc.getElementById("inputTask");
  const taskInputIframeDoc = taskInputIframe.contentWindow.document;

  setTaskInput(
    taskInputIframeDoc,
    elem.dataset.memo,
    elem.dataset.limit,
    elem.dataset.amount,
    elem.dataset.start,
    elem.dataset.done == "true" ? true : false
  );
}
// タスク編集を取得
const taskEditIframe = document.getElementById("selectedTaskEdit");

// タスクテーブル取得
const taskTableiframe = document.getElementById("allTaskTable");
taskTableiframe.addEventListener("load", function () {
  worker.port.postMessage({ action: "getAllTask" });
});

const worker = new SharedWorker("../../worker/index.js", { type: "module" });
worker.port.onmessage = function (event) {
  console.log(event.data);
  if (event.data.action === "setAllTask") {
    if (taskTableiframe.contentWindow.document !== null) {
      taskTableiframe.contentWindow.postMessage(
        {
          action: "createTaskTable",
          value: event.data.value,
        },
        myOrigin
      );
    }
  }
};

window.addEventListener("message", function (event) {
  if (event.origin !== myOrigin) {
    return;
  }

  switch (event.data.action) {
    case "clickedTaskTableCell": {
      taskEditIframe.contentWindow.postMessage(
        { action: "setTaskData", value: event.data.value },
        myOrigin
      );
      break;
    }
    case "editTask": {
      console.log(event.data.value);
      worker.port.postMessage({
        action: "editTask",
        value: event.data.value,
      });
      break;
    }
    default: {
      console.log("event not found:");
      console.log(event.data);
      break;
    }
  }
});
