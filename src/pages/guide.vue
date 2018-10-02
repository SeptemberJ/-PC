<template>
  <div class="guide" :style="{minHeight: windowHeight + 'px'}">
    <div class="guideMain">
      <img src="../../static/img/guide.png">
      <h2>创建您的第一个智慧家庭</h2>
      <Button class="createBt" type="primary" shape="circle" icon="" @click="toCreateHome">开启智慧生活</Button>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'Guide',
  data () {
    return {
    }
  },
  created () {
    this.windowHeight = window.innerHeight
  },
  computed: {
    ...mapState({
      curMenu: state => state.sider.curMenu
    })
  },
  methods: {
    toCreateHome () {
      this.$router.push({name: 'CreateHome'})
    }
  }
}
</script>
<style lang="less" scoped>
@bgPrimary: #2d8cf0;
.guide{
  width: 100%;
  background: #fff;
  .guideMain{
    width: 320px;
    height: 500px;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    img{
      width: 320px;
      height: 320px;
    }
    .createBt{
      width: 200px;
      margin-top: 40px;
      animation: GrayToNormal 2s ease-in-out infinite;
      -webkit-animation: GrayToNormal 2s ease-in-out infinite;
      -ms-animation: GrayToNormal 2s ease-in-out infinite;
      animation-fill-mode: forwards;
      animation-delay: 0s;
    }
    @keyframes GrayToNormal
    {
      0% {
         filter: opacity(1);
         transform: scale(1, 1);
      }
      50% {
        filter: opacity(1);
        transform: scale(1.08, 1.08);
      }
      100% {
        filter: opacity(1);
        transform: scale(1, 1);
      }
    }
    @-webkit-keyframes GrayToNormal /*Safari and Chrome*/
    {
      0% {
         -webkit-filter: opacity(1);
         -webkit-transform: scale(1, 1);
      }
      50% {
        -webkit-filter: opacity(1);
        -webkit-transform: scale(1.08, 1.08);
      }
      100% {
        -webkit-filter: opacity(1);
        -webkit-transform: scale(1, 1);
      }
    }
  }
}
</style>
