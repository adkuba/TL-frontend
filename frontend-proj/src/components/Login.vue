<template lang="html">
    <div>

        <div v-if="!$store.state.jwt" id="login" :class="$mq">
            <div class="login_form">
                <h1>Sign in</h1>
                <input class="fin" type="text" id="username" placeholder="Username"><br>
                <input class="fin" type="password" id="password" placeholder="Password"><br><br>
                <div class="fsignup error" v-if="errMessage">Can't login! {{ errMessage }}</div>
                <div class="fsubmit" v-on:click="signin()"> Login </div>
                <div class="fsignup">Sign up</div>
            </div> 
        </div>

        <div v-else id="settings" :class="$mq">
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
    name: 'Login',
    mounted () {

    },
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          response: '',
          errMessage: ''
      }
    },
    methods: {
        signin(){
            var loginApi = this.baseApi + 'auth/signin';
            this.axios.post(loginApi, {
                username: document.getElementById("username").value, 
                password: document.getElementById("password").value
                })
                .then(response => {this.$store.commit('set', response.data)})
                .catch(error => {if (error.toString().includes("401")) this.errMessage = "Bad credentials" });
            document.getElementById("password").value = '';
            document.getElementById("username").value = '';
        }
    },
    computed: {

    }
}


</script>

<style scoped lang="sass">
.error
    color: #B8352D

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

#login
    background: #F6F6F6
    font-family: 'Raleway-Regular'
    &.large
        margin: 50px 10%

.login_form
    padding: 120px 0
    letter-spacing: 2px
    h1
        margin: 0 auto
        margin-bottom: 40px
        text-align: left
        width: 300px
        font-size: 40px

.fin
    margin-bottom: 15px
    border-radius: 5px
    border: 0px
    background: #e6e6e6
    height: 40px
    width: 280px
    padding-left: 20px
    font-size: 15px
    font-family: 'OpenSans-Regular'
    &:focus
        background: #d9d9d9
        outline: none

.fsubmit
    margin: 10px auto
    border-radius: 5px
    width: 300px
    padding: 10px 0px
    font-family: 'Raleway-Regular'
    letter-spacing: 1px
    font-weight: bold
    font-size: 15px
    border: 0
    background: #B8352D
    color: white
    &:focus
        outline: none
        background: #a42e28

.fsignup
    font-size: 14px
    text-align: left
    margin: 15px auto
    width: 290px
    letter-spacing: 0px

</style>
