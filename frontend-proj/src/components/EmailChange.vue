<template lang="html">
    <div>
        <div id="login" :class="$mq">
            <form action="javascript:void(0);" class="login_form" :class="$mq">
                <h1>Change email</h1>
                <input class="fin" type="text" id="email" placeholder="New email"><br>
                <input type="submit" value="Submit" class="fsubmit" v-on:click="changeEmail()">
            </form>
        </div>
    </div>
</template>

<script lang="js">

  export default  {
    name: 'EmailChange',
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
      }
    },
    methods: {
        changeEmail(){
            let self = this
            var emailApi = this.baseApi + 'users/email'

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
            })
        },
        refreshToken(){
            var refreshApi = this.baseApi + 'auth/refreshToken'
            this.axios.post(refreshApi, {}, {withCredentials: true})
                    .then(response => {this.$store.commit('set', response.data)})
                    .catch(error => {console.log(error)})
        }
    }
}


</script>

<style scoped lang="sass">

</style>
