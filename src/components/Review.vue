<template lang="html">
    <div>
        <div id="login" :class="$mq">
            <form action="javascript:void(0);" class="login_form" :class="$mq">
                <h1 :class="$mq">Contact</h1>
                <textarea class="fin opinion" :class="$mq" autocorrect="off" spellcheck="false" type="text" id="review-input" placeholder="Type"></textarea><br>
                <input type="submit" :class="$mq" value="Submit" id="submit-button" class="fsubmit" v-on:click="submitReview()">
                <div class="loader" id="ls" :class="$mq"></div>
            </form>
            <div class="login-desc" :class="$mq">
                <h1>About</h1>
                <p>Tell us what you think.</p>
            </div>
        </div>
    </div>
</template>

<script lang="js">

  export default  {
    name: 'Review',
    created() {
        this.scrollToTop()
    },
    data () {
      return {
          baseApi: 'https://api.tline.site/api/'
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
        submitReview(){
            document.getElementById("ls").style.opacity = "1"
            document.getElementById("submit-button").style.background = "#932a24"
            var review = {
                username: this.$store.state.jwt.user.username,
                opinion: document.getElementById("review-input").value
            }
            this.axios.post(this.baseApi + 'statistics/public/review', review, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                },
            })
            .then(() => {
                this.$router.push({ name: 'settings' })
            })
            .catch(error => {
                console.log(error)
            })
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

.opinion
    -webkit-appearance: none
    border: 1px solid #d7d7d7
    padding: 8px 11px
    resize: none
    height: 100px

.fsubmit
    &:active
        background: #B8352D
    &:focus
        background: #B8352D
        outline: none

</style>
