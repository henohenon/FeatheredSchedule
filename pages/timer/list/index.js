import {
  getTimerDB,
  addData,
  putTime,
  updateDataById,
  getAllStoreData,
  deleteDataById,
  getDataById,
  clearAllStoreData,
} from "../../../dbWrapper/timer/index.js";
const myOrigin = window.location.origin;

const iframes = {};
let activeIframeId = -1;

let db = null;

//createTimerList(timerData);

function createTimerList(timeresData) {
  const timerList = document.getElementById("timerList");

  timeresData.forEach((timerData) => {
    const iframe = document.createElement("iframe");
    iframe.src = "../../../module/timer/card/index.html";
    iframe.id = `iframe-${timerData.id}`; // 各iframeにidを設定
    timerList.appendChild(iframe);

    iframe.addEventListener("load", function () {
      iframe.contentWindow.postMessage(
        {
          action: "setData",
          value: timerData,
        },
        myOrigin
      );
    });
    iframes[timerData.id] = iframe;
  });
}

window.addEventListener("message", function (event) {
  if (event.origin !== myOrigin) {
    return;
  }

  switch (event.data.action) {
    case "startedTimer": {
      console.log("timerStart!");
      if (iframes[activeIframeId]) {
        iframes[activeIframeId].contentWindow.postMessage(
          {
            action: "stopTimer",
          },
          myOrigin
        );
      }

      activeIframeId = event.data.value.id;
      break;
    }
    case "stoppedTimer": {
      console.log("timerStop!");
      const eventValues = event.data.value;
      console.log(eventValues);

      putTime(db, eventValues.day, eventValues.dayTime, eventValues.id);

      if (activeIframeId == eventValues.id) {
        activeIframeId = -1;
      }
      break;
    }
    default: {
      console.log("event not found:");
      console.log(event.data);
      break;
    }
  }
});

getTimerDB().then((getedDB) => {
  db = getedDB;
  /*
    getDataById(db, "timeres", 12).then((rara)=>{
        console.log(rara)
    });
    clearAllStoreData(db, "timeres");
    updateDataById(db, "timeres", {title: "Tramworks"}, 36).then((rara)=>{
    });
    deleteDataById(db, "timeres", 0).then((rara)=>{
        console.log(rara)
    });
    addData(db, "timeres", {title:"生活", elapsedTime:0, active:0}).then((rara)=>{
        console.log(rara)
    });
    */

  getAllStoreData(db, "timeres").then((datas) => {
    console.log(datas);

    createTimerList(datas);
  });
});
