<template lang="html">
    <div>
        <div v-if="!$store.state.jwt" id="login" :class="$mq">
            <form action="javascript:void(0);" class="login_form" :class="$mq">
                <h1>{{action}}</h1>
                <input class="fin" type="text" id="username" placeholder="Username"><br>
                <div v-if="action=='Sign up'">
                    <input class="fin" type="text" id="email" placeholder="Email"><br>
                </div>
                <input class="fin" type="password" id="password" placeholder="Password"><br>
                <div v-if="action=='Sign up'">
                    <input class="fin" type="password" id="repeat-password" placeholder="Repeat password"><br>
                </div>
                <br v-if="!errMessage">
                <div class="fsignup error" v-if="errMessage">{{ errMessage }}</div>
                <input type="submit" value="Submit" class="fsubmit" v-on:click="signin()">
                <div class="fsignup" v-on:click="signupShow()">{{signupText}}</div>
            </form>
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
          routerPath: null,
          action: 'Sign in',
          signupText: 'Sign up'
      }
    },
    methods: {
        signin(){
            let self = this;

            if(this.action == "Sign in"){
                var loginApi = this.baseApi + 'auth/signin'
                this.axios.post(loginApi, {
                    username: document.getElementById("username").value, 
                    password: document.getElementById("password").value
                    },
                    {withCredentials: true})
                    .then(response => {this.$store.commit('set', response.data); self.$router.push({ path: this.routerPath })})
                    .catch(error => {
                        if (error.toString().includes("401")){
                            this.errMessage = "Can't login! Bad credentials"

                        } else {
                            this.errMessage = error
                        }
                    })
                this.clearData()

            } else {
                var signupApi = this.baseApi + 'auth/signup'
                var passwordValue = document.getElementById("password").value

                if (passwordValue != document.getElementById("repeat-password").value){
                    this.errMessage = "Passwords not matching"
                    this.clearData(true)
                    return
                }

                if (document.getElementById("username").value.length < 3 || document.getElementById("username").value.length > 20){
                    this.errMessage = "Username needs to be between 3 and 20 characters long."
                    document.getElementById("username").value = ""
                    return
                }

                if (document.getElementById("password").value.length < 6 || document.getElementById("password").value.length > 40){
                    this.errMessage = "Password needs to be between 6 and 40 characters long."
                    this.clearData(true)
                    return
                }

                if (this.validEmail(document.getElementById("email").value)){
                    this.axios.post(signupApi, {
                        username: document.getElementById("username").value,
                        password: passwordValue,
                        email: document.getElementById("email").value
                    }, {
                        withCredentials: true
                    })
                    .then(() => {
                        self.errMessage = "Created!"
                        self.signupShow()
                        self.clearData()
                    })
                    .catch(error => {
                        console.log(error)
                        self.errMessage = error.response.data.message
                        self.clearData()
                    })
                } else{
                    this.errMessage = "Wrong email."
                }
            }
            
        },
        redirect(){
            if(this.$store.state.jwt){
                this.$router.push({ path: this.routerPath })
            }
        },
        signupShow(){
            this.errMessage = ''
            if(this.signupText == 'Sign in'){
                this.action = 'Sign in'
                this.signupText = 'Sign up'

            } else {
                this.signupText = 'Sign in'
                this.action = 'Sign up'
            }
        },
        clearData(onlyPassword = false){
            if (onlyPassword){
                document.getElementById("password").value = ''
                document.getElementById("repeat-password").value = ''

            } else {
                document.getElementById("password").value = ''
                if (document.getElementById("email")){
                    document.getElementById("email").value = ''
                }
                document.getElementById("username").value = ''
                if (document.getElementById("repeat-password")){
                    document.getElementById("repeat-password").value = ''
                }
            }
        },
        validEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    },
    updated() {
        this.redirect()
    }
}


</script>

<style lang="sass">
@import '../assets/saas-vars.sass'

.error
    padding-left: 5px
    color: #B8352D !important

#login
    position: fixed
    background: $bg-color
    font-family: 'Raleway-Regular'
    height: calc( 100% - 50px )
    width: 80%
    margin: 0 10%
    margin-top: 50px
    &.medium
        margin: 0
        margin-top: 50px
        width: 100%
    &.small
        margin: 0
        margin-top: 50px
        width: 100%

.login_form
    padding-top: 150px
    &.small
        padding-top: 100px
    letter-spacing: 2px
    h1
        margin: 0 auto
        margin-bottom: 40px
        text-align: left
        width: 290px
        font-size: 40px

.fin
    margin-bottom: 15px
    border-radius: 5px
    border: 0px
    background: #e6e6e6
    height: 40px
    width: 270px
    padding-left: 20px
    font-size: 15px
    font-family: 'OpenSans-Regular'
    &:focus
        background: #d9d9d9
        outline: none

.fsubmit
    border-radius: 3px
    text-align: center
    width: 290px
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
    color: #14426B
    font-size: 14px
    text-align: left
    margin: 15px auto
    width: 290px
    letter-spacing: 0px

</style>
