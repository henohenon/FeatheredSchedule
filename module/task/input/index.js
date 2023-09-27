import { formatDateToISOString } from "../index.js";

const myOrigin = window.location.origin;
window.addEventListener("message", function (event) {
  if (event.origin !== myOrigin) {
    return;
  }

  //console.log(event.data);
  switch (event.data.action) {
    case "setTaskInput": {
      setTaskInput(event.data.value);
      break;
    }
    case "getTaskInput": {
      window.parent.postMessage(
        { action: "returnTaskInput", value: getTaskInput() },
        myOrigin
      );
      break;
    }
    default: {
      console.log("event not found:");
      console.log(event.data);
      break;
    }
  }
});

function setTaskInput(data) {
  let memoInput = document.querySelector("textArea");
  memoInput.value = data.memo;

  let otherInputs = document.querySelectorAll("input");
  otherInputs[0].value = "";
  otherInputs[1].value = formatDateToISOString(new Date(parseInt(data.limit)));
  otherInputs[2].value = data.amount;
  otherInputs[3].value = "";
  otherInputs[4].value = formatDateToISOString(new Date(parseInt(data.start)));
  otherInputs[5].checked = data.done;
}

function getTaskInput() {
  let result = {};

  let memoInput = document.querySelector("textArea");
  result["memo"] = memoInput.value;

  let otherInputs = document.querySelectorAll("input");
  result["limit"] = otherInputs[1].value;
  result["amount"] = otherInputs[2].value;
  result["start"] = otherInputs[4].value;
  result["done"] = otherInputs[5].value == "on" ? 1 : 0;

  return result;
}
