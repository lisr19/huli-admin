<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">待审订单</p>
      <Row>
        <Col span="2">
          <!--<Button type="primary" class="my-btn" v-if="viewAdd" @click="isAdd = true">添加</Button>-->
        </Col>

        <Col span="2">
          <!--<Button type="error" class="my-btn" v-if="viewDelMany">批量删除</Button>-->
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
  </div>
</template>

<script>
  import {findOrder} from "../../api/orders";
  import {ordersInfoColumns} from "../../libs/table";
  import {hasOneOf, array4tree} from '@/libs/tools';

  export default {
    name: "orders-pending",
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
        return false
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
    data() {
      return {
        columns: [
          {
            title: '操作',
            align: 'center',
            fixed: 'right',
            key: 'handle',
            render: (h, params) => {
              if (this.viewEdit ) {
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
                        // this.openModal(data)
                      }
                    }
                  }, '编辑')
                  ])
              } else {
                return h('span', '您没有操作该数据的权限')
              }
            }
          }
        ],
        tableData: [],
        rules:{},
        page: {// 页面翻页对象
          total: 1, // 数据总数
          currentPage: 1// 当前页面
        },
        searchOption: {
          orderStatus : 1
        }, // 查询用参数
      }
    },
    created() {
      this.columns = ordersInfoColumns.concat(this.columns)
    },
    mounted() {
      this.findOrder(this.searchOption)
    },
    methods: {
      //查询
      async findOrder(params) {
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
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        this.findOrder(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
