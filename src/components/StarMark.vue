<template>
  <div style="display: inline-block; justify-content: center; align-items: center">
    <StarOutlined :style="customStyle" v-if="isFilled" @click.stop="$emit('click')"/>
    <StarFilled :style="customStyle" v-else @click.stop="$emit('click')"/>
  </div>
</template>

<script>
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
  computed: {
    customStyle() {
      let sty = {
        fontSize: this.size + 'px',
      }
      if (!this.isFilled) {
        sty.color = this.color ? this.color : 'rgb(255, 85, 0)'
      }
      return sty
    }
  }
}
</script>
