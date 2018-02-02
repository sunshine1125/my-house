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
      // this.$http.get(this.apiRequestUrl).then(function (res) {
      //   this.lists = res.data.data;
      //   console.log(res.data.data);
      // })
    },
    methods: {
      addData: function () {
        this.isDisplay = true;
        this.newTitle = '';
      },
      removeData : function (id) {
        // return this.lists.find(function(item) {
        //   if(item.id === id) {
        //    this.lists.splice(id, 1);
        //   }
        // })
        this.$http.delete(this.apiRequestUrl);
      }
      ,
      saveData   : function () {
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
