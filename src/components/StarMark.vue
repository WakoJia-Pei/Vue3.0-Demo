<template>
  <div style="display: inline-block; justify-content: center; align-items: center">
    <StarOutlined :style="customStyle" v-if="isFilled" @click.stop="$emit('click')"/>
    <StarFilled :style="customStyle" v-else @click.stop="$emit('click')"/>
  </div>
</template>

<script>
import { computed } from 'vue'
import {StarOutlined, StarFilled} from '@ant-design/icons-vue';
export default {
  name: "StarMark",
  components: {
    StarOutlined,
    StarFilled
  },
  props: {
    size: {
      type: [Number, String],
      default: 16
    },
    color: {
      type: String,
      default: ''
    },
    isFilled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    console.log('打印setup参数: ', props, context)
    const customStyle = computed(() => {
      let sty = {
        fontSize: props.size + 'px',
      }
      if (!props.isFilled) {
        sty.color = props.color ? props.color : 'rgb(255, 85, 0)'
      }
      return sty
    })

    return {
      customStyle
    }
  }
}
</script>
