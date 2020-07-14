<template lang="html">
    <div>
        <div id="login" :class="$mq">
            <form action="javascript:void(0);" class="login_form" :class="$mq">
                <h1 :class="$mq">Reset password</h1>
                <input v-if="firstStage" class="fin" :class="$mq" type="text" id="email" placeholder="Your email">
                <input v-else class="fin" :class="$mq" type="password" id="password" placeholder="New password">
                <input v-if="!firstStage" class="fin" :class="$mq" type="password" id="password-repeat" placeholder="Repeat password">
                <br v-if="errMessage">
                <div class="fsignup error" :class="$mq" v-if="errMessage">{{ errMessage }}</div><br>
                <input v-if="firstStage" type="submit" :class="$mq" value="Submit" class="fsubmit" v-on:click="sendEmail()">
                <input v-else type="submit" :class="$mq" value="Submit" class="fsubmit" v-on:click="resetPassword()">
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
        window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          errMessage: null,
          firstStage: true
      }
    },
    methods: {
        sendEmail(){
            var email = document.getElementById("email").value
            if (this.validEmail(email)){
                document.getElementById("modal-button").innerHTML = "..."
                document.getElementById("modal-button").style.pointerEvents = "none"
                document.getElementById("modal").style.display = "block"
                this.$store.commit('setMessage', "Please wait...")
                this.axios.post(this.baseApi + 'auth/resetPassword?email=' + email, null)
                    .then(response => {
                        this.errMessage = response.data.message
                        this.$store.commit('setMessage', "Email send!")
                        document.getElementById("modal-button").innerHTML = "OK"
                        document.getElementById("modal-button").style.pointerEvents = "auto"
                    })
                    .catch(error => {
                        this.errMessage = error.response.data.message
                        this.$store.commit('setMessage', "Try again!")
                        document.getElementById("modal-button").innerHTML = "OK"
                        document.getElementById("modal-button").style.pointerEvents = "auto"
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
            document.getElementById("modal-button").innerHTML = "..."
            document.getElementById("modal-button").style.pointerEvents = "none"
            document.getElementById("modal").style.display = "block"
            this.$store.commit('setMessage', "Please wait...")

            this.axios.post(this.baseApi + 'auth/resetPasswordChange', {
                token: this.$route.params.id,
                newPassword: passwordValue
            })
            .then(response => {
                this.errMessage = response.data.message
                this.$store.commit('setMessage', "Password reseted! Go to login page.")
                document.getElementById("modal-button").innerHTML = "OK"
                document.getElementById("modal-button").style.pointerEvents = "auto"
            })
            .catch(error => {
                this.errMessage = error.response.data.message
                this.$store.commit('setMessage', "Try again!")
                document.getElementById("modal-button").innerHTML = "OK"
                document.getElementById("modal-button").style.pointerEvents = "auto"
            })
        }
    }
}


</script>

<style scoped lang="sass">

</style>
