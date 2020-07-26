<template lang="html">
    <div id="about-container" :class="$mq">
        <h1 id="about">About</h1>
        <p>Welcome on Tline! <br>Tline allows users to create various content based on timeline concept, to showcase projects, achievements, to inspire and develop connections.</p>
        <p class="img-desc" style="margin-top: 80px">Create free account</p>
        <img src="../assets/images/about/signup.png" class="image">
        <p class="img-desc">Fill your details. User full name will be displayed above timeline to direct users to owner’s profile.</p>
        <img src="../assets/images/about/settings.png" class="image">
        <p class="img-desc">“Create” will direct you to our special timeline creator. Add description, events and pictures.</p>
        <img src="../assets/images/about/creator.png" class="image">
        <p class="img-desc">Profile is a summary of your activity. You can find there your timelines, likes, and following users. Here you can also edit or delete created timelines.</p>
        <img src="../assets/images/about/profile.png" class="image">
        <p class="img-desc">Timelines will be displayed on a homepage. That's the best place to discover other users creations. Moreover with our homepage you can better promote your content and profile.</p>
        <img src="../assets/images/about/homepage.png" class="image">
        
        <h1 id="subscription">Subscription</h1>
        <p>Premium version allows you to use special promotion section on the homepage. It helps you to reach more users. Also premium unlocks more detailed timeline statistics to let you better understand users interactions.</p>
        <p>In future we are planning to implement ads on our page. Premium version will be free from them. Ads in standard version will display on homepage, profiles and timelines. So with premium, even non logged user visiting your profile or timeline won’t see ads.</p>
        <p>Subscription eliminates also max 2 timelines limit, you can create unlimited number of timelines. Subscription helps us to develop and improve Tline, thank you!</p>
        <img src="../assets/images/about/statistics.png" class="image subs">
        <h1>Coming</h1>
        <p>We are currently working on:</p>
        <ul>
            <li>Better homepage - recommendation system,</li>
            <li>Improved subscription system.</li>
        </ul>
        <h1 id="regulations">Regulations</h1>
        <p>Following Regulations describes the way user uses Tline. This service is created by 
            <router-link style="display: inline; cursor: auto; text-decoration: none; color: #303030" :to="{ path: '/ola'}">Jakub Adamski.</router-link>
        </p>
        <p>In Tline user can choose between two accounts - free or paid. In free version user allows to display ads from external ad networks. Tline does not transfer any additional data to advertisers and does not take responsibility for content displayed on ads. We are making everything to create smooth user experience and in case of possible violation of content rules (below) ad can be reported by user and blocked by our administrators after analyze. In free version users allow to display ads next to their content.</p>
        <p>...</p>
        <p>This product includes GeoLite2 data created by MaxMind, available from</p>
        <a href="https://www.maxmind.com">https://www.maxmind.com</a>.
    </div>
</template>

<script lang="js">

  export default  {
    name: 'About',
    created(){
        this.scrollToTop()
    },
    data () {
      return {
          baseApi: 'https://tline-283413.ew.r.appspot.com/api/',
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

.subs
    margin-top: 50px

#subscription
    margin-top: 200px

#regulations
    margin-top: 250px

.img-desc
    text-align: justify
    font-size: 17px
    margin-top: 180px

.image
    image-rendering: crisp-edges
    margin-top: 20px
    width: 100%
    border-radius: 10px

p
    text-align: justify

a
    font-family: OpenSans-Regular

ul
    font-family: OpenSans-Regular

h1
    margin-top: 70px
    font-family: Raleway-Regular

#about-container
    text-align: left
    margin: 100px 27%
    &.medium
        margin: 100px 18%
    &.small
        margin: 100px 5%

</style>
