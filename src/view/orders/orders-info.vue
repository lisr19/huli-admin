<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">订单信息管理</p>
      <Row>
        <Col span="2">
          <!--<Button type="primary" class="my-btn" v-if="viewAdd" @click="isAdd = true">添加</Button>-->
        </Col>

        <Col span="2">
          <Button type="error" class="my-btn" v-if="viewDelMany">批量删除</Button>
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columns" :data="tableData" border @on-selection-change="batchSelect"
               disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>

    <Modal v-model="isDetail" :mask-closable="false" :closable="false" title="订单信息：" width="1000">
      <orders-detail></orders-detail>
      <div slot="footer">
        <Button type="text" @click="cancelModal">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {findOrder} from "../../api/orders";
  import {ordersInfoColumns} from "../../libs/table";
  import {hasOneOf, array4tree} from '@/libs/tools';
  import ordersDetail from './orders-detail'

  export default {
    name: "orders-info",
    components:{
      ordersDetail
    },
    computed: {
      access() {
        return this.$store.state.user.access
      },
      viewAdd() {
        // return hasOneOf(['nurse-add'], this.access)
        return true
      },
      viewEdit() {
        // return hasOneOf(['nurse-edit'], this.access)
        return true
      },
      viewDel() {
        // return hasOneOf(['nurse-del'], this.access)
        return true
      },
      viewDelMany() {
        // return hasOneOf(['nurse-delMany'], this.access)
        return true
      },
      viewLabel() {
        // return hasOneOf(['nurse-label'], this.access)
        return true
      },
      viewDetail() {
        // return hasOneOf(['nurse-detail'], this.access)
        return true
      },
    },
    data(){
      return{
        isAdd:false,
        isEdit:false,
        isDetail:false,
        columns: [
          {
            title: '操作',
            align: 'center',
            fixed: 'right',
            key: 'handle',
            width:300,
            render: (h, params) => {
              if (this.viewEdit || this.viewDel) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    style: {
                      marginRight: '5px',
                      display: this.viewEdit ? 'inline-block' : 'none'
                    },
                    on: {
                      click: () => {
                        let data = Object.assign({}, params.row)
                        // this.formCopy = Object.assign({}, data)
                        this.openModal(data)
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'error'
                    },
                    style: {
                      display: this.viewDel ? 'inline-block' : 'none'
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          title: '请确认删除',
                          content: `<p>删除数据: ${params.row.name} 后无法恢复,确认删除?</p>`,
                          okText: '确认',
                          onOk: () => {
                            let id = {id: params.row.id}
                            // this.doAdminDel(id)
                          },
                          // 取消删除
                          onCancel: () => {
                            this.$Message.info('取消删除！')
                          }
                        })
                      }
                    }
                  }, '删除')
                ])
              } else {
                return h('span', '您没有操作该数据的权限')
              }
            }
          }
        ],
        tableData: [{}],
        detailData:{},
        rules:{},
        // 批量选择的id对象
        delId: {
          ids: ''
        },
        page: {// 页面翻页对象
          total: 1, // 数据总数
          currentPage: 1// 当前页面
        },
        searchOption: {}, // 查询用参数
      }
    },
    created(){
      this.columns = ordersInfoColumns.concat(this.columns)
    },
    mounted(){
      this.findOrder()
    },
    methods:{
      //查询
      async findOrder(params){
        let res = await findOrder(params)
        if (res.code === 200) {
          this.tableData = res.data.list
          this.page = {
            total: res.data.total,
            currentPage: res.data.pageNum
          }
        } else {
          this.$Message.error(res.message)
        }
      },
      // modal打开
      openModal (params) {
        this.detailData = params
        this.isDetail = true
      },
      cancelModal(){
        this.detailData = {}
        this.isDetail = false
      },
      // 批量选择
      batchSelect(selection) {
        this.delId.ids = ''
        selection.forEach(row => {
          if (this.delId.ids === '') {
            this.delId.ids = row.id
          } else {
            this.delId.ids = this.delId.ids + ',' + row.id
          }
        })
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        // this.findAdminData(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
