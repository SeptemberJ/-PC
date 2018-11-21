<template>
  <div class="Socket">
    <Row>
      <Col span="24">
        <div :class="SocketStatus == 0?'switchBox switchBoxNoraml':'switchBox switchBoxActive'">
          <h2>{{SocketStatus == 0 ? '关' : '开'}}</h2>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
// import {mapState} from 'vuex'
export default {
  name: 'Socket',
  data () {
    return {
      SocketStatus: 1 // 0-close 1-open
    }
  },
  computed: {
  },
  watch: {
    lightValue: function (val) {
      this.setLight()
    }
  },
  components: {
  },
  methods: {
    setLightValue (val) {
      console.log(val)
    },
    setLight () {
    }
  }
}
</script>
<style lang="less" scoped>
.Socket{
  width: 250px;
  height: 350px;
  background: #f0f0f0;
  margin: 0 auto;
  position: relative;
  .switchBox{
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    margin: 125px auto;
    border-radius: 50%;
    cursor: pointer;
  }
  .switchBoxNoraml{
    color: #ccc;
    border: 5px solid #ccc;
    box-shadow: 0px 0px 10px #ccc;
  }
  .switchBoxNoraml:hover{
    font-size: 16px;
    box-shadow: 0px 0px 10px #333;
  }
  .switchBoxActive{
    color: #57a3f3;
    border: 5px solid #57a3f3;
    box-shadow: 0px 0px 10px #57a3f3;
  }
  .switchBoxActive:hover{
    font-size: 16px;
    box-shadow: 0px 0px 10px #13227a;
  }
}
</style>
