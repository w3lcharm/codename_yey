module.exports = function intToHex(num) {
  let hexStr = num.toString(16);

  while (hexStr.length < 6) {
    hexStr = "0" + hexStr;
  }

  return `#${hexStr}`;
}