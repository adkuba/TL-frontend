<template lang="html">
    <div>
        <div id="settings" :class="$mq">
            <div v-on:click="logout()">Logout</div>
            <div class="s_item">
                <div class="s_left">Dane</div>
                <div class="s_right">
                    <div class="daneh">Username:</div><div class="danev">{{ $store.state.jwt.username }}</div><br>
                    <div class="daneh">Email:</div><div class="danev">{{ $store.state.jwt.email }}</div><br>
                    <div class="daneh">Password:</div><div class="danev">Change password</div>
                </div>
                <div class="s_line"></div>
            </div>
            <div class="s_item">
                <div class="s_left">Strona</div>
                <div class="s_right">Twoja strona 1</div>
                <div class="s_line"></div>
            </div>
        </div>

    </div>
</template>

<script lang="js">

  export default  {
    name: 'Settings',
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
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
.daneh
    display: inline-block
    width: 20%
    margin-bottom: 10px

.danev
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
