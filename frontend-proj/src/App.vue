<template>
  <div id="app">
    <div class="menu" :class="$mq">
      <router-link :to="{ name: 'home' }" class="home_b" :class="$mq">
          <img src="./assets/images/Logo.png" width="27" height="27">
      </router-link>
      <router-link :to="{ name: 'settings' }" class="login_b" :class="$mq">&#9868;</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
    name: 'App',
    created(){
        this.refreshToken()
        this.tokenRefresh = setInterval(() => this.refreshTry(), 840000)
    },
    data(){
        return {
        baseApi: 'http://localhost:8081/api/',
        tokenRefresh: null
        }
    },
    methods: {
        refreshTry(){
            //if token exists and outdated(14min - 1min before expire)
            if(this.$store.state.jwt){
                var expires = new Date(this.$store.state.jwt.creationTime)
                var now = new Date()
                if (now.getTime() - expires.getTime() >= 840000){
                    this.refreshToken()
                }
            }
        },
        refreshToken(){
            var refreshApi = this.baseApi + 'auth/refreshToken'
            this.axios.post(refreshApi, {}, {withCredentials: true})
                    .then(response => {this.$store.commit('set', response.data)})
                    .catch(error => {console.log(error)})
        }
    }
}

</script>

<style lang="sass">
html
    scroll-padding-top: 75px

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
    text-decoration: none
    font-family: Raleway-Regular
    z-index: 4
    color: white
    float: right
    margin: 10px 30px
    font-size: 23px
    &.small
        margin-right: 4%


.home_b
    z-index: 4
    float: left
    margin: 15px 30px
    &.small
        margin-left: 4%

.menu
    z-index: 3
    position: fixed
    top: 0
    background: #303030
    height: 55px
    width: 100%

body
  margin: 0
  padding-bottom: 25%

p
    font-family: 'OpenSans-Regular'

</style>
