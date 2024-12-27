<script setup lang="ts">

import {getTaskLog} from "@/api/plantask.ts";

const {data} = await getTaskLog('e4b4b7bd-cee7-49b7-b1ae-15458e454427', 1)

const result = JSON.parse(data[0].content)
console.log(result)
const activeKey = ref('')
</script>

<template>
  <main>
    <a-card title="关于项目" :bordered="false">
      Jz
      博客管理系统是一个功能丰富的博客后台管理平台，旨在为用户提供一站式的博客管理解决方案。它提供了全面的数据分析、内容管理、用户管理、评论互动、任务调度、网站设置以及资源管理等功能，帮助用户高效地维护和运营其博客。系统采用模块化设计，界面简洁直观，易于上手。
    </a-card>
    <a-card title="生产环境依赖" :bordered="false" style="margin-top: 10px">
      <div class="devCardList">

        <div class="cardItem" v-for="(item,index) in result.dependencies" :key="index" :data-des="item.description">
          <span>{{ index }}</span> <span>{{ item.version }}</span>
        </div>

      </div>

      <!--      <a-collapse v-model:activeKey="activeKey" accordion>-->
      <!--        <a-collapse-panel v-for="(item,index) in result.dependencies" :key="index" :header="index">-->
      <!--          <p>{{item.description}}<a :href="item.link"  target="_blank">查看文档(由Ai生成可能不准确)</a></p>-->
      <!--          <template #extra>{{item.version}}</template>-->
      <!--        </a-collapse-panel>-->
      <!--      </a-collapse>-->
    </a-card>
    <a-card title="开发环境依赖" :bordered="false" style="margin-top: 10px">
      <div class="devCardList">

        <div class="cardItem" v-for="(item,index) in result.devDependencies" :key="index" :data-des="item.description">
          <span>{{ index }}</span> <span>{{ item.version }}</span>
        </div>

      </div>
    </a-card>
  </main>
</template>

<style scoped>
p {
  margin: 0;
}

.devCardList {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;


  .cardItem {
    width: calc(50% - 10px);
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #f0f0f0;;
    border-radius: 5px;
    position: relative;

    &:before {
      content: attr(data-des);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      transition: opacity 0.3s;
      z-index: 1;
      backdrop-filter: blur(5px);
    }

    &:hover {
      background-color: #ffa9a9;

      &:before {
        opacity: 1;
      }
    }

    &:last-child {
      border-right: none;
    }
  }
}
</style>