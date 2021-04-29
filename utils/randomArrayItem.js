module.exports = function randomArrayItem(arr) {
  return arr[Math.round(Math.random() * (arr.length - 1))];
}