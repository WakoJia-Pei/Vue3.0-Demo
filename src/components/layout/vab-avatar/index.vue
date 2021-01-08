<template>
  <div class="user-avatar">
    <a-dropdown>
      <span class="ant-dropdown-link">
        <a-avatar :src="avatar" />
        {{ username }}
        <DownOutlined />
      </span>
      <template v-slot:overlay>
        <a-menu>
          <a-menu-item>修改密码</a-menu-item>
          <a-menu-item @click="logout">退出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script>
  import { recordRoute } from '@/config'
  import { DownOutlined } from '@ant-design/icons-vue'

  import { useStore } from 'vuex'
  import { useRouter, useRoute } from 'vue-router'
  import { computed } from 'vue'
  export default {
    name: 'VabAvatar',
    components: { DownOutlined },
    setup() {
      const store = useStore()
      const router = useRouter()
      const route = useRoute()
      return {
        avatar: computed(() => store.getters['user/avatar']),
        username: computed(() => store.getters['user/username']),
        logout: async () => {
          await store.dispatch('user/logout')
          if (recordRoute) {
            const fullPath = route.fullPath
            router.push(`/login?redirect=${fullPath}`)
          } else {
            router.push('/login')
          }
        }
      }
    }
  }
</script>
<style lang="less">
  .user-avatar {
    .ant-dropdown-link {
      display: block;
      min-height: 64px;
      cursor: pointer;
    }
  }
</style>
