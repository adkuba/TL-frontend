<template>
  <div id="app">
    <div class="menu">
      <router-link :to="{ name: 'home' }" class="home_b"></router-link>
      <router-link :to="{ name: 'creator' }" class="creator_b">+</router-link>
      <router-link :to="{ name: 'settings' }" class="login_b">
        <div v-if="!$store.state.jwt"> login </div>
        <div v-else> settings </div>
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

.creator_b
    z-index: 4
    color: white
    background: #B8352D
    float: right
    margin: 15px
    text-decoration: none
    font-family: Raleway-Regular

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
