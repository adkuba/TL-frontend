<template lang="html">
    <div>
        <div id="login" :class="$mq">
            <form action="javascript:void(0);" class="login_form" :class="$mq">
                <h1 :class="$mq">Change email</h1>
                <input class="fin" :class="$mq" type="text" id="email" placeholder="New email">
                <br v-if="!errMessage">
                <div class="fsignup error" :class="$mq" v-if="errMessage">{{ errMessage }}</div>
                <input type="submit" :class="$mq" value="Submit" class="fsubmit" v-on:click="changeEmail()">
            </form>
            <div class="login-desc" :class="$mq">
                <h1>About</h1>
                <p>Email displays under your timelines so that users can contact with you. </p>
                <p>It's also used to reset your password. You don't have to confirm it but make sure to enter valid email.</p>
            </div>
        </div>
    </div>
</template>

<script lang="js">

  export default  {
    name: 'EmailChange',
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          errMessage: ''
      }
    },
    methods: {
        changeEmail(){
            let self = this
            var emailApi = this.baseApi + 'users/email'

            if(this.validEmail(document.getElementById("email").value)){
                this.axios.put(emailApi, null, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.jwt.token
                    },
                    params: {
                        email: document.getElementById("email").value
                    }
                })
                .then(()=>{
                    this.refreshToken()
                    self.$router.push({ name: 'settings' })
                })
                .catch(error => {
                    console.log(error)
                    this.errMessage = error
                })
            } else{
                this.errMessage = "Wrong email."
                document.getElementById("email").value
            }
        },
        refreshToken(){
            var refreshApi = this.baseApi + 'auth/refreshToken'
            this.axios.post(refreshApi, {}, {withCredentials: true})
                    .then(response => {this.$store.commit('set', response.data)})
                    .catch(error => {console.log(error)})
        },
        validEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }
}


</script>

<style scoped lang="sass">

</style>
