<template lang="html">
    <div id="profile" :class="$mq">
        <div v-if="user.followers" class="user" :class="$mq">
            <h1 :class="$mq">{{ user.fullName }}</h1>
            <div class="followers" :class="$mq">{{ user.followers.filter(e => e.userId != null).length }} FOLLOWERS &middot; @{{ user.username }}</div>
            <p class="email" :class="$mq"> {{ user.email }} </p>
            <div class="follow" :class="$mq" v-if="$store.state.jwt">
                <div class="follower-item" :class="{free: !user.subscriptionEnd}" v-on:click="follow()" v-if="$store.state.jwt.user.followers.filter(e => e.follow === user.username).length == 0">Follow</div>
                <div class="follower-item" :class="{free: !user.subscriptionEnd}" v-on:click="follow()" v-else>Unfollow</div>
                <div class="desc-p" v-if="user.subscriptionEnd && $mq!='small'">PREMIUM</div>
            </div>
            <div v-else class="follow" :class="$mq">
                <router-link class="follower-item" style="text-decoration: none; display: block" :class="{free: !user.subscriptionEnd}" :to="{ name: 'login', params: {path: {path: '/profile/' + user.username}}}">Login to follow</router-link>
                <div class="desc-p" v-if="user.subscriptionEnd && $mq!='small'">PREMIUM</div>
            </div>
        </div>
        <div v-else>
            <div class="empty-profile" :class="$mq"></div>
        </div>
        <div class="controls" :class="$mq">
            <div class="menu-item" :class="$mq" v-on:click="openTimelines()">Timelines <div id="1" class="border" :class="$mq"></div></div>
            <div class="menu-item" :class="$mq" v-on:click="openLikes()">Likes <div id="2" class="border" :class="$mq"></div></div>
            <div class="menu-item" :class="$mq" v-on:click="openFollowing()">Following <div id="3" class="border" :class="$mq"></div></div>
        </div>
        <div class="timelines-container" v-if="selected && selected[0] && selected[0].id" :class="$mq">
            <transition-group class="fade">
                <span v-for="(timeline, index) in selected" :key="timeline.id + index">
                    <profile-timeline v-bind:timeline="timeline"></profile-timeline>
                </span>
            </transition-group>
        </div>
        <div v-if="!selected">
            <div class="empty-element" :class="$mq"></div>
        </div>
        <div class="fusers-container" v-if="selected && selected[0] && selected[0].email">
            <router-link :to="{ path: '/profile/' + fuser.username }" class="fusers" v-for="(fuser, idx) in selected" :key="idx" :class="$mq">
                <div v-if="fuser.fullName" class="fuser-name">{{ fuser.fullName }}</div>
                <div v-else class="fuser-name">New User</div>
                <div class="fuser-desc">@{{ fuser.username }} &middot; {{ fuser.followers.filter(e => e.userId != null).length }} followers</div>
            </router-link>
        </div>
    </div>
</template>

<script lang="js">
import ProfileTimeline from '../components/ProfileTimeline.vue'

  export default  {
    name: 'Profile',
    metaInfo() {
        return {
            title: this.user.fullName,
            titleTemplate: '%s - Tline',
            meta: [
                { name: 'description', content: this.user.fullName + " profile on Tline. Check this user's activity!"},
                { property: 'og:url', content: 'https://www.tline.site/profile/' + this.user.username},
                { property: 'og:title', content: this.user.fullName + ' - Tline' },
                { property: 'og:descriprion', content: this.user.fullName + " profile on Tline. Check this user's activity!"},
                { property: 'og:image', content: 'https://storage.googleapis.com/tline-files/profile.png' },
                { property: 'twitter:card', content: 'summary_large_image'},
                { property: 'twitter:url', content: 'https://www.tline.site/profile/' + this.user.username},
                { property: 'twitter:title', content: this.user.fullName + ' - Tline'},
                { property: 'twitter:description', content: this.user.fullName + " profile on Tline. Check this user's activity!"},
                { property: 'twitter:image', content: 'https://storage.googleapis.com/tline-files/profile.png'}
            ]
        }
    },
    components: {
        ProfileTimeline
    },
    created () {
        this.axios.get(this.baseApi + 'users/public/' + this.$route.params.id + '?profile=true')
            .then(response => {
                if (response.data){
                    this.user = response.data
                    this.getTimelines()
                    this.getLikes()
                } else {
                    this.$router.push( {path: "/"} )
                }
            }).catch(error => {
                console.log(error)
            })
    },
    mounted() {
        this.scrollToTop()
        document.getElementById("dropdown").style.display = "none"
        document.getElementById("dropdown-bg").style.display = "none"
        document.getElementById("1").style.opacity = 1
    },
    watch: {
        '$route.params.id': function(){
            window.location.reload()
        }
    },
    data () {
      return {
          baseApi: 'https://api.tline.site/api/',
          timelines: null,
          user: {
              fullName: '',
              username: ''
          },
          activeError: "",
          likes: [],
          selected: null,
          details: [{username: 'kuba'}],
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
        getLikes(){
            for (var i=0, len=this.user.likes.length; i<len; i++){
                this.axios.get(this.baseApi + 'timelines/public?id=' + this.user.likes[i])
                .then(response => {
                    this.likes.push(response.data)
                })
                .catch(error => {
                    console.log(error)
                })
            }
        },
        getTimelines(){
            var timelineApi = this.baseApi + 'timelines/public/' + this.$route.params.id
            this.axios.get(timelineApi)
                .then(response => {
                    this.timelines = response.data
                    this.selected = this.timelines
                }).catch(err => {
                    console.log(err)
                })
        },
        follow(){
            if (this.$route.params.id == this.$store.state.jwt.user.username){
                return
            }
            this.axios.post(this.baseApi + 'users/follow/' + this.$route.params.id, null, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                }
            }).then(response => {
                    if (response.data){
                        var jwt = this.$store.state.jwt
                        jwt.user.followers = response.data
                        this.$store.commit('set', jwt)
                        window.location.reload() //troche zamula

                    } else {
                        console.log("error following")
                    }
                }).catch(error => {
                    console.log(error)
                })
        },
        openLikes(){
            this.selected = []
            setTimeout(() => {this.selected = this.likes}, 200);
            document.getElementById("1").style.opacity = 0
            document.getElementById("3").style.opacity = 0
            document.getElementById("2").style.opacity = 1
        },
        openTimelines(){
            this.selected = []
            setTimeout(() => {this.selected = this.timelines}, 200);
            document.getElementById("1").style.opacity = 1
            document.getElementById("3").style.opacity = 0
            document.getElementById("2").style.opacity = 0
        },
        openFollowing(){
            this.selected = []
            var following = this.user.followers.filter(e => e.follow != null)
            for (var i=0, len=following.length; i<len; i++){
                this.axios.get(this.baseApi + "users/public/" + following[i].follow)
                    .then(response => {
                        this.selected.push(response.data)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
            document.getElementById("1").style.opacity = 0
            document.getElementById("3").style.opacity = 1
            document.getElementById("2").style.opacity = 0
        },
    }
}


</script>

<style scoped lang="sass">
@import '../assets/saas-vars.sass'

.desc-p
    font-size: 11px
    color: #7e7e7e

.fade-leave-active
    transition: all 1ms

.fade-move, .fade-enter-active
    transition: all 0.4s

.fade-enter, .fade-leave-to
    opacity: 0

.empty-profile
    margin-top: 120px
    background: #f1f1f1
    border-radius: 20px
    position: relative
    height: 110px
    background: rgba(0, 0, 0, 0.04)
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)
    animation: pulse 1.5s linear infinite
    &.small
        height: 155px
        width: 96%
        margin-left: 2%

.empty-element
    margin: 2%
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)
    border-radius: 20px
    position: relative
    width: 45%
    height: 500px
    background: rgba(0, 0, 0, 0.04)
    animation: pulse 1.5s linear infinite
    &.small
        width: 96%
        height: 450px

@keyframes pulse
    0%
        background: rgba(0, 0, 0, 0.04)
    50%
        background: rgba(0, 0, 0, 0.1)
    100%
        background: rgba(0, 0, 0, 0.04)

.fuser-desc
    font-family: OpenSans-Regular
    font-size: 14px
    color: #7e7e7e

.fuser-name
    font-size: 25px
    font-family: Raleway-Regular
    margin-bottom: 10px

.fusers-container
    text-align: left
    
.fusers
    animation-timing-function: ease-in
    animation: fadein 0.5s
    text-decoration: none
    color: #303030
    display: inline-block
    width: 27%
    margin: 20px 3%
    &.medium
        width: 44%
    &.small
        width: 94%

.timelines-container
    text-align: left

.follower-item
    background: #ff7f51
    color: white
    padding: 5px 10px
    font-size: 14px
    border-radius: 5px

.controls
    font-family: Raleway-Regular
    margin-top: 120px
    margin-bottom: 40px
    font-size: 24px
    font-weight: bold
    letter-spacing: 1px
    &.small
        margin-top: 60px
        margin-bottom: 10px
        font-size: 20px

.menu-item
    cursor: pointer
    width: 32%
    display: inline-block

.border
    width: 50%
    margin: 6px auto
    border-bottom: 2px solid #cdcdcd
    opacity: 0
    &.small
        width: 70%

.follow
    text-align: center
    cursor: pointer
    font-family: OpenSans-Regular
    &.large
        position: absolute
        top: 130px
        right: 15%
    &.medium
        position: absolute
        top: 130px
        right: 3%
    &.small
        display: inline-block
        margin-left: 5px
        margin-top: 15px

.followers
    margin-top: 5px
    font-family: OpenSans-Regular
    letter-spacing: 1px
    font-size: 15px
    margin-left: 5px
    color: #7e7e7e
    &.small
        font-size: 14px

.user
    animation-timing-function: ease-in
    animation: fadein 1s
    text-align: left
    margin-top: 120px
    &.small
        margin-left: 2%
        margin-right: 2%

h1
    margin-bottom: 0
    font-family: Raleway-Regular
    font-size: 45px
    &.small
        font-size: 35px

.free
    background: #9cafb7

#profile
    width: 70%
    margin-left: 15%
    padding-bottom: 500px
    &.medium
        margin-left: 3%
        width: 94%
    &.small
        margin-left: 1%
        width: 98%

.email
    margin-top: 5px
    color: #14426B
    margin-left: 5px
    &.small
        font-size: 14px

.s_line
    width: 70%
    float: left
    height: 1px
    background: #cccccc
    margin-top: 15px
    display: inline-block

</style>