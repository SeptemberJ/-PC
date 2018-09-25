<template>
  <div class="layout">
    <Layout>
      <Sider ref="side1" :style="{position: 'fixed', left: 0, top: 0}" hide-trigger collapsible collapsed-width="100%" v-model="isCollapsed">
        <SIDER/>
      </Sider>
      <Layout class="mainContent" style="position:absolute;top:0;left:200px;">
        <Content :style="{margin: '20px', background: '#fff', minHeight: windowHeight + 'px'}">
            <CONTENT/>
        </Content>
      </Layout>
    </Layout>
      <TAB/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SIDER from './components/Sider.vue'
import TAB from './components/Tab.vue'
import CONTENT from './components/Content.vue'

export default {
  name: 'App',
  data () {
    return {
      isCollapsed: false,
      windowHeight: 0
    }
  },
  created () {
    this.windowHeight = window.innerHeight
  },
  computed: {
    ...mapState({
      curTab: state => state.sider.curTab
    })
  },
  components: {
    SIDER,
    TAB,
    CONTENT
  },
  methods: {
  }
}
</script>

<style lang="css" scoped>
.layout{
  border: 0px solid #d7dde4;
  background: #2d8cf0;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 600px
}
.layout-header-bar{
  background: #fff;
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
}
.layout-logo-left{
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon{
  transition: all .3s;
}
.rotate-icon{
  transform: rotate(-90deg);
}
.menu-item span{
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width .2s ease .2s;
}
.menu-item i{
  transform: translateX(0px);
  transition: font-size .2s ease, transform .2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span{
  width: 0px;
  transition: width .2s ease;
}
.collapsed-menu i{
  transform: translateX(5px);
  transition: font-size .2s ease .2s, transform .2s ease .2s;
  vertical-align: middle;
  font-size: 22px;
}
.mainContent{
  background: #fff !important;
}
</style>
