<template>
  <div id="app">
    <div class="menu" :class="$mq">
      <router-link :to="{ name: 'home' }" class="home_b" :class="$mq">&#9903;</router-link>
      <router-link :to="{ name: 'settings' }" class="login_b" :class="$mq">
        <div class="get-started" :class="$mq" v-if="!$store.state.jwt">Get started</div>
        <div v-else style="margin-top: 3px"> &#9868; </div>
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
    scroll-padding-top: 85px

@font-face
    font-family: 'Raleway-Regular'
    src: url('./assets/fonts/Raleway/Raleway-Regular.ttf')

@font-face 
    font-family: 'OpenSans-Regular'
    src: url('./assets/fonts/OpenSans/OpenSans-Regular.ttf')

.get-started
    background: #B8352D
    padding: 3px 20px
    border-radius: 5px
    font-size: 16px
    &.small
        font-size: 14px

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
    margin: 18px 30px
    font-size: 23px
    &.small
        margin-right: 5%


.home_b
    z-index: 4
    color: white
    text-decoration: none
    float: left
    margin: 9px 30px
    font-size: 35px
    letter-spacing: 3px
    font-family: Raleway-Regular
    &.small
        margin-left: 1px
        transform: rotate(90deg)

.menu
    z-index: 3
    position: fixed
    top: 0
    background: #303030
    height: 60px
    width: 100%

body
  margin: 0
  padding-bottom: 25%

p
    font-family: 'OpenSans-Regular'

</style>
