import routeItem, { RouteItem } from "@/router/config";

import { defineStore } from "pinia";

type TabskeyArr = RouteItem & {
  noClose?: boolean;
};

type TabsState = {
  activeKey: Ref<number>;
  tabsKeyArr: Ref<TabskeyArr[]>;
  setKeyArr: (item: RouteItem) => void;
  delSingleKeyItem: (index: number, isBasedKey?: boolean) => void;
  delMultiKeyItem: (
    index: number[],
    tabId: number,
    isBasedKey: boolean,
  ) => void;
  getKeyArr: (key: number) => void;
};

export const useTabsState = defineStore(
  "tabsState",
  (): TabsState => {
    /*  当前页签 */
    const activeKey = ref(0);

    const router = useRouter();

    /*  tabs页签 */
    const tabsKeyArr = ref<TabskeyArr[]>([
      Object.assign({}, routeItem[0], { noClose: true }),
    ]);

    const setKeyArr = (item) => {
      if (tabsKeyArr.value.findIndex((v) => v.name === item.name) === -1) {
        tabsKeyArr.value.push(item);
      }

      const newKey = tabsKeyArr.value.findIndex((res: any) => {
        return res.name === item.name;
      });
      activeKey.value = Number(newKey);
    };
    const getKeyArr = (key) => {
      return tabsKeyArr.value[key];
    };

    /**
     * 删除单个tabs
     * @param index 删除的索引 数组中的索引
     * @param isBasedKey 是否基于tabsKeyArr中的key删除
     */
    const delSingleKeyItem = (index: number, isBasedKey: boolean = false) => {
      /* 是否是基于key删除 */
      if (isBasedKey) {
        const findIndex = tabsKeyArr.value.findIndex(
          (item) => item.meta.key == index,
        );
        if (findIndex != 0) index = findIndex;
      }
      tabsKeyArr.value.splice(index, 1);
      if (activeKey.value == index) {
        /* 删除当前激活的标签，则激活前一个标签 */
        activeKey.value = tabsKeyArr.value.length - 1;
        router.push({ name: getKeyArr(activeKey.value).name });
      }
    };

    /**
     * 批量删除标签
     * @param index 标签索引数组
     * @param tabId 当前标签的key
     * @param isBasedKey 是否基于tabsKeyArr中的key删除
     */
    const delMultiKeyItem = (
      index: number[],
      tabId: number,
      isBasedKey: boolean = false,
    ) => {
      /** 找出当前index[]里的key
       const keyArr = index.map((i) => tabsKeyArr.value[i].key)
       */
      console.log(tabsKeyArr.value, index, tabId);

      const tabsKeyItem = [...tabsKeyArr.value];
      index.forEach((i, _index) => {
        /* 基于key为索引来匹配 */
        if (isBasedKey) {
          let findIndex = tabsKeyArr.value.findIndex(
            (item) => item.meta.key == i,
          );
          if (findIndex > 0) tabsKeyArr.value.splice(findIndex, 1);
        } else {
          tabsKeyItem.splice(i, 1);
          if (_index == index.length - 1) tabsKeyArr.value = tabsKeyItem;
        }
      });
      /* 激活标签 */
      activeKey.value = tabsKeyArr.value.findIndex(
        (item) => item.meta.key == tabId,
      );

      /*  判断是否为首页 首页比较特殊 */
      if (getKeyArr(activeKey.value).name == "dashboard") {
        router.push("/");
      } else {
        /* 跳转当前选中的标签路由中 */
        router.push({ name: getKeyArr(activeKey.value).name });
      }
    };

    /* 根据路由获取当前页面的key */
    watchEffect(() => {
      if(router.currentRoute.value.name == 'login') return;
      activeKey.value = tabsKeyArr.value.findIndex(
        (item) => item.name == router.currentRoute.value.name,
      );
    });

    return {
      activeKey,
      tabsKeyArr,
      setKeyArr,
      delSingleKeyItem,
      delMultiKeyItem,
      getKeyArr,
    };
  },
  {
    // 配置状态管理器的数据持久化，默认存储为cookie
    persist: true,
  },
);
