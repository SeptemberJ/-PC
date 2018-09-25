<template>
  <h1>FeedBack。。。</h1>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'FeedBack',
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
