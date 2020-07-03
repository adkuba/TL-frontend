<template lang="html">
    <div>
        <div id="login" :class="$mq">
            <form action="javascript:void(0);" class="login_form" :class="$mq">
                <h1 :class="$mq">Contact</h1>
                <textarea class="fin opinion" :class="$mq" type="text" id="review-input" placeholder="Type"></textarea>
                <input type="submit" :class="$mq" value="Submit" class="fsubmit" v-on:click="submitReview()">
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
    data () {
      return {
          baseApi: 'http://localhost:8081/api/'
      }
    },
    methods: {
        submitReview(){
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
.opinion
    border: 1px solid #d7d7d7
    box-sizing: padding-box
    padding: 8px 11px
    resize: none
    height: 100px

</style>
