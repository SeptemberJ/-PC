<template>
  <div id="mqttws">
   <!--  <input type="text" id="msg" v-model="msg"/>
    <input type="button" value="Send" @click="send" />
    <input type="button" value="Start" @click="start"/>
    <input type="button" value="Stop" @click="stop"/> -->
  </div>
</template>
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.2/mqttws31.js"></script> -->
<script>
import '../util/mqttws31'
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
</script>
<style scoped>
</style>
