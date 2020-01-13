<template>
  <div>
    <Card>
      <img src="../../assets/images/img13.png" style="width: 100%">
      <div class="m-body">
        <div class="m-btn" v-for="(item,index) in btnArray" :key="index">
          <img :src="item.url">
          <span>{{item.name}}</span>
        </div>
      </div>
      <div class="m-body">
        <div class="m-btn" v-for="(item,index) in btnArray2" :key="index">
          <img :src="item.url">
          <span>{{item.name}}</span>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
    export default {
        name: "mental-health",
      data(){
          return{
            btnArray:[
              {
                name:'UCLA孤独量表',
                url:require('../../assets/images/img1.png')
              },
              {
                name:'人际关系综合诊断表',
                url:require('../../assets/images/img2.png')
              },
              {
                name:'成人心理压力量表',
                url:require('../../assets/images/img3.png')
              },
              {
                name:'哈佛性向测试',
                url:require('../../assets/images/img4.png')
              },
              {
                name:'焦虑自评量表',
                url:require('../../assets/images/img5.png')
              },
              {
                name:'老年人抑郁量表',
                url:require('../../assets/images/img6.png')
              },
            ],
            btnArray2:[
              {
                name:'情商（EQ）测试',
                url:require('../../assets/images/img7.png')
              },
              {
                name:'日常生活能力量表(ADL)',
                url:require('../../assets/images/img8.png')
              },
              {
                name:'社会功能缺陷筛选量表SDS',
                url:require('../../assets/images/img9.png')
              },
              {
                name:'抑郁自评量表SDS',
                url:require('../../assets/images/img10.png')
              },
              {
                name:'心理年龄量表',
                url:require('../../assets/images/img11.png')
              },
              {
                name:'心理衰老测试',
                url:require('../../assets/images/img12.png')
              },
            ]
          }
      }
    }
</script>

<style lang="less" scoped>
  .m-body{
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin: 30px 0;
    .m-btn{
      text-align: center;
      cursor: pointer;
      width: 239px;
      img{
        width: 100%;
      }
      span{
        display: block;
        margin: 10px auto;
        font-size:22px;
        color:rgba(51,51,51,1);
        line-height:29px;
      }
    }
  }

</style>
