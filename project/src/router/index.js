import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import NProgress from 'nprogress'

// 导入页面组件
import Layout from '@/layout/index.vue'
import Login from '@/views/login/index.vue'
import Home from '@/views/home/index.vue'
import Profile from '@/views/profile/index.vue'
import UserManagement from '@/views/system/user/index.vue'
import RoleManagement from '@/views/system/role/index.vue'
import MenuManagement from '@/views/system/menu/index.vue'
import ProductList from '@/views/products/list/index.vue'
import ProductRecommend from '@/views/products/recommend/index.vue'
import OrderList from '@/views/orders/list/index.vue'
import OrderStats from '@/views/orders/stats/index.vue'
import UserActions from '@/views/actions/index.vue'
import NotFound from '@/views/error/404.vue'

// 静态路由（不需要权限）
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      title: '登录',
      hidden: true 
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: { 
      title: '404',
      hidden: true 
    }
  }
]

// 动态路由（需要权限）
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页',
          icon: 'House',
          affix: true
        }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    meta: { hidden: true },
    children: [
      {
        path: 'index',
        name: 'Profile',
        component: Profile,
        meta: {
          title: '个人中心',
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/products',
    component: Layout,
    name: 'Products',
    meta: {
      title: '商品管理',
      icon: 'ShoppingBag'
    },
    children: [
      {
        path: 'list',
        name: 'ProductList',
        component: ProductList,
        meta: {
          title: '商品列表',
          icon: 'List'
        }
      },
      {
        path: 'recommend',
        name: 'ProductRecommend',
        component: ProductRecommend,
        meta: {
          title: '推荐商品',
          icon: 'Star'
        }
      }
    ]
  },
  {
    path: '/orders',
    component: Layout,
    name: 'Orders',
    meta: {
      title: '订单管理',
      icon: 'ShoppingCart'
    },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: OrderList,
        meta: {
          title: '订单列表',
          icon: 'List'
        }
      },
      {
        path: 'stats',
        name: 'OrderStats',
        component: OrderStats,
        meta: {
          title: '订单统计',
          icon: 'DataLine'
        }
      }
    ]
  },
  {
    path: '/actions',
    component: Layout,
    redirect: '/actions/index',
    meta: {
      title: '用户行为日志',
      icon: 'Document',
      roles: ['superAdmin']
    },
    children: [
      {
        path: 'index',
        name: 'UserActions',
        component: UserActions,
        meta: {
          title: '行为日志',
          icon: 'Document',
          roles: ['superAdmin']
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'Setting',
      roles: ['admin', 'superAdmin']
    },
    children: [
      {
        path: 'user',
        name: 'UserManagement',
        component: UserManagement,
        meta: {
          title: '用户管理',
          icon: 'User',
          roles: ['admin', 'superAdmin']
        }
      },
      {
        path: 'role',
        name: 'RoleManagement',
        component: RoleManagement,
        meta: {
          title: '角色管理',
          icon: 'UserFilled',
          roles: ['admin', 'superAdmin']
        }
      },
      {
        path: 'menu',
        name: 'MenuManagement',
        component: MenuManagement,
        meta: {
          title: '菜单管理',
          icon: 'Menu',
          roles: ['admin', 'superAdmin']
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 })
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  
  const userStore = useUserStore()
  const token = userStore.token
  
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 检查是否已获取用户信息
      if (!userStore.userInfo.id) {
        try {
          await userStore.getUserInfo()
          // 生成动态路由
          const accessRoutes = await userStore.generateRoutes()
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })
          // 添加404路由
          router.addRoute({
            path: '/:pathMatch(.*)*',
            redirect: '/404'
          })
          next({ ...to, replace: true })
        } catch (error) {
          await userStore.logout()
          next('/login')
        }
      } else {
        next()
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router