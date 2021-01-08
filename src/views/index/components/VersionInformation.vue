<template>
  <a-alert
    :message="
      '欢迎体验全网首个基于 vue ' +
      dependencies['vue'] +
      ' + ant-design-vue ' +
      dependencies['ant-design-vue'] +
      ' 开发的admin框架vue-admin-beautiful-antdv，vue3.0的流畅超乎了我们的想象，感谢尤雨溪、唐金州的开源项目我带来的灵感和帮助，vue-admin-beautiful-antdv同时支持电脑、平板、手机，希望实现一套代码即可帮助中小微企业快速实现项目落地，帮助前端小白快速入门vue前端框架搭建技术，迅速在工作中占据主导地位。'
    "
    type="success"
    show-icon
  />

  <a-card class="version-information" title="系统信息">
    <template v-slot:title></template>
    <template v-slot:extra>
      <a href="#">部署时间{{ updateTime }}</a>
    </template>
    <div class="version-information-table">
      <table>
        <tr>
          <td>标星</td>
          <td>
            <a
              target="_blank"
              href="https://github.com/chuzhixin/vue-admin-beautiful/tree/vue3.0-antdv"
            >
              <img
                style="margin-right: 10px"
                src="https://img.shields.io/github/stars/chuzhixin/vue-admin-beautiful?style=flat-square&label=Stars&logo=github"
              />
            </a>
          </td>
          <td>下载量统计</td>
          <td>敬请期待！</td>
        </tr>
        <tr v-for="(row, idx) in packages" :key="idx">
          <td>{{ row[0]['name'] }}</td>
          <td>{{ row[0]['value'] }}</td>
          <td>{{ row[1] ? row[1]['name'] : '' }}</td>
          <td>{{ row[1] ? row[1]['value'] : '' }}</td>
        </tr>
        <tr>
          <td>v3.x版演示地址（antdv MIT协议，商用免费）</td>
          <td colspan="3">
            <a
              href="https://beautiful.panm.cn/vue-admin-beautiful-antdv?hmsr=mwsqj&hmpl=&hmcu=&hmkw=&hmci="
            >
              点我
            </a>
          </td>
        </tr>
        <tr>
          <td>官方QQ群</td>
          <td colspan="3">972435319、1139183756</td>
        </tr>
      </table>
    </div>
  </a-card>
</template>
<script>
  import { dependencies, devDependencies } from '*/package.json'
  export default {
    data() {
      return {
        updateTime: process.env.VUE_APP_UPDATE_TIME,
        dependencies: dependencies,
        devDependencies: devDependencies,
      }
    },
    computed: {
      packages() {
        let dependency = Object.keys(Object.assign(this.dependencies, this.devDependencies))
        let rows = []
        for (let depen in dependency) {
          rows.push({
            name: dependency[depen],
            value: this.dependencies[dependency[depen]] || this.devDependencies[dependency[depen]]
          })
        }
        let len = rows.length;
        let n = 2; //假设每行显示2个
        let lineNum = len % 2 === 0 ? len / 2 : Math.floor( (len / 2) + 1 );
        let res = [];
        for (let i = 0; i < lineNum; i++) {
          let temp = rows.slice(i*n, i*n+n);
          res.push(JSON.parse(JSON.stringify(temp)));
        }
        return res
      }
    }
  }
</script>
<style lang="less" scoped>
  .version-information {
    margin-top: @vab-margin;
    &-table {
      width: 100%;
      overflow: scroll;
      table {
        width: 100%;
        color: #666;
        border-collapse: collapse;
        background-color: #fff;

        td {
          position: relative;
          padding: 9px 15px;
          font-size: 14px;
          line-height: 20px;
          border: 1px solid #e6e6e6;

          &:nth-child(odd) {
            width: 20%;
            text-align: right;
            background-color: #f7f7f7;
          }
        }
      }
    }
  }
</style>
