<template lang="html">
    <div id="profile" :class="$mq">
        <div v-if="user" class="user" :class="$mq">
            <h1 v-if="user.fullName">{{ user.fullName }}</h1>
            <h1 v-else>New User</h1>
            <p class="email"> {{ user.email }} </p>
            <p class="username">@{{ user.username }} </p>
            <div class="follow" :class="$mq" v-if="$store.state.jwt">
                <div class="follower-item" v-on:click="follow()" v-if="$store.state.jwt.user.followers.filter(e => e.follow === user.username).length == 0">Follow </div>
                <div class="follower-item" v-on:click="follow()" v-else>Unfollow</div>
                <div class="follower-item" v-on:click="openDetails(user.followers.filter(e => e.userId != null))">&middot; {{ user.followers.filter(e => e.userId != null).length }}</div>
            </div>
            <div v-else class="follow" :class="$mq">
                <div class="follower-item" :class="$mq">Login to follow &middot; {{ user.followers.filter(e => e.userId != null).length }}</div>
            </div>
            <div class="premium-sign" :class="$mq" v-if="user.subscriptionEnd">PREMIUM</div>
            <div v-else class="premium-sign free" :class="$mq">FREE</div>
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
                <div class="timeline" v-for="(timeline, index) in selected" :key="timeline.id + index" :class="$mq" >
                    <router-link :to="{ path: '/timeline/' + timeline.id }" class="tl-router" :class="$mq">
                        <div class="title" v-bind:class="[{ shadow: !timeline.active}, $mq]">{{ timeline.descriptionTitle }}</div>
                        <div class="descr" v-bind:class="[{ shadow: !timeline.active}, $mq]">{{ timeline.description.replace(/ \[([^\]]+)\]\(([^\)]+)\)/g, '') }}...</div>
                        <div class="image-container" v-bind:class="[{ shadow: !timeline.active}, $mq]">
                            <img class="image" v-if="timeline.pictures && timeline.pictures.length > 0" :src="timeline.pictures[0]">
                            <img :class="$mq" v-else class="image" :src="require('../assets/images/default/Default' + defaultImage + '.png')">
                        </div>
                    </router-link>
                    <div class="views-container" v-bind:class="[{ shadow: !timeline.active}, $mq]">
                        <router-link :to="{ path: '/statistics/' + $store.state.jwt.user.username }" class="stats" v-if="$store.state.jwt && $store.state.jwt.user.username == timeline.user.username">Statistics</router-link>
                        <div class="views" v-else>{{ timeline.views }} views &middot; {{ timeline.likes.length }} likes</div>
                    </div>
                    <div class="views-container user-edit">
                        <div class="views" v-if="$store.state.jwt && $store.state.jwt.user.username == timeline.user.username">
                            <router-link style="text-decoration: none" :to="{ path: '/editorLoader/' + timeline.id }" class="edit" v-bind:class="[{ shadow: !timeline.active}, $mq]">Edit</router-link>
                            <div class="edit" v-bind:class="[{ shadow: !timeline.active}, $mq]">&middot;</div>
                            <div class="edit" v-on:click="deleteTimeline(timeline)">Delete</div>
                            <div class="edit" v-if="!timeline.active">&middot;</div>
                            <div v-if="!timeline.active" class="edit" v-on:click="quitOpenActive(1)">Make active</div>
                        </div>
                        <div v-else class="views" v-bind:class="[{ shadow: !timeline.active}, $mq]">{{ timeline.creationDate }}</div>
                    </div>
                </div>
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

        <div id="make-active" :class="$mq">
            <div style="margin-bottom: 10px; width: 90%">Select max 2 active timelines:</div>
            <div class="quit" v-on:click="quitOpenActive(0)">x</div>
            <div v-for="(timeline, idx) in timelines" :key="idx">
                <input type="checkbox" :name="idx" :id="'active_' + timeline.id">
                <label :for="idx"> {{ timeline.id }}</label><br>
            </div>
            <div v-if="!activeError" style="height: 40px"></div>
            <div class="active-error" v-else>{{ activeError }}</div>
            <div class="fsubmit" id="activeSubmit" v-on:click="makeActive()">Submit</div>
            <div class="loader" id="loader" :class="$mq"></div>
        </div>

    </div>
</template>

<script lang="js">

  export default  {
    name: 'Profile',
    metaInfo() {
        return {
            title: this.$route.params.id,
            titleTemplate: '%s - Tline',
            content: 'Explore new way to present your content based on timeline.'
        }
    },
    created () {
        this.scrollToTop()
        this.axios.get(this.baseApi + 'users/public/' + this.$route.params.id + '?profile=true')
            .then(response => {
                if (response.data){
                    this.user = response.data
                    document.getElementById("1").style.opacity = 1
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
        document.getElementById("dropdown").style.display = "none"
        document.getElementById("dropdown-bg").style.display = "none"
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
          user: null,
          activeError: "",
          likes: [],
          selected: null,
          details: [{username: 'kuba'}],
          defaultImage: (Math.floor(Math.random() * 10) + 1)
      }
    },
    methods: {
        makeActive(){
            var activeTimelines = []
            for (var i=0, len=this.timelines.length; i<len; i++){
                if (document.getElementById("active_" + this.timelines[i].id).checked){
                    activeTimelines.push(this.timelines[i].id)
                }
            }
            if (activeTimelines.length != 2){
                this.activeError = "Select 2 timelines!"
                return

            } else {
                document.getElementById("loader").style.opacity = 1
                document.getElementById("activeSubmit").style.background = "#932a24"
                this.axios.post(this.baseApi + "timelines/make-active", activeTimelines, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.jwt.token
                    }
                }).then(() => {
                    document.getElementById("loader").style.opacity = 0
                    document.getElementById("activeSubmit").style.background = "#B8352D"
                    this.quitOpenActive(0)
                    window.location.reload()

                }).catch(error => {
                    document.getElementById("loader").style.opacity = 0
                    document.getElementById("activeSubmit").style.background = "#B8352D"
                    this.activeError = error.response.data.message
                    console.log(error)
                })
            }
        },
        quitOpenActive(action){
            if (action == 0){
                this.activeError = ""
                document.getElementById("make-active").style.display = "none"
            } else {
                document.getElementById("make-active").style.display = "block"
            }
        },
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
            this.selected = this.likes
            document.getElementById("1").style.opacity = 0
            document.getElementById("3").style.opacity = 0
            document.getElementById("2").style.opacity = 1
        },
        openTimelines(){
            this.selected = this.timelines
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
        deleteTimeline(timeline){
            if (confirm("Delete " + timeline.id + '?')){
                var timelinesApi = this.baseApi + 'timelines/' + timeline.id
                this.axios.delete(timelinesApi, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.jwt.token
                    },
                })
                .then(() => {
                    var index = this.timelines.indexOf(timeline)
                    if (index > -1){
                        this.timelines.splice(index, 1)
                    }
                    window.location.reload()
                })
                .catch(error =>{
                    console.log(error)
                })
            }
        },
    }
}


</script>

<style scoped lang="sass">
@import '../assets/saas-vars.sass'

#loader
    opacity: 0
    position: absolute
    bottom: 32px
    right: 7%

.active-error
    text-align: center
    color: #B8352D
    margin-bottom: 5px
    margin-top: 13px

.quit
    position: absolute
    top: 0
    padding: 10px
    right: 10px
    cursor: pointer

.fsubmit
    margin: 0 auto
    margin-bottom: 5px

#make-active
    display: none
    position: fixed
    background: $bg-color
    top: 30%
    box-shadow: 0 0 0 1600px rgba(0,0,0,0.65)
    padding: 20px 40px
    box-sizing: border-box
    text-align: left
    font-family: OpenSans-Regular
    border-radius: 20px
    width: 24%
    left: 38%
    &.medium
        width: 44%
        left: 28%
    &.small
        width: 80%
        left: 10%

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

.stats
    font-family: OpenSans-Regular
    text-decoration: none
    font-size: 14px
    color: #14426B

.email
    margin-top: 10px !important
    color: #14426B

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

.tl-router
    text-decoration: none
    color: #303030

.follower-item
    display: inline-block
    margin-left: 5px

.controls
    font-family: Raleway-Regular
    margin-top: 120px
    margin-bottom: 40px
    font-size: 24px
    font-weight: bold
    letter-spacing: 1px
    &.small
        margin-top: 80px
        font-size: 20px

.menu-item
    cursor: pointer
    width: 33%
    display: inline-block

.border
    width: 50%
    margin: 6px auto
    border-bottom: 2px solid #cdcdcd
    opacity: 0
    &.small
        width: 70%

.user-edit
    float: right
    text-align: right
    margin-right: 5%

.edit
    color: #14426B
    margin-left: 10px
    display: inline-block

.views
    cursor: pointer
    color: #7e7e7e
    font-family: OpenSans-Regular
    font-size: 14px
    margin-bottom: 5px

.views-container
    margin-left: 5%
    margin-top: 15px
    display: inline-block

.timeline
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)
    box-sizing: border-box
    padding: 30px 10px
    border-radius: 20px
    display: inline-block
    vertical-align: top
    width: 45%
    margin: 2%
    text-align: left
    &.medium
        width: 46%
        margin: 1%
    &.small
        margin-left: 0
        margin-right: 0
        width: 100%

.follow
    cursor: pointer
    font-family: OpenSans-Regular
    &.large
        position: absolute
        right: 15%
        top: 200px
    &.medium
        position: absolute
        right: 5%
        top: 200px
    &.small
        position: relative
        display: inline-block
        vertical-align: top
        margin-top: 10px

.premium-sign
    border-radius: 5px
    font-family: Raleway-Regular
    text-align: center
    padding: 5px 40px
    letter-spacing: 1px
    font-size: 14px
    background: #ff7f51
    color: white
    &.large
        position: absolute
        right: 15%
        top: 150px
    &.medium
        position: absolute
        right: 5%
        top: 150px
    &.small
        position: relative
        float: right
        margin-right: 5%
        margin-top: 10px

.free
    padding: 5px 50px
    background: #9cafb7

.followers-item
    display: inline-block

.title
    width: 90%
    margin-left: 5%
    font-family: Raleway-Regular
    font-size: 35px
    font-weight: bold

.descr
    width: 90%
    margin-left: 5%
    font-family: OpenSans-Regular
    margin-top: 10px
    height: 70px
    text-align: justify
    overflow: hidden

.image-container
    width: 90%
    margin-top: 20px
    margin-left: 5%

.image
    animation-timing-function: ease-in
    animation: fadein 1s
    border-radius: 5px
    width: 100%
    height: 330px
    object-fit: cover
    &.medium
        height: 280px
    &.small
        height: 240px

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

.username
    color: #7e7e7e
    margin-top: 0px
    font-size: 14px
    margin-left: 5px

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
    display: inline-block
    margin-top: 5px
    margin-bottom: 5px
    color: #14426B
    margin-left: 5px

.s_line
    width: 70%
    float: left
    height: 1px
    background: #cccccc
    margin-top: 15px
    display: inline-block

</style>
