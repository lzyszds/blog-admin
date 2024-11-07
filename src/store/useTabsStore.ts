import items, { Items } from '@/layout/config'
import { defineStore } from 'pinia'

interface TabskeyArr extends Items {
  noClose: boolean
}

type TabsState = {
  activeKey: Ref<number>
  tabsKeyArr: Ref<TabskeyArr[]>
  setKeyArr: (item: Items) => void
  delSingleKeyItem: (index: number, isBasedKey?: boolean) => void
  delMultiKeyItem: (index: number[], tabId: number, isBasedKey: boolean) => void
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
    const getKeyArr = (key) => {
      return tabsKeyArr.value[key]
    }


    /**
     * 删除单个tabs
     * @param index 删除的索引 数组中的索引
     * @param isBasedKey 是否基于tabsKeyArr中的key删除
     */
    const delSingleKeyItem = (index: number, isBasedKey: boolean = false) => {

      /* 是否是基于key删除 */
      if (isBasedKey) {
        const findIndex = tabsKeyArr.value.findIndex((item) => item.key == index)
        if (findIndex != 0) index = findIndex
      }
      tabsKeyArr.value.splice(index, 1)
      if (activeKey.value == index) {
        /* 删除当前激活的标签，则激活前一个标签 */
        activeKey.value = tabsKeyArr.value.length - 1
        router.push({ name: getKeyArr(activeKey.value).component })
      }

    }

    /**
     * 批量删除标签
     * @param index 标签索引数组
     * @param tabId 当前标签的key
     * @param isBasedKey 是否基于tabsKeyArr中的key删除
     */
    const delMultiKeyItem = (index: number[], tabId: number, isBasedKey: boolean = false) => {
      const tabsKeyItem = [...tabsKeyArr.value]
      index.forEach(i => {
        /* 基于key为索引来匹配 */
        if (isBasedKey) {
          let findIndex = tabsKeyArr.value.findIndex((item) => item.key == i)
          if (findIndex > 0) tabsKeyArr.value.splice(findIndex, 1)
        } else {
          tabsKeyItem.splice(tabsKeyItem.findIndex((_item, _index) => _index == i), 1)
          if (i == index.length - 1) tabsKeyArr.value = tabsKeyItem
        }
      })
      /* 激活标签 */
      activeKey.value = tabsKeyArr.value.findIndex((item) => item.key == tabId)
      
      /*  判断是否为首页 首页比较特殊 */
      if (getKeyArr(activeKey.value).component == 'dashboard') {
        router.push('/')
      } else {
        /* 跳转当前选中的标签路由中 */
        router.push({ name: getKeyArr(activeKey.value).component })
      }
    }



    /* 根据路由获取当前页面的key */
    watchEffect(() => {
      activeKey.value = tabsKeyArr.value.findIndex((item) => item.component == router.currentRoute.value.name)
    })

    return {
      activeKey,
      tabsKeyArr,
      setKeyArr,
      delSingleKeyItem,
      delMultiKeyItem,
      getKeyArr
    }

  },
  {
    // 配置状态管理器的数据持久化，默认存储为cookie
    persist: true,
  }
)