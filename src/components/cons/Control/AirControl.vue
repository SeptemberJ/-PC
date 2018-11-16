<template>
  <div class="AirControl">
    <Row>
      <Col span="24" class="TextAlignR">
        <img class="CursorPointer powerIcon" style="width: 20px;height:20px;margin: 10px;" src="../../../../static/img/icons/powerRed.png">
      </Col>
      <Col span="24">
        <div class="curNumberBox">
          <Row>
            <Col span="24">
              <img class="CursorPointer" src="../../../../static/img/icons/controlUp.png" @click="addTemperature">
            </Col>
            <Col span="24">
              <p>{{temperature}}<span class="smallSize">℃</span></p>
            </Col>
            <Col span="24">
              <img class="CursorPointer" src="../../../../static/img/icons/controlDown.png" @click="minTemperature">
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
    <Row class="footerBox">
      <Col class="iconItem" span="6">
        <img src="../../../../static/img/icons/airCold.png">
        <span>制冷</span>
      </Col>
      <Col class="iconItem" span="6">
        <img src="../../../../static/img/icons/airFire.png">
        <span>制热</span>
      </Col>
      <Col class="iconItem" span="6">
        <img src="../../../../static/img/icons/airshidu.png">
        <span>除湿</span>
      </Col>
      <Col class="iconItem" span="6">
        <img src="../../../../static/img/icons/airshangxia.png">
        <span>上下扫风</span>
      </Col>
            <Col class="iconItem" span="6">
        <img src="../../../../static/img/icons/airzuoyou.png">
        <span>左右扫风</span>
      </Col>
    </Row>
  </div>
</template>

<script>
// import {mapState} from 'vuex'
// import NoData from '../../NoData.vue'
export default {
  name: 'AirControl',
  data () {
    return {
      temperature: 30
    }
  },
  computed: {
  },
  watch: {
  },
  components: {
  },
  methods: {
    addTemperature () {
      this.temperature++
    },
    minTemperature () {
      this.temperature--
    }
  }
}
</script>
<style lang="less" scoped>
.AirControl{
  width: 250px;
  height: 350px;
  background: #f0f0f0;
  margin: 0 auto;
  position: relative;
  .powerIcon:hover{
    box-shadow: 0 0 10px #57a3f3;
    border-radius: 50%;
  }
  .curNumberBox{
    margin-top: -10px;
    img{
      width: 50px;
      height: 50px;
    }
    img:hover{
      box-shadow: 0 0 10px #57a3f3;
    }
    p{
      font-size: 36px;
      font-weight: bold;
      color: #57a3f3;
    }
  }
  .footerBox{
    width: 100%;
    height: 150px;
    background: #d9d9d9;
    position: absolute;
    left: 0;
    bottom: 0;
    .iconItem{
      height: 50px;
      cursor: pointer;
      margin-top: 5px;
      img{
        width: 25px;
        height: 25px;
        margin: 5px auto;
        border: 1px solid #ccc;
        border-radius: 50%;
        display: block;
      }
      span{
        font-size: 10px;
      }
    }
    .iconItem:hover img{
      box-shadow: 0 0 10px #57a3f3;
    }
    .iconItem:hover span{
      color: #57a3f3;
    }
  }
}

</style>
