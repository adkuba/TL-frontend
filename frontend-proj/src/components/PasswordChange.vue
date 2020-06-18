<template lang="html">
    <div>
        <div id="login" :class="$mq">
            <form action="javascript:void(0);" class="login_form" :class="$mq">
                <h1 :class="$mq">Change password</h1>
                <input class="fin" :class="$mq" type="password" id="old-password" placeholder="Old password"><br>
                <input class="fin" :class="$mq" type="password" id="password" placeholder="New password"><br>
                <input class="fin" :class="$mq" type="password" id="repeat-password" placeholder="Repeat password"><br>
                <br v-if="!errMessage">
                <div class="fsignup error" :class="$mq" v-if="errMessage">{{ errMessage }}</div>
                <input type="submit" :class="$mq" value="Submit" class="fsubmit" v-on:click="changePassword()">
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
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
           errMessage: ''
      }
    },
    methods: {
        changePassword(){
            let self = this
            var passwordApi = this.baseApi + 'users/password'

            if(document.getElementById("password").value == document.getElementById("repeat-password").value){
                if (document.getElementById("password").value.length > 6 && document.getElementById("password").value.length < 40){
                    this.axios.put(passwordApi, null, {
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.jwt.token
                        },
                        params: {
                            oldPassword: document.getElementById("old-password").value,
                            newPassword: document.getElementById("password").value
                        }
                    })
                    .then(()=>{
                        this.refreshToken()
                        self.$router.push({ name: 'settings' })
                    })
                    .catch(error => {
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

</style>
