<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">护理项目管理</p>
      <Row>
        <Col span="2">
          <Button type="primary" class="my-btn" v-if="viewAdd" @click="isAdd = true">添加</Button>
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <tree-table
          :is-fold="false"
          border
          expand-key="name"
          :expand-type="false"
          :selectable="false"
          :columns="columns"
          :data="tableData"
        >
          <template slot="action" slot-scope="{row}">
            <Button type="primary" style="width: 80px;marginRight: 20px;" v-if="viewEdit" @click="openEditModal(row)">
              编辑
            </Button>
            <Button type="error" style="width: 80px;" v-if="viewDel" @click="doProgramDel(row)">删除</Button>
          </template>
        </tree-table>
      </div>
    </Card>

    <!--添加Modal-->
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="项目添加：" width="600">
      <Form :model="addForm" ref="addForm" :label-width="100" :rules="rules">
        <FormItem label="项目图片：" prop="imgUrl">
          <img-upload ref="imgUpload" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload>
        </FormItem>
        <FormItem label="项目名称：" prop="name">
          <Input clearable v-model="addForm.name" placeholder="项目名称"/>
        </FormItem>
        <FormItem label="父级项目：">
          <Select clearable v-model="addForm.pid" placeholder="请选择父级项目" style="width: 100%">
            <Option value="0" key="0">无</Option>
          </Select>
        </FormItem>
        <FormItem label="项目类型：">
          <Select clearable v-model="addForm.serviceType" placeholder="请选择项目类型" style="width: 100%">
            <Option v-for="item in types" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="项目价格：" prop="price">
          <Input clearable  v-model="addForm.price" placeholder="项目价格">
          <span slot="append">元</span>
        </Input>
        </FormItem>
        <FormItem label="服务内容：" prop="content">
          <Input type="textarea" v-model="addForm.content" :autosize="{minRows: 5,maxRows: 10}" placeholder="请填写服务内容"/>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <!--<Button type="primary" @click="doRoleAdd">确认</Button>-->
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="项目编辑：" width="600">
      <Form :model="editForm" ref="editForm" :label-width="100" :rules="rules">
        <FormItem label="项目图片：" prop="imgUrl">
          <img-upload ref="imgUploadByEdit" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload>
        </FormItem>
        <FormItem label="项目名称：" prop="name">
          <Input clearable v-model="editForm.name" placeholder="项目名称"/>
        </FormItem>
        <FormItem label="父级项目：">
          <Select clearable v-model="editForm.pid" placeholder="请选择父级项目" style="width: 100%">
            <Option value="0" key="0">无</Option>
          </Select>
        </FormItem>
        <FormItem label="项目类型：">
          <Select clearable v-model="editForm.serviceType" placeholder="请选择项目类型" style="width: 100%">
            <Option v-for="item in types" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="项目价格：" prop="price">
          <Input clearable  v-model="editForm.price" placeholder="项目价格">
          <span slot="append">元</span>
        </Input>
        </FormItem>
        <FormItem label="服务内容：" prop="content">
          <Input type="textarea" v-model="editForm.content" :autosize="{minRows: 5,maxRows: 10}" placeholder="请填写服务内容"/>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <!--<Button type="primary" @click="doRoleAdd">确认</Button>-->
      </div>
    </Modal>
  </div>
</template>

<script>
  import {findNursingService,doNursingServiceAdd,doNursingServiceEdit,doNursingServiceDel,doNursingServiceDelMany,findNursingServiceType} from "../../api/nursing";
  import {programColumns} from "../../libs/table";
  import {hasOneOf, array4tree,tools4Del} from '@/libs/tools'

  import ImgUpload from '../components/img-upload/img-upload'

  export default {
    name: "nursing-program",
    components:{
      ImgUpload
    },
    computed: {
      access() {
        return this.$store.state.user.access
      },
      viewAdd() {
        // return hasOneOf(['label-add'], this.access)
        return true
      },
      viewEdit() {
        // return hasOneOf(['label-edit'], this.access)
        return true
      },
      viewDel() {
        // return hasOneOf(['label-del'], this.access)
        return true
      },
      viewDelMany() {
        // return hasOneOf(['label-delMany'], this.access)
        return true
      },
    },
    data() {
      return {
        isAdd: false,
        isEdit: false,
        columns: [],
        tableData: [],
        addForm: {},
        editForm: {},
        rules: {},
        types: [],
        searchOption: {}, // 查询用参数
      }
    },
    created(){
      this.columns = programColumns
    },
    mounted(){
      this.findNursingService()
      this.findNursingServiceType()
    },
    methods:{
      //查询
      async findNursingService(params) {
        let res = await findNursingService(params)
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
      //查询
      async findNursingServiceType() {
        let res = await findNursingServiceType({size:100})
        if (res.code === 200) {
          this.types = res.data.list
        } else {
          this.$Message.error(res.data)
        }
      },
      //项目删除
      doProgramDel(row){
        this.$Modal.confirm({
          title: '请确认删除',
          content: `<p>删除数据: ${row.name} 后无法恢复,确认删除?</p>`,
          okText: '确认',
          onOk: () => {
            if (row[`children`]) { // 若是该数据有子类
              let ids = ''
              ids = row.id
              let idArray = []
              tools4Del(row.children, idArray)
              ids = ids + ',' + idArray.join(',')
              // console.log(ids)
            } else { // 若没有则删除单个
              let id = { id: row.id }
            }
          },
          // 取消删除
          onCancel: () => {
            this.$Message.info('取消删除！')
          }
        })
      },
      // 获取上传图片url
      getUploadImg (url) {
        this.addForm.imgUrl = url
        this.editForm.imgUrl = url
      },
      delUploadImg (url) {
        this.addForm.imgUrl = ''
        this.editForm.imgUrl = ''
      },
      cancelAddModal() {
        this.$refs.addForm.resetFields()// 重置表单
        this.$refs.imgUpload.updateImgUrl([])
        this.addForm = {}
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal(params) {
        console.log(params)
        this.editForm = params
        this.isEdit = true
      },
      cancelEditModal() {
        this.$refs.editForm.resetFields()// 重置表单
        this.editForm = {}
        this.isEdit = false
      },
    }
  }
</script>

<style scoped>

</style>
