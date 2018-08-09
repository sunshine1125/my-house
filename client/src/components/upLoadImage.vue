<template>
  <el-row class="uploadImage" type="flex" justify="start">
    <div class="upFile">
      <el-button class="upload" type="primary">上传封面</el-button>
      <input type="file" id="file" name="imgData" accept="image/*" @change="upLoad($event)">
    </div>
    <div v-if="!edit" class="previewImage" :style="`background-image: url(${imgSrc})`"></div>
    <div v-else class="previewImage" :style="`background-image: url(${imgPath})`"></div>
  </el-row>
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
        this.$http.post('/api/upload', fd, {
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
  .uploadImage{
    position relative
    width 100%
    height 100%
    overflow hidden
    .upFile {
      width 24%
      position relative
      #file, .upload {
        width 100%
        height 100%
      }
      #file {
        opacity 0
        z-index 10
        cursor pointer
        position absolute
        left 0
        top 0
      }
    }
    .previewImage {
      margin-left 30px
      width 40px
      height 40px
      background-repeat no-repeat
      background-position center
      -webkit-background-size cover
      background-size cover
    }
  }

    /*input, button*/
      /*position absolute*/
      /*left 0px*/
      /*width 15%*/
      /*cursor pointer*/
    /*input*/
      /*opacity 0*/
      /*z-index 10*/

</style>
