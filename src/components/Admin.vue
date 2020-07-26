<template lang="html">
    <div class="admin">
        <div v-if="$store.state.jwt.user.roles.includes('ROLE_ADMIN')">
            JESTES ADMINEM
            <div class="stats" :class="$mq">
                <h1>Stats</h1>
                <p class="download" v-on:click="download(allStats, 'stats.csv')">Download</p>
                <div class="container">
                    <div class="data" v-for="(stat, idx) in allStats" :key="idx">
                        Day: {{ stat.day }} Views(home, timeline, profile): {{ stat.mainPageViews }}+{{ stat.totalTimelinesViews }}+{{ stat.profileViews }}={{ stat.profileViews + stat.totalTimelinesViews + stat.mainPageViews }}  newUsers: {{ stat.numberOfUsers }} activeUsers: {{ stat.activeUsers }}
                    </div>
                </div>
                <LineChart v-if="allStatObject" :chartdata="allStatObject" :options="viewsOptions" class="stat-chart"/>
            </div>
            <div class="timelines" :class="$mq">
                <h1>Timelines</h1>
                <p class="download" v-on:click="download(allTimelines, 'timelines.csv')">Download</p>
                <div class="container">
                    <div class="data" v-for="(timeline, idx) in allTimelines" :key="idx">
                        <router-link :to="{ path: 'timeline/' + timeline.id }" class="router">
                            Title: {{ timeline.id }} Views: {{ timeline.views }} Likes: {{ timeline.likes.length }} Trending: {{ timeline.trendingViews }} User: {{ timeline.user.email }} Reports: {{ timeline.numberOfReports }}
                        </router-link>
                        <div v-on:click="deleteTimeline(timeline)" class="del">DELETE</div>
                    </div>
                </div>
            </div>
            <div class="users" :class="$mq">
                <h1>Users</h1>
                <p class="download" v-on:click="download(allUsers, 'users.csv')">Download</p>
                <div class="container">
                    <div class="data" v-bind:class="{blocked: user.blocked}" v-for="(user, idx) in allUsers" :key="idx">
                        <router-link :to="{ path: 'profile/' + user.username }" class="router">
                            Username: {{ user.username }} Email: {{ user.email }} Creation: {{ user.creationTime }} Followers: {{ user.followers.filter(e => e.userId != null).length }}
                        </router-link>
                        <div class="del" v-on:click="deleteUser(user)">DELETE</div>
                        <div class="del" v-on:click="blockUser(user)" v-if="!user.blocked">BLOCK</div>
                        <div class="del" v-on:click="unBlockUser(user)" v-if="user.blocked">UNBLOCK</div>
                    </div>
                </div>
            </div>
            <div class="timelines" :class="$mq">
                <h1>Reported timelines</h1>
                <p class="download" v-on:click="download(reportedTimelines, 'reported-timelines.csv')">Download</p>
                <div class="container">
                    <div class="data" v-for="(timeline, idx) in reportedTimelines" :key="idx">
                        <router-link :to="{ path: 'timeline/' + timeline.id }" class="router">
                            Title: {{ timeline.id }} Views: {{ timeline.views }} Likes: {{ timeline.likes.length }} Trending: {{ timeline.trendingViews }} User: {{ timeline.user.email }} Reports: {{ timeline.numberOfReports }}
                        </router-link>
                        <div v-on:click="deleteTimeline(timeline)" class="del">DELETE</div>
                        <div v-on:click="unReportTimeline(timeline)" class="del">UNREPORT</div>
                    </div>
                </div>
            </div>
            <div class="devices" :class="$mq">
                <h1>Devices</h1>
                <p>No duplicates - there can be multiple views by the same device.</p>
                <p class="download" v-on:click="download(allDevices, 'devices.csv')">Download</p>
                <div class="container">
                    <div class="data" v-for="(device, idx) in allDevices" :key="idx">
                        Device details: {{ device.deviceDetails }} Location: {{ device.location }} Username: {{ device.username }} LastLogin: {{ device.lastLogged }}
                    </div>
                </div>
                <BarChart v-if="locationStat" :chartdata="locationStat" :options="viewsOptions" class="stat-chart" :class="$mq"/>
                <BarChart v-if="devicesInfoChart" :chartdata="devicesInfoChart" :options="viewsOptions" class="stat-chart" :class="$mq"/>
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
            var totalViews = []
            for (i=0, len=response.data.length; i<len; i++){
                totalViews.push(response.data[i].mainPageViews + response.data[i].totalTimelinesViews + response.data[i].profileViews)
            }
            var totalUsers = []
            for (i=0, len=response.data.length; i<len; i++){
                var usersNumber = 0
                for (var j=0, len2=i; j<=len2; j++){
                    usersNumber += response.data[j].numberOfUsers
                }
                totalUsers.push(usersNumber)
            }
            var activeUsers = []
            for (i=0, len=response.data.length; i<len; i++){
                activeUsers.push(response.data[i].activeUsers)
            }

            var object = {
                labels: labels,
                datasets: [
                    {
                        label: "Views",
                        data: totalViews,
                        backgroundColor: "transparent",
                        borderColor: "rgba(1, 116, 188, 0.8)",
                        pointBackgroundColor: "rgba(1, 116, 188, 1)"
                    },
                    {
                        label: "Total-Users",
                        data: totalUsers,
                        backgroundColor: "transparent",
                        borderColor: "rgba(100, 116, 188, 0.8)",
                        pointBackgroundColor: "rgba(100, 116, 188, 1)"
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
        baseApi: 'https://tline-283413.ew.r.appspot.com/api/',
        allTimelines: [],
        allStats: [],
        allStatObject: null,
        allUsers: [],
        allDevices: [],
        reportedTimelines: [],
        locationStat: null,
        devicesInfoChart: null,
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
                xAxes: [{
                    ticks: {
                        maxRotation: 90
                    }
                }]
            } 
        }
      }
    },
    watch: {
        allDevices: function(){
            if (this.allStats.length > 0){
                this.createLocations()
                this.createDevicesInfo()
            }
        },
        allStats: function(){
            if (this.allDevices.length > 0){
                this.createLocations()
                this.createDevicesInfo()
            }
        }
    },
    methods: {
        createDevicesInfo(){
            var devicesId = []
            var data = []
            for (var i=0, len=this.allStats.length; i<len; i++){
                Object.keys(this.allStats[i].devices).forEach( (key) => {
                    if (devicesId.filter(e => e === key.toString()).length > 0){
                        var index = devicesId.indexOf(key.toString())
                        data[index] += this.allStats[i].devices[key]
                    } else {
                        devicesId.push(key.toString())
                        data.push(this.allStats[i].devices[key])
                    }
                } )
            }
            var labels = []
            var dataParsed = []
            for (i=0, len=devicesId.length; i<len; i++){
                var details = this.allDevices.filter(e => e.id === devicesId[i])[0].deviceDetails
                if (labels.filter(e => e === details).length > 0){
                    var index = labels.indexOf(details)
                    dataParsed[index] += data[i]
                } else {
                    labels.push(details)
                    dataParsed.push(data[i])
                }
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
            this.devicesInfoChart = object
        },
        createLocations(){
            var devicesId = []
            var data = []
            for (var i=0, len=this.allStats.length; i<len; i++){
                Object.keys(this.allStats[i].devices).forEach( (key) => {
                    if (devicesId.filter(e => e === key.toString()).length > 0){
                        var index = devicesId.indexOf(key.toString())
                        data[index] += this.allStats[i].devices[key]
                    } else {
                        devicesId.push(key.toString())
                        data.push(this.allStats[i].devices[key])
                    }
                } )
            }
            var labels = []
            var dataParsed = []
            for (i=0, len=devicesId.length; i<len; i++){
                var details = this.allDevices.filter(e => e.id === devicesId[i])[0].location
                if (labels.filter(e => e === details).length > 0){
                    var index = labels.indexOf(details)
                    dataParsed[index] += data[i]
                } else {
                    labels.push(details)
                    dataParsed.push(data[i])
                }
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

.container
    height: 200px
    overflow: auto

.data
    margin-bottom: 20px

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
    &.small
        width: 95%

.devices
    width: 80%
    text-align: left
    margin: 50px auto
    &.small
        width: 95%

.timelines
    width: 80%
    text-align: left
    margin: 50px auto
    &.small
        width: 95%

.users
    width: 80%
    text-align: left
    margin: 50px auto
    &.small
        width: 95%

.admin
    font-family: OpenSans-Regular
    margin-top: 60px

.del
    display: inline-block
    color: red
    cursor: pointer
    margin-right: 30px

</style>
