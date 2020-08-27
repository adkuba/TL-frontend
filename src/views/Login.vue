<template lang="html">
    <div>
        <div v-if="!$store.state.jwt && $store.state.refreshTry" id="login" :class="$mq">
            <form action="javascript:void(0);" class="login_form" :class="$mq" id="signin-form">
                <h1 :class="$mq">{{action}}</h1>
                <input class="fin" :class="$mq" type="text" id="username" autocorrect="off" spellcheck="false" maxlength="20" placeholder="Username"><br>
                <div v-if="action=='Sign up'">
                    <input class="fin" :class="$mq" type="text" id="full-name" autocorrect="off" spellcheck="false" maxlength="20" placeholder="Full name"><br>
                    <input class="fin" :class="$mq" type="text" id="email" autocorrect="off" spellcheck="false" placeholder="Email"><br>
                </div>
                <input class="fin" :class="$mq" type="password" id="password" autocorrect="off" spellcheck="false" maxlength="40" placeholder="Password"><br>
                <div v-if="action=='Sign up'">
                    <input class="fin" :class="$mq" type="password" id="repeat-password" autocorrect="off" spellcheck="false" placeholder="Repeat password"><br>
                </div>
                <br v-if="!errMessage">
                <div class="fsignup error" :class="$mq" v-if="errMessage">{{ errMessage }}</div>
                <input v-if="action=='Sign in'" id="submit-button" type="submit" value="Submit" class="fsubmit" :class="$mq" v-on:click="signin()">
                <vue-recaptcha v-else sitekey="6LcwcqwZAAAAAGHazabCBGXKndRustjOflfOFQSX" ref="recaptcha" @verify="onCaptchaVerified" @expired="onCaptchaExpired" size="invisible"></vue-recaptcha>
                <input v-if="action!='Sign in'" :disabled="status==='submitting'" type="submit" value="Submit" id="submit-button" class="fsubmit" :class="$mq" v-on:click="signUp()">
                <div v-if="action!='Sign in'" class="regulations-inf" :class="$mq">By clicking submit you agree to our <a href="https://www.tline.site/about#regulations" style="color: #14426b">regulations</a></div>
                <br>
                <div class="fsignup" :class="$mq" v-on:click="signupShow()">{{signupText}}</div>
                <router-link class="p-reset" :class="$mq" :to="{ path: '/passwordReset/true' }">Forgot password?</router-link>
                <div class="loader" id="ls" :class="$mq"></div>
            </form>
            <div class="login-desc" :class="$mq">
                <h1>About</h1>
                <p>Start creating your own timelines.</p>
                <p>The best way to showcase your projects, ideas, thinking process. Social features boosts views.</p>
            </div>
        </div>
        <div v-else id="login" class="login-pulse" :class="$mq"></div>
    </div>
</template>

<script lang="js">
import VueRecaptcha from 'vue-recaptcha'

  export default  {
    name: 'Login',
    props: {
        path: Object
    },
    components: {
        'vue-recaptcha': VueRecaptcha
    },
    metaInfo() {
        return {
            title: 'Login',
            titleTemplate: '%s - Tline',
            meta: [
                { name: 'description', content: 'Login to create content based on timeline!'},
                { property: 'og:url', content: 'https://www.tline.site/login'},
                { property: 'og:title', content: 'Login - Tline' },
                { property: 'og:descriprion', content: 'Login to create content based on timeline!'},
                { property: 'og:image', content: 'https://storage.googleapis.com/tline-files/signup.png' },
                { property: 'twitter:card', content: 'summary_large_image'},
                { property: 'twitter:url', content: 'https://www.tline.site/login'},
                { property: 'twitter:title', content: 'Login - Tline'},
                { property: 'twitter:description', content: 'Login to create content based on timeline!'},
                { property: 'twitter:image', content: 'https://storage.googleapis.com/tline-files/signup.png'}
            ]
        }
    },
    created(){
        if(!this.path){
            this.routerPath = '/settings'

        } else {
            this.routerPath = this.path.path
        }
        this.redirect()
    },
    mounted() {
        this.scrollToTop()
        document.getElementById("dropdown").style.display = "none"
        document.getElementById("dropdown-bg").style.display = "none"
    },
    data () {
      return {
          baseApi: 'https://api.tline.site/api/',
          errMessage: '',
          routerPath: null,
          action: 'Sign in',
          signupText: 'Sign up',
          status: 'ok'
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
        signUp(){
            if (this.checkData()){
                this.$refs.recaptcha.execute()
            }
        },
        onCaptchaVerified(recaptchaToken){
            this.$refs.recaptcha.reset()
            this.status = "submitting"
            this.signin(recaptchaToken)
        },
        onCaptchaExpired(){
            this.$refs.recaptch.reset()
        },
        checkData(){
            if (document.getElementById("full-name").value.length < 2){
                this.errMessage = "Full name needs to be at least 2 characters long"
                return false
            }

            var passwordValue = document.getElementById("password").value

            if (passwordValue != document.getElementById("repeat-password").value){
                this.errMessage = "Passwords not matching"
                this.clearData(true)
                return false
            }

            if (document.getElementById("username").value.length < 3 || document.getElementById("username").value.length > 20){
                this.errMessage = "Username needs to be between 3 and 20 characters long."
                document.getElementById("username").value = ""
                return false
            }

            //alphanumerical underscore dot, (_. only inside, no duplicates)
            var re=/^(?=[a-zA-Z0-9-]{3,20}$)(?!.*[-]{2})[^-].*[^-]$/
            if (!re.test(document.getElementById("username").value)){
                this.errMessage = "Username only alphanumerical and '-' (inside, no duplicates)"
                document.getElementById("username").value = ""
                return false
            }

            if (document.getElementById("password").value.length < 6 || document.getElementById("password").value.length > 40){
                this.errMessage = "Password needs to be between 6 and 40 characters long."
                this.clearData(true)
                return false
            }

            if (!this.validEmail(document.getElementById("email").value)){
                this.errMessage = "Wrong email!"
                return false
            }

            return true
        },
        signin(recaptchaToken = null){
            let self = this;

            if(this.action == "Sign in"){
                var loginApi = this.baseApi + 'auth/signin'

                if (document.getElementById("username").value.length == 0){
                    this.errMessage = "Type username!"
                    this.clearData(true)
                    return
                }

                if (document.getElementById("password").value.length == 0){
                    this.errMessage = "Type password!"
                    this.clearData(true)
                    return
                }

                document.getElementById("ls").style.opacity = "1"
                document.getElementById("submit-button").style.background = "#932a24"

                this.axios.post(loginApi, {
                    username: document.getElementById("username").value, 
                    password: document.getElementById("password").value
                    },
                    {withCredentials: true})
                    .then(response => {
                        this.$store.commit('set', response.data)
                        this.getNotifications()
                        this.clearData()
                        self.$router.push({ path: this.routerPath })
                    })
                    .catch(error => {
                        this.errMessage = error.response.data.message
                        document.getElementById("ls").style.opacity = "0"
                        document.getElementById("submit-button").style.background = "#B8352D"
                        this.clearData()
                        console.log(error)
                    })
            } else {
                var passwordValue = document.getElementById("password").value
                var signupApi = this.baseApi + 'auth/signup'    
                document.getElementById("ls").style.opacity = "1"
                document.getElementById("submit-button").style.background = "#932a24"

                this.axios.post(signupApi, {
                    username: document.getElementById("username").value,
                    password: passwordValue,
                    fullName: document.getElementById("full-name").value,
                    email: document.getElementById("email").value,
                    recaptchaToken: recaptchaToken
                }, {
                    withCredentials: true
                })
                .then(() => {
                    document.getElementById("ls").style.opacity = "0"
                    this.$store.commit('setMessage', "Created!")
                    document.getElementById("modal").style.display = "block"
                    self.signupShow()
                    self.clearData()
                })
                .catch(error => {
                    console.log(error)
                    self.errMessage = error.response.data.message
                    document.getElementById("ls").style.opacity = "0"
                    document.getElementById("submit-button").style.background = "#B8352D"
                    this.status = "ok"
                })  
            }
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
                if (document.getElementById("full-name")){
                    document.getElementById("full-name").value = ''
                }
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

.login-pulse
    height: 717px
    animation: pulse 1.5s linear infinite

@keyframes pulse
    0%
        background: rgba(0, 0, 0, 0.04)
    50%
        background: rgba(0, 0, 0, 0.1)
    100%
        background: rgba(0, 0, 0, 0.04)

.regulations-inf
    margin-top: 5px
    text-align: left
    letter-spacing: 0
    color: #7e7e7e
    font-size: 13px
    font-family: OpenSans-Regular
    margin-left: 20%
    width: 60%
    &.medium
        margin-left: 30%
        width: 40%
    &.small
        width: 70%
        margin-left: 15%


#ls
    opacity: 0
    vertical-align: top
    margin-top: 25px
    display: block
    margin-left: 20%
    &.medium
        margin-left: 30%
    &.small
        margin-left: 15%

.login-desc
    margin: 65px auto
    text-align: justify
    width: calc(60% + 20px)
    &.medium
        width: calc(40% + 20px)
    &.small
        width: calc(70% + 20px)
        margin: 80px auto

#login
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)
    border-radius: 30px
    background: $bg-color
    padding-bottom: 10px
    font-family: 'Raleway-Regular'
    width: 40%
    margin: 0 30%
    margin-top: 130px
    &.medium
        margin: 5%
        margin-top: 100px
        width: 90%
    &.small
        margin: 0
        margin-top: 90px
        width: 100%

.login_form
    padding-top: 90px
    letter-spacing: 2px
    h1
        margin: 0 auto
        margin-bottom: 40px
        text-align: left
        width: calc(60% + 20px)
        font-size: 40px
        &.medium
            width: calc(40% + 20px)
        &.small
            width: calc(70% + 20px)
    &.small
        padding-top: 60px

.fin
    margin-bottom: 15px
    border-radius: 2px
    border: 0px
    background: #e6e6e6
    height: 40px
    width: 60%
    padding-left: 20px
    padding-right: 1px
    font-size: 15px
    font-family: 'OpenSans-Regular'
    &:focus
        background: #d9d9d9
        outline: none
    &.medium
        width: 40%
    &.small
        width: 70%

.fsubmit
    -webkit-appearance: none
    cursor: pointer
    border-radius: 3px
    text-align: center
    width: calc(60% + 20px)
    padding: 10px 0px
    font-family: 'Raleway-Regular'
    letter-spacing: 1px
    font-size: 17px
    border: 0
    background: #B8352D
    color: white
    &:active
        background: #B8352D
    &:focus
        background: #B8352D
        outline: none
    &.medium
        width: calc(40% + 20px)
    &.small
        width: calc(70% + 20px)

.fsignup
    cursor: pointer
    color: #14426B
    font-size: 14px
    text-align: left
    display: inline-block
    width: calc(30% - 7px)
    letter-spacing: 0px
    &.medium
        width: calc(20% - 7px)
    &.small
        width: calc(35% - 7px)

.error
    display: block
    padding-left: 5px
    color: #B8352D !important
    margin-bottom: 15px
    margin-left: calc(20% - 10px)
    width: calc(60% + 20px)
    &.medium
        margin-left: calc(30% - 10px)
        width: calc(40% + 10px)
    &.small
        margin-left: calc(15% - 10px)
        width: calc(70% + 10px)

.p-reset
    margin-top: 20px
    text-decoration: none
    color: #14426B
    font-size: 14px
    display: inline-block
    text-align: right
    width: calc(30% + 10px)
    letter-spacing: 0px
    &.medium
        width: calc(20% + 10px)
    &.small
        width: calc(35% + 10px)

</style>