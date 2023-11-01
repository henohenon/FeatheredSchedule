import { formatDate } from "../../index.js";

const myOrigin = window.location.origin;
window.addEventListener("message", function (event) {
  if (event.origin !== myOrigin) {
    return;
  }

  //console.log(event.data);
  switch (event.data.action) {
    case "createTaskTable": {
      createTaskTable(event.data.value);
      break;
    }
    default: {
      console.log("event not found:");
      console.log(event.data);
      break;
    }
  }
});

// タスクデータをテーブルに追加
function createTaskTable(data) {
  // tbodyを取得
  const tbody = document.querySelector("tbody");

  for (let i = 0; i < data.length; i++) {
    const task = data[i];
    // 列の作成
    if (task.archive == 1) {
      continue;
    }
    const row = tbody.insertRow();
    // データ作成
    row.setAttribute("id", i);
    row.setAttribute("class", "taskRow");

    const formatedLimit = formatDate(new Date(task.limit));
    const formatedStart = formatDate(new Date(task.start));
    row.innerHTML = `
    <td>${i}</td>
    <td>${task.categoryId}</td>
    <td>${task.memo}</td>
    <td>${formatedLimit}</td>
    <td>${task.amount}</td>
    <td>${formatedStart}</td>
    <td>${task.done}</td>
    `;

    row.dataset.id = i;
    row.dataset.iconId = task.categoryId;
    row.dataset.memo = task.memo;
    row.dataset.limit = task.limit;
    row.dataset.amount = task.amount;
    row.dataset.start = task.start;
    row.dataset.done = task.done;

    // クリックされた際のイベント追加
    row.addEventListener("click", function () {
      // activeを排除
      const activeElems = tbody.querySelectorAll(".active");
      activeElems.forEach((activeElem) => {
        activeElem.classList.remove("active");
      });
      // すでにactiveだったところがクリックされた出ないなら
      if (!(activeElems.length == 1 && activeElems[0] == row)) {
        // クリックされたのをactiveに
        row.classList.add("active");
        window.parent.postMessage(
          { action: "clickedTaskTableCell", value: { id: i, data: task } },
          myOrigin
        );
      }
    });
  }
}
