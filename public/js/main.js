const vm = new Vue({
    el     : "#app",
    data   : {
      lists        : [],
      apiRequestUrl: 'http://localhost:3000/data',
      isDisplay    : false,
      newTitle     : '',
      id           : 0
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

        this.$http.delete(this.apiRequestUrl);
      }
      ,
      saveData  : function () {
        let displayData = {
          "id"    : this.id,
          "title" : this.newTitle,
          "date"  : new Date().toLocaleDateString(),
          "action": "删除数据"
        };
        this.lists.push(displayData);
        this.id++;
        this.isDisplay = false;
        this.$http.post(this.apiRequestUrl, displayData);
      }

    }

  })
;
