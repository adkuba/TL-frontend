<template lang="html">
    <div>
        <div id="settings" :class="$mq">
            <div class="logout" v-on:click="logout()">Logout</div>
            <div class="s_item">
                <div class="s_left">Details</div>
                <div class="s_right">
                    <div class="daneh">Username:</div>
                    <div class="danev">{{ $store.state.jwt.username }}</div><br>

                    <div class="daneh">Email:</div>
                    <div class="danev">{{ $store.state.jwt.email }}</div>
                    <router-link :to="{ name: 'emailChange' }" class="danea">Change email</router-link><br>

                    <div class="daneh">Password:</div>
                    <div class="danev">*****</div>
                    <div class="danea">Change password</div><br>

                    <div class="daneh">Name:</div>
                    <div class="danev">{{ $store.state.jwt.fullName }}</div>
                    <router-link :to="{ name: 'nameChange' }" class="danea">Change name</router-link>
                </div>
                <div class="s_line"></div>
            </div>
            <div class="s_item" v-for="(timeline, index) in timelines" :key="index">
                <div class="s_left"> {{ index+1 }}. 
                    <router-link style="color: #303030; text-decoration: none" :to="{ path: 'timeline/' + timeline.id }"> {{ timeline.descriptionTitle }} </router-link>
                    <div class="edit">Edit</div>
                    <div class="edit">Delete</div>
                </div>
                <div class="s_right">{{ timeline.description.substring(0, timeline.description.length/2) }}</div>
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
        }
    }
}


</script>

<style scoped lang="sass">
.edit
    margin-top: 10px
    margin-left: 2px
    font-weight: normal
    font-size: 15px
    color: #14426B

.danea
    display: inline-block
    color: #14426B

.logout
    position: absolute
    right: 10%
    margin-right: 30px
    top: 70px
    font-family: Raleway-Regular
    font-size: 20px

.daneh
    display: inline-block
    width: 20%
    margin-bottom: 10px

.danev
    width: 40%
    display: inline-block
    color: #14426B

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

.s_right
    font-family: 'OpenSans-Regular'
    text-align: left
    float: left
    width: 70%
    display: inline-block  

.s_item
    letter-spacing: 1px
    margin: 0 auto
    width: 80%
    margin-bottom: 100px

#settings
    background: #F6F6F6
    padding: 100px 0
    &.large
        margin: 50px 10%

</style>
