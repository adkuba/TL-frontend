<template lang="html">
    <div class="admin">
        <div v-if="$store.state.jwt.user.roles.includes('ROLE_ADMIN')">
            JESTES ADMINEM
            <div class="stats">
                <div v-for="(stat, idx) in allStats" :key="idx">
                    Day: {{ stat.day }} mainPageViews: {{ stat.mainPageViews }} numberOfUsers: {{ stat.numberOfUsers }} totalTimelinesViews: {{ stat.totalTimelinesViews }}
                    <div class="reviews">
                        <div v-for="(review, index) in stat.reviews" :key="index">
                            Username {{ review.username }} Opinion: {{ review.opinion }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="timelines">
                <div v-for="(timeline, idx) in allTimelines" :key="idx">
                    Title: {{ timeline.id }} Views: {{ timeline.views }} Likes: {{ timeline.likes.length }} Trending: {{ timeline.trendingViews }} User: {{ timeline.user.email }} <div v-on:click="deleteTimeline(timeline)" class="del">DELETE</div>
                </div>
            </div>
            <div class="users">
                <div v-for="(user, idx) in allUsers" :key="idx">
                    Username: {{ user.username }} Email: {{ user.email }} Creation: {{ user.creationTime }} Followers: {{ user.followers.filter(e => e.userId != null).length }} <div class="del" v-on:click="deleteUser(user)">DELETE</div>
                </div>
            </div>
        </div>
        <div v-else>
            NIE JESTES ADMINEM
        </div>
    </div>
</template>

<script lang="js">

  export default  {
    name: 'Admin',
    created () {
        this.axios.get(this.baseApi + 'statistics/all', {
            headers: {
                'Authorization': 'Bearer ' + this.$store.state.jwt.token
            }
        })
        .then(response => {
            this.allStats = response.data
        })
        .catch(error => {
            console.log(error)
        })

        this.axios.get(this.baseApi + 'timelines/all', {
            headers: {
                'Authorization': 'Bearer ' + this.$store.state.jwt.token
            }
        })
        .then(response => {
            this.allTimelines = response.data
        })
        .catch(error => {
            console.log(error)
        })

        this.axios.get(this.baseApi + 'users/all', {
            headers: {
                'Authorization': 'Bearer ' + this.$store.state.jwt.token
            }
        })
        .then(response => {
            this.allUsers = response.data
        })
        .catch(error => {
            console.log(error)
        })
    },
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          allTimelines: [],
          allStats: [],
          allUsers: []
      }
    },
    methods: {
        deleteTimeline(timeline){
            var timelinesApi = this.baseApi + 'timelines/' + timeline.id
            this.axios.delete(timelinesApi, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                },
            })
            .then(() => {
                var index = this.allTimelines.indexOf(timeline)
                if (index > -1){
                    this.allTimelines.splice(index, 1)
                }
            })
            .catch(error =>{
                console.log(error)
            })
        },
        deleteUser(user){
            var usersApi = this.baseApi + 'users/' + user.username
            this.axios.delete(usersApi, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                },
            })
            .then(() => {
                var index = this.allUsers.indexOf(user)
                if (index > -1){
                    this.allUsers.splice(index, 1)
                }
            })
            .catch(error =>{
                console.log(error)
            })
        },
    }
}


</script>

<style scoped lang="sass">
.stats
    width: 80%
    text-align: left
    margin: 50px auto

.reviews
    margin-left: 30px

.timelines
    width: 80%
    text-align: left
    margin: 50px auto

.users
    width: 80%
    text-align: left
    margin: 50px auto

.admin
    font-family: OpenSans-Regular
    margin-top: 60px

.del
    display: inline-block
    color: red

</style>
