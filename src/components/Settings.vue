<template lang="html">
    <div>
        <div id="settings" :class="$mq">
            <div class="controler" :class="$mq">
                <router-link :to="{ path: '/profile/' + $store.state.jwt.user.username}" class="menu-element" :class="$mq">Profile</router-link>
                <router-link :to="{ name: 'creator' }" class="menu-element" :class="$mq">Create</router-link>
                <div class="menu-element" :class="$mq" v-on:click="logout()">Logout</div>
            </div>
            <div class="data-settings" :class="$mq">
                <div class="s_item" :class="$mq">
                    <div class="s_left" :class="$mq">Details</div>
                    <div class="s_right" :class="$mq">
                        <div class="daneh" :class="$mq">Username:</div>
                        <div class="danev" :class="$mq">{{ $store.state.jwt.user.username }}</div>
                        <div class="danea"></div><br>

                        <div class="daneh" :class="$mq">Email:</div>
                        <div class="danev" :class="$mq">{{ $store.state.jwt.user.email }}</div>
                        <router-link :to="{ name: 'emailChange' }" class="danea" :class="$mq">Change email</router-link><br>

                        <div class="daneh" :class="$mq">Password:</div>
                        <div class="danev" :class="$mq">*****</div>
                        <router-link :to="{ name: 'passwordChange' }" class="danea" :class="$mq">Change password</router-link><br>

                        <div class="daneh" :class="$mq">Name:</div>
                        <div class="danev" :class="$mq">{{ $store.state.jwt.user.fullName }}</div>
                        <router-link :to="{ name: 'nameChange' }" class="danea" :class="$mq">Change name</router-link>
                    </div>
                    <div class="s_line"></div>
                </div>

                <div class="s_item" :class="$mq">
                    <div class="s_left" :class="$mq"><a href="https://www.tline.site/about#subscription" style="text-decoration: none; color: #303030">Subscription</a></div>
                    <div class="s_right" :class="$mq">

                            <div v-if="$store.state.jwt.user.subscriptionEnd && $store.state.jwt.user.subscriptionID" class="daneh" :class="$mq">Status:</div>
                            <div v-if="$store.state.jwt.user.subscriptionEnd && $store.state.jwt.user.subscriptionID" class="danev" :class="$mq">Active</div>

                            <div v-if="$store.state.jwt.user.subscriptionEnd && !$store.state.jwt.user.subscriptionID" class="daneh" :class="$mq">Status:</div> 
                            <div v-if="$store.state.jwt.user.subscriptionEnd && !$store.state.jwt.user.subscriptionID" class="danev" :class="$mq">Canceled</div>

                            <div v-if="!$store.state.jwt.user.subscriptionEnd && !$store.state.jwt.user.subscriptionID" class="daneh" :class="$mq">Status:</div>
                            <div v-if="!$store.state.jwt.user.subscriptionEnd && !$store.state.jwt.user.subscriptionID" class="danev" :class="$mq">Free</div>
                            <br v-if="$store.state.jwt.user.subscriptionEnd">

                            <div v-if="$store.state.jwt.user.subscriptionEnd && $store.state.jwt.user.subscriptionID && $store.state.jwt.user.card" class="daneh" :class="$mq">Card:</div>
                            <div v-if="$store.state.jwt.user.subscriptionEnd && $store.state.jwt.user.subscriptionID && $store.state.jwt.user.card" class="danev" :class="$mq">{{ $store.state.jwt.user.card[0].toUpperCase() + $store.state.jwt.user.card.slice(1) }}</div>

                            <div v-if="$store.state.jwt.user.subscriptionEnd && !$store.state.jwt.user.subscriptionID && $store.state.jwt.user.card" class="daneh" :class="$mq">Card:</div> 
                            <div v-if="$store.state.jwt.user.subscriptionEnd && !$store.state.jwt.user.subscriptionID && $store.state.jwt.user.card" class="danev" :class="$mq">{{ $store.state.jwt.user.card[0].toUpperCase() + $store.state.jwt.user.card.slice(1) }}</div>
                            <br v-if="$store.state.jwt.user.subscriptionEnd && $store.state.jwt.user.card">

                            <div v-if="$store.state.jwt.user.subscriptionEnd && $store.state.jwt.user.subscriptionID" class="daneh" :class="$mq">Next payment:</div> 
                            <div v-if="$store.state.jwt.user.subscriptionEnd && $store.state.jwt.user.subscriptionID" class="danev" :class="$mq">{{ $store.state.jwt.user.subscriptionEnd }}</div>

                            <div v-if="$store.state.jwt.user.subscriptionEnd && !$store.state.jwt.user.subscriptionID" class="daneh" :class="$mq">Ends:</div> 
                            <div v-if="$store.state.jwt.user.subscriptionEnd && !$store.state.jwt.user.subscriptionID" class="danev" :class="$mq">{{ $store.state.jwt.user.subscriptionEnd }}</div>
                        
                        <div class="danea" :class="$mq" v-if="$store.state.jwt.user.subscriptionID" v-on:click="cancel()">
                            <div style="text-decoration: underline; cursor: pointer; vertical-align: top; display: inline-block">Cancel</div>
                            <div class="loader" id="ls"></div>
                        </div>
                        <router-link :to="{ name: 'subscription'}" class="danea" style="vertical-align: top" :class="$mq" v-else>Activate</router-link>
                    </div>
                    <div class="s_line"></div>
                </div>

                <div class="s_item" :class="$mq">
                    <div class="s_left" :class="$mq">Contact</div>
                    <div class="s_right" :class="$mq">
                        <div class="daneh" :class="$mq">Contact with us:</div>
                        <div class="danev"></div>
                        <router-link :to="{ name: 'review'}" class="danea" :class="$mq">Write</router-link>
                    </div>
                    <div class="s_line"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="js">

  export default  {
    name: 'Settings',
    created() {
        this.scrollToTop()
        this.axios.get(this.baseApi + 'users/check-subscription', {
            headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                }
        })
        var timelineApi = this.baseApi + 'timelines/public/' + this.$store.state.jwt.user.username
        this.axios.get(timelineApi)
            .then(response => {
                this.timelinesNumber = response.data.length
            }).catch(err => {
                console.log(err)
            })
    },
    metaInfo() {
        return {
            title: 'Settings',
            titleTemplate: '%s - Tline',
            content: 'Explore new way to present your content based on timeline.'
        }
    },
    data () {
      return {
          baseApi: 'https://api.tline.site/api/',
          timelinesNumber: null,
      }
    },
    methods: {
        scrollToTop() {
            const c = document.documentElement.scrollTop || document.body.scrollTop;
            if (c > 0) {
                window.requestAnimationFrame(this.scrollToTop);
                window.scrollTo(0, c - c / 8);
            }
        },
        logout(){
            var logoutApi = this.baseApi + 'auth/logout'
            this.axios.post(logoutApi, {}, {withCredentials: true})
                    .then(() => {this.$store.commit('set', null)})
                    .catch(error => {console.log(error)})
            this.$router.push({ path: '/home' })
        },
        cancel(){
            document.getElementById("ls").style.opacity = "1"
            this.axios.post(this.baseApi + 'users/cancel-subscription', null, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                },
            })
            .then(() => {
                var jwt = this.$store.state.jwt
                jwt.user.subscriptionID = null
                this.$store.commit('set', jwt)
                this.$store.commit('setMessage', "Sucess!")
                document.getElementById("modal").style.display = "block"
                document.getElementById("ls").style.opacity = "0"
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
}


</script>

<style scoped lang="sass">
@import '../assets/saas-vars.sass'

#ls
    display: inline-block
    vertical-align: top
    margin-top: 0
    margin-left: 20px

.data-settings
    padding-top: 100px
    padding-bottom: 1px
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)
    border-radius: 30px
    background: $bg-color
    &.small
        padding-top: 60px

.menu-element
    display: inline-block
    font-family: Raleway-Regular
    font-weight: bold
    text-decoration: none
    color: #303030
    cursor: pointer
    font-size: 30px
    width: 33%
    letter-spacing: 1px
    &.small
        font-size: 27px
    
.controler
    user-select: none
    margin-bottom: 70px
    width: 80%
    margin-left: 10%
    &.medium
        margin-bottom: 50px
        margin-top: 30px
        margin-left: 1%
        width: 98%
    &.small
        margin-bottom: 50px
        margin-top: 30px
        margin-left: 1%
        width: 98%

.likes
    font-weight: normal
    font-size: 15px
    margin-top: 10px
    color: #7e7e7e

p
    font-family: OpenSans-Regular
    text-align: justify
    margin: 0 10%
    margin-bottom: 100px

h1
    font-family: Raleway-Regular
    font-size: 40px
    text-align: left
    margin-left: 10%

.author
    font-weight: normal
    font-size: 15px
    margin-top: 15px

.edit
    display: inline-block
    margin-top: 15px
    margin-right: 20px
    font-weight: normal
    font-size: 15px
    color: #14426B
    user-select: none

.danea
    display: inline-block
    color: #14426B
    width: 30%
    &.small
        width: 100%
        margin-bottom: 40px

.toright
    float: right
    margin-right: 25%
    &.small
        margin-right: 5%

.top-item
    font-weight: bold
    float: left
    width: 30%
    text-align: left
    font-family: Raleway-Regular
    font-size: 20px

.daneh
    vertical-align: top
    display: inline-block
    width: 20%
    margin-bottom: 10px
    &.medium
        width: 30%
    &.small
        width: 100%
        margin-bottom: 5px

.danev
    vertical-align: top
    width: 40%
    display: inline-block
    color: #14426B
    &.small
        width: 100%
        margin-bottom: 5px

.subs
    width: 60%
    &.medium
        width: 70%

.s_line
    width: 100%
    height: 1px
    background: #cccccc
    margin-top: 40px
    display: inline-block

.s_left
    font-weight: bold
    text-align: left
    width: 30%
    font-size: 25px
    font-family: 'Raleway-Regular'
    display: inline-block
    float: left
    &.medium
        width: 100%
        margin-bottom: 30px
    &.small
        width: 100%
        margin-bottom: 30px

.s_right
    font-family: 'OpenSans-Regular'
    text-align: justify
    float: left
    width: 70%
    display: inline-block
    &.medium
        width: 100%
    &.small
        width: 100%

.s_item
    letter-spacing: 1px
    margin: 0 auto
    width: 80%
    margin-bottom: 120px
    &.small
        margin-bottom: 60px

#settings
    background: $bg2-color
    padding: 70px 0
    &.large
        margin: 50px 10%
    &.medium
        margin: 0 5%

</style>
