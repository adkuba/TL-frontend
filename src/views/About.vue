<template lang="html">
    <div id="about-container" :class="$mq">
        <div id="intro" :class="$mq">
            <h1 id="about">About</h1>
            <p>Welcome on Tline! <br><br> Create content based on timeline. Present your projects, achievements, inspire others and develop connections!</p>
        </div>
        <div class="images-container" :class="$mq">
            <div class="element" :class="$mq">
                <img src="../assets/images/about/signup.png" class="image" :class="$mq">
                <p class="img-desc">Create free account</p>
            </div>
            <div class="element" :class="$mq">
                <img src="../assets/images/about/settings.png" class="image" :class="$mq">
                <p class="img-desc">Fill your details in settings</p>
            </div>
            <div class="element" :class="$mq">
                <img src="../assets/images/about/creator.png" class="image" :class="$mq">
                <p class="img-desc">Create your timeline</p>
            </div>
            <div class="element" :class="$mq">
                <img src="../assets/images/about/timeline.png" class="image" :class="$mq">
                <p class="img-desc">Ready timeline</p>
            </div>
            <div class="element" :class="$mq">
                <img src="../assets/images/about/homepage.png" class="image" :class="$mq">
                <p class="img-desc">Timelines display on homepage</p>
            </div>
            <div class="element" :class="$mq">
                <img src="../assets/images/about/profile.png" class="image" :class="$mq">
                <p class="img-desc">Take advantage of your profile</p>
            </div>
            <router-link class="login-button" :to="{ path: '/login'}">Create account</router-link>
        </div>

        <div id="subscription" :class="$mq">
            <h1>Subscription</h1>
            <p>Premium version allows you to use special promotion section on our homepage and your profile. Premium also unlocks more detailed timeline statistics to let you better understand users interactions.</p>
            <p>In future we are planning to implement ads in our system. With premium, even non logged user visiting your profile or timeline won’t see ads.</p>
            <p>Subscription eliminates max 2 timelines limit, you can create unlimited number of timelines. Subscription helps us to develop and improve, thank you!</p>
            <div class="element subs-elem" :class="$mq">
                <img src="../assets/images/about/statistics.png" class="image subs" :class="$mq">
            </div>
        </div>

        <div id="coming" :class="$mq">
            <h1>Coming</h1>
            <p>We are currently working on:</p>
            <ul>
                <li>Better homepage - recommendation system,</li>
                <li>Improved subscription system.</li>
            </ul>
        </div>

        <div id="regulations" :class="$mq">
            <h1>Regulations</h1>
            <p>Following Regulations describes the way user uses Tline. This service is created by 
                <router-link style="display: inline; cursor: auto; text-decoration: none; color: #303030" :to="{ path: '/ola'}">Jakub Adamski.</router-link>
            </p>
            <p>In Tline user can choose between two accounts - free or paid. In future we are planning to implement ads. Free version users allow to display ads next to their content. Paid account eliminates ads and allows to use our special premium features like, premium section or statistics. Payments, and related data is processed by Stripe. User can anytime cancel subscription and make request to delete all data. Subscription costs 3 dollars.</p>
            <p>Tline collects data about your usage - likes, views and user follows. Moreover we store information contained in user settings and data about client device and its location. These data is needed for proper service functionality and personalization. Device information is used for better security - notifications about new login. All of these data may be also used in analytics to improve Tline.</p>
            <p>Contact information - email is used to notify user about changes in their account. We use cookies to save login session and they may be also used by captcha.</p>
            <p>Publicly available data for even non logged users includes - your timelines, full name, email, likes and list of following users. We share some statistics with creators - views number, likes and followers to allow them to better understand how users interact with their content. When needed we can share all data to law enforcement authorities.</p>
            <p>We provide mentioned services and require from user following commitments. User must be older than 13 years old. Published data is valid with our content regulations and user takes all responsibility for provided informations. Security is important to us and Tline has rights to block, delete users or timelines when regulations are violated. User mustn't impersonate someone else and must submit correct informations that is using on a daily basis. We encourage to report content or behaviour, that may be violating user rights or our Regulations.</p>
            <p>Users have all the intellectual property rights and allows Tline to use their content for promotion in system or for outside service advertising. Tline administrates user data until its deleted.</p>
            <p>Regulations updates. We are constantly improving our services, that’s why we may change all the regulations. User will be informed about change minimum 30 days before its implementation, unless this changes are legally required. When our Regulations will be updated, users using service must respect them. In case of the update disapproval, user can delete account with all the data by letting us know through contact form available in settings.</p>
            <p>RODO. Due to global character of Tline, collected data may be stored in server outside user native country. The main administrator of data is Jakub Adamski company without registration in Poland. You can contact Tline through contact form or email: admin@tline.site.</p>
            <p>We collect and use data mentioned in Regulations in a way not exceeding your consent. All the informations in blocked account, may be stored to prevent next violation of our terms of use. In relation to personal data processing, user has the right to view them, correct through settings, deletion and to make a complaint through supervisory authority.</p>
            <p>Tline values privacy and security of vulnerable data. We are trying our best to secure, physically and technically all the personal informations from the destruction, accidental loss, change, reveal, usage or access, according to all the applicable regulations.</p>
            <p>Content. Content placed on Tline must meet following requirements. Users take responsibility for their data. We have the right to review and in case of regulations violation to delete or block it. When we are unable to review - for example difficulties in translation, and the data receives multiple user reports we may also delete it.</p>
            <p>We are trying our best to control content, keeping the freedom of speech. Data mustn’t be illegal, misleading, discriminatory or fraudulent. It mustn't violate other user rights including all the intellectual rights.</p>
            <p>User must not sent send viruses or any malicious code and take action, which may block, overload or disturb correct functionality or deteriorate the appearance of our site. User can’t gain access to blocked data or collect it from our system, unless is authorized by us.</p>
            <p>We want to make sure that all the data is authentic and safe. Threats, violence, incitement and illegal behaviour is forbidden. We do not allow content promoting hate or drastic visuals.</p>
            <p>Tline tries to eliminate spam, because we don’t want to allow, the content that’s goal is to fraud or mislead users, be used to gain views.</p>
            <p>These Regulations are the whole agreement between you and Tline in relation to users using our service. It replaces every earlier agreements. All our rights and responsibilities resulting from the Regulations can be freely moved in case of fusion, acquisition, sale of assets or legal action and other.</p>
            <p>This product includes GeoLite2 data created by MaxMind, available from <a href="https://www.maxmind.com" style="color: #14426b">https://www.maxmind.com</a></p>
            <p>Date of the last update 26.07.2020 r.</p>
        </div>

    </div>
</template>

<script lang="js">

  export default  {
    name: 'About',
    metaInfo() {
        return {
            title: 'About',
            titleTemplate: '%s - Tline',
            meta: [
                { name: 'description', content: 'Create content based on timeline! Present your projects, achievements, inspire others and develop connections! About, regulations.'},
                { property: 'og:url', content: 'https://www.tline.site/about'},
                { property: 'og:title', content: 'About - Tline' },
                { property: 'og:descriprion', content: 'Create content based on timeline! Present your projects, achievements, inspire others and develop connections! About, regulations.'},
                { property: 'og:image', content: 'https://storage.googleapis.com/tline-files/meta.png' },
                { property: 'twitter:card', content: 'summary_large_image'},
                { property: 'twitter:url', content: 'https://www.tline.site/about'},
                { property: 'twitter:title', content: 'About - Tline'},
                { property: 'twitter:description', content: 'Create content based on timeline! Present your projects, achievements, inspire others and develop connections! About, regulations.'},
                { property: 'twitter:image', content: 'https://storage.googleapis.com/tline-files/meta.png'}
            ]
        }
    },
    mounted(){
        this.scrollToTop()
    },
    data () {
      return {
          baseApi: 'http://api.tline.site/api/',
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

.login-button
    background: #B8352D
    text-decoration: none
    color: white
    font-family: Raleway-Regular
    font-size: 17px
    padding: 12px 40px
    border-radius: 5px

.images-container
    text-align: center
    width: 60%
    margin-left: 20%
    margin-bottom: 150px
    &.medium
        width: 80%
        margin-left: 10%
    &.small
        width: 96%
        margin-left: 2%
        margin-bottom: 100px

.subs-elem
    width: 90% !important

#intro
    width: 50%
    margin-left: 25%
    margin-bottom: 50px
    &.medium
        width: 70%
        margin-left: 15%
    &.small
        width: 96%
        margin-left: 2%

.element
    vertical-align: bottom
    text-align: center
    width: 43%
    margin: 90px 3%
    display: inline-block
    &.small
        display: block
        width: 94%
        margin: 50px 3%

.subs
    margin-top: 30px
    height: 200px !important

#subscription
    margin-top: 100px
    width: 50%
    margin-left: 25%
    margin-bottom: 50px
    &.medium
        width: 70%
        margin-left: 15%
    &.small
        width: 96%
        margin-left: 2%

#coming
    margin-top: 100px
    width: 50%
    margin-left: 25%
    margin-bottom: 50px
    &.medium
        width: 70%
        margin-left: 15%
    &.small
        width: 96%
        margin-left: 2%

#regulations
    margin-top: 100px
    width: 50%
    margin-left: 25%
    margin-bottom: 50px
    &.medium
        width: 70%
        margin-left: 15%
    &.small
        width: 96%
        margin-left: 2%

.img-desc
    height: 70px
    text-align: center
    font-size: 15px
    color: #7e7e7e

.image
    max-width: 100%
    image-rendering: crisp-edges
    object-fit: contain
    margin-bottom: 20px
    height: 120px
    border-radius: 10px
    &.medium
        height: 150px
    &.small
        margin-bottom: 0

a
    font-family: OpenSans-Regular

ul
    font-family: OpenSans-Regular

h1
    margin-top: 70px
    font-family: Raleway-Regular

#about-container
    text-align: left
    margin: 100px 5%
    &.medium
        margin: 100px 0
    &.small
        margin: 100px 0

</style>