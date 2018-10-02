<template>
  <div>
    <h1>HomeList。。。</h1>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {Encrypt, Decrypt} from '../../util/util'
export default {
  name: 'HomeManage',
  data () {
    return {
      cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        }
      ],
      model1: ''
    }
  },
  computed: {
    ...mapState({
      curMenu: state => state.sider.curMenu
    })
  },
  created () {
    console.log('111111111111111111111111')
    let t = Encrypt('要加密的字符串')
    console.log(t)
    console.log(Decrypt(t))
  },
  methods: {
  }
}
</script>
<style scoped>
</style>
