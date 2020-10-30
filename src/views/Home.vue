<template>
  <div class="home-container">
    <Header />
    <div class="content clearfix">
      <div class="list">
        <h2>任务列表</h2>
        <a-button type="primary" size="large" @click="addTask">
          <template v-slot:icon><PlusOutlined /></template>添加任务
        </a-button>
      </div>

      <a-table
          :rowKey="record => record.id"
          :loading="loading"
          :pagination="pagination"
          border
          :columns="columns"
          :data-source="tableData"
          @change="handleTableChange"
      >
        <template v-slot:name="{ text, record, index }">
          <star-mark size="16" :is-filled="record.is_major == 0" @click="toggleFav(record, index)" ></star-mark>
          {{text}}
        </template>
        <template v-slot:expireDate="{text}">
          {{$Valid.formatDate(text)}}
        </template>
        <template v-slot:status="{text}">
          {{text == 2 ? '删除' : text == 1 ? '完成' : '待办'}}
        </template>
        <template v-slot:operation="{record, index}">
          <a-button style="margin-right: 10px" @click="edit(record, index)" v-if="record.status != 2">编辑</a-button>
          <a-button type="primary" ghost style="margin-right: 10px" @click="complete(record)" v-if="record.status != 2">{{ record.status == 0 ? '完成' : record.status == 1 ? '待办' : null}}</a-button>
          <a-button type="danger" ghost @click="remove(record.id)" v-if="record.status != 2">删除</a-button>
        </template>
      </a-table>
    </div>

<!--    <Footer />-->

    <a-drawer
        :title="title"
        v-model:visible="isShow"
        width="400"
        :styles="styles"
        :mask-closable="false"
        :loading="loading"
    >
      <a-form :model="formValidate" ref="formValidate" :rules="ruleValidate">
        <a-row :gutter="32">
          <a-col span="24">
            <a-form-item label="任务名称" name="title">
              <a-input v-model:value="formValidate.title" placeholder="请输入任务名称" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="32">
          <a-col span="24">
            <a-form-item label="截止日期" name="date">
              <a-date-picker v-model:value="formValidate.date"/>
<!--              <a-date-picker :editable="false" v-model="formValidate.date" type="date" placeholder="请选择截止日期" style="display: block"></a-date-picker>-->
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="任务内容" name="content">
          <a-input type="textarea" v-model:value="formValidate.content" :rows="8" placeholder="请输入任务内容" />
        </a-form-item>

        <a-form-item class="demo-drawer-footer">
          <a-button type="primary" style="margin-right: 15px" @click="handleSubmit('formValidate')">{{ textBtn }}</a-button>
          <a-button @click="handleReset('formValidate')" style="margin-right: 15px">重置</a-button>
          <a-button type="error" @click="isShow = false">取消</a-button>
        </a-form-item>
      </a-form>

    </a-drawer>

  </div>
</template>

<script>
import Header from '@/components/Header';
import StarMark from '@/components/StarMark';
import { PlusOutlined } from '@ant-design/icons-vue';
import {
  queryTaskList,
  addTask,
  editTask,
  updateTaskStatus,
  updateMark,
  deleteTask
} from '@/utils/api';

export default {
  name: 'Home',
  components: {
    Header,
    StarMark,
    PlusOutlined,
  },
  data() {
    return {
      loading: true,
      pagination: {total: 0, pageSize: 10,},
      pageNo: 1,

      status: null,
      textBtn: '提交',
      type: 1, // 1:添加 2:编辑
      title: '添加任务',
      isShow: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      // vue3 & ant-design 演示1
      formValidate: {
        title: '',
        date: '',
        content: ''
      },
      columns: [
        {
          title: '任务名称',
          dataIndex: 'title',
          slots: { customRender: 'name' }
        },
        {
          title: '任务内容',
          dataIndex: 'content'
        },
        {
          title: '截止日期',
          key: 'gmt_expire',
          dataIndex: 'gmt_expire',
          slots: { customRender: 'expireDate' }
        },
        {
          title: '任务状态',
          width: 120,
          dataIndex: 'status',
          slots: { customRender: 'status' },
          filters: [
            { text: '待办', value: 0 },
            { text: '完成', value: 1 },
            { text: '删除', value: 2 }
          ],
          filterMultiple: false
        },
        {
          title: '操作',
          width: 300,
          dataIndex: 'operation',
          slots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      tableData: [],
      ruleValidate: {
        title: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        date: [
          { required: true, type: 'date', message: '请选择截止日期', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入任务内容', trigger: 'blur' }
        ]
      }

    }
  },
  mounted() {
    this.getTaskList();
  },
  methods: {
    handleTableChange(pagination, filters) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getTaskList({...filters});
    },

    // 获取任务列表数据
    getTaskList(para) {
      this.loading = true;
      let params = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        status: this.status,
        ...para
      }

      queryTaskList(params).then(res => {
        console.log('任务列表===', res);
        this.loading = false;
        if (res.code == 0 && res.data) {
          this.tableData = res.data.rows;
          this.pagination.total = res.data.total;
        } else {
          this.tableData = [];
          this.pagination.total = 0;
        }
      }).catch(() => {
        this.loading = false;
      })
    },
    // 添加任务
    addTask() {
      this.isShow = true;
      this.textBtn = '提交';
      this.title = '添加任务';
      this.type = 1;
      this.$refs.formValidate.resetFields();
    },
    // 编辑任务
    edit(row, index) {
      this.isShow = true;
      this.textBtn = '保存';
      this.title = '编辑任务';
      this.type = 2;

      this.formValidate = {
        id: row.id,
        title: row.title,
        date: this.$Valid.formatDate(row.gmt_expire),
        content: row.content
      }

    },
    // 完成/待办任务
    complete(row) {
      // console.log('我的名', row)
      let status = row.status == 0 ? 1 : row.status == 1 ? 0 : null;

      let data = {
        id: row.id,
        status: status
      }

      updateTaskStatus(data).then(res => {
        console.log('操作状态===', res);
        if (res.code == 0) {
          this.pageNo = 1;
          this.getTaskList();
          this.$Message.success('更新任务状态成功');
        } else {
          this.$Message.error(res.msg);
        }
      })
    },
    // 删除任务
    remove(id) {
      let data = {
        id: id,
        status: 2
      }

      deleteTask(data).then(res => {
        console.log('删除任务===', res);
        if (res.code == 0) {
          this.pageNo = 1;
          this.getTaskList();
          this.$Message.success('任务删除成功');
        } else {
          this.$Message.error(res.msg);
        }
      })
      // this.data.splice(index, 1);
    },
    // 提交添加或编辑
    handleSubmit(name) {
      this.$refs[name].validate().then(() => {
        if (this.type == 1) {
          let data = {
            title: this.formValidate.title,
            gmt_expire: new Date(this.formValidate.date.toString()).getTime(),
            content: this.formValidate.content
          }
          addTask(data).then(res => {
            console.log('添加任务===', res)
            this.isShow = false;
            if (res.code == 0) {
              this.pageNo = 1;
              this.getTaskList();
              this.$Message.success(`${this.title}成功`);
            } else {
              this.$Message.error(res.msg);
            }
          }).catch(() => {
            this.isShow = false;
          })
        } else if (this.type == 2) {
          let data = {
            id: this.formValidate.id,
            title: this.formValidate.title,
            gmt_expire: new Date(this.formValidate.date.toString()).getTime(),
            content: this.formValidate.content
          }

          editTask(data).then(res => {
            console.log('编辑任务===', res)
            this.isShow = false;
            if (res.code == 0) {
              this.pageNo = 1;
              this.getTaskList();
              this.$Message.success(`${this.title}成功`);
            } else {
              this.$Message.error(res.msg);
            }
          }).catch(() => {
            this.isShow = false;
          })
        }
      })
    },
    // 重置表单
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    // 重要或不重要
    toggleFav (row, index) {
      if (row.status == 2) {
        this.$Message.error('数据已删除');
      } else {
        // is_major: 0:不重要 1:重要
        this.tableData[index].is_major = this.tableData[index].is_major === 0 ? 1 : 0;

        let data = {
          id: row.id,
          is_major: this.tableData[index].is_major
        }

        updateMark(data).then(res => {
          console.log('操作标记===', res);
          if (res.code == 0) {
            this.pageNo = 1;
            this.getTaskList();
            this.$Message.success('更新标记成功');
          } else {
            this.$Message.error(res.msg);
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .content {
    height: calc(100% - 60px);
    padding: 30px 40px;
    .list {
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 20px 0 30px;
      h2 {
        line-height: 36px;
      }
    }
  }

}
</style>
<style lang="scss">
.ivu-table-tip table td {
  width: 100% !important;
}
/*.ivu-input-icon-validate {
  display: none !important;
}*/
.pagination {
  float: right;
  margin: 20px 0;
}

.demo-drawer-footer{
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 16px;
  background: #fff;
  display: flex;
  justify-content: space-around;
}
</style>
