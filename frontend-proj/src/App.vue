<template>
  <div id="app">
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
  font-family: 'Raleway-Bold';
  src: url('./assets/fonts/Raleway/Raleway-Bold.ttf');
}

#app {
  font-family: 'Raleway-Bold';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
