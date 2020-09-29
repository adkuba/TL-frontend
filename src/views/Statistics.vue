<template lang="html">
    <div id="statistics" :class="$mq">
        <h1 :class="$mq">Statistics</h1>
        <span v-if="user">
            <statistics-element v-bind:user="user"></statistics-element>
        </span>
        <span v-for="(timeline, idx) in timelines" :key="idx">
            <statistics-element v-bind:timeline="timeline"></statistics-element>
        </span>
    </div>
</template>

<script lang="js">
import StatisticsElement from '../components/StatisticsElement.vue'

  export default  {
    name: 'Statistics',
    components: {
        StatisticsElement
    },
    metaInfo() {
        return {
            title: 'Statistics',
            titleTemplate: '%s - Tline',
            meta: [
                { name: 'description', content: 'Your account statistics.'},
                { property: 'og:url', content: 'https://www.tline.site/statistics'},
                { property: 'og:title', content: 'Statistics - Tline' },
                { property: 'og:descriprion', content: 'Your account statistics.'},
                { property: 'og:image', content: 'https://storage.googleapis.com/tline-files/statistics.png' },
                { property: 'twitter:card', content: 'summary_large_image'},
                { property: 'twitter:url', content: 'https://www.tline.site/statistics'},
                { property: 'twitter:title', content: 'Statistics - Tline'},
                { property: 'twitter:description', content: 'Your account statistics.'},
                { property: 'twitter:image', content: 'https://storage.googleapis.com/tline-files/statistics.png'}
            ]
        }
    },
    mounted() {
        this.scrollToTop()
    },
    created() {
        if (this.$store.state.jwt.user.username != this.$route.params.id){
            this.$router.push({ name: "home" })
        }
        this.axios.get(this.baseApi + 'users/public/' + this.$route.params.id)
            .then(response => {
                if (response.data){
                    var user = response.data
                    user["viewsCountry"] = null
                    user["viewsDetails"] = null
                    this.user = user
                    if (this.$store.state.jwt.user.subscriptionEnd){
                        this.getStatsForUser(user)
                        this.getViewsForUser(user)
                    }
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
            baseApi: 'https://api.tline.site/api/',
            user: null,
            timelines: [],
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
        getTimelines(){
            var timelineApi = this.baseApi + 'timelines/public/' + this.$route.params.id
            this.axios.get(timelineApi)
                .then(response => {
                    for (var i=0, len=response.data.length; i<len; i++){
                        var timeline = response.data[i]
                        timeline["viewsCountry"] = null
                        timeline["viewsDetails"] = null
                        this.timelines.push(timeline)
                        if (this.$store.state.jwt.user.subscriptionEnd){
                            this.getStatsForTimeline(timeline)
                            this.getViewsForTimeline(timeline)
                        }
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
                var labels = []
                for (var i=0, len=response.data.length; i<len; i++){
                    labels.push(response.data[i].location)
                }
                var data = []
                for (i=0, len=response.data.length; i<len; i++){
                    data.push(response.data[i].number)
                }
                var object = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Views",
                            data: data,
                            backgroundColor: "rgba(1, 116, 188, 0.7)",
                        }
                    ]
                }
                this.timelines[this.timelines.indexOf(timeline)].viewsCountry = object
            })
        },
        getStatsForUser(user){
            this.axios.get(this.baseApi + 'statistics/profile-locations/' + user.username, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                }
            }).then(response => {
                var labels = []
                for (var i=0, len=response.data.length; i<len; i++){
                    labels.push(response.data[i].location)
                }
                var data = []
                for (i=0, len=response.data.length; i<len; i++){
                    data.push(response.data[i].number)
                }
                var object = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Views",
                            data: data,
                            backgroundColor: "rgba(1, 116, 188, 0.7)",
                        }
                    ]
                }
                this.user.viewsCountry = object
            })
        },
        compareDates(date1, date2){
            date1 = new Date(date1)
            date2 = new Date(date2)
            if (date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()){
                return true
            }
            return false
        },
        missingDates(start, end, array){
            var newArray = []
            for (var d = start; d<=end; d.setDate(d.getDate()+1)){
                var filtered = array.filter(a => this.compareDates(a.date, d))
                if (filtered.length > 0){
                    newArray.push(filtered[0])
                } else {
                    var dateObj = new Date(d)
                    var obj = {
                        date: dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate(),
                        number: 0
                    }
                    newArray.push(obj)
                }
            }
            return newArray
        },
        getViewsForTimeline(timeline){
            this.axios.get(this.baseApi + 'statistics/timeline-views/' + timeline.id, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                }
            }).then(response => {
                var parsed = this.missingDates(new Date(timeline.creationDate), new Date(), response.data)
                var labels = []
                for (var i=0, len=parsed.length; i<len; i++){
                    labels.push(parsed[i].date)
                }
                var data = []
                for (i=0, len=parsed.length; i<len; i++){
                    data.push(parsed[i].number)
                }
                var object = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Views",
                            data: data,
                            backgroundColor: "transparent",
                            borderColor: "rgba(1, 116, 188, 0.8)",
                            pointBackgroundColor: "rgba(1, 116, 188, 1)"
                        }
                    ]
                }
                this.timelines[this.timelines.indexOf(timeline)].viewsDetails = object
            })
        },
        getViewsForUser(user){
            this.axios.get(this.baseApi + 'statistics/profile-views/' + user.username, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                }
            }).then(response => {
                var parsed = this.missingDates(new Date(user.creationTime), new Date(), response.data)
                var labels = []
                for (var i=0, len=parsed.length; i<len; i++){
                    labels.push(parsed[i].date)
                }
                var data = []
                for (i=0, len=parsed.length; i<len; i++){
                    data.push(parsed[i].number)
                }
                var object = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Views",
                            data: data,
                            backgroundColor: "transparent",
                            borderColor: "rgba(1, 116, 188, 0.8)",
                            pointBackgroundColor: "rgba(1, 116, 188, 1)"
                        }
                    ]
                }
                this.user.viewsDetails = object
            })
        }
    }
}


</script>

<style scoped lang="sass">

h1
    font-family: Raleway-Regular
    font-size: 40px
    letter-spacing: 1px
    &.small
        margin-left: 3%

#statistics
    margin: 120px auto
    width: 80%
    text-align: left
    &.medium
        width: 95%
        margin: 110px auto
    &.small
        width: 100%
        margin: 100px auto

</style>