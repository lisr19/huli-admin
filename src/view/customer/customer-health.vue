<template>
  <div>
    <!--<img src="http://sdcmi.halohealth.cn/images/1552373693998.jpg" class="health-img"/>-->
    <Collapse>
      <Panel>
        档案基本信息
        <ul slot="content">
          <li>
            <div class="size-big">档案号：<span>{{healthData.id}}</span></div>
          </li>
          <Divider/>
          <li>
            <div>病人ID：<span>{{healthData.userId}}</span></div>
            <div>转介来源：<span>{{healthData.sourceOfReferral|sourceOfReferral}}</span></div>
          </li>
          <li>
            <div>隶属区域：<span>{{healthData.subordinateArea}}</span></div>
            <div>居住方式：<span>{{healthData.living | living}}</span></div>
          </li>
          <Divider/>
          <li>
            <div>姓名：<span>{{healthData.name}}</span></div>
            <div>性别：<span>{{healthData.gender | gender}}</span></div>
          </li>
          <li>
            <div class="size-big">出生年月：<span>{{healthData.birthday}}</span>（年龄：<span>{{healthData.birthday|operatingAge}}</span>）
            </div>
          </li>
          <Divider/>
          <li>
            <div>出生地：<span>{{healthData.birthPlace}}</span></div>
            <div>籍贯：<span>{{healthData.nativePlace}}</span></div>
          </li>
          <li>
            <div class="size-big">文化程度：<span>{{healthData.educationLevel|educationLevel}}</span></div>
          </li>
          <Divider/>
          <li>
            <div>民族：<span>{{healthData.nationality}}</span></div>
            <div>职业：<span>{{healthData.occupation}}</span></div>
          </li>
          <li>
            <div>婚姻状况：<span>{{healthData.maritalStatus|maritalStatus}}</span></div>
            <div>医疗付款方式：<span>{{healthData.medicalPaymentMethod|medicalPaymentMethod}}</span></div>
          </li>
          <li>
            <div class="size-big">现居住地：<span>{{healthData.residence}}</span></div>
          </li>
          <Divider/>
          <li>
            <div class="size-big">工作单位：<span>{{healthData.workplace|setChar}}</span></div>
          </li>
          <li>
            <div>单位联系人：<span>{{healthData.workplaceContact|setChar}}</span></div>
            <div>单位联系电话：<span>{{healthData.workplaceContactPhone|setChar}}</span></div>
          </li>
          <Divider/>
          <li>
            <div class="size-big">通信地址：<span>{{healthData.residenceAddress|setChar}}</span></div>
          </li>
          <li>
            <div>通信联系人：<span>{{healthData.residenceContact|setChar}}</span>（关系：<span>{{healthData.relation|relation}}</span>）</div>
            <div>联系人电话：<span>{{healthData.residenceContactPhone|setChar}}</span></div>
          </li>
          <Divider/>
          <li>
            <div>本次主要诊断：<span>{{healthData.diagnosis}}</span></div>
            <div>建档日期：<span>{{healthData.addTime}}</span></div>
          </li>
          <!--<li>-->
            <!--<div>接诊护士：</div>-->
            <!--<div>本次服务标识：</div>-->
          <!--</li>-->
        </ul>
      </Panel>
      <Panel>
        心血管疾病风险筛查
        <ul slot="content">
          <li>
            <CheckboxGroup v-model="healthData.cerebralApoplexyFactor">
              <Checkbox label="既往有脑卒中" disabled></Checkbox>
              <Checkbox label="既往有短暂性脑缺血发作" disabled></Checkbox>
              <Checkbox label="冠心病" disabled></Checkbox>
            </CheckboxGroup>
          </li>
          <Divider/>
          <li>
            <div>当前血压水平（mmHg）：收缩压 <span>{{healthData.systolicBloodPressur}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;舒张压<span>{{healthData.diastolicBloodPressur}}</span></div>
            <div>
              正在服用降压药：
              <RadioGroup v-model="healthData.takeAntihypertensiveDrugs">
                <Radio label="1" disabled>是</Radio>
                <Radio label="0" disabled>否</Radio>
              </RadioGroup>
            </div>
          </li>
          <Divider/>
          <li>
            糖尿病：
            <RadioGroup v-model="healthData.diabetesMellitus">
              <Radio label="1" disabled>是</Radio>
              <Radio label="0" disabled>否</Radio>
            </RadioGroup>
          </li>
          <Divider/>
          <li>
            <div style="width: 100%">
              血脂水平（mmol/l）：<br>
              甘油三脂（TC）<span>{{healthData.triglyceride}}</span>;
              高密度脂蛋白胆固醇（HDL-C）<span>{{healthData.highDensityLipteinCholesterol}}</span>;
              低密度脂蛋白胆固醇（LDL-C）<span>{{healthData.lowDensityLipteinCholesterol}}</span>;
            </div>
          </li>
          <Divider/>
          <li>
            体育段炼很少或轻体力劳动者：
            <RadioGroup v-model="healthData.littlePhysicalExercise">
              <Radio label="1" disabled>是</Radio>
              <Radio label="0" disabled>否</Radio>
            </RadioGroup>
          </li>
          <Divider/>
          <li>
            <div>
              身高（m）：<span>{{healthData.height}}</span>cm&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              体重（kg）：<span>{{healthData.weight}}</span>kg&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <!--BMI(kg/㎡)：16.62-->
            </div>
          </li>
          <Divider/>
          <li>
            <div>
              现在是否吸烟 ：
              <RadioGroup v-model="healthData.heavySmoking">
                <Radio label="1" disabled>是</Radio>
                <Radio label="0" disabled>否</Radio>
              </RadioGroup>
            </div>
            <div>
              是否重度吸烟（指每天吸烟≥30）：
              <RadioGroup v-model="healthData.smokingStatus">
                <Radio label="1" disabled>是</Radio>
                <Radio label="0" disabled>否</Radio>
              </RadioGroup>
            </div>
          </li>
          <Divider/>
          <li>
            <div class="size-big">
              心脑血管疾病家族史（指父母、兄弟姐妹中有人患有心肌梗死或脑卒中）：
              <RadioGroup v-model="healthData.hereditaryDisease">
                <Radio label="1" disabled>是</Radio>
                <Radio label="0" disabled>否</Radio>
              </RadioGroup>
            </div>
          </li>
        </ul>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
  import {findUserHealthRecord} from "../../api/customer";

  export default {
    name: "customer-health",
    filters: {
      setChar(value){
        if (!value || value === 'null') return ''
        return value
      },
      gender(value) {
        switch (value) {
          case 1:
            value = '男';
            break;
          case 2:
            value = '女';
            break;
        }
        return value
      },
      relation(value){
        switch (value) {
          case 1:
            value = '夫妻';
            break;
          case 2:
            value = '子女';
            break;
          case 3:
            value = '亲属';
            break;
          case 4:
            value = '陪人';
            break;
          case 5:
            value = '保姆';
            break;
        }
        return value
      },
      medicalPaymentMethod(value){
        switch (value) {
          case 1:
            value = '社会基本医疗';
            break;
          case 2:
            value = '公费医疗';
            break;
          case 3:
            value = '大病统筹';
            break;
          case 4:
            value = '自费医疗';
            break;
          case 5:
            value = '军队医疗';
            break;
          case 6:
            value = '其他';
            break;
        }
        return value
      },
      operatingAge(value) {
        if (!value) return ''
        let year = new Date().getFullYear()
        value = year - value.split('-')[0]
        return value
      },
      sourceOfReferral(value){
        switch (value) {
          case 1:
            value = '出院系统';
            break;
          case 2:
            value = '病房';
            break;
          case 3:
            value = '干休所';
            break;
          case 4:
            value = '个人';
            break;
          case 5:
            value = '互联网';
            break;
        }
        return value
      },
      living(value){
        switch (value) {
          case 0:
            value = '独居';
            break;
          case 1:
            value = '只与配偶同住 ';
            break;
          case 2:
            value = '与家人同住';
            break;
        }
        return value
      },
      maritalStatus(value){
        switch (value) {
          case 0:
            value = '未婚';
            break;
          case 1:
            value = '已婚 ';
            break;
          case 2:
            value = '离异';
            break;
          case 3:
            value = '丧偶';
            break;
        }
        return value
      },
      educationLevel(value){
        switch (value) {
          case 1:
            value = '小学';
            break;
          case 2:
            value = '初中';
            break;
          case 3:
            value = '中专';
            break;
          case 4:
            value = '大专';
            break;
          case 5:
            value = '大学本科';
            break;
          case 6:
            value = '研究生';
            break;
          case 7:
            value = '研究生以上';
            break;
        }
        return value
      }
    },
    data() {
      return {
        healthData: {}
      }
    },
    methods: {
      async findUserHealthRecord(id) {
        let res = await findUserHealthRecord({userId: id})
        if (res.code === 200) {
          if (res.data.list.length > 0) {
            this.healthData = res.data.list[0]
            this.healthData.smokingStatus = this.healthData.smokingStatus.toString()
            this.healthData.heavySmoking = this.healthData.heavySmoking.toString()
            this.healthData.hereditaryDisease = this.healthData.hereditaryDisease.toString()
            this.healthData.diabetesMellitus = this.healthData.diabetesMellitus.toString()
            this.healthData.takeAntihypertensiveDrugs = this.healthData.takeAntihypertensiveDrugs.toString()
            this.healthData.littlePhysicalExercise = this.healthData.littlePhysicalExercise.toString()
            this.healthData.cerebralApoplexyFactor = this.healthData.cerebralApoplexyFactor.split(',')
          }
        } else {
          this.$Message.error(res.data)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .health-img {
    display: block;
    margin: 10px auto;
    text-align: center;
    width: 100px;
    height: 100px;
  }

  ul li {
    list-style-type: none;
    padding: 3px;
    margin: 0 3px;
    font-size: 14px;
    line-height: 30px;
    font-weight: 500;
    display: flex;
    justify-content: left;
    > div {
      width: 50%;
      span {
        color: #2d8cf0
      }
    }
    .none {
      height: 36px;
    }
  }

  .size-big {
    width: 100%;
  }
</style>
