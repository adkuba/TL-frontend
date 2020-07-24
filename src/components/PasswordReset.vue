<template lang="html">
    <div>
        <div id="login" :class="$mq">
            <form action="javascript:void(0);" class="login_form" :class="$mq">
                <h1 :class="$mq">Reset password</h1>
                <input v-if="firstStage" class="fin" autocorrect="off" spellcheck="false" :class="$mq" type="text" id="email" placeholder="Your email">
                <input v-else class="fin" :class="$mq" autocorrect="off" spellcheck="false" type="password" id="password" placeholder="New password">
                <input v-if="!firstStage" class="fin" :class="$mq" autocorrect="off" spellcheck="false" type="password" id="password-repeat" placeholder="Repeat password">
                <br v-if="errMessage">
                <div class="fsignup error" :class="$mq" v-if="errMessage">{{ errMessage }}</div><br>
                <input v-if="firstStage" type="submit" :class="$mq" value="Submit" class="fsubmit" id="submit-button" v-on:click="sendEmail()">
                <input v-else type="submit" :class="$mq" value="Submit" id="submit-button" class="fsubmit" v-on:click="resetPassword()"><br>
                <div class="loader" id="ls"></div>
            </form>
            <div class="login-desc" :class="$mq">
                <h1>About</h1>
                <p v-if="firstStage">Check your email to reset password.</p>
                <p v-else>Type new strong password.</p>
            </div>
        </div>
    </div>
</template>

<script lang="js">

  export default  {
    name: 'PasswordReset',
    created() {
        if (this.$route.params.id != 'true'){
            this.firstStage = false
        }
        this.scrollToTop()
    },
    data () {
      return {
          baseApi: 'https://tline-283413.ew.r.appspot.com/api/',
          errMessage: null,
          firstStage: true
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
        sendEmail(){
            var email = document.getElementById("email").value
            if (this.validEmail(email)){
                document.getElementById("ls").style.display = "block"
                document.getElementById("submit-button").style.background = "#932a24"
                this.axios.post(this.baseApi + 'auth/resetPassword?email=' + email, null)
                    .then(response => {
                        this.errMessage = response.data.message
                        this.$store.commit('setMessage', "Email send!")
                        document.getElementById("modal").style.display = "block"
                        document.getElementById("ls").style.display = "none"
                        document.getElementById("submit-button").style.background = "#B8352D"
                    })
                    .catch(error => {
                        this.errMessage = error.response.data.message
                        this.$store.commit('setMessage', "Try again!")
                        document.getElementById("modal").style.display = "block"
                        document.getElementById("ls").style.display = "none"
                        document.getElementById("submit-button").style.background = "#B8352D"
                    })

            } else {
                this.errMessage = "Bad Email!"
            }
        },
        validEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        resetPassword(){
            var passwordValue = document.getElementById("password").value

            if (passwordValue != document.getElementById("password-repeat").value){
                this.errMessage = "Passwords not matching"
                return
            }
            if (document.getElementById("password").value.length < 6 || document.getElementById("password").value.length > 40){
                this.errMessage = "Password needs to be between 6 and 40 characters long."
                return
            }
            document.getElementById("ls").style.display = "block"
            document.getElementById("submit-button").style.background = "#932a24"

            this.axios.post(this.baseApi + 'auth/resetPasswordChange', {
                token: this.$route.params.id,
                newPassword: passwordValue
            })
            .then(response => {
                this.errMessage = response.data.message
                this.$store.commit('setMessage', "Password reseted! Go to login page.")
                document.getElementById("modal").style.display = "block"
                document.getElementById("ls").style.display = "none"
                document.getElementById("submit-button").style.background = "#B8352D"
            })
            .catch(error => {
                this.errMessage = error.response.data.message
                this.$store.commit('setMessage', "Try again!")
                document.getElementById("modal").style.display = "block"
                document.getElementById("ls").style.display = "none"
                document.getElementById("submit-button").style.background = "#B8352D"
            })
        }
    }
}


</script>

<style scoped lang="sass">

#ls
    display: none
    margin-left: calc(20% - 5px)
    opacity: 1

</style>
