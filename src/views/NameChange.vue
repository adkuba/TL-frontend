<template lang="html">
    <div>
        <div id="login" :class="$mq">
            <form action="javascript:void(0);" class="login_form" :class="$mq" id="name-form">
                <h1 :class="$mq">Change name</h1>
                <input class="fin" :class="$mq" type="text" id="name" autocorrect="off" spellcheck="false" maxlength="20" placeholder="New name">
                <br v-if="!errMessage">
                <div class="fsignup error" :class="$mq" v-if="errMessage">{{ errMessage }}</div>
                <input type="submit" :class="$mq" value="Submit" id="submit-button" class="fsubmit" v-on:click="changeName()">
                <div class="loader" id="ls" :class="$mq"></div>
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
    mounted() {
        this.scrollToTop()
    },
    metaInfo() {
        return {
            title: 'NameChange',
            titleTemplate: '%s - Tline',
            meta: [
                { name: 'description', content: 'Change your name!'},
                { property: 'og:url', content: 'https://www.tline.site/nameChange'},
                { property: 'og:title', content: 'NameChange - Tline' },
                { property: 'og:descriprion', content: 'Change your name!'},
                { property: 'og:image', content: 'https://storage.googleapis.com/tline-files/signup.png' },
                { property: 'twitter:card', content: 'summary_large_image'},
                { property: 'twitter:url', content: 'https://www.tline.site/nameChange'},
                { property: 'twitter:title', content: 'NameChange - Tline'},
                { property: 'twitter:description', content: 'Change your name!'},
                { property: 'twitter:image', content: 'https://storage.googleapis.com/tline-files/signup.png'}
            ]
        }
    },
    data () {
      return {
          baseApi: 'http://akuba.pl/api/tline/api/',
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
        changeName(){
            if(document.getElementById("name-form").checkValidity()){
                let self = this
                var nameApi = this.baseApi + 'users/name'
                document.getElementById("ls").style.opacity = "1"
                document.getElementById("submit-button").style.background = "#932a24"

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
                    document.getElementById("ls").style.opacity = "0"
                    document.getElementById("submit-button").style.background = "#B8352D"
                    console.log(error)
                    this.errMessage = error
                })
            }
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

#ls
    display: block
    margin-left: calc(20% - 10px)
    &.medium
        margin-left: calc(30% - 10px)
    &.small
        margin-left: calc(15% - 10px)

</style>