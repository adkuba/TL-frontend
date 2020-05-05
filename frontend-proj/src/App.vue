<template>
  <div id="app">
    <div class="menu"></div>
    <Timeline/>
  </div>
</template>

<script>
import Timeline from './components/Timeline.vue'

export default {
  name: 'App',
  components: {
    Timeline
  }
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
  background: #303030;
  height: 50px;
}

body{
  margin: 0;
  padding-bottom: 25%;
}

p{
    font-family: 'OpenSans-Regular';
}

</style>
