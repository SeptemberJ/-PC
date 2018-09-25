<template>
  <h1>AllEquipment。。。</h1>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'AllEquipment',
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
