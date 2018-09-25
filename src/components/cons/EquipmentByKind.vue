<template>
  <h1>EquipmentByKind。。。</h1>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'EquipmentByKind',
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
