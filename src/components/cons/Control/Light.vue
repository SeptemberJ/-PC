<template>
  <div class="Light">
    <Row>
      <Col span="24">
        <div class="switchBox CursorPointer">
          <h2>开</h2>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <p>当前亮度： {{lightValue}}</p>
      </Col>
    </Row>
    <Row class="footerBox">
      <Col span="4"><img src="../../../../static/img/icons/lightWeak.png"></Col>
      <Col span="16">
        <Slider style="margin-top: 30px;" class="slider" v-model="lightValue" :step="10" show-stops @on-change="setLightValue"></Slider>
      </Col>
      <Col span="4"><img src="../../../../static/img/icons/lightStrong.png"></Col>
    </Row>
  </div>
</template>

<script>
// import {mapState} from 'vuex'
// import NoData from '../../NoData.vue'
export default {
  name: 'Light',
  data () {
    return {
      lightValue: 30
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
.Light{
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
    color: #57a3f3;
    margin: 20px auto;
    border: 5px solid #57a3f3;
    border-radius: 50%;
    box-shadow: 0px 0px 10px #57a3f3;
  }
  .footerBox{
    width: 100%;
    height: 80px;
    line-height: 80px;
    background: #d9d9d9;
    position: absolute;
    left: 0;
    bottom: 0;
    img{
      width: 20px;
      height: 20px;
    }
  }
}
</style>
