<template>
    <div class="timeline" :class="$mq" v-if="timeline">
        <router-link :to="{ path: '/timeline/' + timeline.id }" class="tl-router" :class="$mq">
            <div class="title" v-bind:class="[{ shadow: !timeline.active}, $mq]">{{ timeline.descriptionTitle }}</div>
            <div class="descr" v-bind:class="[{ shadow: !timeline.active}, $mq]">{{ timeline.description.replace(/ \[([^\]]+)\]\(([^\)]+)\)/g, '') }}...</div>
            <div class="image-container" v-bind:class="[{ shadow: !timeline.active}, $mq]">
                <img class="image" v-if="timeline.pictures && timeline.pictures.length > 0" :src="timeline.pictures[0]" :class="$mq">
                <img v-else class="image" :class="$mq" :src="require('../assets/images/default/Default' + defaultImage + '.png')">
            </div>
        </router-link>
        <div class="views-container" v-bind:class="[{ shadow: !timeline.active}, $mq]">
            <router-link :to="{ path: '/statistics/' + $store.state.jwt.user.username }" class="stats" v-if="$store.state.jwt && $store.state.jwt.user.username == timeline.user.username">Statistics</router-link>
            <div class="views" v-else>{{ timeline.views }} views &middot; {{ timeline.likes.length }} likes</div>
        </div>
        <div class="views-container user-edit" :class="$mq">
            <div class="views" v-if="$store.state.jwt && $store.state.jwt.user.username == timeline.user.username">
                <router-link style="text-decoration: none" :to="{ path: '/editorLoader/' + timeline.id }" class="edit" v-bind:class="[{ shadow: !timeline.active}, $mq]">Edit</router-link>
                <div class="edit" v-bind:class="[{ shadow: !timeline.active}, $mq]">&middot;</div>
                <div class="edit" v-on:click="deleteTimeline(timeline)">Delete</div>
                <div class="edit" v-if="!timeline.active">&middot;</div>
                <div v-if="!timeline.active" class="edit" v-on:click="quitOpenActive(1)">Make active</div>
            </div>
            <div v-else class="views" v-bind:class="[{ shadow: !timeline.active}, $mq]">{{ timeline.creationDate }}</div>
        </div>

        <div id="make-active" :class="$mq">
            <div style="margin-bottom: 10px; width: 90%">Select max 2 active timelines:</div>
            <div class="quit" v-on:click="quitOpenActive(0)">x</div>
            <div v-for="(timeline, idx) in timelines" :key="idx">
                <input type="checkbox" :name="idx" :id="'active_' + timeline.id">
                <label :for="idx"> {{ timeline.id }}</label><br>
            </div>
            <div v-if="!activeError" style="height: 40px"></div>
            <div class="active-error" v-else>{{ activeError }}</div>
            <div class="fsubmit" id="activeSubmit" v-on:click="makeActive()">Submit</div>
            <div class="loader" id="loader" :class="$mq"></div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'ProfileTimeline',
    props: {
        timeline: Object
    },
    data() {
        return {
            baseApi: 'https://api.quicpos.com/tline/api/',
            defaultImage: (Math.floor(Math.random() * 10) + 1)
        }
    },
    methods: {
        makeActive(){
            var activeTimelines = []
            for (var i=0, len=this.timelines.length; i<len; i++){
                if (document.getElementById("active_" + this.timelines[i].id).checked){
                    activeTimelines.push(this.timelines[i].id)
                }
            }
            if (activeTimelines.length != 2){
                this.activeError = "Select 2 timelines!"
                return

            } else {
                document.getElementById("loader").style.opacity = 1
                document.getElementById("activeSubmit").style.background = "#932a24"
                this.axios.post(this.baseApi + "timelines/make-active", activeTimelines, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.jwt.token
                    }
                }).then(() => {
                    document.getElementById("loader").style.opacity = 0
                    document.getElementById("activeSubmit").style.background = "#B8352D"
                    this.quitOpenActive(0)
                    window.location.reload()

                }).catch(error => {
                    document.getElementById("loader").style.opacity = 0
                    document.getElementById("activeSubmit").style.background = "#B8352D"
                    this.activeError = error.response.data.message
                    console.log(error)
                })
            }
        },
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
        quitOpenActive(action){
            if (action == 0){
                this.activeError = ""
                document.getElementById("make-active").style.display = "none"
            } else {
                document.getElementById("make-active").style.display = "block"
            }
        },
    }
}
</script>

<style scoped lang="sass">
@import '../assets/saas-vars.sass'

#loader
    opacity: 0
    position: absolute
    bottom: 32px
    right: 7%

.active-error
    text-align: center
    color: #B8352D
    margin-bottom: 5px
    margin-top: 13px

.fsubmit
    margin: 0 auto
    margin-bottom: 5px

.quit
    position: absolute
    top: 0
    padding: 10px
    right: 10px
    cursor: pointer

#make-active
    display: none
    position: fixed
    background: $bg-color
    top: 30%
    box-shadow: 0 0 0 1600px rgba(0,0,0,0.65)
    padding: 20px 40px
    box-sizing: border-box
    text-align: left
    font-family: OpenSans-Regular
    border-radius: 20px
    width: 24%
    left: 38%
    &.medium
        width: 44%
        left: 28%
    &.small
        width: 80%
        left: 10%

.edit
    color: #14426B
    margin-left: 10px
    display: inline-block

.user-edit
    float: right
    text-align: right
    margin-right: 5%
    &.small
        margin-right: 2%

.stats
    font-family: OpenSans-Regular
    text-decoration: none
    font-size: 14px
    color: #14426B

.views
    cursor: pointer
    color: #7e7e7e
    font-family: OpenSans-Regular
    font-size: 14px
    margin-bottom: 5px

.views-container
    margin-left: 5%
    margin-top: 15px
    display: inline-block
    &.small
        margin-left: 2%

.image-container
    width: 90%
    margin-top: 20px
    margin-left: 5%
    &.small
        width: 96%
        margin-left: 2%

.image
    animation-timing-function: ease-in
    animation: fadein 1s
    border-radius: 5px
    width: 100%
    height: 330px
    object-fit: cover
    &.medium
        height: 280px
    &.small
        height: 240px

.title
    width: 90%
    margin-left: 5%
    font-family: Raleway-Regular
    font-size: 35px
    font-weight: bold
    &.small
        margin-left: 2%

.descr
    width: 90%
    margin-left: 5%
    font-family: OpenSans-Regular
    margin-top: 10px
    height: 70px
    text-align: justify
    overflow: hidden
    &.small
        margin-left: 2%

.tl-router
    text-decoration: none
    color: #303030

.timeline
    animation-timing-function: ease-in
    animation: fadein 0.5s
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)
    box-sizing: border-box
    padding: 30px 10px
    border-radius: 20px
    display: inline-block
    vertical-align: top
    width: 45%
    margin: 2%
    text-align: left
    &.medium
        width: 46%
        margin: 1%
    &.small
        margin-left: 0
        margin-right: 0
        width: 100%

</style>