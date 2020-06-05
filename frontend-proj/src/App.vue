<template>
  <div id="app">
    <div class="menu">
      <router-link :to="{ name: 'home' }" class="home_b" :class="$mq">&#9903;</router-link>
      <router-link :to="{ name: 'creator' }" class="creator_b" :class="$mq">+</router-link>
      <router-link :to="{ name: 'settings' }" class="login_b" :class="$mq">
        <div v-if="!$store.state.jwt">&#9868;</div>
        <div v-else style="margin-top: 3px"> &#9881; </div>
      </router-link>
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
    scroll-padding-top: 60px

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
    margin: 7px
    margin-right: 12px
    font-size: 23px
    &.small
        margin-right: 2px

.home_b
    z-index: 4
    color: white
    text-decoration: none
    float: left
    margin: 11px
    font-size: 25px
    margin-left: 30px

.creator_b
    z-index: 4
    color: white
    padding: 0 9px
    border-radius: 5px
    font-size: 30px
    float: right
    margin: 7px
    margin-right: 30px
    text-decoration: none
    font-family: Raleway-Regular
    &.small
        margin-right: 5px

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
