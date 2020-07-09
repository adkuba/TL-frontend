<template lang="html">
    <div id="profile" :class="$mq">
        <div v-if="user" class="user" :class="$mq">
            <h1 v-if="user.fullName">{{ user.fullName }}</h1>
            <h1 v-else>New User</h1>
            <p class="username">@{{ user.username }} {{ user.email }}</p>
            <p class="username" v-if="user.subscriptionEnd">TO JEST USER PREMIUM</p>
            <div class="follow" :class="$mq" v-if="$store.state.jwt">
                <div class="follower-item" v-on:click="follow()" v-if="$store.state.jwt.user.followers.filter(e => e.follow === user.username).length == 0">Follow </div>
                <div class="follower-item" v-on:click="follow()" v-else>Unfollow</div>
                <div class="follower-item" v-on:click="openDetails(user.followers.filter(e => e.userId != null))">&middot; {{ user.followers.filter(e => e.userId != null).length }}</div>
            </div>
            <div v-else class="follow" :class="$mq">
                <div class="follower-item" :class="$mq">Login to follow &middot; {{ user.followers.filter(e => e.userId != null).length }}</div>
            </div>
        </div>
        <div class="controls" :class="$mq">
            <div class="menu-item" :class="$mq" v-on:click="openTimelines()">Timelines <div id="1" class="border" :class="$mq"></div></div>
            <div class="menu-item" :class="$mq" v-on:click="openLikes()">Likes <div id="2" class="border" :class="$mq"></div></div>
            <div class="menu-item" :class="$mq" v-on:click="openFollowing()">Following <div id="3" class="border" :class="$mq"></div></div>
        </div>
        <div class="timelines-container" v-if="selected && selected[0] && selected[0].id" :class="$mq">
            <div class="timeline" v-for="(timeline, index) in selected" :key="index" v-bind:class="[{ shadow: !timeline.active}, $mq]" >
                <router-link :to="{ path: '/timeline/' + timeline.id }" class="tl-router">
                    <div class="title">{{ timeline.descriptionTitle }}</div>
                    <div class="descr">{{ timeline.description.substring(0, 150) }}...</div>
                    <div class="image-container" v-if="timeline.pictures.length > 0">
                        <img class="image" :src="timeline.pictures[0]">
                    </div>
                </router-link>
                <div class="views-container">
                    <div class="views" v-on:click="openDetails(timeline.likes)">{{ timeline.views }} views &middot; {{ timeline.likes.length }} likes</div>
                    <div class="views">{{timeline.creationDate}} &middot; &#8593;{{ timeline.trendingViews }}</div>
                </div>
                <div class="views-container user-edit">
                    <div class="views" v-if="$store.state.jwt && $store.state.jwt.user.username == timeline.user.username">+{{ timeline.premiumViews }}</div>
                    <div class="views" v-if="$store.state.jwt && $store.state.jwt.user.username == timeline.user.username">
                        <router-link style="text-decoration: none" :to="{ path: '/editorLoader/' + timeline.id }" class="edit">Edit</router-link>
                        <div class="edit">&middot;</div>
                        <div class="edit" v-on:click="deleteTimeline(timeline)">Delete</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fusers-container" v-if="selected && selected[0] && selected[0].email">
            <router-link :to="{ path: '/profile/' + fuser.username }" class="fusers" v-for="(fuser, idx) in selected" :key="idx">
                <div v-if="fuser.fullName" class="fuser-name">{{ fuser.fullName }}</div>
                <div v-else class="fuser-name">New User</div>
                <div class="fuser-desc">@{{ fuser.username }} &middot; {{ fuser.followers.filter(e => e.userId != null).length }} followers</div>
            </router-link>
        </div>
        <div id="details">
            Users:
            <div class="exit" v-on:click="closeDetails()">x</div>
            <div v-for="(detail, index) in details" :key="index">
                @{{ detail.userId }}
            </div>
        </div>
    </div>
</template>

<script lang="js">

  export default  {
    name: 'Profile',
    created () {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        this.axios.get(this.baseApi + 'users/public/' + this.$route.params.id)
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
    watch: {
        '$route.params.id': function(){
            window.location.reload()
        }
    },
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          timelines: null,
          user: null,
          likes: [],
          selected: null,
          details: [{username: 'kuba'}]
      }
    },
    methods: {
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
        openDetails(array){
            this.details = array
            document.getElementById('details').style.display = "block"
        },
        closeDetails(){
            this.details = null
            document.getElementById('details').style.display = "none"
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
    margin-top: 140px
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

#details
    position: fixed
    top: 20%
    left: 40%
    width: 20%
    padding: 20px
    box-sizing: border-box
    font-family: OpenSans-Regular
    border-radius: 10px
    text-align: left
    background: white
    display: none
    box-shadow: 0 0 0 1600px rgba(0,0,0,0.65)

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
    &.small
        margin-left: 0
        margin-right: 0
        width: 100%

.follow
    cursor: pointer
    font-family: OpenSans-Regular
    &.large
        position: absolute
        right: 20%
        top: 165px
    &.medium
        position: absolute
        right: 5%
        top: 165px
    &.small
        position: relative
        margin-top: 20px
        margin-left: -2px

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

.image-container
    width: 90%
    margin-top: 20px
    margin-left: 5%

.image
    border-radius: 5px
    width: 100%
    max-height: 350px

.user
    text-align: left
    margin-top: 120px

h1
    margin-bottom: 0
    font-family: Raleway-Regular
    font-size: 45px

.username
    color: #7e7e7e
    margin-bottom: 0
    margin-top: 5px

#profile
    width: 70%
    margin-left: 15%
    padding-bottom: 500px
    &.medium
        margin-left: 5%
        width: 90%
    &.small
        margin-left: 5%
        width: 90%

.email
    display: inline-block
    margin-top: 5px
    margin-bottom: 5px
    color: #14426B

.s_line
    width: 70%
    float: left
    height: 1px
    background: #cccccc
    margin-top: 15px
    display: inline-block

</style>
