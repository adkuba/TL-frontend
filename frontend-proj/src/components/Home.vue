<template>
<div>
    <div id="homepage" :class="$mq">
        <div class="element" style="border-bottom: 4px solid #B8352D" v-if="!$store.state.jwt">
            <div class="s_line"></div>
            <div class="left">Timelines</div>
            <div class="right"> Create your own timeline! </div>
        </div>
    
        <div class="element" :style="'border-bottom: 4px solid '+timeline.color" v-for="(timeline, idx) in timelines" :key="idx">
            <div class="s_line"></div>
            <router-link :to="{ path: 'timeline/' + timeline.id }" class="left">
                {{ timeline.descriptionTitle }}
                <div class="author">by {{ timeline.user.username }}</div>
            </router-link>
            <router-link :to="{ path: 'timeline/' + timeline.id }" class="right" v-bind:class="{rightSmall: timeline.pictures}">
                {{ timeline.description.substring(0, 500) }}...
            </router-link>
            <router-link :to="{ path: 'timeline/' + timeline.id }" class="image_container" v-if="timeline.pictures">
                <img class="image" :src="timeline.pictures[0]">
            </router-link>
        </div>
    </div>
</div>
</template>

<script>

export default {
    name: 'Home',
    created(){
        this.getTimelines()
    },
    data() {
        return {
            baseApi: 'http://localhost:8081/api/',
            timelines: [],
            borderColors: ['#ffb6b6', '#fde2e2', '#aacfcf', '#679b9b']
        }
    },
    methods: {
        scroll() {
            window.onscroll = () => {
                let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

                if (bottomOfWindow) {
                    this.getTimelines()
                }
            };
        },
        getTimelines(){
            var timelinesApi = this.baseApi + 'timelines/public/random'
            this.axios.get(timelinesApi)
            .then(response => {
                var temp = response.data
                for (var i=0, len=temp.length; i<len; i++){
                    temp[i].color = this.borderColors[Math.floor(Math.random() * this.borderColors.length)]
                    this.timelines.push(temp[i])
                }
            })
            .catch(error => {
                console.log(error)
            })
        }
    },
    mounted() {
        this.scroll()
    }
}

</script>

<style scoped lang="sass">
@import '../assets/saas-vars.sass'
.author
    font-weight: normal
    font-size: 15px
    margin-top: 15px
    margin-left: 3px

.s_line
    width: calc( 100% + 100px )
    transform: translateX(-50px)
    height: 70px
    background: white
    display: inline-block

.image_container
    display: inline-block
    width: 16%
    margin-left: 4%
    vertical-align: top
    margin-top: 50px       

.image
    border-radius: 3px
    width: 100%
    object-fit: contain

.right
    text-decoration: none
    color: #303030
    margin-top: 45px
    font-family: OpenSans-Regular
    display: inline-block
    width: 85%
    text-align: justify

.rightSmall
    width: 65%

.left
    text-decoration: none
    color: #303030
    margin-top: 40px
    font-family: Raleway-Regular
    vertical-align: top
    display: inline-block
    width: 15%
    text-align: left
    font-size: 30px
    font-weight: bold
    letter-spacing: 1px


.element
    border-radius: 5px
    padding: 0 50px
    padding-bottom: 80px
    width: 70%
    margin-left: calc(15% - 50px)
    background: $bg-color

#homepage
    padding-top: 1px
    margin-top: 50px

.hh
    position: absolute
    top: 0
    margin-top: 60px

</style>
