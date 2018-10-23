<template>
  <Row v-if="ifSpin" type="flex" justify="center" class="code-row-bg" style="background: #eee;opacity:.5;position: fixed;top:0;left:200px;margin-left:-200px;z-index:99999;width:100%;height:100%;">
 <!--  <Row  v-if="ifSpin" type="flex" justify="center" class="code-row-bg" style="background: #fff;opacity:.3;position: fixed;top:80px;left:25%;z-index:99999999;width:100%;height:90%;"> -->
    <Col class="demo-spin-col" span="24">
      <Spin fix style="">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>加载中...</div>
      </Spin>
    </Col>
  </Row>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
  name: 'Problem',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      curMenu: state => state.sider.curMenu,
      ifSpin: state => state.ifSpin,
      ifShowChart: state => state.ifShowChart
    })
  },
  watch: {
    ifShowChart: function (val) {
      if (!val) {
        this.toggleSpin(false)
      }
    }
  },
  methods: {
    ...mapActions([
      'toggleSpin'
    ])
  }
}
</script>
<style scoped>
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
</style>
