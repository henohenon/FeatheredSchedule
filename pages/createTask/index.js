import { createTask } from "../../db/task/index.js";

window.onload = async function () {
  // タスク追加を取得
  const taskCreateIframe = document.getElementById("taskCreateFrame");
  const taskCreateframeDoc = taskCreateIframe.contentWindow.document;
  const popup = document.getElementById("createPopup");
  // タスク入力を取得
  //const taskInputIframe = taskCreateframeDoc.getElementById("taskInput");
  //const taskInputeframeDoc = taskInputIframe.contentWindow.document;

  // 追加ボタン、閉じるボタンを取得
  const addButton = taskCreateframeDoc.getElementById("addTaskButton");
  const closeButton = document.getElementById("popupCloseButton");
  // 押されたときのイベントを追加
  addButton.addEventListener("click", function () {
    createTask({}).then((result) => {
      console.log(result);
    });
  });
  closeButton.addEventListener("click", function () {
    popup.classList.remove("active");
  });
};
