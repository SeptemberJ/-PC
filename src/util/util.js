import CryptoJS from 'crypto-js'
export function Encrypt (plaintText) {
  var keyStr = 'btsby123btsby123'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  // var iv = CryptoJS.enc.Utf8.parse('qwertyuiopasdfgh')
  var encryptedData = CryptoJS.AES.encrypt(plaintText, key, {
    // iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  // var encryptedBase64Str = encryptedData.toString()
  var encryptedStr = encryptedData.ciphertext.toString()
  return encryptedStr
}

// AES解密
export function Decrypt (encryptedStr) {
  var keyStr = 'btsby123btsby123'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedStr)
  var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8)
  return decryptedStr
}

// 创建cookie
export function setCookie (cname, cvalue, exdays) {
  var d = new Date()
  d.setTime(d.getTime() + (exdays * 60 * 60 * 1000))
  // d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  console.info(cname + '=' + cvalue + '; ' + expires)
  document.cookie = cname + '=' + cvalue + '; ' + expires
}

// 获取cookie
export function getCookie (cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1)
    if (c.indexOf(name) !== -1) return c.substring(name.length, c.length)
  }
  return ''
}

// 删除cookie
export function clearCookie (name) {
  setCookie(name, '', -1)
}
