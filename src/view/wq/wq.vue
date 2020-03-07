<template>
	<div>
		<!--按钮部分-->
		<Card>
			<Tabs>
				<TabPane label="所有用户" >
					<!--表格部分-->
					<Card>
						<div>
							<Table :columns="columns" :data="tableData" border
							></Table>
						</div>
						<div style="margin: 10px;overflow: hidden">
							<div style="float: right;">
								<Page show-total show-elevator :total="page.total" :current="page.currentPage"
								      @on-change="handlePageTurn"></Page>
							</div>
						</div>
					</Card>
				</TabPane>
				<TabPane label="可疑用户" >
					<!--表格部分-->
					<Card>
						<div>
							<Table :columns="columns2" :data="tableData2" border
							></Table>
						</div>
						<div style="margin: 10px;overflow: hidden">
							<div style="float: right;">
								<Page show-total show-elevator :total="page2.total2" :current="page2.currentPage2"
								      @on-change="handlePageTurn2"></Page>
							</div>
						</div>
					</Card>
				</TabPane>
        <TabPane label="每日登记统计" >
          <Card class="count" style=" font-size: 30px;">
            <p class="red">可疑人数：{{countData.redD}}</p>
            <p>总人数：{{countData.totalD}}</p>
          </Card>
        </TabPane>
			</Tabs>

		</Card>

		<!--Modal-->
		<Modal v-model="isShow"  title="详情：" width="1000">
      <Card>
        <div>
          <Table :columns="detalColumns" :data="tableData3" border
          ></Table>
        </div>
      </Card>
			<div slot="footer">
				<Button type="primary" @click="isShow = false">确定</Button>
			</div>
		</Modal>
<!--    发送消息-->
    <Modal v-model="isShow2"  title="发送：" width="500">
      <Card>
        <div>
          <i-select :model.sync="model1" @on-change="onChange">
            <i-option v-for="item in tipList" :value="item.value"></i-option>
          </i-select>
          <div style="margin-top: 20px"></div>
          <i-input type="textarea" v-model="message" :autosize="{minRows: 6,maxRows: 8}" placeholder="请输入检测结果"></i-input>
        </div>
      </Card>
      <div slot="footer">
        <Button type="primary" @click="pushMessage">确定</Button>
      </div>
    </Modal>

	</div>
</template>

<script>
import {getList,getRedList,getDetail,pushMessage,isSendMsg,getCountList} from '../../api/wq'
import { wqColumns ,wqColumns2} from '../../libs/table'
import Config from '../../config/index'

export default {
  computed: {
    access () {
      return this.$store.state.user.access
    },
    viewAdd () { // 该用户是否拥有用户添加权限
      // return hasOneOf(['role-add'], this.access)
      return true
    },
    viewEdit () { // 该用户是否拥有用户信息编辑权限
      // return hasOneOf(['role-edit'], this.access)
      return true
    },
    viewDel () { // 该用户是否拥有用户删除权限
      // return hasOneOf(['role-del'], this.access)
      return true
    },
    viewDelMany () { // 该用户是否拥有用户删除权限
      // return hasOneOf(['role-delMany'], this.access)
      return true
    },
    viewAccess () {
      // if (hasOneOf(['role-access-add'], this.access) && hasOneOf(['role-access-del'], this.access)) {
      //   return true
      // } else {
      //   return false
      // }
      return true
    }
  },
  data () {
    return {
      countData:{},
      model1:'',
      tipList: [
        {
          value: '阴性',
          label: '您的新冠病毒核酸检测结果为阴性。'
        },
        {
          value: '阳性',
          label: '您的新冠病毒核酸检测提示可疑阳性，建议立即复诊！'
        },],
      message:null,
      receiverId:null,
      isShow2:false,
      processResult: null,
      handle: false,
      isShow: false,
      myHeader: { authorization: localStorage.getItem(Config.tokenName) },
      isAdd: false,
      isEdit: false,
      detalColumns:[
        {
          title: '填表时间',
          align: 'center',
          key: 'addTime'
        },

        {
          title: '3日内 (《12岁患儿2日内 )是否有发热、干咳、腹泻、乏力、咽痛等呼吸道症状？',
          align: 'center',
          key: 'answer1',
          render: (h, params) => {
            return h('span', [
              params.row.answer1 === 1 ? '是' : '否'
            ])
          }
        },
        {
          title: '14天内是否到过武汉及周边地区或接触过来自该地区人员？',
          align: 'center',
          key: 'answer2',
          render: (h, params) => {
            return h('span', [
              params.row.answer2 === 1 ? '是' : '否'
            ])
          }
        },
        {
          title: '4天内居住的社区或身边是否有新冠病毒感染者（核酸检测阳性者）？',
          align: 'center',
          key: 'answer3',
          render: (h, params) => {
            return h('span', [
              params.row.answer3 === 1 ? '是' : '否'
            ])
          }
        },
        {
          title: '14天内是否接触过有新冠肺炎报告病例社区的发热和呼吸道症状患者？',
          align: 'center',
          key: 'answer4',
          render: (h, params) => {
            return h('span', [
              params.row.answer4 === 1 ? '是' : '否'
            ])
          }
        },
        {
          title: '身边是否有2人或2人以上存在发热或者干咳、咽痛等呼吸道症状情况？',
          align: 'center',
          key: 'answer5',
          render: (h, params) => {
            return h('span', [
              params.row.answer1 === 5 ? '是' : '否'
            ])
          }
        },
        {
          title: '本次拟就诊科室',
          align: 'center',
          key: 'answer6'
        },
        {
          title: '初查结果',
          align: 'center',
          key: 'result',
          render: (h, params) => {
            return h('span', [
              params.row.result === 1 ? '待查' : '正常'
            ])
          }
        },
        // {
        //   title: '操作',
        //   align: 'center',
        //   key: 'handle',
        //   width: '250',
        //   render: (h, params) => {
        //     if (this.viewEdit || this.viewDel) {
        //       return h('div', [
        //         h('Button', {
        //           props: {
        //             type: 'error',
        //             disabled: params.row.ifSend === 1
        //           },
        //           style: {
        //             marginRight: '5px',
        //             display: params.row.result===1 ? 'inline-block' : 'none'
        //           },
        //           on: {
        //             click: () => {
        //               this.isShow2 = true
        //               this.msgId = params.row.id
        //               this.receiverId = params.row.userId
        //             }
        //           }
        //         }, '发送结果'),
        //       ])
        //     } else {
        //       return h('span', '您没有操作该数据的权限')
        //     }
        //   }
        // }
      ],
      msgId:null,
      columns: [
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          width: '250',
          render: (h, params) => {
            if (this.viewEdit || this.viewDel) {
              return h('div', [
                h('Button', {
                  props: {
	                  type: 'primary',
                  },
                  style: {
                    marginRight: '5px',
                    display: this.viewEdit ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.handle = true
	                    console.log(params);
	                    this.getDetail({userId:params.row.userId})
                    }
                  }
                }, '详情'),
                // h('Button', {
                //   props: {
                //     type: 'error',
                //   },
                //   style: {
                //     marginRight: '5px',
                //     display: this.viewEdit ? 'inline-block' : 'none'
                //   },
                //   on: {
                //     click: () => {
                //       this.handle = true
                //       this.isShow2 = true
                //       this.receiverId = params.row.userId
                //     }
                //   }
                // }, '发送检查结果'),
              ])
            } else {
              return h('span', '您没有操作该数据的权限')
            }
          }
        }
      ],
	    columns2: [
		    {
			    title: '操作',
			    align: 'center',
			    key: 'handle',
			    width: '250',
			    render: (h, params) => {
				    if (this.viewEdit || this.viewDel) {
					    return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                  },
                  style: {
                    marginRight: '5px',
                    display: this.viewEdit ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.handle = true
                      console.log(params);
                      this.getDetail({userId:params.row.userId})
                    }
                  }
                }, '详情'),
						    // h('Button', {
							  //   props: {
								//     type: 'error',
                //     // disabled: params.row.ifSend === 1
							  //   },
							  //   style: {
								//     marginRight: '5px',
								//     display: this.viewEdit ? 'inline-block' : 'none'
							  //   },
							  //   on: {
								//     click: () => {
								// 	    this.handle = true
								// 	    this.isShow2 = true
                //       this.receiverId = params.row.userId
								//     }
							  //   }
						    // }, '发送检查结果'),
					    ])
				    } else {
					    return h('span', '您没有操作该数据的权限')
				    }
			    }
		    }
	    ],
      tableData: [],
      tableData2: [],
      tableData3: [],
      accessData: [],
      // 批量选择的id对象
      delId: {
        ids: ''
      },
      page: {// 页面翻页对象
        total: 1, // 数据总数
        currentPage: 1// 当前页面
      },
	    page2: {// 页面翻页对象
		    total2: 1, // 数据总数
		    currentPage2: 1// 当前页面
	    },
      searchOption: {} // 查询用参数
    }
  },
  created () {
    this.columns = wqColumns.concat(this.columns)
    this.columns2 = wqColumns2.concat(this.columns2)
    this.hospital = localStorage.getItem('hospital')
    this.userId = localStorage.getItem('userId')
	  this.getList({hospital:this.hospital})
	  this.getRedList({hospital:this.hospital})
	  this.getCountList({hospital:this.hospital})
  },
  mounted () {

  },
  activated () {
    this.getList({hospital:this.hospital})
    this.getRedList({hospital:this.hospital})
  },
  methods: {
    async getCountList (params) {
      let res = await getCountList(params)
      if (res.code === 200) {
        this.countData= res.data
      }
    },
    onChange(item){
      if(item==='阳性'){
        this.message = '您的新冠病毒核酸检测提示可疑阳性，建议立即复诊！纸质报告可前往医院咽拭子采样处领取。'
      }else {
        this.message = '您的新冠病毒核酸检测结果为阴性，纸质报告可前往医院咽拭子采样处领取。'
      }
    },
    async isSendMsg (params) {
      let res = await isSendMsg(params)
      if (res.code === 200) {

      } else {
        this.$Message.error(res.data)
      }
    },

    async pushMessage(){
      if(!this.message){
        this.$Message.error('不能为空')
        return
      }
      let params = {
        message:this.message,
        typeId:9,
        senderId:this.userId,
        receiverId:this.receiverId,
      }
      let res = await pushMessage(params)
      if (res.code === 200) {
        this.isShow2 =false
        this.$Message.success('发送成功')
        this.message = ''
        this.model1 = ''
        this.isSendMsg({ifSend:1.,id:this.msgId})
        this.getRedList({hospital:this.hospital})
      } else {
        this.$Message.error(res.data)
      }
    },
	  async getDetail (params) {
		  let res = await getDetail(params)
		  if (res.code === 200) {
			  this.tableData3=res.data.list
			  this.isShow =true
		  } else {
			  this.$Message.error(res.data)
		  }
	  },
    // 查询列表
    async getList (params) {
	    let res = await getList(params)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.page = {
          total: res.data.total,
          currentPage: res.data.pageNum
        }
      } else {
        this.$Message.error(res.data)
      }
    },
	  // 查询列表
	  async getRedList (params) {
		  let res = await getRedList(params)
		  if (res.code === 200) {
			  this.tableData2 = res.data.list
			  this.page2 = {
				  total2: res.data.total,
				  currentPage2: res.data.pageNum
			  }
		  } else {
			  this.$Message.error(res.data)
		  }
	  },
    cancelEditModal () {
      this.isEdit = false
    },
    // 页面翻页
    handlePageTurn (page) {
      this.searchOption.page = page
      this.searchOption.hospital = this.hospital
      this.getList(this.searchOption)
    },
	  // 页面翻页
	  handlePageTurn2 (page) {
		  this.searchOption.page2 = page
      this.searchOption.hospital = this.hospital
		  this.getRedList(this.searchOption)
	  }
  }
}
</script>

<style lang="less" scoped>
	.tip{
		display: flex;
		align-items: center;
		span{
			margin-left: 30px;
		}
    .count{
      p{
        font-size: 36px;
      }
    }
	}
</style>
