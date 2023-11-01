const myOrigin = window.location.origin;

const timerTitle = document.getElementById("timerTitle");
const timerText = document.getElementById("timerText");
const cardBody = document.getElementById("cardBody");

let timerId = -1;
let elapsedTime = 0;
let startTime = 0;
let intervalId = null;
let isRunning = false;

window.addEventListener("message", function (event) {
  if (event.origin !== myOrigin) {
    return;
  }

  switch (event.data.action) {
    case "setData": {
      // 各値を更新。valueに含まれなかった場合は変更しない。
      const setValues = event.data.value;
      if (setValues) {
        if ("id" in setValues) {
          timerId = setValues.id;
        }
        if ("title" in setValues) {
          timerTitle.innerText = setValues.title;
        }
        if ("elapsedTime" in setValues) {
          elapsedTime = setValues.elapsedTime;
          updateDisplay(elapsedTime);
        }
      }
      break;
    }
    case "startTimer": {
      startTimer();
      break;
    }
    case "stopTimer": {
      stopTimer();
      break;
    }
    default: {
      console.log("event not found:");
      console.log(event.data);
      break;
    }
  }
});

cardBody.addEventListener("click", function () {
  if (!isRunning) {
    startTimer();
  } else {
    stopTimer();
  }
});

function startTimer() {
  isRunning = true;

  const now = new Date().getTime();
  startTime = now - elapsedTime;
  intervalId = setInterval(timerTick, 10);

  window.parent.postMessage(
    { action: "startedTimer", value: { id: timerId, startTime: startTime } },
    myOrigin
  );
}

function stopTimer() {
  isRunning = false;

  elapsedTime = new Date().getTime() - startTime;
  clearInterval(intervalId);
  intervalId = null;

  window.parent.postMessage(
    {
      action: "stoppedTimer",
      value: { id: timerId, elapsedTime: elapsedTime, startTime: startTime },
    },
    myOrigin
  );
}

function timerTick() {
  const now = new Date().getTime();
  const elapsed = now - startTime;
  updateDisplay(elapsed);
}

function updateDisplay(elapsed) {
  const hours = padZero(Math.floor(elapsed / 3600000));
  const minutes = padZero(Math.floor((elapsed % 3600000) / 60000));
  const seconds = padZero(Math.floor((elapsed % 60000) / 1000));
  const milliseconds = padZero(Math.floor((elapsed % 1000) / 10)); // 2桁にするために10で割る
  timerText.innerText = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}
function padZero(number) {
  return number.toString().padStart(2, "0");
}
