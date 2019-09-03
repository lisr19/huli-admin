<template>
  <div>
    <!--<img src="http://sdcmi.halohealth.cn/images/1552373693998.jpg" class="health-img"/>-->
    <Collapse>
      <Panel>
        档案基本信息
        <ul slot="content">
          <li>
            <div class="size-big">档案号：</div>
          </li>
          <Divider/>
          <li>
            <div>病人ID：</div>
            <div>转介来源：</div>
          </li>
          <li>
            <div>隶属区域：</div>
            <div>居住方式：</div>
          </li>
          <Divider/>
          <li>
            <div>姓名：</div>
            <div>性别：</div>
          </li>
          <li>
            <div class="size-big">出生年月：（年龄：）</div>
          </li>
          <Divider/>
          <li>
            <div>出生地：</div>
            <div>籍贯：</div>
          </li>
          <li>
            <div class="size-big">文化程度：</div>
          </li>
          <Divider/>
          <li>
            <div>民族：</div>
            <div>职业：</div>
          </li>
          <li>
            <div>婚姻状况：</div>
            <div>医疗付款方式：</div>
          </li>
          <li>
            <div class="size-big">现居住地：</div>
          </li>
          <Divider/>
          <li>
            <div class="size-big">工作单位：</div>
          </li>
          <li>
            <div>单位联系人：</div>
            <div>单位联系电话：</div>
          </li>
          <Divider/>
          <li>
            <div class="size-big">通信地址：</div>
          </li>
          <li>
            <div>通信联系人：（关系：）</div>
            <div>联系人电话：</div>
          </li>
          <Divider/>
          <li>
            <div>本次主要诊断：</div>
            <div>建档日期：</div>
          </li>
          <li>
            <div>接诊护士：</div>
            <div>本次服务标识：</div>
          </li>
        </ul>
      </Panel>
      <Panel>
        心血管疾病风险筛查
        <ul slot="content">
          <li>
            <CheckboxGroup>
              <Checkbox label="既往有脑卒中" disabled></Checkbox>
              <Checkbox label="既往有短暂性脑缺血发作" disabled></Checkbox>
              <Checkbox label="冠心病" disabled></Checkbox>
            </CheckboxGroup>
          </li>
          <Divider/>
          <li>
            <div>当前血压水平（mmHg）：收缩压 140&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;舒张压140</div>
            <div>
              正在服用降压药：
              <RadioGroup>
                <Radio label="是" disabled></Radio>
                <Radio label="否" disabled></Radio>
              </RadioGroup>
            </div>
          </li>
          <Divider/>
          <li>
            糖尿病：
            <RadioGroup>
              <Radio label="是" disabled></Radio>
              <Radio label="否" disabled></Radio>
            </RadioGroup>
          </li>
          <Divider/>
          <li>
            血脂水平（mmol/l）：
            甘油三脂（TC）123;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            高密度脂蛋白胆固醇（HDL-C）123;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            低密度脂蛋白胆固醇（LDL-C）123;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </li>
          <Divider/>
          <li>
            体育段炼很少或轻体力劳动者：
            <RadioGroup>
              <Radio label="是" disabled></Radio>
              <Radio label="否" disabled></Radio>
            </RadioGroup>
          </li>
          <Divider/>
          <li>
            身高（m）：1.9&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            体重（kg）：60&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            BMI(kg/㎡)：16.62
          </li>
          <Divider/>
          <li>
            <div>
              现在是否吸烟 ：
              <RadioGroup>
                <Radio label="是" disabled></Radio>
                <Radio label="否" disabled></Radio>
              </RadioGroup>
            </div>
            <div>
              是否重度吸烟（指每天吸烟≥30）：
              <RadioGroup>
                <Radio label="是" disabled></Radio>
                <Radio label="否" disabled></Radio>
              </RadioGroup>
            </div>
          </li>
          <Divider/>
          <li>
            <div class="size-big">
              心脑血管疾病家族史（指父母、兄弟姐妹中有人患有心肌梗死或脑卒中）：
              <RadioGroup>
                <Radio label="是" disabled></Radio>
                <Radio label="否" disabled></Radio>
              </RadioGroup>
            </div>
          </li>
        </ul>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
  export default {
    name: "customer-health",
    data() {
      return {
        healthData: {}
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
      width: 50%
    }
    .none {
      height: 36px;
    }
  }

  .size-big {
    width: 100%;
  }
</style>
