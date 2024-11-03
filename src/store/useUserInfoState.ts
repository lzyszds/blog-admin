import { defineStore } from 'pinia'
import { getUserInfoToken } from '@/api/user'
import { User } from '@/typings/User'

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

  // 初始化时调用一次
  fetchUserInfo()

  return {
    userInfo,
    isLogin,
    isAdmin,
    isEditor,
    isUser,
    isSuperAdmin,
    fetchUserInfo,// 暴露 `fetchUserInfo`，可在组件中再次调用
    logout
  }
})
