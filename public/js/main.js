const vm = new Vue({
  el     : "#app",
  data   : {
    lists        : [],
    // displayData:{
    //   "id"    : id,
    //   "title" : title,
    //   "date"  : new Date().toLocaleDateString(),
    //   "action": "remove"
    // },
    apiRequestUrl: 'http://localhost:3000/data'
  },
  mounted: function () {
    this.$http.get(this.apiRequestUrl).then(function (res) {
      this.lists = res.data.data;
      console.log(res.data.data);
    })
  },
  methods: {
    get   : function () {
      this.$http.get(this.apiRequestUrl).then(function (res) {
        this.lists = res.data.data;
        console.log(res.data.data);
      })
    },
    add   : function () {
      this.lists.push();
      console.log(this.lists.length);
      let data = {
        "id"    : 7,
        "title" : "test",
        "date"  : "2018-02-07",
        "action": "remove"
      };
      this.$http.post('http://localhost:3000/data', data);
    },
    remove: function () {

    },
    save  : function () {

    }

  }

});
