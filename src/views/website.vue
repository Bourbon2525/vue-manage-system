<template>
  <div>
    <!--    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />-->
    <div class="container">
      <!--      <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"-->
      <!--                   :delFunc="handleDelete" :editFunc="handleEdit" :refresh="getData" :currentPage="page.index"-->
      <!--                   :changePage="changePage">-->
      <TableCustom :columns="columns" :tableData="tableData" :viewFunc="handleView"
                   :delFunc="handleDelete" :editFunc="handleEdit" :refresh="getData"
                   :changePage="changePage" :hasPagination="false ">
        <template #toolbarBtn>
          <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
        </template>
        <template #money="{ rows }">
          ￥{{ rows.money }}
        </template>
        <template #thumb="{ rows }">
          <el-image class="table-td-thumb" :src="rows.thumb" :z-index="10" :preview-src-list="[rows.thumb]"
                    preview-teleported>
          </el-image>
        </template>
        <template #is_allowed="{ rows }">
          <el-tag :type="rows.is_allowed ? 'success' : 'danger'">
            {{ rows.is_allowed ? '允许' : '拒绝' }}
          </el-tag>
        </template>
      </TableCustom>

    </div>
    <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
               :close-on-click-modal="false" @close="closeDialog">
      <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData">
        <template #thumb="{ rows }">
          <img class="table-td-thumb" :src="rows.thumb"></img>
        </template>
      </TableEdit>
    </el-dialog>
    <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
      <TableDetail :data="viewData">
        <template #thumb="{ rows }">
          <el-image :src="rows.thumb"></el-image>
        </template>
      </TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import {ref, reactive} from 'vue';
import {ElMessage,} from 'element-plus';
import {CirclePlusFilled} from '@element-plus/icons-vue';
import {fetchData, fetchDeleteWebsite, fetchWebsiteData} from '@/api/index';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import {TableItem} from '@/types/table';
import {FormOption, FormOptionList} from '@/types/form-option';
import axios from "axios";

// 查询相关
const query = reactive({
  name: '',
});
const searchOpt = ref<FormOptionList[]>([
  {type: 'input', label: '用户名：', prop: 'name'}
])
const handleSearch = () => {
  changePage(1);
};

// 表格相关
let columns = ref([
  {type: 'selection'},
  {prop: 'website_path', label: '网站名'},
  {prop: 'important_level', label: '重要等级', width: 100, align: 'center'},
  {prop: 'is_allowed', label: '允许规则', width: 100},
  {prop: 'country', label: '国家', width: 350},
  {prop: 'count', label: '次数'},
  {prop: 'operator', label: '操作', width: 250},
])
const page = reactive({
  index: 1,
  size: 1000,
  total: 1,
})
const tableData = ref<TableItem[]>([]);
const getData = async () => {
  const res = await fetchWebsiteData()
  tableData.value = res.data;
};
getData();

const changePage = (val: number) => {
  page.index = val;
  getData();
};

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    const { id } = response.data;
    rowData.value.id = id;  // 更新 rowData 的 ID
    ElMessage.success('文件上传成功');
  } catch (error) {
    ElMessage.error('文件上传失败');
  }
};

// 新增/编辑弹窗相关
const countryOptions = ref([
  { label: 'United States', value: 'US' },
  { label: 'China', value: 'CN' },
  { label: 'India', value: 'IN' },
  // Add more countries as needed
]);
let options = ref<FormOption>({
  labelWidth: '100px',
  span: 24,
  list: [
    {type: 'input', label: '网站名', prop: 'website_path', required: true},
    {type: 'number', label: '重要等级', prop: 'important_level', required: true},
    {type: 'switch', activeText: '允许', inactiveText: '拒绝', label: '允许规则', prop: 'is_allowed', required: true},
    {type: 'upload', label: '上传网站  ', prop: 'thumb', required: true},
    {type: 'input', label: '国家', prop: 'country', required: true},
    {type: 'number', label: '次数', prop: 'count', required: true}
  ]
})
const submitData = async () => {
  try {
    const response = await axios.post('/save', rowData.value);
    ElMessage.success(response.data.message);
    closeDialog();
    getData();
  } catch (error) {
    ElMessage.error('添加失败');
  }
};

const visible = ref(false);
const isEdit = ref(false);
const rowData = ref<TableItem>();
const handleEdit = (row: TableItem) => {
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
};

const updateData = () => {
  if (isEdit.value) {
    // Update existing data logic
  } else {
    submitData();
  }
};

const closeDialog = () => {
  visible.value = false;
  isEdit.value = false;
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
  row: {},
  list: []
});
const handleView = (row: TableItem) => {
  viewData.value.row = {...row}
  viewData.value.list = [
    {
      prop: 'id',
      label: '用户ID',
    },
    {
      prop: 'name',
      label: '用户名',
    },
    {
      prop: 'money',
      label: '账户余额',
    },
    {
      prop: 'state',
      label: '账户状态',
    },
    {
      prop: 'thumb',
      label: '头像',
    },
  ]
  visible1.value = true;
};

// 删除相关
const handleDelete = async (row: TableItem) => {
  const a = await fetchDeleteWebsite();
  ElMessage.success('删除成功');
}
</script>

<style scoped>
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
