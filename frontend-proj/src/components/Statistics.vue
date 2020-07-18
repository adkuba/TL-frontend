<template lang="html">
    <div id="statistics">
        <h1>Statistics</h1>
        <div class="element" v-if="user">
            <h1 class="title">Profile</h1>
            Number of your likes: {{ user.likes.length }}
            Followers: {{ user.followers.filter(e => e.userId != null).length }}
            You are following: {{ user.followers.length - user.followers.filter(e => e.userId != null).length }} users
        </div>
        <div class="element" v-for="(timeline, idx) in timelines" :key="idx">
            <h1 class="title">Timeline</h1>
            id: {{ timeline.id }}
            creationDate: {{ timeline.creationDate }} <br>
            likes: {{ timeline.likes.length }}
            premiumViews: {{ timeline.premiumViews }}
            last 2 Days: {{ timeline.trendingViews }}
            views: {{ timeline.views }}

            <br><br>
            VIEWS CHART ONLY FOR PREMIUM
            <div v-on:click="getViewsForTimeline(timeline)">get Details (click)</div>
            <div v-if="timeline.viewsDetails">
                <div v-for="(view, index) in timeline.viewsDetails" :key="index">
                    {{ view.date }} number: {{ view.number }}
                </div>
            </div>
            VIEWS DETAILS ONLY FOR PREMIUM
            <div v-on:click="getStatsForTimeline(timeline)">get Details (click)</div>
            <div v-if="timeline.viewsCountry">
                <div v-for="(country, index) in timeline.viewsCountry" :key="index">
                    {{ country.location }} number: {{ country.number }}
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="js">

  export default  {
    name: 'Statistics',
    created() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        if (this.$store.state.jwt.user.username != this.$route.params.id){
            this.$router.push({ name: "home" })
        }
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
          user: null,
          timelines: [],
      }
    },
    methods: {
        getTimelines(){
            var timelineApi = this.baseApi + 'timelines/public/' + this.$route.params.id
            this.axios.get(timelineApi)
                .then(response => {
                    for (var i=0, len=response.data.length; i<len; i++){
                        var timeline = response.data[i]
                        timeline["viewsCountry"] = null
                        timeline["viewsDetails"] = null
                        this.timelines.push(timeline)
                    }
                }).catch(err => {
                    console.log(err)
                })
        },
        getStatsForTimeline(timeline){
            this.axios.get(this.baseApi + 'statistics/timeline/' + timeline.id, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                }
            }).then(response => {
                this.timelines[this.timelines.indexOf(timeline)].viewsCountry = response.data
            })
        },
        getViewsForTimeline(timeline){
            this.axios.get(this.baseApi + 'statistics/timeline-views/' + timeline.id, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                }
            }).then(response => {
                this.timelines[this.timelines.indexOf(timeline)].viewsDetails = response.data
            })
        }
    }
}


</script>

<style scoped lang="sass">

#statistics
    margin: 120px auto
    width: 80%
    text-align: left

.element
    margin-top: 70px
    padding: 5px 35px
    padding-bottom: 30px
    border-radius: 20px
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)

h1
    font-family: Raleway-Regular
    font-size: 40px
    letter-spacing: 1px

.title
    font-size: 30px

</style>
