<script lang="ts" setup>

import {getSystemLog} from "@/api/system.ts";

const {data: errorData} = await getSystemLog({
  page: 1,
  limit: 5,
  type: 'error',
  date: '2024-12-27'
})

const {data: infoData} = await getSystemLog({
  page: 1,
  limit: 5,
  type: 'info',
  date: '2024-12-27'
})

const infoActiveKey = ref('')
const errorActiveKey = ref('')

const handleData = (data: any) => {
  try {
    return JSON.parse(data)
  } catch (e) {
    return data
  }
}

const isObject = (data: any) => {
  return typeof data === 'object'
}

</script>

<template>
  <main>
    <a-card title="错误日志" :bordered="false">
      <a-collapse v-model:activeKey="infoActiveKey">
        <a-collapse-panel v-for="(item,index) in errorData" :key="index" :header="item.time">
          <span v-if="!isObject(handleData(item.message))">{{ handleData(item.message) }}</span>
          <section v-else>
            <p style="margin: 0" v-for="(value,key) in handleData(item.message)" :key="key">
              {{ key }}:{{ value }}
            </p>
          </section>
        </a-collapse-panel>

      </a-collapse>
    </a-card>
    <a-card title="正常日志" :bordered="false" style="margin-top: 10px">
      <a-collapse v-model:activeKey="errorActiveKey">
        <a-collapse-panel v-for="(item,index) in infoData" :key="index" :header="item.time">
          <span v-if="!isObject(handleData(item.message))">{{ handleData(item.message) }}</span>
          <section v-else>
            <p style="margin: 0" v-for="(value,key) in handleData(item.message)" :key="key">
              {{ key }}:{{ value }}
            </p>
          </section>
        </a-collapse-panel>

      </a-collapse>
    </a-card>
  </main>
</template>
