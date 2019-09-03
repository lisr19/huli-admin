<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">宣传教育管理</p>
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
            <Button type="error" style="width: 80px;" v-if="viewDel" @click="doEducationDel(row)">删除</Button>
          </template>
        </tree-table>
      </div>
    </Card>

    <!--添加Modal-->
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="宣教添加：" width="900">
      <Form :model="addForm" ref="addForm" :label-width="100" :rules="rules">
        <!--<FormItem label="宣教图片：" prop="imgUrl">-->
          <!--<img-upload ref="imgUpload" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload>-->
        <!--</FormItem>-->
        <FormItem label="宣教名称：" prop="name">
          <Input clearable v-model="addForm.name" placeholder="宣教名称"/>
        </FormItem>
        <FormItem label="宣教内容：" prop="content">
          <editor ref="addEditor"></editor>
        </FormItem>
        <FormItem label="父级宣教：">
          <Select clearable v-model="addForm.pid" placeholder="请选择父级宣教" style="width: 100%">
            <Option value="0" key="0">无</Option>
          </Select>
        </FormItem>
        <FormItem label="宣教类型：">
          <Select clearable v-model="addForm.type" placeholder="请选择宣教类型" style="width: 100%">
            <Option value="0" key="0">无</Option>
          </Select>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <!--<Button type="primary" @click="doRoleAdd">确认</Button>-->
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="宣教编辑：" width="900">
      <Form :model="editForm" ref="editForm" :label-width="100" :rules="rules">
        <!--<FormItem label="宣教图片：" prop="imgUrl">-->
          <!--<img-upload ref="imgUploadByEdit" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload>-->
        <!--</FormItem>-->
        <FormItem label="宣教名称：" prop="name">
          <Input clearable v-model="editForm.name" placeholder="宣教名称"/>
        </FormItem>
        <FormItem label="宣教内容：" prop="content">
          <editor ref="editEditor"></editor>
        </FormItem>
        <FormItem label="父级宣教：">
          <Select clearable v-model="editForm.pid" placeholder="请选择父级宣教" style="width: 100%">
            <Option value="0" key="0">无</Option>
          </Select>
        </FormItem>
        <FormItem label="宣教类型：">
          <Select clearable v-model="editForm.type" placeholder="请选择宣教类型" style="width: 100%">
            <Option value="0" key="0">无</Option>
          </Select>
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
  import {educationColumns} from "../../libs/table";
  import {hasOneOf, array4tree,tools4Del} from '@/libs/tools'

  import Editor from '../components/editor/editor'

  export default {
    name: "publicity-education",
    components:{
      Editor
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
        tableData: [{}],
        addForm: {},
        editForm: {},
        rules: {},
        types: [],
        searchOption: {}, // 查询用参数
      }
    },
    created(){
      this.columns = educationColumns
    },
    methods:{
      //宣教删除
      doEducationDel(row){
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
      cancelAddModal() {
        this.$refs.addForm.resetFields()// 重置表单
        this.$refs.addEditor.changeContent()
        this.addForm = {}
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal(params) {
        this.editForm = params
        this.isEdit = true
      },
      cancelEditModal() {
        this.$refs.editForm.resetFields()// 重置表单
        this.$refs.editEditor.changeContent()
        this.editForm = {}
        this.isEdit = false
      },
    }
  }
</script>

<style scoped>

</style>
