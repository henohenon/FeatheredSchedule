let nowFocus = 0;

let inputList;
document.addEventListener("DOMContentLoaded", function () {
  // インプット一覧を取得
  inputList = [
    document.getElementById("memoInput"),
    document.getElementById("limitInput"),
    document.getElementById("amountInput"),
    document.getElementById("startInput"),
  ];
  // 最初のをfocus
  nowFocus = 0;
  inputList[0].focus();

  // ショトカを追加
  document.addEventListener("keydown", function (event) {
    // ctr+enter
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault(); // デフォルトの動作削除

      // focusを一つずらす
      nowFocus++;
      if (nowFocus >= inputList.length) {
        nowFocus = 0;
      }
      inputList[nowFocus].focus();
    }
    // ctr+shit+enter
    if (event.shiftKey && event.ctrlKey && event.key === "Enter") {
      event.preventDefault(); // デフォルトの動作削除

      // 追加処理
      formatTask(
        0,
        inputList[0].value,
        inputList[1].value,
        inputList[2].value,
        inputList[3].value
      );
    }
  });
});

db = null;
function setDB(db) {
  this.db = db;

  getAllTasks(db, function (tasks) {
    console.log(tasks);
  });
}

function formatTask(iconId, memo, limit, amount, start) {
  if (db == null) {
    alert("dbが設定されていません...");
    return;
  }
  const newTask = {
    iconId: 0,
    memo: memo,
    limit: limit,
    amount: amount,
    start: start,
    done: false,
  };

  console.log(newTask)
  //addTask(db, newTask);
}
