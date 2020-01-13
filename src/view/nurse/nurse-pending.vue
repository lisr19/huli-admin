<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">护士管理-资格审核</p>
      <Row>
        <Col span="2">
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columns" :data="tableData" border
               disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>

    <!--审核-->
    <Modal v-model="isDetail" :mask-closable="false" :closable="false" title="护士审核：" width="1000">
      <Credentials></Credentials>
      <div slot="footer">
        <Button type="text" @click="cancelModal">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {nursePendingColumns} from "../../libs/table";
  import {hasOneOf, array4tree} from '@/libs/tools';
  import Credentials from './nurse-credentials'

  export default {
    name: "nurse-pending",
    components:{
      Credentials
    },
    computed: {
      access() {
        return this.$store.state.user.access
      },
      viewDetail() {
        // return hasOneOf(['nurse-detail'], this.access)
        return true
      },
    },
    data() {
      return {
        isDetail:false,
        columns: [
          {
            title: '操作',
            align: 'center',
            key: 'handle',
            render: (h, params) => {
              if (this.viewDetail) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'warning'
                    },
                    style: {
                      marginRight: '5px',
                      display: this.viewDetail ? 'inline-block' : 'none'
                    },
                    on: {
                      click: () => {
                        this.openModal()
                      }
                    }
                  }, '审核'),
                ])
              } else {
                return h('span', '您没有操作该数据的权限')
              }
            }
          }
        ],
        tableData: [],
        detailData:{},
        page: {// 页面翻页对象
          total: 1, // 数据总数
          currentPage: 1// 当前页面
        },
        searchOption: {}, // 查询用参数
      }
    },
    created(){
      this.columns = nursePendingColumns.concat(this.columns)
    },
    methods:{
      // modal打开
      openModal (params) {
        this.detailData = params
        this.isDetail = true
      },
      cancelModal(){
        this.detailData = {}
        this.isDetail = false
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
