<template>
  <div class="Control">
    <Light v-if="curEqType == '021' || curEqType == '022'"/>
    <AirControl v-if="curEqType == '051' || curEqType == '052'"/>
  </div>
</template>

<script>
// import {mapState} from 'vuex'
import Light from './Light.vue'
import AirControl from './AirControl.vue'
export default {
  name: 'Control',
  props: ['curEqType'],
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
    AirControl
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.Control{
}
</style>
