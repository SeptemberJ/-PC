<template>
  <h1>Problem。。。</h1>
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
  }
}
</script>
<style scoped>
</style>
