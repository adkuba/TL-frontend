<template lang="html">
    <div>
        <div id="login" :class="$mq">
            <form action="javascript:void(0);" class="login_form" :class="$mq">
                <h1 :class="$mq">Change password</h1>
                <input class="fin" :class="$mq" type="password" autocorrect="off" spellcheck="false" id="old-password" placeholder="Old password"><br>
                <input class="fin" :class="$mq" type="password" autocorrect="off" spellcheck="false" id="password" placeholder="New password"><br>
                <input class="fin" :class="$mq" type="password" autocorrect="off" spellcheck="false" id="repeat-password" placeholder="Repeat password"><br>
                <br v-if="!errMessage">
                <div class="fsignup error" :class="$mq" v-if="errMessage">{{ errMessage }}</div>
                <input type="submit" :class="$mq" value="Submit" class="fsubmit" id="submit-button" v-on:click="changePassword()">
                <div class="loader" id="ls"></div>
            </form>
            <div class="login-desc" :class="$mq">
                <h1>About</h1>
                <p>Enter strong password, you can always reset it via email.</p>
            </div>
        </div>
    </div>
</template>

<script lang="js">

  export default  {
    name: 'PasswordChange',
    created() {
        this.scrollToTop()
    },
    data () {
      return {
          baseApi: 'https://tline-283413.ew.r.appspot.com/api/',
           errMessage: ''
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
        changePassword(){
            let self = this
            var passwordApi = this.baseApi + 'users/password'

            if(document.getElementById("password").value == document.getElementById("repeat-password").value){
                if (document.getElementById("password").value.length > 6 && document.getElementById("password").value.length < 40){
                    document.getElementById("ls").style.opacity = "1"
                    document.getElementById("submit-button").style.background = "#932a24"
                    this.axios.put(passwordApi, {
                        oldPassword: document.getElementById("old-password").value,
                        newPassword: document.getElementById("password").value

                    }, {
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.jwt.token
                        },
                    })
                    .then(()=>{
                        this.refreshToken()
                        self.$router.push({ name: 'settings' })
                    })
                    .catch(error => {
                        document.getElementById("ls").style.opacity = "0"
                        document.getElementById("submit-button").style.background = "#B8352D"
                        if (error.toString().includes("401")){
                            this.errMessage = "Wrong old password!"

                        } else {
                            this.errMessage = error
                        }
                        this.clearData();
                    })
                } else{
                    this.errMessage = "Password needs to be between 6 to 40 characters long."
                    this.clearData()
                }
                
            } else{
                this.errMessage = "Passwords not matching!"
                this.clearData()
            }
            
        },
        refreshToken(){
            var refreshApi = this.baseApi + 'auth/refreshToken'
            this.axios.post(refreshApi, {}, {withCredentials: true})
                    .then(response => {this.$store.commit('set', response.data)})
                    .catch(error => {console.log(error)})
        },
        clearData(){
            document.getElementById("password").value = ""
            document.getElementById("repeat-password").value = ""
            document.getElementById("old-password").value = ""
        }
    }
}


</script>

<style scoped lang="sass">

#ls
    display: block
    margin-left: calc(20% - 10px)
    &.medium
        margin-left: calc(30% - 10px)
    &.small
        margin-left: calc(15% - 10px)

</style>
