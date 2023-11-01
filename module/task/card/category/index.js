data = null;
window.addEventListener("message", function (event) {
  if (event.origin !== myOrigin) {
    return;
  }

  switch (event.data.action) {
    case "setCategory": {
      console.log(event.data.value);
      const icon =this.document.getElementById('categoryIcon')
      data = event.data.value
      break;
    }
    default: {
      console.log("event not found:");
      console.log(event.data);
      break;
    }
  }
});
