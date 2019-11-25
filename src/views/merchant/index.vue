<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchQuery.company_name" placeholder="商家名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="searchQuery.create_operator" placeholder="创建人" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker
        style="width: 150px" 
        class="vm" 
        v-model="searchQuery.start_time"
        type="date"
        placeholder="开始时间">
      </el-date-picker>
      <el-date-picker
        style="width: 150px" 
        class="vm" 
        v-model="searchQuery.end_time"
        type="date"
        placeholder="结束时间">
      </el-date-picker>
      <el-select v-model="searchQuery.state" placeholder="商家状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in merchantState" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      
      <el-button class="filter-item" type="primary" @click="handleFilter">
        筛选
      </el-button>
      <el-button class="filter-item" type="default" @click="handleReset">
        重置
      </el-button>
      <!-- <el-button :loading="downloadLoading" class="filter-item" type="default" @click="handleDownload">
        导出
      </el-button> -->
      <!-- <el-button class="filter-item" style="margin-left: 10px; float: right;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button> -->
    </div>
    <el-table
      :data="tableData"
      v-loading="listLoading"
      border  
      style="width: 100%; margin-top: 20px;">
      <el-table-column
        prop="id" 
        label="商家编号">
      </el-table-column>
      <el-table-column
        prop="company_name" 
        label="商家名称">
      </el-table-column>
      <el-table-column
        prop="state" 
        label="商家状态">
        <template slot-scope="scope">
          <span>{{ stateFormat[scope.row.state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="addr" 
        label="地址">
      </el-table-column>
      <el-table-column
        prop="link_user" 
        label="联系人">
      </el-table-column>
      <el-table-column
        prop="phone" 
        label="联系方式">
      </el-table-column>
      <el-table-column
        prop="create_operator" 
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="create_time" 
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="remarks" 
        label="备注">
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item label="商家名称" prop="company_name">
          <el-input v-model="temp.company_name" placeholder="请输入商家名称" />
        </el-form-item>
        <el-form-item label="商家状态" prop="state">
          <el-select v-model="temp.state" class="filter-item" placeholder="请选择">
            <el-option v-for="item in merchantState" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="temp.addr" placeholder="请输入商家地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="link_user">
          <el-input v-model="temp.link_user" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="temp.phone" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remarks" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="btnLoading" @click="dialogStatus==='create' ? createData() : updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { merchantList, createMerchant, updateMerchant } from '@/api/merchant'
import Pagination from '@/components/Pagination'
export default {
  name: 'MerchantIndex',
  components: { Pagination },
  data() {
    return {
      btnLoading: false,
      tableData: [],
      tableKey: 0,
      total: 0,
      downloadLoading: false,
      listLoading: true,
      listQuery: {
        page_size: 20,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      },
      searchQuery: {
        company_name: '',
        create_operator: '',
        start_time: '',
        end_time: '',
        state: ''
      },
      merchantState: [{label: '运营中', value: 1}, {label: '已关闭', value: 0}],
      stateFormat: {
        1: '运营中',
        0: '已关闭'
      },
      temp: {
        id: undefined,
        company_name: '',
        phone: '',
        addr: '',
        state: '',
        link_user: '',
        remarks: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑商家',
        create: '新增商家'
      },
      dialogPvVisible: false,
      rules: {
        state: [{ required: true, message: '请选择商家状态', trigger: 'change' }],
        company_name: [{ required: true, message: '请输入商家名称', trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      merchantList(data).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        company_name: '',
        phone: '',
        addr: '',
        state: '',
        link_user: '',
        remarks: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          this.temp.id = '' // mock a id
          createMerchant(this.temp).then(() => {
            this.btnLoading = false;
            this.getList();
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = {
            id: this.temp.id,
            company_name: this.temp.company_name,
            phone: this.temp.phone,
            addr: this.temp.addr,
            state: this.temp.state,
            link_user: this.temp.link_user,
            remarks: this.temp.remarks
          }
          this.btnLoading = true;
          updateMerchant(tempData).then(() => {
            this.btnLoading = false;
            this.getList();
            // for (const v of this.tableData) {
            //   if (v.id === this.temp.id) {
            //     const index = this.tableData.indexOf(v)
            //     this.tableData.splice(index, 1, this.temp)
            //     break
            //   }
            // }
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleReset() {
      this.listQuery = {
        page_size: 20,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      };
      this.searchQuery = {
        company_name: '',
        create_operator: '',
        start_time: '',
        end_time: '',
        state: ''
      };
      this.getList();
    },
    handleFilter() {
      this.listQuery.page_index = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
    }
  }
}
</script>
<style>
  .vm {
    vertical-align: top;
  }
  .pages-wrap {
    margin: 10px 0;
  }
  .fr {
    float: right;
  }
</style>