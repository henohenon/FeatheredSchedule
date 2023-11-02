const myOrigin = window.location.origin;

const timerTitle = document.getElementById("timerTitle");
const todayText = document.getElementById("todayText");
const monthText = document.getElementById("monthText");
const cardBody = document.getElementById("cardBody");

let timerId = -1;
let dayTime = 0;
let monthSumTime = 0;
let startTime = 0;
let todayStr = getTodayStr();
let times = {};
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
        if ("times" in setValues) {
          times = setValues.times;

          todayStr = getTodayStr();
          if (times.hasOwnProperty(todayStr)) {
            dayTime = times[todayStr];
            todayText.innerText = formatTimeToDisplayStr(dayTime);
          }
          console.log(monthText);
          monthSumTime = getMonthSum(times);
          monthText.innerText = formatTimeToDisplayStr(monthSumTime);
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

  startTime = new Date().getTime();
  intervalId = setInterval(timerTick, 10);

  window.parent.postMessage(
    { action: "startedTimer", value: { id: timerId, startTime: startTime } },
    myOrigin
  );
}

function stopTimer() {
  isRunning = false;

  const elapsed = new Date().getTime() - startTime;
  dayTime += elapsed;
  clearInterval(intervalId);
  intervalId = null;

  window.parent.postMessage(
    {
      action: "stoppedTimer",
      value: {
        id: timerId,
        day: todayStr,
        dayTime: dayTime,
        startTime: startTime,
      },
    },
    myOrigin
  );
}

function timerTick() {
  const now = new Date().getTime();
  const elapsed = now - startTime;

  const dayElapsed = dayTime + elapsed;
  todayText.innerText = formatTimeToDisplayStr(dayElapsed);
  const monthElapsed = monthSumTime + elapsed;
  monthText.innerText = formatTimeToDisplayStr(monthElapsed);
}

function formatTimeToDisplayStr(elapsed) {
  const hours = padZero(Math.floor(elapsed / 3600000));
  const minutes = padZero(Math.floor((elapsed % 3600000) / 60000));
  const seconds = padZero(Math.floor((elapsed % 60000) / 1000));
  const milliseconds = padZero(Math.floor((elapsed % 1000) / 10)); // 2桁にするために10で割る
  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}
function padZero(number) {
  return number.toString().padStart(2, "0");
}

function getTodayStr() {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return formattedDate;
}

function getMonthSum(data) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 0から始まるので+1
  const currentYear = now.getFullYear();

  let sum = 0;
  for (const [date, value] of Object.entries(data)) {
    const [year, month] = date.split("-").map(Number);
    if (year === currentYear && month === currentMonth) {
      sum += value;
    }
  }

  return sum;
}
