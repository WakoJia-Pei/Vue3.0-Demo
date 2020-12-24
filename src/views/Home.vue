<template>
  <div class="home-container">
    <Header />
    <div class="content clearfix">
      <div class="list">
        <h2>任务列表</h2>
        <a-button type="primary" size="large" @click="onClickAddTask">
          <template v-slot:icon><PlusOutlined /></template>添加任务
        </a-button>
      </div>

      <a-table
          :rowKey="record => record.id"
          :loading="loading"
          :pagination="paginationOpts"
          border
          :columns="columns"
          :data-source="tableData"
          @change="handleTableChange"
      >
        <template #name="{ text, record, index }">
          <star-mark size="16" :is-filled="record.is_major == 0" @click="toggleFav(record, index)" ></star-mark>
          {{text}}
        </template>
        <template #expireDate="{text}">
          {{$Valid.formatDate(text)}}
        </template>
        <template v-slot:status="{text}">
          {{text == 2 ? '删除' : text == 1 ? '完成' : '待办'}}
        </template>
        <template #operation="{record, index}">
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
      <a-form v-bind="layout">
        <a-row :gutter="32">
          <a-col span="24">
            <a-form-item label="任务名称" name="formValidate.title" v-bind="validateInfos.title">
              <a-input v-model:value="formValidate.title" placeholder="请输入任务名称" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="32">
          <a-col span="24">
            <a-form-item label="截止日期" name="date" v-bind="validateInfos.date">
              <a-date-picker v-model:value="formValidate.date"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="任务内容" name="content" v-bind="validateInfos.content">
          <a-input type="textarea" v-model:value="formValidate.content" :rows="8" placeholder="请输入任务内容" />
        </a-form-item>
      </a-form>
      <div class="demo-drawer-footer">
        <a-button type="primary" style="margin-right: 15px" @click="handleSubmit">{{ textBtn }}</a-button>
        <a-button @click="resetFields" style="margin-right: 15px">重置</a-button>
        <a-button type="error" @click="isShow = false">取消</a-button>
      </div>
    </a-drawer>

  </div>
</template>

<script>
import { reactive, toRefs, toRaw, computed, onMounted } from 'vue'
import { useForm } from '@ant-design-vue/use'
import { message } from 'ant-design-vue';
import Valid from '@/utils/valid'
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
  setup() {
    const data = reactive({
      loading: true,
      pagination: {total: 0, pageSize: 6,},
      pageNo: 1,
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
      },
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
      paginationOpts: computed(() => Math.ceil(data.pagination.total / data.pagination.pageSize) > 1 ? data.pagination : false)
    });
    // vue3 & ant-design 演示1
    let formValidate = reactive({
      title: '',
      date: null,
      content: ''
    });
    const ruleValidate = reactive({
      title: [
        { required: true, message: '任务名称不能为空', trigger: 'blur' }
      ],
      date: [
        { required: true, type: 'date', message: '请选择截止日期', trigger: 'change' }
      ],
      content: [
        { required: true, message: '请输入任务内容', trigger: 'blur' }
      ]
    });
    const { resetFields, validate, validateInfos } = useForm(formValidate, ruleValidate);
    function getTaskList(para) {
      data.loading = true;
      let params = {
        pageNo: data.pagination.current,
        pageSize: data.pagination.pageSize,
        status: data.status,
        ...para
      }
      queryTaskList(params).then(res => {
        console.log('任务列表===', res);
        data.loading = false;
        if (res.code == 0 && res.data) {
          data.tableData = res.data.rows;
          data.pagination.total = res.data.total;
        } else {
          data.tableData = [];
          data.pagination.total = 0;
        }
      }).catch(() => {
        data.loading = false;
      })
    }

    const  handleTableChange = (pagination, filters) => {
      const pager = { ...data.pagination };
      pager.current = pagination.current;
      data.pagination = pager;
      getTaskList({...filters});
    }

    // 点击添加任务按钮
    function onClickAddTask() {
      data.isShow = true;
      data.textBtn = '提交';
      data.title = '添加任务';
      data.type = 1;
      resetFields()
    }
    // 编辑任务
    function edit(row, idx) {
      console.log(row, idx)
      data.isShow = true
      data.textBtn = '保存'
      data.title = '编辑任务'
      data.type = 2
      formValidate.id = row.id
      formValidate.title = row.title
      formValidate.date = Valid.formatDate(row.gmt_expire)
      formValidate.content = row.content
    }
    // 完成/待办任务
    function complete(row) {
      // console.log('我的名', row)
      let status = row.status == 0 ? 1 : row.status == 1 ? 0 : null;

      let param = {
        id: row.id,
        status: status
      }

      updateTaskStatus(param).then(res => {
        console.log('操作状态===', res);
        if (res.code == 0) {
          data.pageNo = 1;
          getTaskList();
          // data.$Message.success('更新任务状态成功');
          message.success('更新任务状态成功');
        } else {
          // data.$Message.error(res.msg);
          message.error(res.msg);
        }
      })
    }
    // 删除任务
    function remove(id) {
      let param = {
        id: id,
        status: 2
      }

      deleteTask(param).then(res => {
        console.log('删除任务===', res);
        if (res.code == 0) {
          data.pageNo = 1;
          getTaskList();
          // data.$Message.success('任务删除成功');
          message.success('任务删除成功');
        } else {
          // data.$Message.error(res.msg);
          message.error(res.msg);
        }
      })
      // data.data.splice(index, 1);
    }
    // 提交添加或编辑
    function handleSubmit(e) {
      e.preventDefault();
      validate().then(async res => {
        console.log(res, toRaw(formValidate));
        let _data = {}
        let resCode = null, resMsg = null
        if(data.type === 1) {
          _data = {
            title: res.title,
            gmt_expire: new Date(res.date.toString()).getTime(),
            content: res.content
          }
          const { code, msg } = await addTask(_data).catch(() => data.isShow = false)
          resCode = code
          resMsg = msg
        }
        if(data.type === 2) {
          _data = {
            id: toRaw(formValidate).id,
            title: res.title,
            gmt_expire: new Date(toRaw(formValidate).date.toString()).getTime(),
            content: res.content
          }
          const { code, msg } = await editTask(_data).catch(() => data.isShow = false)
          resCode = code
          resMsg = msg
        }
        data.isShow = false;
        if (resCode === 0) {
          data.pageNo = 1;
          getTaskList();
          // data.$Message.success(`${data.title}成功`);
          message.success(`${data.title}成功`);
        } else {
          message.info(`${ resMsg }`, 5);
        }
      }).catch(err => console.log('error', err));
    }
    // 重要或不重要
    function toggleFav (row, index) {
      if (row.status == 2) {
        // data.$Message.error('数据已删除');
        message.error('数据已删除');
      } else {
        // is_major: 0:不重要 1:重要
        data.tableData[index].is_major = data.tableData[index].is_major === 0 ? 1 : 0;

        let _data = {
          id: row.id,
          is_major: data.tableData[index].is_major
        }

        updateMark(_data).then(res => {
          console.log('操作标记===', res);
          if (res.code == 0) {
            data.pageNo = 1;
            getTaskList();
            // data.$Message.success('更新标记成功');
            message.success('更新标记成功');
          } else {
            // data.$Message.error(res.msg);
            message.error(res.msg);
          }
        })
      }
    }
    onMounted(() => {
      getTaskList()
    })
    return {
      ...toRefs(data),
      validateInfos,
      resetFields,
      formValidate,
      onClickAddTask,
      handleTableChange,
      handleSubmit,
      edit,
      complete,
      remove,
      toggleFav
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
