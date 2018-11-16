<template>
  <div class="Control">
    <Light/>
    <!-- <AirControl/> -->
  </div>
</template>

<script>
// import {mapState} from 'vuex'
import Light from './Light.vue'
import AirControl from './AirControl.vue'
export default {
  name: 'Control',
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
