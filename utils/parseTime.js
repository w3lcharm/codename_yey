module.exports = function parseTime(num) {
  const hours = Math.floor(num / 3600);
  let minutes = Math.floor((num - (hours * 3600)) / 60) ;
  let seconds = num - (hours * 3600) - (minutes * 60);

  if (hours && minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  return hours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}
