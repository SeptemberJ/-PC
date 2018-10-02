<template>
  <Row class="TextAlignC NoData">
    <Col class="demo-spin-col" span="24">
      <img src="../../static/img/icons/noData.png">
      <p>暂无数据</p>
    </Col>
  </Row>
</template>

<script>
export default {
  name: '暂无数据',
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.NoData{
  margin-top: 50px;
  img{
    width: 100px;
    height: 100px;
  }
}
</style>
