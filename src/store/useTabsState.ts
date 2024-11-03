import items, { Items } from '@/layout/config'
import { defineStore } from 'pinia'

interface TabskeyArr extends Items {
  noClose: boolean
}

type TabsState = {
  activeKey: Ref<number>
  tabsKeyArr: Ref<TabskeyArr[]>
  setKeyArr: (item: Items) => void
  delKeyItem: (key: number) => void
  getKeyArr: (key: number) => void
}

export const useTabsState = defineStore(
  'tabsState',
  (): TabsState => {
    /*  当前页签 */
    const activeKey = ref(0)

    const router = useRouter()

    /*  tabs页签 */
    const tabsKeyArr = ref<TabskeyArr[]>([
      Object.assign({}, items[0], { noClose: true })
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

    /* 根据路由获取当前页面的key */
    watchEffect(() => {
      activeKey.value = tabsKeyArr.value.findIndex((item) => item.component == router.currentRoute.value.name)
    })

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