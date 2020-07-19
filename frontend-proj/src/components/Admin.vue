<template lang="html">
    <div class="admin">
        <div v-if="$store.state.jwt.user.roles.includes('ROLE_ADMIN')">
            JESTES ADMINEM
            <div class="stats">
                <h1>Stats</h1>
                <p class="download" v-on:click="download(allStats, 'stats.csv')">Download</p>
                <div v-for="(stat, idx) in allStats" :key="idx">
                    Day: {{ stat.day }} mainPageViews: {{ stat.mainPageViews }} newUsers: {{ stat.numberOfUsers }} totalTimelinesViews: {{ stat.totalTimelinesViews }} activeUsers(updates next day): {{ stat.activeUsers }}
                    <div class="reviews">
                        <div v-for="(review, index) in stat.reviews" :key="index">
                            Day: {{ stat.day }} Username {{ review.username }} Opinion: {{ review.opinion }}
                        </div>
                    </div>
                </div>
                <LineChart v-if="allStatObject" :chartdata="allStatObject" :options="viewsOptions" class="stat-chart"/>
            </div>
            <div class="timelines">
                <h1>Timelines</h1>
                <p class="download" v-on:click="download(allTimelines, 'timelines.csv')">Download</p>
                <div v-for="(timeline, idx) in allTimelines" :key="idx">
                    <router-link :to="{ path: 'timeline/' + timeline.id }" class="router">
                        Title: {{ timeline.id }} Views: {{ timeline.views }} Likes: {{ timeline.likes.length }} Trending: {{ timeline.trendingViews }} User: {{ timeline.user.email }}
                    </router-link>
                    <div v-on:click="deleteTimeline(timeline)" class="del">DELETE</div>
                </div>
            </div>
            <div class="users">
                <h1>Users</h1>
                <p class="download" v-on:click="download(allUsers, 'users.csv')">Download</p>
                <div v-bind:class="{blocked: user.blocked}" v-for="(user, idx) in allUsers" :key="idx">
                    <router-link :to="{ path: 'profile/' + user.username }" class="router">
                        Username: {{ user.username }} Email: {{ user.email }} Creation: {{ user.creationTime }} Followers: {{ user.followers.filter(e => e.userId != null).length }}
                    </router-link>
                    <div class="del" v-on:click="deleteUser(user)">DELETE</div>
                    <div class="del" v-on:click="blockUser(user)" v-if="!user.blocked">BLOCK</div>
                    <div class="del" v-on:click="unBlockUser(user)" v-if="user.blocked">UNBLOCK</div>
                </div>
            </div>
            <div class="timelines">
                <h1>Reported timelines</h1>
                <p class="download" v-on:click="download(reportedTimelines, 'reported-timelines.csv')">Download</p>
                <div v-for="(timeline, idx) in reportedTimelines" :key="idx">
                    <router-link :to="{ path: 'timeline/' + timeline.id }" class="router">
                        Title: {{ timeline.id }} Views: {{ timeline.views }} Likes: {{ timeline.likes.length }} Trending: {{ timeline.trendingViews }} User: {{ timeline.user.email }} 
                    </router-link>
                    <div v-on:click="deleteTimeline(timeline)" class="del">DELETE</div>
                    <div v-on:click="unReportTimeline(timeline)" class="del">UNREPORT</div>
                </div>
            </div>
            <div class="devices">
                <h1>Devices</h1>
                <p>No duplicates - there can be multiple views by the same device.</p>
                <p>Detailed info about all views and related devices in "statistics.devices" or chart below!</p>
                <p class="download" v-on:click="download(allDevices, 'devices.csv')">Download</p>
                <div v-for="(device, idx) in allDevices" :key="idx">
                     Device details: {{ device.deviceDetails }} Location: {{ device.location }} Username: {{ device.username }} LastLogin: {{ device.lastLogged }}
                </div>
                <BarChart v-if="locationStat" :chartdata="locationStat" :options="viewsOptions" class="stat-chart"/>
            </div>
        </div>
        <div v-else>
            NIE JESTES ADMINEM
        </div>
    </div>
</template>

<script lang="js">
import LineChart from './LineChart.vue'
import BarChart from './BarChart.vue'

  export default  {
    name: 'Admin',
    components: {
        LineChart,
        BarChart
    },
    created () {
        this.axios.get(this.baseApi + 'statistics/all', {
            headers: {
                'Authorization': 'Bearer ' + this.$store.state.jwt.token
            }
        })
        .then(response => {
            this.allStats = response.data

            var labels = []
            for (var i=0, len=response.data.length; i<len; i++){
                labels.push(response.data[i].day)
            }
            var mainPageViews = []
            for (i=0, len=response.data.length; i<len; i++){
                mainPageViews.push(response.data[i].mainPageViews)
            }
            var newUsers = []
            for (i=0, len=response.data.length; i<len; i++){
                newUsers.push(response.data[i].numberOfUsers)
            }
            var timelineViews = []
            for (i=0, len=response.data.length; i<len; i++){
                timelineViews.push(response.data[i].totalTimelinesViews)
            }
            var activeUsers = []
            for (i=0, len=response.data.length; i<len; i++){
                activeUsers.push(response.data[i].activeUsers)
            }

            var object = {
                labels: labels,
                datasets: [
                    {
                        label: "Main-Page-Views",
                        data: mainPageViews,
                        backgroundColor: "transparent",
                        borderColor: "rgba(1, 116, 188, 0.8)",
                        pointBackgroundColor: "rgba(1, 116, 188, 1)"
                    },
                    {
                        label: "New-Users",
                        data: newUsers,
                        backgroundColor: "transparent",
                        borderColor: "rgba(100, 116, 188, 0.8)",
                        pointBackgroundColor: "rgba(100, 116, 188, 1)"
                    },
                    {
                        label: "Timeline-Views",
                        data: timelineViews,
                        backgroundColor: "transparent",
                        borderColor: "rgba(200, 116, 188, 0.8)",
                        pointBackgroundColor: "rgba(200, 116, 188, 1)"
                    },
                    {
                        label: "Active-Users",
                        data: activeUsers,
                        backgroundColor: "transparent",
                        borderColor: "rgba(1, 200, 188, 0.8)",
                        pointBackgroundColor: "rgba(1, 200, 188, 1)"
                    }
                ]
            }
            this.allStatObject = object
        })
        .catch(error => {
            console.log(error)
        })

        this.axios.get(this.baseApi + 'statistics/all-devices', {
            headers: {
                'Authorization': 'Bearer ' + this.$store.state.jwt.token
            }
        })
        .then(response => {
            this.allDevices = response.data
            this.createLocations()
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
        allStatObject: null,
        allUsers: [],
        allDevices: [],
        reportedTimelines: [],
        locationStat: null,
        viewsOptions: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                }],
            } 
        }
      }
    },
    methods: {
        createLocations(){
            var allDevicesArray = []
            for (var i=0, len=this.allStats.length; i<len; i++){
                allDevicesArray = allDevicesArray.concat(this.allStats[i].devices)
            }
            var allDevicesSet = [...new Set(allDevicesArray)]
            var labels = []
            var data = []
            for(i=0, len=allDevicesSet.length; i<len; i++){
                labels.push(this.allDevices.filter(e => e.id === allDevicesSet[i])[0].location)
                const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
                data.push(countOccurrences(allDevicesArray, allDevicesSet[i]))
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
            this.locationStat = object
        },
        download(array, name){
            var parsedArray = []
            for (var i=0, len=array.length; i<len; i++){
                parsedArray.push([ Object.keys(array[i]).map((key) => {
                    if (array[i][key] != null){
                        if (!Array.isArray(array[i][key])){
                            return array[i][key].toString().split(",").join("")
                        } else {
                            return "Array-not-parsed-len: " + array[i][key].length
                        }
                    } else {
                        return array[i][key]
                    }
                })])
            }
            let csvContent = "data:text/csv;charset=utf-8," + parsedArray.map(e => e.join(",")).join("\n")
            var encodedUri = encodeURI(csvContent)
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", name);
            document.body.appendChild(link); // Required for FF
            link.click()
        },
        deleteTimeline(timeline){
            if (confirm("Delete " + timeline.id + '?')){
                var reason = window.prompt("Why you are deleting this timeline?")
                var timelinesApi = this.baseApi + 'timelines/' + timeline.id + "?reason=" + reason
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
        deleteUserTimelines(user){
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
        },
        deleteUser(user){
            if (confirm("Delete " + user.username + "? Warning email notification is not send")){
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
        blockUser(user){
            if (confirm("Block " + user.username + '? Will delete all his timelines.')){
                this.deleteUserTimelines(user)
                var reason = window.prompt("Why you are blocking user?")
                this.axios.post(this.baseApi + "users/block?username=" + user.username + "&reason=" + reason, null, {
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
        unBlockUser(user){
            if (confirm("Unblock " + user.username + '?')){
                this.axios.post(this.baseApi + "users/unblock?username=" + user.username, null, {
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
.stat-chart
    margin-top: 50px
    margin-bottom: 80px

.download
    cursor: pointer
    color: #14426B

.blocked
    opacity: 0.3

.router
    text-decoration: none
    color: #303030

.stats
    width: 80%
    text-align: left
    margin: 50px auto

.devices
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
