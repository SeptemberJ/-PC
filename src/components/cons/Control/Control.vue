<template>
  <div class="Control">
    <Light v-if="curEqType == '022'" :curEq="curEq" @toggleSwitchFn="toggleSwitch"/>
    <AirControl v-if="curEqType == '051' || curEqType == '052'" :curEq="curEq"/>
    <Socket v-if="curEqType == '081' || curEqType == '082'" :curEq="curEq"/>
  </div>
</template>

<script>
// import {mapState} from 'vuex'
import Light from './Light.vue'
import AirControl from './AirControl.vue'
import Socket from './Socket.vue'
export default {
  name: 'Control',
  props: ['curEqType', 'curEqIndex', 'curEq'],
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  components: {
    Light,
    AirControl,
    Socket
  },
  methods: {
    toggleSwitch () {
      // this.$emit('toggleSwitchFunction', this.curEq, this.curEqIndex)
    }
  }
}
</script>
<style lang="less" scoped>
.Control{
}
</style>
