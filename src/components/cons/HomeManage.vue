<template >
  <div>
    <Edithome v-show="isshow"/>
  </div>
</template>
<script>

import {mapState, mapActions} from 'vuex'
import Edithome from './Edithome.vue'
export default {
  name: 'HomeManage',
  data () {
    return {
      isshow: true,
      show: false,
      homeshowtype: '',
      modal3: false
    }
  },
  computed: {
    ...mapState({
      curMenu: state => state.sider.curMenu
    })
  },
  created: function () {
    this.gethomeshowtype()
  },
  components: {
    Edithome
  },
  methods: {
    ...mapActions([
      'changeCurHome',
      'changeHomeList'
    ]),
    gethomeshowtype () {
      console.log(11111)
      console.log(this.$store.state.home.CurType)
      this.homeshowtype = this.$store.state.home.CurType
      console.log(this.homeshowtype === 5)
      if (this.homeshowtype === 0) {
        this.isshow = true
        this.show = false
      } else if (this.homeshowtype === 5) {
        this.isshow = false
        this.show = true
      }
    },
    changetype () {
      this.changehomeshowtype(this.homeshowtype)
      console.log(1111)
      console.log(this.$store.state.homeshowtype)
    }
  }
}
</script>
<style scoped>
.homeManage{
  margin: 20px 0;
}
.homeManage h1{
  color: #fff;
}
.model{
  height:120px;
}
.icon{
  width: 80px;
  height: 80px;
  background-color: antiquewhite;
  border-radius: 8px;
  margin-left: 10px;
  margin-top: 10px;
}
.button{
  width:70px;
  height:26px;
  margin-top:6px;
  font-size:14px;
  padding-top:0;
}
p{
  font-size: 16px;
  line-height: 30px
}
</style>
