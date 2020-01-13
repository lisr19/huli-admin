<template>
  <div>
    <Form :model="form" ref="form" label-position="top" :rules="rules" >
      <Row>
        <Col span="12">
          <Card>
            <FormItem label="护士所在医院：" prop="hospital">
              <Input clearable v-model="form.hospital" :disabled="!detailStatus" placeholder="护士所在医院"/>
            </FormItem>
            <FormItem label="所在科室：" prop="departments">
              <Input clearable v-model="form.departments" :disabled="!detailStatus" placeholder="请填写所在科室"/>
            </FormItem>
            <FormItem label="工作年限：" prop="year">
              <Input clearable v-model="form.year" :disabled="!detailStatus" placeholder="请填写工作年限">
              <span slot="append">年</span>
              </Input>
            </FormItem>
          </Card>
          <Card>
            <FormItem label="资质状态：" prop="status">
              <Select v-model="form.status" placeholder="请选择资质状态">
                <Option value="0" key="0">未审核</Option>
                <Option value="1" key="1">已拒绝</Option>
                <Option value="2" key="2">已通过</Option>
              </Select>
            </FormItem>
          </Card>
          <Card v-if="form.status === 2">
            <Card>
              <p slot="title">标签添加：</p>
              <Row>
                <Col span="12">
                  <Cascader :data="labelData" ref="labelForm" v-model="labelForm.labelCas"></Cascader>
                </Col>
                <Col span="4" offset="1">
                  <Button type="primary" >添加</Button>
                </Col>
              </Row>
            </Card>
            <Card>
              <p slot="title">已有标签</p>
              <!--<Tag type="border" closable color="default" v-for="(item,index) in labelArray" :key="item.labelId"-->
                   <!--:name="item.labelContent" @on-close="doLabelDel(item.id,index)">{{item.labelContent}}-->
              <!--</Tag>-->
            </Card>
          </Card>
        </Col>
        <Col span="12" >
          <Card>
            <FormItem label="身份证号码：" prop="idNumber">
              <Input clearable v-model="form.idNumber" :disabled="!detailStatus" placeholder="请填写身份证号码"/>
            </FormItem>
            <div v-if="detailStatus">
              <FormItem label="身份证正反面：" >
                <img-upload-more></img-upload-more>
              </FormItem>
              <FormItem label="中华人民共和国执业护士证书：" >
                <img-upload-more></img-upload-more>
              </FormItem>
              <FormItem label="护理称职证书：" >
                <img-upload-more></img-upload-more>
              </FormItem>
              <FormItem label="护理服务专业培训证书：" >
                <img-upload-more></img-upload-more>
              </FormItem>
            </div>
            <div v-else>
              <FormItem label="身份证正反面：" >
                <div class="size-img">
                  <img src="http://sdcmi.halohealth.cn/images/1552373693998.jpg" @click="openModal('ces','http://sdcmi.halohealth.cn/images/1552373693998.jpg')"/>
                  <img src="http://sdcmi.halohealth.cn/images/1552373693998.jpg" @click="openModal()"/>
                </div>
              </FormItem>
              <FormItem label="中华人民共和国执业护士证书：" >
                <div class="size-img">
                  <img src="http://sdcmi.halohealth.cn/images/1552373693998.jpg" @click="openModal()"/>
                </div>
              </FormItem>
              <FormItem label="护理称职证书：" >
                <div class="size-img">
                  <img src="http://sdcmi.halohealth.cn/images/1552373693998.jpg" @click="openModal()"/>
                </div>
              </FormItem>
              <FormItem label="护理服务专业培训证书：" >
                <div class="size-img">
                  <img src="http://sdcmi.halohealth.cn/images/1552373693998.jpg" @click="openModal()"/>
                </div>
              </FormItem>
            </div>
          </Card>
        </Col>
      </Row>
    </Form>

    <Modal :title="titleShow+'（可拖拽）'" v-model="visible" draggable  style="z-index: 666">
      <img :src="imgShow" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import ImgUploadMore from '../components/img-upload/img-upload-more'
  export default {
    name: "nurse-credentials",
    components:{
      ImgUploadMore
    },
    computed:{
    },
    props:{
      detailStatus: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        visible:false,
        rules: {},
        labelData:[],
        labelArray:[],
        labelForm:{},
        form: {},
        titleShow:'',
        imgShow:'http://sdcmi.halohealth.cn/images/1552373693998.jpg'
      }
    },
    methods:{
      openModal(title,url){
        this.visible = true
        this.titleShow = title
        this.imgShow = url
      }
    }
  }
</script>

<style lang="less" scoped>
  .size-img{
    display: flex;
    justify-content: center;
    img{
      width: 80px;
      height: 80px;
      margin: 0 10px;
    }
  }
</style>
