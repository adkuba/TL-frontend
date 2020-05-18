<template>
  <div id="app">
    
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
}

</script>

<style>
@font-face {
  font-family: 'Raleway-Regular';
  src: url('./assets/fonts/Raleway/Raleway-Regular.ttf');
}

@font-face {
  font-family: 'OpenSans-Regular';
  src: url('./assets/fonts/OpenSans/OpenSans-Regular.ttf');
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #303030;
}

.menu{
    z-index:3;
    position: fixed;
    top:0;
    background: #303030;
    height: 50px;
    width: 100%;
}

body{
  margin: 0;
  padding-bottom: 25%;
}

p{
    font-family: 'OpenSans-Regular';
}

</style>
