<template>
  <div class="header-container">
    <div class="header">
      <div class="section"></div>

      <div class="user-info">
        <span class="username">{{ username }}</span>

        <div class="avatar" data-tip="更换头像">
          <img src="https://portrait.gitee.com/uploads/avatars/user/767/2303431_WakoJam_1578971415.png!avatar200" alt="">
          <i class="iconfont icon-icons03" style="position: absolute; top: 50%; right: 70%; color: #1890ff; z-index: 1"></i>
        </div>
        <a-dropdown>
          <DownOutlined :style="{marginLeft: '6px'}"/>
          <template v-slot:overlay>
            <a-menu @click="changeMenu">
              <a-menu-item key="a">修改密码</a-menu-item>
              <a-menu-item key="b">退出</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>


    </div>

    <a href="https://github.com/WakoJia-Pei/Vue3.0-Demo/tree/master" target="_blank" class="github-corner">
      <svg width="82" height="82" viewBox="0 0 250 250">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" class="octo-arm"></path>
        <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
      </svg>
    </a>

    <a-modal
        title="修改密码"
        v-model:visible="modal"
        @ok="ok"
        ok-text="确认"
        cancel-text="取消"
        :confirm-loading="modalLoading"
        destroyOnClose
        class-name="vertical-center-modal">
      <a-form :model="formItem" :label-width="90" ref="formItem" v-bind="layout">
        <a-form-item label="旧密码" name="oldPassword">
          <a-input v-model:value="formItem.oldPassword" type="password" placeholder="请输入旧密码"></a-input>
        </a-form-item>
        <a-form-item label="新密码" name="newPassword">
          <a-input v-model:value="formItem.newPassword" type="password" placeholder="请输入新密码"></a-input>
        </a-form-item>
        <a-form-item label="确认新密码" name="confirmPassword">
          <a-input v-model:value="formItem.confirmPassword" type="password" placeholder="请再次确认新密码"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>

  </div>
</template>

<script>
import { resetPwd } from '@/utils/api';
import { DownOutlined } from '@ant-design/icons-vue';
export default {
  name: 'Header',
  components: {
    DownOutlined
  },
  data() {
    return {
      modal: false,
      modalLoading: false,
      username: this.$store.state.userInfo.data.userData.username,
      formItem: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
    }
  },
  methods: {
    // 点击头像下拉菜单选择
    changeMenu(o) {
      if (o.key == 'a') {
        this.modal = true;
        this.$refs['formItem'].resetFields();
      } else if (o.key == 'b') {
        this.$store.dispatch('userInfo/logout')
      }
    },
    // 提交修改密码
    ok() {
      setTimeout(() => {
        this.modalLoading = true;
        this.$nextTick(() => {
          this.modalLoading = false;
        });
      }, 100);
      console.log('重置密码', this.formItem)
      if (!this.$Valid.validPass(this.formItem.oldPassword)) {
        this.$Message.error("旧密码应为8到20位字母或数字！");
        return false;
      } else if (!this.$Valid.validPass(this.formItem.newPassword)) {
        this.$Message.error("新密码应为8到20位字母或数字！");
        return false;
      } else if (!this.$Valid.validPass(this.formItem.confirmPassword)){
        this.$Message.error("确认密码有误");
        return false;
      } else if (this.formItem.confirmPassword !== this.formItem.newPassword){
        this.$Message.error("两次密码不一致");
        return false;
      }

      let data = {
        username: this.$store.state.userInfo.data.userData.username,
        oldPassword: this.formItem.oldPassword,
        newPassword: this.formItem.confirmPassword
      }

      resetPwd(data).then(res => {
        if (res.code == 0) {
          this.modal = false;
          this.$Message.success('修改密码成功');
        } else {
          this.$Message.error(res.msg);
        }
      })
    }

  }

}
</script>

<style lang="scss" scoped>
.header-container {
  .header {
    width: 100%;
    background: #17174c;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 82px 20px 40px;
    box-sizing: border-box;
    .section {
      display: flex;
      ul {
        display: flex;
        align-items: center;
        margin-left: 60px;
        li {
          margin-right: 40px;
          a {
            color: #fff;
            opacity: .5;
            &:hover, &.active {
              opacity: 1;
            };
          }
        }
      }
    }
    .user-info {
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      .username {
        padding-right: 10px;
      }
      .avatar {
        border-radius: 50%;
        overflow: hidden;
        width: 42px;
        height: 42px;
        display: inline-block;
        position: relative;
        cursor: pointer;
        img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }
        &::before, &::after {
          background-color: rgba(0, 0, 0, .5);
          opacity: 0;
          transition: all .3s;
        }

        &::before {
          position: absolute;
          width: 100%;
          height: 100%;
          content: " ";
        }
        &:hover::before {
          opacity: 0.5;
        }

        &::after {
          content: attr(data-tip);
          top: -82%;
          color: #ffffff;
          font-size: 10px;
          position: relative;
        }
        &:hover::after {
          opacity: 1;
        }
      }
    }
    img {
      outline: none;
      &.logo {
        height: 40px;
      }
    }

  }

  .github-corner {
    svg {
      fill: #1890ff;
      color: #fff;
      position: absolute;
      top: 0;
      border: 0;
      right: 0;
    }
    .octo-arm {
      transform-origin: 130px 106px;
    }
    &:hover {
      .octo-arm {
        -webkit-animation: octocat-wave .56s ease-in-out;
        animation: octocat-wave .56s ease-in-out;
      }
    }

  }

  @-webkit-keyframes octocat-wave {
    0%, 100% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    20%, 60% {
      -webkit-transform: rotate(-25deg);
      transform: rotate(-25deg);
    }
    40%, 80% {
      -webkit-transform: rotate(10deg);
      transform: rotate(10deg);
    }
  }
  @keyframes octocat-wave {
    0%, 100% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    20%, 60% {
      -webkit-transform: rotate(-25deg);
      transform: rotate(-25deg);
    }
    40%, 80% {
      -webkit-transform: rotate(10deg);
      transform: rotate(10deg);
    }
  }

}
</style>
<style lang="scss">
.vertical-center-modal{
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal{
    top: 0;
  }
}

</style>
