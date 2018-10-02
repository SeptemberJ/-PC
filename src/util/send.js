import axios from 'axios'
// import * as CryptoJS from 'crypto-js'
// import _ from 'underscore'

const URL_PREFIX = 'http://www.smart-hox.com:8081/hoxJK'

let clientId = localStorage['clientId']
let clientSecret = localStorage['clientSecret']

/**
 * 获取clientId
 * @returns {*}
 */
export function getClientId () {
  'use strict'
  return clientId
}

/**
 * 登陆后,注入clientId
 * @param id
 */
export function setClientId (id) {
  'use strict'
  clientId = id
  localStorage['clientId'] = id
}

/**
 * 登陆后,注入clientSecret
 * @param secret
 */
export function setClientSecret (secret) {
  'use strict'
  clientSecret = secret
  localStorage['clientSecret'] = secret
}

/**
 * 退出登录
 * 删除clientId和clientSecret
 */
export function logout () {
  'use strict'
  clientId = undefined
  delete localStorage['clientId']
  clientSecret = undefined
  delete localStorage['clientSecret']
}

export function send (options) {
  options.url = URL_PREFIX + options.name
  delete options.name
  return new Promise(function (resolve, reject) {
    axios(options).then((data) => resolve(data), (xhr) => reject(xhr && xhr.status))
  })
}
