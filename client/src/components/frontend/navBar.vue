<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <a class="navbar-brand" href="#">小屋</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav ml-auto">
        <!--<li class="nav-item active">-->
          <!--<a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>-->
        <!--</li>-->
        <li class="nav-item">
          <a class="nav-link" href="#">登录</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">注册</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Dropdown link
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something else here</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>

  export default {
    name      : 'navBar',
    data() {
      return {
      }
    },
    mounted   : function () {
    },
    computed: {

    },
    methods   : {

    },
    components: {}
  }
</script>
<style scoped lang="stylus">
  .navbar
    border-bottom 1px solid #e0e0e0
    position fixed
    top 0
    left 0
    width 100%
    z-index 100
    background-color #f5f5f5
</style>
