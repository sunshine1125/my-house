<template>
  <div class="uploadImage row">
    <input type="file" id="file" name="imgData" accept="image/*" @change="upLoad($event)">
    <el-button type="primary">上传封面</el-button>
    <div v-if="!edit" class="previewImage" :style="`background-image: url(${imgSrc})`"></div>
    <div v-else class="previewImage" :style="`background-image: url(${imgPath})`"></div>
  </div>
</template>

<script>

  export default {
    name      : 'uploadImage',
    props     : ['imgPath', 'edit'],
    data() {
      return {
        imgSrc: ''
      }
    },
    methods   : {
      upLoad(e) {
        let file = e.target.files[0];
        // upload image
        let fd = new FormData();
        fd.append('file', file);
        this.$http.post('/api/uploadImage', fd, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          this.imgSrc = res.data.path;
          this.$emit('imgSrc', this.imgSrc);
        });
      }
    },
    components: {}
  }
</script>
<style lang="stylus" scoped>
  .uploadImage
    position relative
    input, button
      position absolute
      left 0px
      width 15%
    input
      opacity 0
      z-index 10
    .previewImage
      position absolute
      left 20%
      margin-right 10px
      width 40px
      height 40px
      background-repeat no-repeat
      background-position center
      -webkit-background-size cover
      background-size cover
</style>
