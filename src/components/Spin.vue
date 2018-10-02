<template>
  <Row type="flex" justify="center" class="code-row-bg" style="background: pink;opacity:.7;position: fixed;top:0;left:200px;margin-left:-200px;z-index:99999;width:100%;height:100%;">
    <Col class="demo-spin-col" span="24">
      <Spin fix>
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
    </Col>
  </Row>

</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'Problem',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      curMenu: state => state.sider.curMenu
    })
  },
  methods: {
    handleSpinCustom () {
      this.$Spin.show({
        render: (h) => {
          return h('div', [
            h('Icon', {
              'class': 'demo-spin-icon-load',
              props: {
                type: 'ios-loading',
                size: 18
              }
            }),
            h('div', 'Loading')
          ])
        }
      })
      setTimeout(() => {
        this.$Spin.hide()
      }, 3000)
    }
  }
}
</script>
<style scoped>
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
</style>
