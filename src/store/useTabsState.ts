import { defineStore } from 'pinia'

type TabskeyArr = {
  component: string
  key: string
  name: string
  uicon: string
  noClose?: boolean
}

type TabsState = {
  activeKey: Ref<number>
  tabsKeyArr: Ref<TabskeyArr[]>
  setKeyArr: (key: number) => void
  delKeyItem: (key: number) => void
  getKeyArr: (key: number) => void
}

export const useTabsState = defineStore(
  'tabsState',
  (): TabsState => {
    /*  当前页签 */
    const activeKey = ref(0)

    /*  tabs页签 */
    const tabsKeyArr = ref<TabskeyArr[]>([
      {
        component: "dashboard",
        key: "1",
        name: "欢迎使用",
        uicon: "hugeicons:home-01",
        noClose: true
      }
    ])

    const setKeyArr = (item: any) => {

      if (tabsKeyArr.value.findIndex((v) => v.name === item.name) === -1) {
        tabsKeyArr.value.push(item)
      }
      const newKey = tabsKeyArr.value.findIndex((res: any) => {
        return res.name === item.name
      })

      activeKey.value = Number(newKey)
    }

    const delKeyItem = (index: any) => {
      tabsKeyArr.value.splice(index, 1)
      if (activeKey.value === index) {
        activeKey.value = tabsKeyArr.value.length - 1
      }
    }
    const getKeyArr = (key) => {
      return tabsKeyArr.value[key]
    }

    return {
      activeKey,
      tabsKeyArr,
      setKeyArr,
      delKeyItem,
      getKeyArr
    }

  },
  {
    // 配置状态管理器的数据持久化，默认存储为cookie
    persist: true,
  }
)