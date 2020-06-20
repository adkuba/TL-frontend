<template lang="html">
    <div>
        <div id="settings" :class="$mq">
            <div class="s_item" :class="$mq">
                <div class="s_left" :class="$mq">Main</div>
                <div class="s_right" :class="$mq">
                <div class="daneh" :class="$mq">Action:</div>
                <router-link :to="{ name: 'creator' }" class="danev" v-bind:class="[{ shadow: subscription.status != 'active'}, $mq]">Create timeline</router-link>
                <div class="danea" :class="$mq" v-on:click="logout()">Logout</div>
                </div>
                <div class="s_line"></div>
            </div>
            <div class="s_item">
                <div class="s_left" :class="$mq">Details</div>
                <div class="s_right" :class="$mq">
                    <div class="daneh" :class="$mq">Username:</div>
                    <div class="danev" :class="$mq">{{ $store.state.jwt.username }}</div>
                    <div class="danea"></div><br>

                    <div class="daneh" :class="$mq">Email:</div>
                    <div class="danev" :class="$mq">{{ $store.state.jwt.email }}</div>
                    <router-link :to="{ name: 'emailChange' }" class="danea" :class="$mq">Change email</router-link><br>

                    <div class="daneh" :class="$mq">Password:</div>
                    <div class="danev" :class="$mq">*****</div>
                    <router-link :to="{ name: 'passwordChange' }" class="danea" :class="$mq">Change password</router-link><br>

                    <div class="daneh" :class="$mq">Name:</div>
                    <div class="danev" :class="$mq">{{ $store.state.jwt.fullName }}</div>
                    <router-link :to="{ name: 'nameChange' }" class="danea" :class="$mq">Change name</router-link>
                </div>
                <div class="s_line"></div>
            </div>
            <div class="s_item" :class="$mq">
                <div class="s_left" :class="$mq">Subscription</div>
                <div class="s_right" :class="$mq">
                <div class="daneh" :class="$mq">Status:</div>
                <div class="danev" :class="$mq" v-if="subscription.status == 'active'">{{ subscription.status }}</div>
                <div class="danev" :class="$mq" v-else>disabled</div>
                <div class="danea" style="text-decoration: underline; cursor: pointer" :class="$mq" v-if="subscription.status == 'active'" v-on:click="cancel()">Cancel</div>
                <router-link :to="{ name: 'subscription'}" class="danea" :class="$mq" v-else>Activate</router-link>
                </div>
                <div class="s_line"></div>
            </div>

            <h1>Timelines</h1>
            <p>Your timelines. You can edit them or delete. Try to keep things orginized.</p>

            <div class="s_item" v-bind:class="{ shadow: subscription.status != 'active' }" v-for="(timeline, index) in timelines" :key="index">
                <div class="s_left" :class="$mq">
                    <router-link style="color: #303030; text-decoration: none" :to="{ path: 'timeline/' + timeline.id }"> {{ timeline.descriptionTitle }} </router-link><br>
                    <router-link style="text-decoration: none" :to="{ path: 'editorLoader/' + timeline.id }" class="edit">Edit</router-link>
                    <div class="edit" v-on:click="deleteTimeline(timeline)">Delete</div>
                    <div class="likes">{{ timeline.views }} views &middot; {{ timeline.likes }} likes</div>
                </div>
                <div class="s_right" :class="$mq">{{ timeline.description.substring(0, 250) }}</div>
                <div class="s_line"></div>
            </div>

            <h1>Likes</h1>
            <p>Your likes. List of all likes. You can click on timeline and check it out.</p>
            <div>
                <div class="s_item" v-for="(timeline, index) in likes" :key="index">
                <div class="s_left" :class="$mq">
                    <router-link style="color: #303030; text-decoration: none" :to="{ path: 'timeline/' + timeline.id }"> {{ timeline.descriptionTitle }} </router-link><br>
                    <div class="author">By {{timeline.user.username}}</div>
                    <div class="likes">{{ timeline.views }} views &middot; {{ timeline.likes }} likes</div>
                </div>
                <div class="s_right" :class="$mq">{{ timeline.description.substring(0, 250) }}</div>
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
        window.scrollTo({ top: 0, behavior: 'smooth' })
        var timelinesApi = this.baseApi + 'timelines/public/' + this.$store.state.jwt.username
        this.axios.get(timelinesApi)
        .then(response => {
            this.timelines = response.data
        })
        .catch(error => {
            console.log(error)
        })

        for (var i=0, len=this.$store.state.jwt.likes.length; i<len; i++){
            this.axios.get(this.baseApi + 'timelines/public?id=' + this.$store.state.jwt.likes[i])
            .then(response => {
                this.likes.push(response.data)
            })
            .catch(error => {
                console.log(error)
            })
        }

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
        })
    },
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          timelines: null,
          likes: [],
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
        deleteTimeline(timeline){
            var timelinesApi = this.baseApi + 'timelines/' + timeline.id
            this.axios.delete(timelinesApi, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                },
            })
            .then(() => {
                var index = this.timelines.indexOf(timeline)
                if (index > -1){
                    this.timelines.splice(index, 1)
                }
            })
            .catch(error =>{
                console.log(error)
            })
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
        }
    }
}


</script>

<style scoped lang="sass">
@import '../assets/saas-vars.sass'
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
    background: $bg-color
    padding: 100px 0
    &.large
        margin: 50px 10%

</style>
