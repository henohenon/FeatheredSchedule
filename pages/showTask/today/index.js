import {
  setTaskInput,
  createTaskTableContents,
  setTaskRowClickedEvent,
} from "../../../module/task/index.js";
import { getAllTasks } from "../../../db/task/index.js";

window.onload = async function () {
  // 全タスク取得
  getAllTasks().then((result) => {
    console.log(result);
    const nearyTask = getNearyTask(result);
    const iframe = document.createElement("iframe");
    iframe.src = "../../../module/task/card/big";
    iframe.classList.add("nearTaskCard");
    console.log(iframe);
    document.body.appendChild(iframe);
  });
};

function getNearyTask(datas) {
  result = null;
  limitTime = 0;
  datas.forEach((data) => {
    const startDate = new Date(data.start);
    const limitDate = new Date(data.limit);
    const differenceInMilliseconds = limitDate - startDate;
    if (limitTime > differenceInMilliseconds) {
      limitTime = differenceInMilliseconds;
      result = data;
    }
  });
  return result;
}
