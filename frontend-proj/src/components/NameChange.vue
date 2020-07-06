<template lang="html">
    <div>
        <div id="login" :class="$mq">
            <form action="javascript:void(0);" class="login_form" :class="$mq">
                <h1 :class="$mq">Change name</h1>
                <input class="fin" :class="$mq" type="text" id="name" placeholder="New name">
                <br v-if="!errMessage">
                <div class="fsignup error" :class="$mq" v-if="errMessage">{{ errMessage }}</div>
                <input type="submit" :class="$mq" value="Submit" class="fsubmit" v-on:click="changeName()">
            </form>
            <div class="login-desc" :class="$mq">
                <h1>About</h1>
                <p>Name displays above your timeline. Leve empty and submit to delete.</p>
            </div>
        </div>
    </div>
</template>

<script lang="js">

  export default  {
    name: 'NameChange',
    created() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          errMessage: ''
      }
    },
    methods: {
        changeName(){
            let self = this
            var nameApi = this.baseApi + 'users/name'

            this.axios.put(nameApi, null, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                },
                params: {
                    name: document.getElementById("name").value
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
