<template>
  <div class="article">
    <Row>
      <Col span="12" class="PaddingL_16"><h1>文章列表</h1></Col>
    </Row>
    <Row>
      <Col span="24" class="PaddingL_16" v-html="detail"><h1>文章列表</h1></Col>
    </Row>
  </div>
</template>

<script>
// import {mapState} from 'vuex'
// import NoData from '../../NoData.vue'
export default {
  name: 'Problem',
  data () {
    return {
      detail: '<h1>文章内容</h1><p>文章内容</p>'
    }
  },
  computed: {
  },
  watch: {
  },
  components: {
  },
  methods: {
    
  }
}
</script>
<style lang="less" scoped>
.article{
  margin: 10px 0;
  h1{
    color: #fff;
  }
}
</style>
