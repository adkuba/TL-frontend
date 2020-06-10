<template lang="html">
    <div class="admin">
        <div v-if="$store.state.jwt.roles.includes('ROLE_ADMIN')">
            JESTES ADMINEM
            <div class="stats">
                <div v-for="(stat, idx) in allStats" :key="idx">
                Day: {{ stat.day }} mainPageViews: {{ stat.mainPageViews }} numberOfUsers: {{ stat.numberOfUsers }} totalTimelinesViews: {{ stat.totalTimelinesViews }}
                </div>
            </div>
            <div class="timelines">
                <div v-for="(timeline, idx) in allTimelines" :key="idx">
                    Title: {{ timeline.id }} Views: {{ timeline.views }} Trending: {{ timeline.trendingViews }} User: {{ timeline.user.email }} <div v-on:click="deleteTimeline(timeline)" class="del">DELETE</div>
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
    },
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          allTimelines: [],
          allStats: []
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
        }
    }
}


</script>

<style scoped lang="sass">
.stats
    margin-top: 50px

.timelines
    margin-top: 50px

.admin
    font-family: OpenSans-Regular
    margin-top: 60px

.del
    display: inline-block
    color: red

</style>
