<template>
  <div id="app">
    <div class="menu" :class="$mq">
      <router-link :to="{ name: 'home' }" class="home_b" :class="$mq">
          <img src="./assets/images/Logo.png" width="27" height="27">
      </router-link>
      <router-link :to="{ name: 'settings' }" class="login_b" :class="$mq">&#9868;</router-link>
    </div>
    <div id="modal" :class="$mq">
        <div class="message" :class="$mq">{{ $store.state.message }}</div>
        <div id="modal-button" v-on:click="closeModal()" class="ok-button" :class="$mq">OK</div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
    name: 'App',
    created(){
        this.refreshToken()
        this.tokenRefresh = setInterval(() => this.refreshToken(), 840000) //14min
    },
    data(){
        return {
            baseApi: 'https://tline-283413.ew.r.appspot.com/api/',
            tokenRefresh: null
        }
    },
    methods: {
        refreshToken(){
            var refreshApi = this.baseApi + 'auth/refreshToken'
            this.axios.post(refreshApi, {}, {withCredentials: true})
                    .then(response => {this.$store.commit('set', response.data)})
                    .catch(error => {console.log(error)})
        },
        closeModal(){
            document.getElementById("modal").style.display = "none"
        }
    }
}

</script>

<style lang="sass">
@import './assets/saas-vars.sass'

.loader
    border: 4px solid #c2c2c2
    border-top: 4px solid #303030
    border-radius: 50%
    width: 17px
    height: 17px
    animation: spin 1s linear infinite

@keyframes spin
    0%
        transform: rotate(0deg)
    100%
        transform: rotate(360deg)

.shadow
    opacity: 0.3
    pointer-events: none

.exit
    position: absolute
    top: 10px
    cursor: pointer
    right: 20px

#modal
    user-select: none
    display: none
    position: fixed
    top: 25%
    z-index: 5
    width: 25%
    margin-left: 37%
    box-shadow: 0 0 0 1600px rgba(0,0,0,0.65)
    border-radius: 10px
    background: $bg2-color
    &.medium
        width: 40%
        margin-left: 30%
    &.small
        width: 70%
        margin-left: 15%

.message
    font-family: OpenSans-Regular
    text-align: left
    margin: 30px 35px

.ok-button
    cursor: pointer
    width: 50%
    background: #B8352D
    color: white
    font-family: Raleway-Regular
    margin: 40px auto
    padding: 8px 0
    border-radius: 5px

html
    scroll-padding-top: 75px

@font-face
    font-family: 'Raleway-Regular'
    src: url('./assets/fonts/Raleway/Raleway-Regular.ttf')

@font-face 
    font-family: 'OpenSans-Regular'
    src: url('./assets/fonts/OpenSans/OpenSans-Regular.ttf')

#app
    -webkit-appearance: none
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
    margin: 11px 40px
    font-size: 23px
    &.small
        margin-right: 4%


.home_b
    z-index: 4
    float: left
    margin: 16px 40px
    &.small
        margin-left: 4%

.menu
    z-index: 3
    position: fixed
    top: 0
    backdrop-filter: blur(2px)
    background: rgba(30,30,30, 0.97)
    height: 60px
    width: 100%

body
  background: #f9f9f9
  margin: 0
  padding-bottom: 25%

p
    font-family: 'OpenSans-Regular'

</style>
