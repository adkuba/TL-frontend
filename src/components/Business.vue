<template lang="html">
    <div id="business-container" :class="$mq">
        <h1>Business</h1>
        <p>Display ads on Tline!</p>
        <p>We are currently working on ads system. Ads will display on homepage in form of current timelines or on user profile and their created timelines - only non premium users. With our built in system we can avoid adblocks and personalize ads to logged in users.</p>
        <img src="../assets/images/about/ads.png" class="image">
    </div>
</template>

<script lang="js">

  export default  {
    name: 'Business',
    created(){
        this.scrollToTop()
    },
    data () {
      return {
          baseApi: 'https://api.tline.site/api/',
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
    }
}


</script>

<style scoped lang="sass">

.image
    image-rendering: crisp-edges
    margin-top: 70px
    width: 100%
    border-radius: 10px

p
    text-align: justify

h1
    margin-top: 70px
    font-family: Raleway-Regular

#business-container
    text-align: left
    margin: 100px 27%
    &.medium
        margin: 100px 18%
    &.small
        margin: 100px 5%

</style>
