<template>
<div>
    <form action="javascript:void(0);" class="search" :class="$mq">
        <input autocorrect="off" spellcheck="false" placeholder="Search" type="search" class="search-input" @focus="scrollToTop()" id="search-input" :class="$mq">
        <button type="submit" v-on:click="search()" class="search-b" :class="$mq">&#9906;</button>
    </form>
    <div id="homepage" :class="$mq">
        <div v-if="searchResults.length == 0">
            <div v-if="$mq != 'small'">
                <home-special v-bind:special="special" v-bind:mobile="false"></home-special>
            </div>
            <div v-if="$store.state.timelines.length > 0">
                <transition-group name="fade">
                    <div v-for="(timeline, idx) in $store.state.timelines" :key="timeline.id + idx.toString()">
                        <div v-if="timeline.data == null">
                            <home-timeline v-bind:timeline="timeline" v-bind:search="false"></home-timeline>
                        </div>
                        <div v-else>
                            <div v-if="$mq == 'small'">
                                <home-special v-bind:special="special" v-bind:mobile="true"></home-special>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </div>
            <div v-else>
                <div class="empty-element" :class="$mq"></div>
                <div class="empty-element" :class="$mq"></div>
            </div>
        </div>
        <div v-else>
            <h1 :class="$mq" class="search-h1" >Search results</h1>
            <div v-on:click="quit()" class="quit" :class="$mq">x</div>
            <div class="search-container" :class="$mq">
                <div v-if="searchResults[0] != 'loading'">
                    <transition-group name="fade">
                        <span v-for="(timeline, idx) in searchResults" :key="timeline.id + idx.toString()">
                            <home-timeline v-bind:timeline="timeline" v-bind:search="true"></home-timeline>
                        </span>
                        <div v-if="searchResults.length == 0" class="empty">Can't find.</div>
                    </transition-group>
                </div>
                <div v-else class="empty-element search-element" :class="$mq"></div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import HomeTimeline from '../components/HomeTimeline.vue'
import HomeSpecial from '../components/HomeSpecial.vue'

export default {
    name: 'Home',
    components: {
        HomeTimeline,
        HomeSpecial
    },
    metaInfo() {
        return {
            title: 'Tline',
            meta: [
                { name: 'description', content: 'Create content based on timeline! Present your projects, achievements, inspire others and develop connections!'},
                { property: 'og:url', content: 'https://www.tline.site/'},
                { property: 'og:title', content: 'Tline' },
                { property: 'og:descriprion', content: 'Create content based on timeline! Present your projects, achievements, inspire others and develop connections!'},
                { property: 'og:image', content: 'https://storage.googleapis.com/tline-files/meta.png' },
                { property: 'twitter:card', content: 'summary_large_image'},
                { property: 'twitter:url', content: 'https://www.tline.site/'},
                { property: 'twitter:title', content: 'Tline'},
                { property: 'twitter:description', content: 'Create content based on timeline! Present your projects, achievements, inspire others and develop connections!'},
                { property: 'twitter:image', content: 'https://storage.googleapis.com/tline-files/meta.png'}
            ]
        }
    },
    created(){
        if (this.$store.state.timelines.length == 0){
            this.getTimelines(true)
            this.axios.post(this.baseApi + 'statistics/public', null)
            .catch(error => {
                console.log(error)
            })
        } else {
            var filtered = this.$store.state.timelines.filter(obj => obj.data != null)
            if (filtered != null){
                this.special = filtered.reverse()[0]
            }
        }
    },
    data() {
        return {
            baseApi: 'https://api.tline.site/api/',
            searchResults: [ ],
            details: null,
            counter: 0,
            special: null,
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
        scroll() {
            window.onscroll = () => {
                let bottomOfwindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

                if (bottomOfwindow) {
                    if (this.counter == 2){
                        this.counter = 0
                        this.getTimelines(true)
                        
                    } else {
                        this.getTimelines()
                    }
                    this.counter += 1
                }
            };
        },
        getTimelines(withSpecial=false){
            var timelinesApi = this.baseApi + 'timelines/public/homepage'
            var username = null
            if (this.$store.state.jwt){
                username = this.$store.state.jwt.user.username
            }
            this.axios.post(timelinesApi, {
                timelinesIDS: this.$store.state.timelines.map(o => o.id).filter(o => o != null),
                username: username
            })
            .then(response => {
                this.$store.commit('addTimelines', response.data)
                if (withSpecial){
                    this.getSpecial()
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        search(){
            if (document.getElementById("search-input").value.length > 2){
                document.getElementById("search-input").placeholder = 'Search'
                this.searchResults = ['loading']
                var timelinesApi = this.baseApi + 'timelines/public/search'
                this.axios.get(timelinesApi, {
                    params: {
                        text: document.getElementById("search-input").value
                    }
                })
                .then(response => {
                    this.searchResults = response.data
                })
                .catch(error => {
                    console.log(error)
                })
            } else {
                document.getElementById("search-input").value = ''
                document.getElementById("search-input").placeholder = "Type at least 3 characters"
            }
        },
        quit(){
            document.getElementById("search-input").value = ''
            this.searchResults = []
        },
        getSpecial(){
            this.axios.get(this.baseApi + 'timelines/public/homepage/special')
                .then(response => {
                    var specialElement = {
                        data: response.data
                    }
                    this.special = specialElement
                    this.$store.commit('addSpecial', specialElement)
                })
                .catch(error => {
                    console.log(error)
                })
        },
    },
    mounted() {
        this.scroll()
    }
}

</script>

<style scoped lang="sass">
@import '../assets/saas-vars.sass'

@keyframes fadein
    0%
        opacity: 0
    100%
        opacity: 1

.fade-leave-active
    transition: all 1ms

.fade-move, .fade-enter-active
    transition: all 0.4s

.fade-enter, .fade-leave-to
    opacity: 0

.empty-element
    margin-top: 70px
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)
    border-radius: 20px
    position: relative
    width: 40%
    height: 550px
    margin-left: 15%
    background: rgba(0, 0, 0, 0.04)
    animation: pulse 1.5s linear infinite
    &.medium
        width: 60%
        margin-left: 5%
    &.small
        width: 100%
        margin-top: 20px
        margin-left: 0

.empty-search
    background: rgba(0, 0, 0, 0.04)
    animation: pulse 1.5s linear infinite
    height: 100px
    border-radius: 15px

@keyframes pulse
    0%
        background: rgba(0, 0, 0, 0.04)
    50%
        background: rgba(0, 0, 0, 0.1)
    100%
        background: rgba(0, 0, 0, 0.04)

.search-h1
    margin-top: 60px
    margin-left: 25%
    &.small
        margin-top: 40px

.empty
    font-family: OpenSans-Regular
    padding-top: 50px
    padding-bottom: 50px
    text-align: center
    font-size: 20px

.quit
    cursor: pointer
    position: absolute
    right: 25%
    top: 97px
    font-family: OpenSans-Regular
    font-size: 25px
    color: #b1b1b1
    &.small
        right: 5%
    &.medium
        right: 10%

h1
    font-family: Raleway-Regular
    font-size: 40px
    text-align: left
    margin-left: 20%
    margin-top: 50px
    &.medium
        margin-left: 10%
    &.small
        margin-left: 5%

.search-input
    -webkit-appearance: none
    background: rgba(50,50,50, 0.4)
    padding: 0 15px
    outline: none
    border: none
    color: white
    width: 100%
    height: 36px
    border-radius: 10px
    font-size: 17px

.search-b
    visibility: hidden

input::-webkit-search-cancel-button
  -webkit-appearance: none

.search
    box-sizing: content-box
    width: 40%
    font-family: OpenSans-Regular
    position: fixed
    z-index: 5
    top: 0
    padding-top: 11px
    left: 30%
    &.medium
        width: 50%
        left: 25%
    &.small
        width: 60%
        left: 20%

.search-container
    text-align: left
    width: 70%
    margin-left: 15%
    margin-top: 80px
    &.medium
        width: 98%
        margin-left: 1%
        margin-top: 50px
    &.small
        width: 100%
        margin-left: 0
        margin-top: 30px

#homepage
    padding-top: 1px
    margin-top: 50px

.hh
    position: absolute
    top: 0
    margin-top: 60px

</style>