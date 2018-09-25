<template>
  <h1>HomeList。。。</h1>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'HomeManage',
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
  }
}
</script>
<style scoped>
</style>
