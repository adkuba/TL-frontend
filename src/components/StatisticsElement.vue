<template>
    <div class="element" :class="$mq">
        <span v-if="timeline">
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
                    <div class="item" v-on:click="switchChart(0)">Likes</div>
                    <div class="item" style="cursor: default">&middot;</div>
                    <div class="item" v-on:click="switchChart(1)">Views</div>
                    <div class="item" style="cursor: default">&middot;</div>
                    <div class="item" v-on:click="switchChart(2)">Loc.</div>
                    <div class="desc">Click to change charts</div>
                </div>
            </div>
            <div class="right" :class="$mq">
                <div v-if="chart==1 && timeline.viewsDetails && $store.state.jwt.user.subscriptionEnd" class="chart-wrapper">
                    <LineChart :chartdata="timeline.viewsDetails" :options="viewsOptions" class="line-container" :style="{'width': (timeline.viewsDetails.labels.length * 80) + 'px'}"/>
                    </div>
                <div v-if="chart==2 && timeline.viewsCountry && $store.state.jwt.user.subscriptionEnd" class="chart-wrapper">
                    <BarChart :chartdata="timeline.viewsCountry" :options="viewsOptions" class="line-container" :style="{'width': (timeline.viewsCountry.labels.length * 150) + 'px'}"/>
                </div>
                <div v-if="chart==0" class="user-interactions">
                    <div v-if="timeline.likes.length == 0" class="in-empty">
                        No likes
                    </div>
                    <div v-for="(user, useridx) in timeline.likes" :key="useridx" class="interaction" :class="$mq">
                        <router-link :to="{ path: '/profile/' + user.userId }" style="text-decoration: none">
                            <div class="in-user">{{ user.userId }}</div>
                            <div class="in-day">{{ user.date }}</div>
                        </router-link>
                    </div>
                </div>
                <div v-if="!$store.state.jwt.user.subscriptionEnd && chart != 0" class="normal-info" :class="$mq">
                    More detailed charts only for premum users. Subscribe to see more.
                </div>
            </div>
        </span>
        <span v-if="user">
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
                    <div class="item" v-on:click="switchChart(0)">Foll.</div>
                    <div class="item" style="cursor: default">&middot;</div>
                    <div class="item" v-on:click="switchChart(1)">Views</div>
                    <div class="item" style="cursor: default">&middot;</div>
                    <div class="item" v-on:click="switchChart(2)">Loc.</div>
                    <div class="desc">Click to change charts</div>
                </div>
            </div>
            <div class="right" :class="$mq">
                <div v-if="chart==1 && user.viewsDetails && $store.state.jwt.user.subscriptionEnd" class="chart-wrapper">
                    <LineChart :chartdata="user.viewsDetails" :options="viewsOptions" class="line-container" :style="{'width': (user.viewsDetails.labels.length * 80) + 'px'}"/>
                    </div>
                <div v-if="chart==2 && user.viewsCountry && $store.state.jwt.user.subscriptionEnd" class="chart-wrapper">
                    <BarChart :chartdata="user.viewsCountry" :options="viewsOptions" class="line-container" :style="{'width': (user.viewsCountry.labels.length * 150) + 'px'}"/>
                </div>
                <div v-if="chart==0" class="user-interactions">
                    <div v-if="user.followers.filter(e => e.userId != null).length == 0" class="in-empty">
                        No followers
                    </div>
                    <div v-for="(user, useridx) in user.followers.filter(e => e.userId != null)" :key="useridx" class="interaction" :class="$mq">
                        <router-link :to="{ path: '/profile/' + user.userId }" style="text-decoration: none">
                            <div class="in-user">{{ user.userId }}</div>
                            <div class="in-day">{{ user.date }}</div>
                        </router-link>
                    </div>
                </div>
                <div v-if="!$store.state.jwt.user.subscriptionEnd && chart != 0" class="normal-info" :class="$mq">
                    More detailed charts only for premum users. Subscribe to see more.
                </div>
            </div>
        </span>
    </div>
</template>

<script>
import LineChart from './LineChart.vue'
import BarChart from './BarChart.vue'

export default {
    name: 'StatisticsElement',
    components: {
        LineChart,
        BarChart
    },
    props: {
        timeline: Object,
        user: Object,
    },
    data() {
        return {
            chart: 0,
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
        switchChart(index){
            this.chart = index
        },
    }
}
</script>

<style scoped lang="sass">

.in-empty
    text-align: center
    margin-top: 110px

.in-user
    color: #303030
    font-family: Raleway-Regular
    font-size: 18px

.in-day
    font-size: 12px
    color: #7e7e7e

.interaction
    width: 100%
    display: block
    padding: 10px 40px
    box-sizing: border-box
    &.small
        padding: 10px 0

.user-interactions
    overflow: auto
    height: 310px
    margin: 0 5%
    border-radius: 5px

.user-interactions::-webkit-scrollbar
    width: 7px

.user-interactions::-webkit-scrollbar-track
    background: #e7e7e7

.user-interactions::-webkit-scrollbar-thumb
    background: #c0c0c0

.user-interactions::-webkit-scrollbar-thumb:hover
    background: #a3a3a3

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
    padding: 140px 5%
    height: 28px
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
    margin-right: 15px
    cursor: pointer

.desc
    font-size: 13px
    color: #7e7e7e
    margin-top: -3px

.daneh
    display: inline-block
    width: 49%
    margin-bottom: 15px

.dane
    color: #14426B
    vertical-align: top
    float: right
    width: 49%
    text-align: right


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
    width: 24%
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
    width: 59%
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