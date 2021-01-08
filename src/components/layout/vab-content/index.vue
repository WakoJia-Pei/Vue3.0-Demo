<template>
  <a-layout-content class="vab-content">
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="fade-transform">
        <component :is="Component" />
      </transition>
    </router-view>
  </a-layout-content>
</template>

<script>
  import {useRoute} from "vue-router";
  import {computed, watch} from "vue";
  import {useStore} from "vuex";

  export default {
    name: 'VabContent',
    setup() {
      const store = useStore()
      const route = useRoute()
      const device = computed(() => store.getters['settings/device'])
      watch(route, () => {
        if ('mobile' === device.value) {
          store.dispatch('settings/foldSideBar')
        }
      }, { immediate: true })
    }
  }
</script>

<style lang="less">
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all 0.2s;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  .vab-content {
    min-height: calc(
      100vh - @vab-header-height - @vab-padding - @vab-padding - @vab-padding -
        @vab-padding
    ) !important;
    padding: @vab-padding;
    margin: @vab-margin;
    background: #fff;
    .error-container {
      height: calc(
        100vh - @vab-header-height - @vab-padding - @vab-padding - @vab-padding -
          @vab-padding - @vab-padding - @vab-margin
      ) !important;
    }
  }
</style>
