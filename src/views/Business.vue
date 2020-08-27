<template lang="html">
    <div id="business-container" :class="$mq">
        <h1>Business</h1>
        <p>Display ads on Tline!</p>
        <p>We are currently working on ads system. Ads will display on homepage in form of current timelines or on user profile and their created timelines - only non premium users. With our built in system we can avoid adblocks and personalize ads to logged in users.</p>
        <div style="text-align: center">
            <img src="../assets/images/about/desc-a.png" class="image">
        </div>
    </div>
</template>

<script lang="js">

  export default  {
    name: 'Business',
    metaInfo() {
        return {
            title: 'Business',
            titleTemplate: '%s - Tline',
            meta: [
                { name: 'description', content: 'Create content based on timeline! Present your projects, achievements, inspire others and develop connections! Business page'},
                { property: 'og:url', content: 'https://www.tline.site/business'},
                { property: 'og:title', content: 'Business - Tline' },
                { property: 'og:descriprion', content: 'Create content based on timeline! Present your projects, achievements, inspire others and develop connections! Business page'},
                { property: 'og:image', content: 'https://storage.googleapis.com/tline-files/meta.png' },
                { property: 'twitter:card', content: 'summary_large_image'},
                { property: 'twitter:url', content: 'https://www.tline.site/business'},
                { property: 'twitter:title', content: 'Business - Tline'},
                { property: 'twitter:description', content: 'Create content based on timeline! Present your projects, achievements, inspire others and develop connections! Business page'},
                { property: 'twitter:image', content: 'https://storage.googleapis.com/tline-files/meta.png'}
            ]
        }
    },
    mounted(){
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
    height: 400px
    max-width: 100%
    object-fit: contain
    border-radius: 10px

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