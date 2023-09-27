let editList;
let selectedTaskId = null;
document.addEventListener("DOMContentLoaded", function () {
  // インプット一覧を取得
  editList = [
    document.getElementById("memoEdit"),
    document.getElementById("limitEdit"),
    document.getElementById("amountEdit"),
    document.getElementById("startEdit"),
    document.getElementById("doneEdit"),
  ];
});

db = null;
function setDB(db) {
  this.db = db;

  getAllTasks(db, function (tasks) {
    createTaskTable(tasks);
    console.log(tasks);
  });
}

function createTaskTable(tasks) {
  const tableBody = document.querySelector("#taskTable tbody");

  // タスクデータをテーブルに追加
  tasks.forEach((task) => {
    const row = tableBody.insertRow();
    row.setAttribute("id", task.id);
    row.innerHTML = `
      <td>${task.id}</td>
      <td>${task.iconId}</td>
      <td>${task.memo}</td>
      <td>${task.limit}</td>
      <td>${task.amount}</td>
      <td>${task.start}</td>
      <td>${task.done}</td>
    `;
    row.addEventListener("click", function () {
      console.log(task);
      selectedTaskId = task.id;
      changeEdit(task);
    });
  });
}

function changeEdit(task) {
  editList[0].value = task.memo;
  editList[1].value = task.limit;
  editList[2].value = task.amount;
  editList[3].value = task.start;
  editList[4].checked = task.done;
}

function updateSelected() {
  if (db == null) {
    alert("dbが設定されていません...");
    return;
  }
  updateTask(db, selectedTaskId, {
    iconId: 0,
    memo: editList[0].value,
    limit: editList[1].value,
    amount: editList[2].value,
    start: editList[3].value,
    done: editList[4].checked,
  });
}

function deleteSelected() {
  if (db == null) {
    alert("dbが設定されていません...");
    return;
  }
  deleteTask(db, selectedTaskId);
}
