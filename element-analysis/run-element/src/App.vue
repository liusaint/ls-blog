<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
     <ElAlert title="这是一个alert" show-icon description="this is description">1</ElAlert>
  </div>

</template>

<script>
export default {
  name: 'app',
  created(){
    this.$alert(2);
  }
}
</script>

<style>
/*import 'element-ui.css';*/
@import '../node_modules/element-ui/lib/theme-default/index.css';
/*@import '../../node_modules/swiper/dist/css/swiper.min.css';*/
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
