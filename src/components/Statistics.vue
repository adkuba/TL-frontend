<template lang="html">
    <div id="statistics" :class="$mq">
        <h1 :class="$mq">Statistics</h1>
        <div class="element" v-if="user" :class="$mq">
            <h1 class="title" :class="$mq">Profile</h1>
            <p class="timeline-id" :class="$mq">{{ user.username }}</p>
            <div class="left" :class="$mq">
                <div class="daneh">Creation date</div><div class="dane">{{ user.creationTime }}</div>
                <div class="daneh">Followers</div><div class="dane">{{ user.followers.filter(e => e.userId != null).length }}</div>
                
                <div class="daneh">
                    Following
                    <div class="desc">You are following</div>
                </div>
                <div class="dane">{{ user.followers.length - user.followers.filter(e => e.userId != null).length }}</div>
                
                <div class="daneh">
                    Your likes
                    <div class="desc">You are liking</div>
                </div>
                <div class="dane">{{ user.likes.length }}</div>
                
                <div class="daneh">
                    Views
                    <div class="desc">Views on your profile</div>
                </div>
                <div class="dane">{{ user.profileViewsNumber }}</div>
                <div class="controler" :class="$mq">
                    <div class="item" v-on:click="switchChart(1)">Views</div>
                    <div class="item" style="cursor: default">&middot;</div>
                    <div class="item" v-on:click="switchChart(2)">Location</div>
                    <div class="desc">Click to change charts</div>
                </div>
            </div>
            <div class="right" :class="$mq">
                <div v-if="!$store.state.jwt.user.subscriptionEnd" class="normal-info">
                    More detailed charts only for premum users. Subscribe to see more.
                </div>
                <div v-else>
                    <div v-if="chart==1 && user.viewsDetails" class="chart-wrapper">
                        <LineChart :chartdata="user.viewsDetails" :options="viewsOptions" class="line-container" :style="{'width': (user.viewsDetails.labels.length * 80) + 'px'}"/>
                        </div>
                    <div v-if="chart==2 && user.viewsCountry" class="chart-wrapper">
                        <BarChart :chartdata="user.viewsCountry" :options="viewsOptions" class="line-container" :style="{'width': (user.viewsCountry.labels.length * 150) + 'px'}"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="element" v-for="(timeline, idx) in timelines" :key="idx" :class="$mq">
            <h1 class="title" :class="$mq">Timeline</h1>
            <p class="timeline-id" :class="$mq">{{ timeline.id }}</p>
            <div class="left" :class="$mq">
                <div class="daneh">Creation date</div><div class="dane">{{ timeline.creationDate }}</div>
                <div class="daneh">Likes</div><div class="dane">{{ timeline.likes.length }}</div>
                
                <div class="daneh">
                    Premium views
                    <div class="desc">Number of views in premium section</div>
                </div>
                <div class="dane">+{{ timeline.premiumViews }}</div>
                
                <div class="daneh">
                    Last 48h views
                    <div class="desc">Trending criterium</div>
                </div>
                <div class="dane">&#8593;{{ timeline.trendingViews }}</div>
                
                <div class="daneh">Views</div><div class="dane">{{ timeline.views }}</div>
                <div class="controler" :class="$mq">
                    <div class="item" v-on:click="switchChart(1)">Views</div>
                    <div class="item" style="cursor: default">&middot;</div>
                    <div class="item" v-on:click="switchChart(2)">Location</div>
                    <div class="desc">Click to change charts</div>
                </div>
            </div>
            <div class="right" :class="$mq">
                <div v-if="!$store.state.jwt.user.subscriptionEnd" class="normal-info">
                    More detailed charts only for premum users. Subscribe to see more.
                </div>
                <div v-else>
                    <div v-if="chart==1 && timeline.viewsDetails" class="chart-wrapper">
                        <LineChart :chartdata="timeline.viewsDetails" :options="viewsOptions" class="line-container" :style="{'width': (timeline.viewsDetails.labels.length * 80) + 'px'}"/>
                        </div>
                    <div v-if="chart==2 && timeline.viewsCountry" class="chart-wrapper">
                        <BarChart :chartdata="timeline.viewsCountry" :options="viewsOptions" class="line-container" :style="{'width': (timeline.viewsCountry.labels.length * 150) + 'px'}"/>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="js">
import LineChart from './LineChart.vue'
import BarChart from './BarChart'


  export default  {
    name: 'Statistics',
    components: {
        LineChart,
        BarChart
    },
    metaInfo() {
        return {
            title: 'Statistics',
            titleTemplate: '%s - Tline',
            content: 'Explore new way to present your content based on timeline.'
        }
    },
    created() {
        this.scrollToTop()
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
            chart: 1,
            viewsOptions: {
                responsive: true,
                maintainAspectRatio: false,
                responsiveAnimationDuration: 800, 
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                    }],
                    xAxes: [{
                        ticks: {
                            maxRotation: 90
                        }
                    }]   
                } 
            }
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
        switchChart(index){
            this.chart = index
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

.chart-wrapper
    width: 100% 
    overflow-x: auto

.chart-wrapper::-webkit-scrollbar
    height: 7px

.chart-wrapper::-webkit-scrollbar-track
    background: #e7e7e7
    border-radius: 5px

.chart-wrapper::-webkit-scrollbar-thumb
    background: #c0c0c0
    border-radius: 5px

.chart-wrapper::-webkit-scrollbar-thumb:hover
    background: #a3a3a3

.normal-info
    text-align: center
    padding: 145px 5%
    border: 1px solid #d8d8d8
    border-radius: 7px

.line-container
    height: 310px
    min-width: 100%

.controler
    user-select: none
    margin-top: 40px
    &.medium
        margin-top: 20px
    &.small
        margin-top: 20px

.item
    display: inline-block
    margin-right: 20px
    cursor: pointer

.desc
    font-size: 13px
    color: #7e7e7e
    margin-top: -3px

.daneh
    display: inline-block
    width: 50%
    margin-bottom: 15px

.dane
    color: #14426B
    vertical-align: top
    display: inline-block
    width: 50%
    text-align: right

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

.element
    font-family: OpenSans-Regular
    margin-top: 70px
    padding-bottom: 30px
    border-radius: 20px
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)
    &.medium
        margin-top: 60px
    &.small
        margin-top: 50px

.left
    vertical-align: top
    width: 25%
    margin: 0 5%
    display: inline-block
    margin-bottom: 20px
    &.medium
        margin: 0 3%
        width: 33%
    &.small
        display: block
        width: 90%

.right
    vertical-align: top
    width: 60%
    display: inline-block
    margin-right: 5%
    &.medium
        margin-right: 1%
    &.small
        display: block
        width: 98%
        margin-left: 1%
        margin-right: 1%
        margin-top: 50px

h1
    font-family: Raleway-Regular
    font-size: 40px
    letter-spacing: 1px
    &.small
        margin-left: 3%

.title
    margin-left: 5%
    padding-top: 30px
    margin-bottom: 0
    font-size: 33px
    &.medium
        margin-left: 3%
    &.small
        margin-left: 5%

.timeline-id
    margin-left: 5%
    margin-bottom: 40px
    margin-top: 5px
    font-size: 14px
    color: #7e7e7e
    &.medium
        margin-left: 3%
    &.small
        margin-left: 5%

</style>
