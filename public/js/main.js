const vm = new Vue({
    el     : "#app",
    data   : {
      lists        : [],
      apiRequestUrl: 'http://localhost:3000',
      isDisplay    : false,
      newTitle     : '',
      id           : 0,
      isEdit       : false,
      changeTitle  : '',
      editId       : ''
    },
    mounted: function () {
      this.$http.get(this.apiRequestUrl).then(function (res) {
        this.lists = res.data;
        let len = res.data.length;
        let dataId = res.data[Object.keys(res.data)[Object.keys(res.data).length - 1]].id;
        this.id = dataId ? parseInt(dataId) + 1 : 0;
      })
    },
    methods: {
      addData   : function () {
        this.isDisplay = true;
        this.newTitle = '';
      },
      removeData: function (id) {
        swal({
          title            : '确定要删除吗？',
          type             : 'warning',
          showCancelButton : true,
          confirmButtonText: '确定',
          cancelButtonText : '取消'
        }).then((result) => {
          if (result.value) {
            let _this = this;
            this.$http.delete(this.apiRequestUrl + '/' + id).then(function () {
              _this.$http.get(_this.apiRequestUrl).then(function (res) {
                this.lists = res.data;
                let len = res.data.length;
                let dataId = res.data[Object.keys(res.data)[Object.keys(res.data).length - 1]].id;
                this.id = dataId ? parseInt(dataId) + 1 : 0;
              })
            }).then(function () {
              swal('删除成功！')
            });
          }
        })
      }
      ,
      editData  : function (id) {
        this.isEdit = true;
        this.editId = id;
      }
      ,
      saveData  : function () {
        let _this = this;
        let displayData = {
          "id"    : this.id,
          "title" : this.newTitle,
          "date"  : new Date().toLocaleDateString(),
          "action": "删除数据"
        };
        this.lists.push(displayData);
        this.id++;
        this.isDisplay = false;
        this.$http.post(this.apiRequestUrl, displayData).then(function () {
          _this.$http.get(_this.apiRequestUrl).then(function (res) {
            _this.lists = res.data;
            let len = res.data.length;
            let dataId = res.data[Object.keys(res.data)[Object.keys(res.data).length - 1]].id;
            _this.id = dataId ? parseInt(dataId) + 1 : 0;
          })
        });
      },
      sureEdit  : function () {
        let _this = this;
        let changeTitle = {
          title: this.changeTitle
        };
        this.isEdit = false;
        this.$http.put(this.apiRequestUrl + '/' + this.editId, changeTitle).then(function () {
          _this.$http.get(_this.apiRequestUrl).then(function (res) {
            _this.lists = res.data;
            let len = res.data.length;
            let dataId = res.data[Object.keys(res.data)[Object.keys(res.data).length - 1]].id;
            _this.id = dataId ? parseInt(dataId) + 1 : 0;
          })
        });
      },
      cancelEdit:function () {
        this.isEdit = false;
      }

    }

  })
;
