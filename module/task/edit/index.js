const myOrigin = window.location.origin;

window.onload = function () {
  const editButton = document.getElementById("editTaskButton");
  editButton.addEventListener("click", () => {
    if (edittingId !== null) {
      const taskInputIframe = document.getElementById("inputTask");
      taskInputIframe.contentWindow.postMessage(
        { action: "getTaskInput" },
        myOrigin
      );
    }
  });
};

let edittingId = null;

window.addEventListener("message", function (event) {
  if (event.origin !== myOrigin) {
    return;
  }

  switch (event.data.action) {
    case "setTaskData": {
      edittingId = event.data.value.id;
      const taskInputIframe = document.getElementById("inputTask");
      taskInputIframe.contentWindow.postMessage(
        { action: "setTaskInput", value: event.data.value.data },
        myOrigin
      );
      break;
    }
    case "returnTaskInput": {
      window.parent.postMessage(
        {
          action: "editTask",
          value: { id: edittingId, data: event.data.value },
        },
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
