<template lang="html">
    <div id="profile">
        <div v-if="user" class="user">
            <h1>{{ user.fullName }}</h1>
            <p class="username">@{{ user.username }} {{ user.creationTime }}</p>
            <p class="email">{{ user.email }}</p>
            <div class="follow" v-if="$store.state.jwt">
                <div v-on:click="follow()" v-if="$store.state.jwt.user.followers.filter(e => e.follow === user.username).length == 0">Follow</div>
                <div v-on:click="follow()" v-else>Unfollow</div>
                <div class="number-followers" v-on:click="openDetails(user.followers.filter(e => e.userId != null))">{{ user.followers.filter(e => e.userId != null).length }}</div>
            </div>
            <div v-else>Login to follow</div>
        </div>
        <div class="s_line"></div>
        <div class="timeline" v-for="(timeline, index) in timelines" :key="index">
            <div class="title">{{ timeline.descriptionTitle }}</div>
            <div class="descr">{{ timeline.description.substring(0, 150) }}...</div>
            <div class="image-container" v-if="timeline.pictures.length > 0">
                <img class="image" :src="timeline.pictures[0]">
            </div>
        </div>
        <div id="details">
            Users:
            <div class="exit" v-on:click="closeDetails()">x</div>
            <div v-for="(detail, index) in details" :key="index">
                {{ detail.userId }}
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
                    this.getTimelines()
                } else {
                    this.$router.push( {path: "/"} )
                }
            }).catch(error => {
                console.log(error)
            })
    },
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          timelines: null,
          user: null,
          details: [{username: 'kuba'}]
      }
    },
    methods: {
        getTimelines(){
            var timelineApi = this.baseApi + 'timelines/public/' + this.$route.params.id
            this.axios.get(timelineApi)
                .then(response => {
                    this.timelines = response.data
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
        }
    }
}


</script>

<style scoped lang="sass">
.exit
    position: absolute
    top: 10px
    right: 20px

#details
    position: fixed
    top: 40%
    left: 50%
    transform: translateX(-50%) translateY(-50%)
    width: 20%
    background: white
    display: none
    box-shadow: 0 0 0 1600px rgba(0,0,0,0.65)

.timeline
    margin-top: 100px
    display: inline-block
    width: 50%
    float: left
    text-align: left

.follow
    cursor: pointer
    display: inline-block
    float: right
    font-family: OpenSans-Regular

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
    width: 100%
    max-height: 350px

.user
    text-align: left
    margin-top: 120px

h1
    font-family: Raleway-Regular
    font-size: 45px

.username
    color: #7e7e7e
    margin-bottom: 0

#profile
    width: 60%
    margin-left: 20%
    padding-bottom: 500px

.email
    display: inline-block
    margin-top: 5px
    color: #14426B

.s_line
    width: 100%
    height: 1px
    background: #cccccc
    margin-top: 40px
    display: inline-block

</style>
