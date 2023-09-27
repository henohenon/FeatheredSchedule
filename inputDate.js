const weekDayPhrases = ["mon", "the", "wed", "thu", "fri", "sat", "sun"];

function formatStrToDate(inputStr) {
  weekSentence = containsStrFromList(inputStr, weekDayPhrases);
  if(weekSentence){
    }
}

function containsStrFromList(input, list) {
  for (let i = 0; i < list.length; i++) {
    if (input.includes(list[i])) {
      return i;
    }
  }
  return -1;
}

function getDateAfterWeeksAndDay(baseDate, weeks, dayOfWeek) {
  const daysPerWeek = 7;
  const millisecondsPerDay = 24 * 60 * 60 * 1000; // 1日のミリ秒数

  // 基準の日付に週数を加算
  const targetDate = new Date(
    baseDate.getTime() + weeks * daysPerWeek * millisecondsPerDay
  );

  // 指定の曜日までの日数を計算
  const currentDayOfWeek = targetDate.getDay();
  const daysToAdd = (dayOfWeek + daysPerWeek - currentDayOfWeek) % daysPerWeek;

  // 指定の曜日までの日数を加算
  targetDate.setDate(targetDate.getDate() + daysToAdd);

  return targetDate;
}

function getDateAfterDays(baseDate, days) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000; // 1日のミリ秒数
  const targetTimestamp = baseDate.getTime() + days * millisecondsPerDay;
  return new Date(targetTimestamp);
}

function getDateAfterTime(baseDate, hours, minutes, seconds) {
  const millisecondsPerHour = 60 * 60 * 1000; // 1時間のミリ秒数
  const millisecondsPerMinute = 60 * 1000; // 1分のミリ秒数
  const millisecondsPerSecond = 1000; // 1秒のミリ秒数

  const targetTimestamp =
    baseDate.getTime() +
    hours * millisecondsPerHour +
    minutes * millisecondsPerMinute +
    seconds * millisecondsPerSecond;

  return new Date(targetTimestamp);
}
