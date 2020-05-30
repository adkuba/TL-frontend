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
    </div>
</template>

<script lang="js">

  export default  {
    name: 'Login',
    props: {
        path: Object
    },
    created(){
        if(!this.path){
            this.routerPath = '/settings'

        } else {
            this.routerPath = this.path.path
        }

        this.redirect();
    },
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          errMessage: '',
          routerPath: null
      }
    },
    methods: {
        signin(){
            let self = this;
            var loginApi = this.baseApi + 'auth/signin'
            this.axios.post(loginApi, {
                username: document.getElementById("username").value, 
                password: document.getElementById("password").value
                },
                {withCredentials: true})
                .then(response => {this.$store.commit('set', response.data); self.$router.push({ path: this.routerPath })})
                .catch(error => {if (error.toString().includes("401")) this.errMessage = "Bad credentials" })
            document.getElementById("password").value = ''
            document.getElementById("username").value = ''
        },
        redirect(){
            if(this.$store.state.jwt){
                this.$router.push({ path: this.routerPath })
            }
        }
    },
    updated() {
        this.redirect()
    }
}


</script>

<style scoped lang="sass">
.error
    color: #B8352D

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
