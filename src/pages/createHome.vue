<template>
	<div class="createHome" :style="{minHeight: windowHeight + 'px'}">
    <div class="glass" :style="{minHeight: windowHeight + 'px'}"></div>
	  <div class="homeBox">
			<div class="formBox">
				<Form :model="homeinfo" label-position="left" :label-width="100">
	        <FormItem label="家庭名称">
	          <Input v-model="homeinfo.name"></Input>
	        </FormItem>
	        <FormItem label="家庭地址">
	            <Input v-model="homeinfo.address"></Input>
	        </FormItem>
	        <Row class="tipsTit">
		        <Col span="8">在哪些房间有智能设备</Col>
		        <Col span="8" offset="8" class="TextAlignR CursorPointer"><span @click="addOtherRoom">添加其他房间</span></Col>
			    </Row>
			    <Row>
			    	<Col span="24">
				    	<CheckboxGroup v-model="choosedRoom">
				        <Checkbox :label="Room.dhouse_name" v-for="(Room, idx) in defaultRoomList" :key="idx"></Checkbox>
					    </CheckboxGroup>
				    </Col>
			    </Row>
			    <Row>
			    	<Col span="24" class="TextAlignC">
			    		<Button type="primary" @click="createHome">确认创建</Button>
			    	</Col>
			    </Row>
	      </Form>
			</div>
		</div>
	</div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
import {send} from '../util/send'
export default {
  name: 'CreateHome',
  data () {
  	return {
  		homeinfo: {
        name: '',
        address: ''
      },
      newRommName: '',
  		defaultRoomList: [],
  		choosedRoom: [],
  		roomsFormat: []
  	}
  },
  watch: {
    choosedRoom (curVal, oldVal) {
    	let temp = []
      curVal.map((name) => {
      	temp.push({'house_name': name})
      })
      this.roomsFormat = temp
    }
  },
  created () {
    this.windowHeight = document.body.clientHeight
    // this.windowHeight = window.innerHeight
    this.getDefaultRooms()
  },
  computed: {
    ...mapState({
      curMenu: state => state.sider.curMenu
    })
  },
  methods: {
    ...mapActions([
      'changeCurHome'
    ]),
  	getDefaultRooms () {
  		send({
        name: '/house_default',
        method: 'GET',
        data: {
        }
      }).then(_res => {
      	let temp = []
      	_res.data.houseListDefault.map((item) => {
        	temp.push(item.dhouse_name)
        })
        this.defaultRoomList = _res.data.houseListDefault
        this.choosedRoom = temp
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
  	},
  	createHome () {
  		if (!this.homeinfo.name || this.homeinfo.name.trim() === '') {
  			this.$Message.error('家庭名称不能为空')
  			return false
  		}
  		if (!this.homeinfo.address || this.homeinfo.address.trim() === '') {
  			this.$Message.error('家庭地址不能为空')
  			return false
  		}
  		if (this.roomsFormat.length === 0) {
  			this.$Message.error('至少选择一个房间')
  			return false
  		}
  		send({
        name: '/home',
        method: 'POST',
        data: {
        	'home': [
	        	{
		  				'home_name': this.homeinfo.name.trim(),
		  				'faddress': this.homeinfo.address.trim(),
		  				'register_id': this.$store.state.register_id
		  			}
        	],
	  			'house_member': this.roomsFormat
        }
      }).then(_res => {
	      switch (_res.data.code) {
	      	case 1:
  	      	// this.$Message.success('创建成功!')
            this.updateCurHome(_res.data.home_id)
  	      	// this.$router.push({name: 'Home'})
  	      	break
	      	default:
	      	  this.$Message.error(_res.data.message)
	      }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
  	},
    updateCurHome (HomeId) {
      send({
        name: '/home?isdefault=1&id=' + HomeId + '&home_name=' + this.homeinfo.name.trim() + '&faddress=' + this.homeinfo.address.trim() + '&register_id=' + this.$store.state.register_id,
        method: 'PUT',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.$Message.success('设置成功!')
            // 更新当前家
            let CurHomeTemp = {
              home_name: this.homeinfo.name.trim(),
              faddress: this.homeinfo.address.trim(),
              home_id: HomeId,
              isCreater: true,
              isdefault: 1,
              register_id: this.$store.state.register_id
            }
            this.changeCurHome(CurHomeTemp)
            this.$router.push({name: 'Home'})
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    },
  	addOtherRoom () {
      this.$Modal.confirm({
      	onOk: () => {
        	this.defaultRoomList = [...this.defaultRoomList, {'dhouse_name': this.newRommName}]
        	this.choosedRoom = [...this.choosedRoom, this.newRommName]
        },
        render: (h) => {
          return h('Input', {
            props: {
              value: this.newRommName,
              autofocus: true,
              placeholder: '请输入房间名称...'
            },
            on: {
              input: (val) => {
                this.newRommName = val
              }
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@bgPrimary: #2d8cf0;
.createHome{
	width: 100%;
  .glass{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527675541760&di=ab2fabe587b140a66482d9cdf83d3bc9&imgtype=0&src=http%3A%2F%2Fn1.itc.cn%2Fimg8%2Fwb%2Frecom%2F2016%2F06%2F17%2F146614328257949855.JPEG') no-repeat center center/cover;
    filter: alpha(opacity=80);
    -webkit-filter: blur(2px);
  }
	.homeBox{
    width: 500px;
    position: relative;
    top: 50px;
    left: 0;
    z-index:9;
		margin: 0px auto;
		transform: translateY(30px);
		.triangle_border_up{
	    width:0;
	    height:0;
	    border-width:0 250px 150px;
	    border-style:solid;
	    border-color:transparent transparent @bgPrimary;
	    margin:0px auto;
	    position:relative;
		}
		.triangle_border_up span{
	    display:block;
	    width:0;
	    height:0;
	    border-width:0 28px 28px;
	    border-style:solid;
	    border-color:transparent transparent #fc0;
	    position:absolute;
	    top:0px;
	    left:0px;
		}
		.formBox{
			width: 450px;
			height: 400px;
			padding: 80px 20px 0 20px;
			margin: 0 auto;
			box-shadow: 0px 0px 10px #ccc;
			background: #fff;
			background-image: url('../../static/img/home.png');
			background-repeat: no-repeat;
			background-size: contain;
			background-position: bottom;
			.tipsTit{
				font-weight: 600;
				color: #333;
				margin: 10px auto 20px auto;
			}
			button{
				margin-top: 50px;
			}
		}
	}
}
</style>
