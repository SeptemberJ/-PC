<template>
  <div id="mqttws">
    <input type="text" id="msg" v-model="msg"/>
    <input type="button" value="Send" @click="send" />
    <input type="button" value="Start" @click="start"/>
    <input type="button" value="Stop" @click="stop"/>
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.2/mqttws31.js"></script>
<script>
export default {
  data() {
    return {
      client: new Paho.MQTT.Client('116.62.171.244', 61613, ''), // 第三个参数是clientID可以为空
      topic: 'mqtt' // 订阅的主题
    }
  },
  methods: {
    onConnectionLost: function (responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log('onConnectionLost:' + responseObject.errorMessage)
        console.log('连接已断开')
      }
    },
    onMessageArrived: function(message) {
      console.log("收到消息:"+message.payloadString)
    },
    onConnect: function() {
      console.log('onConnected')
      this.client.subscribe(this.topic) // 订阅主题
    }
  },
  created: function() {
    this.client.connect({onSuccess: this.onConnect}) // 连接服务器并注册连接成功处理事件
    this.client.onConnectionLost = this.onConnectionLost // 注册连接断开处理事件
    this.client.onMessageArrived = this.onMessageArrived // 注册消息接收处理事件
    // this.client.disconnect() // 断开连接
  }
}
// export default {
//   name: 'Problem',
//   data () {
//     return {
//       hostname: '39.106.63.136',
//       port: 443,
//       clientId: 'clientId-NX75qTbKES',
//       timeout: 5,
//       keepAlive: 50,
//       cleanSession: false,
//       ssl: false,
//       userName: 'hj',
//       password: '123456',
//       topic: '001/in',
//       client: {},
//       options: {},
//       msg: 'order',
//       count: 0
//     }
//   },
//   created () {
//     this.client = new Paho.MQTT.Client('116.62.171.244', 61623, '') // 116.62.171.244
//     console.log(this.client)
//     var _client = this.client
//     var opt = this.options = {
//       invocationContext: {
//         hostname: '116.62.171.244',
//         port: 61623,
//         path: _client.path,
//         clientId: 'clientId-NX75qTbKES'
//       },
//       timeout: 5,
//       keepAliveInterval: 50,
//       cleanSession: false,
//       useSSL: false,
//       userName: 'hj',
//       password: '123456',
//       onSuccess: function() {
//         console.log("onConnected----------------")
//         // _client.subscribe('00000001/Config')
//       },
//       onFailure: function (e) {
//         console.log("onConnected fail----------------")
//         console.log(e)
//       }
//     }
//     this.client.connect(opt)
//     this.client.onConnectionLost = this.onConnectionLost
//     this.client.onMessageArrived = this.onMessageArrived
//   },
//   methods: {
//     onConnectionLost: function(responseObject) {
//       if (responseObject.errorCode !== 0) {
//         console.log("onConnectionLost:" + responseObject.errorMessage)
//         console.log("连接已断开")
//       }
//     },
//     onMessageArrived: function(message) {
//       console.log("收到消息:" + message.payloadString)
//     },
//     onConnect: function() {
//       console.log("onConnected========================")
//       this.client.subscribe('001/in')
//     },
//     send: function() {
//       var s = this.msg
//       if (s) {
//         s = "{time:" + new Date() + ", content:" + (s) + ", from: web console}"
//         var message = new Paho.MQTT.Message(s)
//         message.destinationName = this.topic
//         this.client.send(message)
//         this.msg = ''
//       }
//     },
//     start: function() {
//       window.tester = window.setInterval(function() {
//         if (this.client.isConnected) {
//           var s = "{time:" + new Date()+ ", content:" + (this.count++) + ", from: web console}"
//           var message = new Paho.MQTT.Message(s)
//           message.destinationName = this.topic
//           this.client.send(message)
//         }
//       }.bind(this), 1000)
//     },
//     stop: function() {
//       window.clearInterval(window.tester)
//     }
//   }
// }
</script>
<style scoped>
</style>
