<template lang="html">
    <div>
        <div id="login" :class="$mq">
            <form action="javascript:void(0);" class="login_form" :class="$mq">
                <h1 :class="$mq">Change email</h1>
                <input class="fin" :class="$mq" type="text" id="email" autocorrect="off" spellcheck="false" placeholder="New email">
                <br v-if="!errMessage">
                <div class="fsignup error" :class="$mq" v-if="errMessage">{{ errMessage }}</div>
                <input type="submit" :class="$mq" value="Submit" id="submit-button" class="fsubmit" v-on:click="changeEmail()">
                <div class="loader" id="ls" :class="$mq"></div>
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
    metaInfo() {
        return {
            title: 'EmailChange',
            titleTemplate: '%s - Tline',
            meta: [
                { name: 'description', content: 'Change your email!'},
                { property: 'og:url', content: 'https://www.tline.site/emailChange'},
                { property: 'og:title', content: 'EmailChange - Tline' },
                { property: 'og:descriprion', content: 'Change your email!'},
                { property: 'og:image', content: 'https://storage.googleapis.com/tline-files/signup.png' },
                { property: 'twitter:card', content: 'summary_large_image'},
                { property: 'twitter:url', content: 'https://www.tline.site/emailChange'},
                { property: 'twitter:title', content: 'EmailChange - Tline'},
                { property: 'twitter:description', content: 'Change your email!'},
                { property: 'twitter:image', content: 'https://storage.googleapis.com/tline-files/signup.png'}
            ]
        }
    },
    mounted() {
        this.scrollToTop()
    },
    data () {
      return {
          baseApi: 'https://api.quicpos.com/tline/api/',
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
        changeEmail(){
            let self = this
            var emailApi = this.baseApi + 'users/email'

            if(this.validEmail(document.getElementById("email").value)){
                document.getElementById("ls").style.opacity = "1"
                document.getElementById("submit-button").style.background = "#932a24"
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
                    this.errMessage = error.response.data
                    document.getElementById("ls").style.opacity = "0"
                    document.getElementById("submit-button").style.background = "#B8352D"
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

#ls
    display: block
    margin-left: calc(20% - 10px)
    &.medium
        margin-left: calc(30% - 10px)
    &.small
        margin-left: calc(15% - 10px)

</style>