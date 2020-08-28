<template>
  <div id="app">
    <img src="./assets/images/default/Default1.png" style="display: none">
    <div class="menu" :class="$mq">
        <router-link :to="{ name: 'home' }" class="home_b" :class="$mq">
            <img src="./assets/images/logo.png" width="27" height="27">
        </router-link>
        <div class="login_b" :class="[{ 'notification-anim': !$store.state.notifications.read }, $mq]" v-on:click="dropdown()">&#9868;</div>
    </div>
    <div id="dropdown-bg" v-on:click="dropdown()"></div>
    <div id="dropdown" :class="$mq">
        <div class="quit" v-on:click="dropdown()">x</div>
        <router-link :to="{ name: 'settings' }" style="text-decoration: none">
            <div v-if="$store.state.jwt" class="account first">Settings</div>
            <div v-else class="account first">Sign in</div>
        </router-link>
        <router-link v-if="$store.state.jwt" :to="{ path: '/profile/' + $store.state.jwt.user.username }" style="text-decoration: none">
            <div v-if="$store.state.jwt" class="account">Profile</div>
        </router-link>
        <router-link v-if="$store.state.jwt" :to="{ name: 'creator' }" style="text-decoration: none">
            <div v-if="$store.state.jwt" class="account">Create</div>
        </router-link>
        
        <div class="notifications-h1">NOTIFICATIONS</div>
        <div v-for="(message, idx) in $store.state.notifications.messages" :key="idx" class="notification">
            <router-link :to="{ path: '/profile/' + message.username }" style="text-decoration: none; color: #303030">
                <div class="notif-user">{{ message.username }}</div>
                <div>{{ message.text }}</div>
                <div class="date">{{ message.date }}</div>
            </router-link>
        </div>
        <div v-if="$store.state.notifications.messages.length == 0" class="notification">
            <router-link :to="{ path: '/login' }" style="text-decoration: none; color: #303030">
                <div class="notif-user">tline</div>
                <div>Login to create!</div>
                <div class="date">now</div>
            </router-link>
        </div>
        <div v-if="$store.state.notifications.messages.length == 0" class="notification">
            <router-link :to="{ path: '/login' }" style="text-decoration: none; color: #303030">
                <div class="notif-user">tline</div>
                <div>Sign up and get more features.</div>
                <div class="date">now</div>
            </router-link>
        </div>
    </div>
    <div id="modal" :class="$mq">
        <div class="message" :class="$mq">{{ $store.state.message }}</div>
        <div id="modal-button" v-on:click="closeModal()" class="ok-button" :class="$mq">OK</div>
    </div>
    <div id="regulations-info" v-if="local">
        <div>
            <div style="display: inline-block; margin-right: 5px">By using our site you agree to </div>
            <a href="https://www.tline.site/about#regulations" style="color: #14426b; display: inline-block"> regulations</a>
            <div class="close-info" :class="$mq" v-on:click="closeInfo()">Click to close</div>
        </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>

export default {
    name: 'App',
    mounted(){
        this.checkLocalStorage()
        this.refreshToken()
        this.tokenRefresh = setInterval(() => this.refreshToken(), 840000) //14min
    },
    data(){
        return {
            baseApi: 'https://api.tline.site/api/',
            tokenRefresh: null,
            local: true
        }
    },
    methods: {
        dropdown(){
            var dropdown = document.getElementById("dropdown")
            if (dropdown.style.display == "block"){
                dropdown.style.display = "none"
                document.getElementById("dropdown-bg").style.display = "none"
            } else {
                var notifications = {
                    read: true,
                    messages: this.$store.state.notifications.messages
                }
                this.$store.commit('setNotifications', notifications)
                dropdown.style.display = "block"
                document.getElementById("dropdown-bg").style.display = "block"
            }
        },
        refreshToken(){
            var refreshApi = this.baseApi + 'auth/refreshToken'
            this.axios.post(refreshApi, {}, {withCredentials: true})
                    .then(response => {
                        this.$store.commit('set', response.data)
                        this.$store.commit('setRefresh', true)
                        this.getNotifications()
                    })
                    .catch(error => {
                        this.$store.commit('setRefresh', true)
                        var notifications = {
                            read: false,
                            messages: this.$store.state.notifications.messages
                        }
                        this.$store.commit('setNotifications', notifications)
                        console.log(error)
                    })
        },
        getNotifications(){
            this.axios.get(this.baseApi + "users/notifications", {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                }
            }).then(response => {
                var notification = response.data
                notification.messages.reverse()
                this.$store.commit('setNotifications', notification)
            }).catch(error => {
                console.log(error)
            })
        },
        closeModal(){
            document.getElementById("modal").style.display = "none"
        },
        closeInfo(){
            localStorage.setItem("regulations", true)
            this.local = false
        },
        checkLocalStorage(){
            if (this.$store.state.jwt || localStorage.getItem("regulations")){
                this.local = false
            } else {
                this.local = true
            }
        }
    }
}
</script>


<style lang="sass">
@import './assets/saas-vars.sass'

.first
    margin-top: 25px

#dropdown-bg
    position: fixed
    width: 100%
    height: 100%
    top: 0
    left: 0
    z-index: 3
    display: none

.notifications-h1
    margin-top: 60px
    font-family: OpenSans-Regular
    font-size: 16px
    color: #7e7e7e
    text-align: left
    padding: 0 30px
    margin-bottom: 10px

.quit
    color: #7e7e7e
    position: absolute
    right: 10px
    padding: 10px
    top: 0
    cursor: pointer
    font-family: OpenSans-Regular

.notif-user
    font-family: Raleway-Regular
    font-size: 20px
    font-weight: bold
    letter-spacing: 1px

.date
    color: #14426B
    font-size: 13px

.notification
    padding: 11px 30px
    font-family: OpenSans-Regular
    text-align: left
    font-size: 14px

#dropdown::-webkit-scrollbar
    width: 0px

#dropdown::-webkit-scrollbar-track
    background: #e7e7e7

#dropdown::-webkit-scrollbar-thumb
    background: #c0c0c0

#dropdown::-webkit-scrollbar-thumb:hover
    background: #a3a3a3

.account
    margin-bottom: 5px
    padding: 0 30px
    color: #303030
    font-family: Raleway-Regular
    letter-spacing: 1px
    font-weight: bold
    text-align: left
    font-size: 35px

#dropdown
    max-height: calc( 100vh - 90px)
    outline: none
    overflow: auto
    display: none
    position: fixed
    top: 70px
    z-index: 3
    right: 10px
    width: 25%
    height: 450px
    box-shadow: 0 0 0 2000px rgba(0,0,0,0.65)
    border-radius: 10px
    background: $bg2-color
    animation-timing-function: ease-in
    animation: fadein 0.2s
    &.medium
        width: 45%
    &.small
        width: 80%

.close-info
    font-size: 13px
    cursor: pointer
    text-decoration: underline
    color: #7e7e7e
    display: inline-block
    margin-left: 20px
    &.small
        margin-left: 0
        display: block

#regulations-info
    border-top: 1px solid #303030
    position: fixed
    font-size: 14px
    font-family: OpenSans-Regular
    width: 100%
    bottom: 0
    padding: 20px 10px
    box-sizing: border-box
    z-index: 7
    background: $bg-color

@keyframes fadein
    0%
        opacity: 0
    100%
        opacity: 1

.loader
    border: 4px solid #c2c2c2
    border-top: 4px solid #303030
    border-radius: 50%
    width: 17px
    height: 17px
    animation: spin 1s linear infinite

@keyframes pulse
    0%
        background: rgba(0, 0, 0, 0.5)
    50%
        background: rgba(0, 0, 0, 0.7)
    100%
        background: rgba(0, 0, 0, 0.5)

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
    z-index: 6
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

@keyframes notify
    0%
        color: white
    50%
        color: #B8352D
    100%
        color: white

.login_b
    cursor: pointer
    user-select: none
    font-family: Raleway-Regular
    z-index: 4
    color: white
    float: right
    margin-top: 11px
    margin-right: 40px
    font-size: 23px
    &.small
        margin-right: 4%

.notification-anim
    animation: notify 3s linear infinite

.home_b
    user-select: none
    z-index: 4
    float: left
    margin-top: 16px
    margin-left: 40px
    &.small
        margin-left: 4%

.menu
    z-index: 5
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
