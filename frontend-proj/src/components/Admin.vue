<template lang="html">
    <div class="admin">
        <div v-if="$store.state.jwt.user.roles.includes('ROLE_ADMIN')">
            JESTES ADMINEM
            <div class="stats">
                <h1>Stats</h1>
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
                <h1>Timelines</h1>
                <div v-for="(timeline, idx) in allTimelines" :key="idx">
                    <router-link :to="{ path: 'timeline/' + timeline.id }" class="router">
                        Title: {{ timeline.id }} Views: {{ timeline.views }} Likes: {{ timeline.likes.length }} Trending: {{ timeline.trendingViews }} User: {{ timeline.user.email }}
                    </router-link>
                    <div v-on:click="deleteTimeline(timeline)" class="del">DELETE</div>
                </div>
            </div>
            <div class="users">
                <h1>Users</h1>
                <div v-bind:class="{blocked: user.blocked}" v-for="(user, idx) in allUsers" :key="idx">
                    <router-link :to="{ path: 'profile/' + user.username }" class="router">
                        Username: {{ user.username }} Email: {{ user.email }} Creation: {{ user.creationTime }} Followers: {{ user.followers.filter(e => e.userId != null).length }}
                    </router-link>
                    <div class="del" v-on:click="deleteUser(user)">DELETE</div>
                    <div class="del" v-on:click="deleteUserTimelines(user)"> DELETE USER TIMELINES</div>
                    <div class="del" v-on:click="blockUser(user)">BLOCK</div>
                </div>
            </div>
            <div class="timelines">
                <h1>Reported timelines</h1>
                <div v-for="(timeline, idx) in reportedTimelines" :key="idx">
                    <router-link :to="{ path: 'timeline/' + timeline.id }" class="router">
                        Title: {{ timeline.id }} Views: {{ timeline.views }} Likes: {{ timeline.likes.length }} Trending: {{ timeline.trendingViews }} User: {{ timeline.user.email }} 
                    </router-link>
                    <div v-on:click="deleteTimeline(timeline)" class="del">DELETE</div>
                    <div v-on:click="unReportTimeline(timeline)" class="del">UNREPORT</div>
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

        this.axios.get(this.baseApi + 'timelines/get-reported', {
            headers: {
                'Authorization': 'Bearer ' + this.$store.state.jwt.token
            }
        })
        .then(response => {
            this.reportedTimelines = response.data
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
          allUsers: [],
          reportedTimelines: []
      }
    },
    methods: {
        deleteTimeline(timeline){
            if (confirm("Delete " + timeline.id + '?')){
                var timelinesApi = this.baseApi + 'timelines/' + timeline.id
                this.axios.delete(timelinesApi, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.jwt.token
                    },
                })
                .then(() => {
                    window.location.reload()
                })
                .catch(error =>{
                    console.log(error)
                })
            }
        },
        deleteUser(user){
            if (confirm("Delete " + user.username + "?")){
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
            }
        },
        deleteUserTimelines(user){
            if (confirm("Delete all " + user.username + ' timelines?')){
                this.axios.delete(this.baseApi + 'timelines?username=' + user.username, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.jwt.token
                    },
                })
                .then(() => {
                    window.location.reload()
                })
                .catch(error => {
                    console.log(error)
                })
            }
        },
        blockUser(user){
            if (confirm("Block " + user.username + '? Will delete all his timelines.')){
                this.deleteUserTimelines(user)
                this.axios.post(this.baseApi + "users/block?username=" + user.username, null, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.jwt.token
                    },
                })
                .then(() => {
                    window.location.reload()
                })
                .catch(error => {
                    console.log(error)
                })
            }
        },
        unReportTimeline(timeline){
            if (confirm("Unblock " + timeline.id + "?")){
                this.axios.post(this.baseApi + 'timelines/un-report?id=' + timeline.id, null, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.jwt.token
                    },
                })
                .then(() => {
                    window.location.reload()
                })
                .catch(error => {
                    console.log(error)
                })
            }
        }
    }
}


</script>

<style scoped lang="sass">

.blocked
    opacity: 0.3

.router
    text-decoration: none
    color: #303030

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
    cursor: pointer
    margin-right: 30px

</style>
