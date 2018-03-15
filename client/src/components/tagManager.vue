<template>
  <div>
    <div style="margin-bottom: 20px; text-align: left;">
      <el-button type="primary" @click="addTag()">新增</el-button>
    </div>
    <el-table :data="tags" border style="width: 80%;">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="editTag(scope.row._id, scope.row.title)" size="small">编辑</el-button>
          <el-button @click="removeTag(scope.row._id)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  export default {
    name   : 'articleManager',
    data() {
      return {
        tags: []
      }
    },
    mounted: function () {
      this.refreshData();
    },
    methods: {
      refreshData() {
        this.$http.get('/api/getTag').then(res => this.tags = res.data.data);
      },
      addTag() {
        this.$prompt('请输入标题', '新增', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          let tag  = {
            title : value
          };
          this.$http.post('api/addTag', tag).then( (res) => {
            this.tags = res.data.data;
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          });
        }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            })

          })
      },
      editTag(id, title) {
        this.$prompt('请输入标题', '编辑', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: title
        }).then(({ value }) => {
          let tag  = {
            title : value
          };
          this.$http.put('api/editTag/' + id, tag).then( (res) => {
            this.refreshData();
            this.$message({
              type: 'success',
              message: '更新成功'
            })
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      },
      removeTag(id) {
        this.$confirm('确定删除该条记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('api/removeTag/' + id).then( (res) => {
            this.refreshData();
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>
<style scoped>
</style>
