export function chineseToPinyin(str) {
  var pinyin = "";
  var charCode;
  for (var i = 0, len = str.length; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode > 255) {
      pinyin += convertChar(charCode);
    } else {
      pinyin += str.charAt(i);
    }
  }
  return pinyin;
}
