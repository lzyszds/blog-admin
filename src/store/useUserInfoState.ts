import { defineStore } from 'pinia'
import { getUserInfoToken } from '@/api/user'
import { User } from '@/typings/User'
import { useTabsState } from "@/store/useTabsState";
const tabsState = useTabsState()

export const useUserInfoState = defineStore('useUserInfoState', () => {

  const userInfo = ref<User>({})
  const isLogin = ref(false)
  const isAdmin = ref(false)
  const isEditor = ref(false)
  const isUser = ref(false)
  const isSuperAdmin = ref(false)
  const router = useRouter()

  // 获取用户信息的函数
  const fetchUserInfo = async () => {
    const res = await getUserInfoToken()
    if (res.code === 200) {
      userInfo.value = res.data
      isLogin.value = true
      isAdmin.value = res.data.role === 'admin'
      isEditor.value = res.data.role === 'editor'
      isUser.value = res.data.role === 'user'
    } else {
      router.push('/login')
    }
  }

  /* 退出登录 */
  const logout = async () => {
    localStorage.removeItem('lzy_token')
    router.push('/login')
  }

  /* 前往个人中心 */
  const goToUserCenter = async () => {
    tabsState.setKeyArr({
      name: '个人中心',
      component: 'userCenter',
      uicon: 'ph:user-circle-gear',
      key: 999
    })
    router.push({ name: 'userCenter' })
  }

  // 初始化时调用一次
  fetchUserInfo()

  return {
    userInfo, // 用户信息
    isLogin,  // 是否登录
    isAdmin, // 是否是管理员
    isEditor, // 是否是编辑者
    isUser, // 是否是普通用户
    isSuperAdmin, // 是否是超级管理员
    fetchUserInfo,// 获取用户信息
    logout, // 注销登陆
    goToUserCenter // 前往个人中心
  }
})