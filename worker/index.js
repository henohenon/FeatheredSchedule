import {
  initialize,
  updateTask,
  archiveTask,
  getAllTask,
} from "../dbWrapper/task/index.js";

let db,
  tasks = null;
async function onload() {
  try {
    if (db == null) {
      db = await initialize();
      tasks = await getAllTask(db);
      messageToAllPort("initSuccess!");
    }
  } catch (error) {
    messageToAllPort("error!");
  }
}
onload();

const connectedPorts = [];

onconnect = async function (e) {
  const port = e.ports[0];
  connectedPorts.push(port);
  port.onmessage = async function (e) {
    const msgData = e.data;
    switch (msgData.action) {
      case "getAllTask": {
        if (tasks != null) {
          port.postMessage({ action: "setAllTask", value: tasks });
        }
        break;
      }
      case "updateTask": {
        if (tasks == null) {
          port.postMessage({ action: "error", value: "tasks was no data" });
          break;
        }
        try {
          const result = await updateTask(
            db,
            msgData.value.data,
            msgData.value.id
          );
          tasks[result.id] = result.data;
          port.postMessage({ action: "editedTask", value: result });
          break;
        } catch (error) {
          port.postMessage(error);
          break;
        }
      }
      case "archiveTask": {
        if (tasks == null) {
          port.postMessage({ action: "error", value: "tasks was no data" });
          break;
        }
        try {
          const result = await archiveTask(db, msgData.value);
          tasks[result.id] = result.data;
          port.postMessage({ action: "archivedTask", value: result });
          break;
        } catch (error) {
          port.postMessage(error);
          break;
        }
      }
    }
  };
};

function messageToAllPort(msg) {
  postMessage.forEach((element) => {
    element.postMessage(msg);
  });
}
