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

<style lang="sass">
@font-face
    font-family: 'Raleway-Regular'
    src: url('./assets/fonts/Raleway/Raleway-Regular.ttf')

@font-face 
    font-family: 'OpenSans-Regular'
    src: url('./assets/fonts/OpenSans/OpenSans-Regular.ttf')

#app 
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    text-align: center
    color: #303030

.login_b
    z-index: 4
    color: white
    float: right
    margin: 15px

.home_b
    z-index: 4
    float: left
    width: 25px
    height: 10px
    border-radius: 6px
    border: 1px solid white
    margin: 20px

.menu
    z-index: 3
    position: fixed
    top: 0
    background: #303030
    height: 50px
    width: 100%

body
  margin: 0
  padding-bottom: 25%

p
    font-family: 'OpenSans-Regular'

</style>
