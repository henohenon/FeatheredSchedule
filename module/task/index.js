function formatDateToISOString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月は0から始まるため+1、2桁になるようにパディング
  const day = String(date.getDate()).padStart(2, "0"); // 日を2桁になるようにパディング
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
  return formattedDate;
}
function parseISOStringToDate(isoString) {
  const parts = isoString.split("T");
  const datePart = parts[0].split("-");
  const timePart = parts[1].split(":");

  const year = parseInt(datePart[0], 10);
  const month = parseInt(datePart[1], 10) - 1; // 月は0から始まるため、1を引く
  const day = parseInt(datePart[2], 10);
  const hours = parseInt(timePart[0], 10);
  const minutes = parseInt(timePart[1], 10);

  const date = new Date(year, month, day, hours, minutes);
  return date;
}
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export { formatDate, formatDateToISOString, parseISOStringToDate };
