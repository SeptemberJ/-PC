import axios from 'axios'
// import * as $ from 'jquery'
// import * as CryptoJS from 'crypto-js'
// import _ from 'underscore'

const URL_PREFIX = 'http://www.smart-hox.com:8081/hoxJK'
// const URL_PREFIX = 'http://205.168.1.122:8081/hoxJK'

let registerId = localStorage['registerId']
let account = localStorage['account']

/**
 * 获取registerId
 * @returns {*}
 */
export function getRegisterId () {
  'use strict'
  return registerId
}

/**
 * 获取registerId
 * @returns {*}
 */
export function getAccount () {
  'use strict'
  return account
}

/**
 * 登陆后,注入registerId
 */
export function setRegisterId (id) {
  'use strict'
  registerId = id
  localStorage['registerId'] = id
}

/**
 * 登陆后,注入Account
 */
export function setAccount (phone) {
  'use strict'
  account = phone
  localStorage['account'] = phone
}

/**
 * 退出登录
 * 删除registerId和Account
 */
export function logout () {
  'use strict'
  registerId = undefined
  delete localStorage['registerId']
  account = undefined
  delete localStorage['account']
}

export function send (options) {
  const timestamp = Date.now()
  // alert((URL_PREFIX + options.name))
  // alert((URL_PREFIX + options.name).indexOf('?') == '-1')
  // debugger
  options.url = (URL_PREFIX + options.name).indexOf('?') == '-1' ? (URL_PREFIX + options.name + '?timestamp=' + timestamp) : (URL_PREFIX + options.name + '&timestamp=' + timestamp)
  // options.url = URL_PREFIX + options.name  + '?&timestamp=' + timestamp
  delete options.name
  return new Promise(function (resolve, reject) {
    switch (options.method) {
      case 'POST':
        axios.post(encodeURI(options.url), options.data
        ).then((res) => {
          resolve(res)
        }).catch((error) => {
          console.log(error)
          this.$Message.error('Interface Error!')
        })
        break
      case 'GET':
        axios.get(encodeURI(options.url), {headers: {'X-Timestamp': timestamp}}
        ).then((res) => {
          resolve(res)
        }).catch((error) => {
          console.log(error)
          this.$Message.error('Interface Error!')
        })
        break
      case 'DELETE':
        axios.delete(encodeURI(options.url)
        ).then((res) => {
          resolve(res)
        }).catch((error) => {
          console.log(error)
          this.$Message.error('Interface Error!')
        })
        break
      case 'PUT':
        axios.put(encodeURI(options.url)
        ).then((res) => {
          resolve(res)
        }).catch((error) => {
          console.log(error)
          this.$Message.error('Interface Error!')
        })
        break
    }
  })
}
// export function send0 (options) {
//   options.url = URL_PREFIX + options.name
//   delete options.name
//   return new Promise(function (resolve, reject) {
//     axios(options).then((data) => resolve(data), (xhr) => reject(xhr && xhr.status))
//   })
// }
