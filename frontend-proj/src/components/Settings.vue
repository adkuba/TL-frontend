<template lang="html">
    <div>
        <div id="settings" :class="$mq">
            <div class="logout" :class="$mq" v-on:click="logout()">Logout</div>
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

            <h1>Timelines</h1>
            <p>Aenean sed justo dui. In tincidunt odio vitae dui dapibus ultricies. Integer pulvinar pharetra nulla, in vestibulum nisl semper ut. Praesent feugiat tortor et leo dapibus, ac consequat ipsum finibus. Cras eget rhoncus arcu. Morbi vulputate finibus lacus, nec bibendum felis fringilla vel. Nullam enim leo, ultrices eu elit a, cursus maximus nisi.</p>

            <div class="s_item" v-for="(timeline, index) in timelines" :key="index">
                <div class="s_left" :class="$mq">
                    <router-link style="color: #303030; text-decoration: none" :to="{ path: 'timeline/' + timeline.id }"> {{ timeline.descriptionTitle }} </router-link><br>
                    <div class="edit">Edit</div>
                    <div class="edit" v-on:click="deleteTimeline(timeline)">Delete</div>
                </div>
                <div class="s_right" :class="$mq">{{ timeline.description.substring(0, timeline.description.length/2) }}</div>
                <div class="s_line"></div>
            </div>
        </div>

    </div>
</template>

<script lang="js">

  export default  {
    name: 'Settings',
    created() {
        var timelinesApi = this.baseApi + 'timelines/public/' + this.$store.state.jwt.username
        this.axios.get(timelinesApi)
        .then(response => {
            this.timelines = response.data
        })
        .catch(error => {
            console.log(error)
        })
    },
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          timelines: null
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
        }
    }
}


</script>

<style scoped lang="sass">
@import '../assets/saas-vars.sass'

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

.logout
    position: absolute
    right: 10%
    margin-right: 30px
    top: 70px
    font-family: Raleway-Regular
    font-size: 20px
    &.small
        right: 0
        margin-right: 15px
        top: 65px
        font-size: 19px
    &.medium
        right: 0

.daneh
    display: inline-block
    width: 20%
    margin-bottom: 10px
    &.medium
        width: 30%
    &.small
        width: 100%
        margin-bottom: 2px

.danev
    width: 40%
    display: inline-block
    color: #14426B
    &.small
        width: 100%
        margin-bottom: 2px

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
