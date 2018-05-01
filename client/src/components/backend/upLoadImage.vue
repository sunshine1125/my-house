<template>
  <div class="uploadImage">
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">上传图片</label>
      <input type="file" id="file" name="imgData" accept="image/*" @change="upLoad($event)">
    </div>
    <div class="form-group row" v-show="imgPath !== '' || imgSrc">
      <span class="col-sm-2"></span>
      <div v-if="imgSrc"><img width="100px" height="150px" :src="imgSrc"/></div>
      <div v-if="!imgSrc"><img width="100px" height="150px" :src="imgPath"/></div>
    </div>
  </div>
</template>

<script>

  export default {
    name      : 'uploadImage',
    props: ['imgSrc'],
    data() {
      return {
        imgPath: ''
      }
    },
    mounted: function() {
      if (this.imgSrc) {
        this.imgPath = this.imgSrc;
      }
    },
    methods   : {
      upLoad(e) {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.imgResult = e.target.result;
        };
        // upload image
        let fd = new FormData();
        fd.append('file', file);
        this.$http.post('/api/post/uploadImage', fd, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          this.imgPath = res.data.path;
          this.$emit('imgHasChange', this.imgPath);
        });
      }
    },
    components: {}
  }
</script>
<style scoped>

</style>
