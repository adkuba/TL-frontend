<template lang="html">
    <div>
        <div id="settings" :class="$mq">
            <div class="s_item" :class="$mq">
                <div class="s_left" :class="$mq">Main</div>
                <div class="s_right" :class="$mq">
                <div class="daneh" :class="$mq">Action:</div>
                <router-link :to="{ name: 'creator' }" class="danev" v-bind:class="[{ shadow: subscription.status != 'active' && subscription.status != 'trial'}, $mq]">Create timeline</router-link>
                <div class="danea" :class="$mq" v-on:click="logout()">Logout</div>
                </div>
                <div class="s_line"></div>
            </div>
            <div class="s_item">
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
                <div class="s_left" :class="$mq">Subscription</div>
                <div class="s_right" :class="$mq">
                <div class="daneh" :class="$mq">Status:</div>
                <div class="danev" :class="$mq">{{ subscription.status }}</div>
                <div class="danea" style="text-decoration: underline; cursor: pointer" :class="$mq" v-if="subscription.status == 'active' || subscription.status == 'incomplete'" v-on:click="cancel()">Cancel</div>
                <router-link :to="{ name: 'subscription'}" class="danea" :class="$mq" v-else>Activate</router-link>
                </div>
                <div class="s_line"></div>
            </div>

            <div class="review">
                <input type="text" id="review-input">
                <div class="review-submit" v-on:click="submitReview()">Submit</div>
            </div>

        </div>

    </div>
</template>

<script lang="js">

  export default  {
    name: 'Settings',
    created() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        this.axios.get(this.baseApi + "users/get-subscription", {
            headers: {
                'Authorization': 'Bearer ' + this.$store.state.jwt.token
            },
        })
        .then(response => {
            this.subscription = response.data
        })
        .catch(error => {
            console.log(error)
            const diffTime = Math.abs(new Date() - new Date(this.$store.state.jwt.user.creationTime))
            if (Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 30){
                this.subscription.status = "trial"
            }
        })
    },
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          subscription: {status: 'disabled'},
      }
    },
    methods: {
        logout(){
            var logoutApi = this.baseApi + 'auth/logout'
            this.axios.post(logoutApi, {}, {withCredentials: true})
                    .then(() => {this.$store.commit('set', null)})
                    .catch(error => {console.log(error)})
            this.$router.push({ path: '/home' })
        },
        cancel(){
            this.axios.post(this.baseApi + 'users/cancel-subscription', null, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                },
            })
            .then(() => {
                this.subscription.status = 'disabled'
            })
            .catch(error => {
                console.log(error)
            })
        },
        submitReview(){
            var review = {
                username: this.$store.state.jwt.user.username,
                opinion: document.getElementById("review-input").value
            }
            this.axios.post(this.baseApi + 'statistics/public/review', review, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                },
            })
            .then(() => {
                document.getElementById("review-input").value = ''
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
.review
    position: fixed
    bottom: 50px
    left: 20px

.shadow
    opacity: 0.3
    pointer-events: none

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

.top-item
    font-weight: bold
    float: left
    width: 30%
    text-align: left
    font-family: Raleway-Regular
    font-size: 20px

.daneh
    display: inline-block
    width: 20%
    margin-bottom: 10px
    &.medium
        width: 30%
    &.small
        width: 100%
        margin-bottom: 5px

.danev
    width: 40%
    display: inline-block
    color: #14426B
    &.small
        width: 100%
        margin-bottom: 5px

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

#settings
    background: $bg2-color
    padding: 100px 0
    &.large
        margin: 50px 10%

</style>
