<template>
  <h1>EquipmentByRoom。。。</h1>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'EquipmentByRoom',
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
