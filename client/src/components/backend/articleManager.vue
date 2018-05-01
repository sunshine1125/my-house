<template>
  <div>
    <el-row style="text-align: left">
      <strong>文章管理</strong>
    </el-row>
    <el-row>
      <el-button @click="addData()" type="primary" plain round icon="el-icon-plus" class="circle el-button--small"></el-button>
    </el-row>
    <el-row style="text-align: center">
      <el-col :span="24">
        <el-table :data="lists" border style="width: 100%;">
          <el-table-column
            type="index"
            label="#"
            min-width="10%">
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="image"-->
          <!--label="图片"-->
          <!--min-width="15%" style="overflow: hidden">-->
          <!--<template slot-scope="scope">-->
          <!--<div style="'background-image: url(' + scope.row.image + ')'"></div>-->
          <!--&lt;!&ndash;<img width="100%" height="100%" :src="scope.row.image" alt="">&ndash;&gt;-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column
            prop="title"
            label="标题"
            min-width="15%">
          </el-table-column>
          <el-table-column
            prop="tagTitle"
            label="标签"
            min-width="5%">
          </el-table-column>
          <el-table-column
            prop="content"
            label="内容"
            min-width="25%"
            class="content">
          </el-table-column>
          <el-table-column
            prop="date"
            label="日期"
            min-width="10%">
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="20%">
            <template slot-scope="scope">
              <el-button @click="goShowData(scope.row._id)" type="success" icon="el-icon-view" plain round class="circle"></el-button>
              <el-button @click="editData(scope.row._id)" type="primary" icon="el-icon-edit" plain round class="circle"></el-button>
              <el-button @click="removeData(scope.row._id)" type="danger" icon="el-icon-delete" plain round class="circle"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--<el-row>-->
      <!--<el-col :span="24" class="page">-->
        <!--<el-pagination layout="prev,pager,next"-->
                       <!--@current-change="handle"-->
                       <!--:total="total"-->
                       <!--:page-size="limit"-->
                       <!--style="float:right">-->
        <!--</el-pagination>-->
      <!--</el-col>-->
    <!--</el-row>-->
  </div>
</template>

<script>

  export default {
    name   : 'articleManager',
    data() {
      return {
        active  : true,
        username: '',
        lists   : [],
        userId  : '',
        total   : 0,
        page    : 1,
        limit   : 2
      }
    },
    mounted: function () {
      let _this = this;
      if (localStorage.getItem('userInfo')) {
        this.username = JSON.parse(localStorage.getItem('userInfo')).email;
        this.userId = JSON.parse(localStorage.getItem('userInfo'))._id;
        _this.refreshData();
      } else {
        this.$router.push('/admin/login');
      }
    },
    methods: {
      refreshData() {
        this.$http.get(`/api/post/get/${this.userId}`).then(res => {
          this.lists = res.data;
          this.lists.find(item => {
            item.date = this.$moment(item.date).format('YYYY-MM-DD HH:mm:ss');
          })
        });
      },
      addData() {
        this.$router.push('/admin/dataChange/add');
        this.newTitle = '';
      },
      removeData(id) {
        this.$confirm('确定删除这篇文章吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText : '取消',
          type             : 'warning'
        }).then((value) => {
          this.$http.delete(`/api/post/remove/${id}`)
            .then(() => this.refreshData())
            .then(() => {
              this.$message({
                type   : 'success',
                message: '删除成功！'
              })
            });
        }).catch(() => {
          this.$message({
            type   : 'info',
            message: '已取消删除'
          })
        })
      },
      editData(id) {
        this.$router.push('/admin/dataChange/edit');
        let canEdit = {
          "editId": id
        };
        localStorage.setItem('canEdit', JSON.stringify(canEdit));
      },
      goShowData(id) {
        this.$router.push(`/detail/${id}`);
      },
      handle(val){
        this.page = val;
        this.refreshData()
      },
    }
  }
</script>
<style scoped lang="stylus">
  .el-button.circle
    padding 6px 6px

  .el-button
    outline none

  .el-row
    text-align left
    margin-bottom 10px
</style>
