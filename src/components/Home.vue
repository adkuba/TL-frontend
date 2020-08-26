<template>
<div>
    <form action="javascript:void(0);" class="search" :class="$mq">
        <input autocorrect="off" spellcheck="false" placeholder="Search" type="search" class="search-input" @focus="scrollToTop()" id="search-input" :class="$mq">
        <button type="submit" v-on:click="search()" class="search-b" :class="$mq">&#9906;</button>
    </form>
    <div id="homepage" :class="$mq">
        <div v-if="searchResults.length == 0">
            <div v-if="$mq != 'small' && special && special.data[0]" class="special-pc" :class="$mq">
                <div class="category-special">FOR YOU</div>
                <div v-if="special.data[0].username != null" class="special-pc-users">
                    <h1 class="special-h1">Users</h1>
                    <router-link :to="{ path: '/profile/' + user.username }" class="special-router" v-for="(user, idx) in special.data" :key="idx">
                        <div class="special-name" v-if="user.fullName">{{ user.fullName }} </div>
                        <div class="special-name" v-else> New user </div>
                        <div class="special-desc">@{{user.username}} &middot; {{user.followers.filter(e => e.userId != null).length}} followers </div>
                    </router-link>
                </div>
                <div v-else class="special-pc-timelines">
                    <h1 class="special-h1">Timelines</h1>
                    <router-link :to="{ path: '/timeline/' + timeline.id }" class="special-router" v-for="(timeline, idx) in special.data" :key="idx">
                        <div class="special-name"> {{timeline.descriptionTitle}} </div>
                        <div class="special-desc">by @{{ timeline.user.username }} &middot; {{ timeline.likes.length }} likes </div>
                    </router-link>
                </div>
                <router-link :to="{ path: '/about' }" class="special-about">About</router-link>
                <router-link :to="{ path: '/business' }" class="special-about-next">Business</router-link>
            </div>
            <div v-if="$store.state.timelines.length > 0">
                <transition-group name="fade">
                    <div v-for="(timeline, idx) in $store.state.timelines" :key="timeline.id + idx.toString()">
                        <div v-if="timeline.data == null" class="element" v-bind:class="[timeline.category == 'PREMIUM' ? 'premium': '', $mq]">
                            <div class="more" :class="$mq" v-on:click="openMore(idx)">&#9866;</div>
                            <div class="moreOpened" :class="$mq" :id="'more-' + idx" v-on:click="report(timeline, idx)">Report</div>
                            <div class="category" :class="$mq">{{ timeline.category }}</div>
                            <router-link :to="{ path: 'timeline/' + timeline.id }" class="title" :class="$mq" @click.native="premium(timeline)">{{ timeline.descriptionTitle }}</router-link>
                            <router-link :to="{ path: 'timeline/' + timeline.id }" class="desc" :class="$mq" @click.native="premium(timeline)">
                                {{ timeline.description.replace(/ \[([^\]]+)\]\(([^\)]+)\)/g, '') }}...
                            </router-link>
                            <router-link :to="{ path: 'timeline/' + timeline.id }" class="image_container" :class="$mq" @click.native="premium(timeline)">
                                <img :class="$mq" v-if="timeline.pictures.length > 0" class="image" :src="timeline.pictures[0]">
                                <img :class="$mq" v-else class="image" :src="require('../assets/images/default/Default' + defaultImage + '.png')">
                            </router-link>
                            <div class="author" :class="$mq">By {{ timeline.user.username }}</div>
                            <div class="views" v-if="timeline.category != 'TRENDING'" :class="$mq">{{ timeline.views }} views &middot; {{ timeline.likes.length }} likes</div>
                            <div class="views" v-else :class="$mq">&#8593;{{ timeline.trendingViews }} views &middot; {{ timeline.likes.length }} likes</div>
                            <div class="views creation">{{ timeline.creationDate }} </div>
                        </div>
                        <div v-else>
                            <div v-if="$mq == 'small' && special" class="special-mobile">
                                <div class="category-special" :class="$mq">FOR YOU</div>
                                <div v-if="special.data[0].username != null" class="special-pc-users" :class="$mq">
                                    <h1 class="special-h1" :class="$mq">Users</h1>
                                    <router-link :to="{ path: '/profile/' + user.username }" class="special-router" :class="$mq" v-for="(user, idx) in special.data" :key="idx">
                                        <div class="special-name" :class="$mq" v-if="user.fullName">{{ user.fullName }} </div>
                                        <div class="special-name" :class="$mq" v-else> New user </div>
                                        <div class="special-desc" :class="$mq">@{{user.username}} &middot; {{user.followers.filter(e => e.userId != null).length}} followers </div>
                                    </router-link>
                                </div>
                                <div v-else class="special-pc-timelines" :class="$mq">
                                    <h1 class="special-h1" :class="$mq">Timelines</h1>
                                    <router-link :to="{ path: '/timeline/' + timeline.id }" class="special-router" :class="$mq" v-for="(timeline, idx) in special.data" :key="idx">
                                        <div class="special-name" :class="$mq"> {{timeline.descriptionTitle}} </div>
                                        <div class="special-desc" :class="$mq">by @{{ timeline.user.username }} &middot; {{ timeline.likes.length }} likes </div>
                                    </router-link>
                                </div>
                                <router-link :to="{ name: 'about' }" class="special-about" :class="$mq">About</router-link>
                                <router-link :to="{ path: '/business' }" class="special-about-next">Business</router-link>
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
                    <div v-for="(timeline, idx) in searchResults" :key="timeline.id + idx.toString()" class="element search-element" :class="$mq">
                        <div v-if="!timeline.none">
                            <div class="category" :class="$mq"></div>
                            <router-link :to="{ path: 'timeline/' + timeline.id }" class="title" :class="$mq">{{ timeline.descriptionTitle }}</router-link>
                            <router-link :to="{ path: 'timeline/' + timeline.id }" class="desc" :class="$mq">
                                {{ timeline.description.replace(/ \[([^\]]+)\]\(([^\)]+)\)/g, '') }}...
                            </router-link>
                            <router-link :to="{ path: 'timeline/' + timeline.id }" class="image_container" :class="$mq">
                                <img :class="$mq" v-if="timeline.pictures.length > 0" class="image" :src="timeline.pictures[0]">
                                <img :class="$mq" v-else class="image" :src="require('../assets/images/default/Default' + defaultImage + '.png')">
                            </router-link>
                            <div class="author" :class="$mq">By {{ timeline.user.username }}</div>
                            <div class="views" :class="$mq">{{ timeline.views }} views &middot; {{ timeline.likes.length }} likes</div>
                            <div class="views creation">{{ timeline.creationDate }} </div>
                        </div>
                        <div v-else class="empty">Can't find.</div>
                    </div>
                </transition-group>
                </div>
                <div v-else class="empty-element search-element" :class="$mq"></div>
            </div>
        </div>
    </div>
</div>
</template>

<script>

export default {
    name: 'Home',
    metaInfo() {
        return {
            title: 'Homepage',
            titleTemplate: '%s - Tline',
            meta: [
                { name: 'description', content: 'Explore new way to present your content based on timeline.'}
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
            defaultImage: (Math.floor(Math.random() * 10) + 1)
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
        premium(timeline){
            if (timeline.category == 'PREMIUM'){
                this.axios.post(this.baseApi + 'timelines/public/premium-view?id=' + timeline.id)
                    .catch(error => {
                        console.log(error)
                    })
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
            this.axios.get(timelinesApi)
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
                    if (response.data.length == 0){
                        this.searchResults = [{none: true}]
                    }
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
        openMore(idx){
            var more = document.getElementById('more-' + idx)
            if (more.style.display=='block'){
                more.style.display="none"

            } else {
                more.style.display="block"
            }
        },
        report(timeline, idx){
            this.axios.post(this.baseApi + 'timelines/public/report?id=' + timeline.id)
                .then(() => {
                    this.$store.commit('setMessage', "Our admins will review it, thank you!")
                    document.getElementById("modal").style.display = "block"
                    this.openMore(idx)
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

.moreOpened
    position: absolute
    font-family: OpenSans-Regular
    font-size: 14px
    &.large
        left: calc(55% - 75px)
    transform: translateY(+14px)
    padding: 3px 10px
    cursor: pointer
    display: none
    &.medium
        left: calc(65% - 75px)
    &.small
        right: 5%
        padding-right: 0

.more
    user-select: none
    position: absolute
    &.large
        left: calc(55% - 37px)
    color: #7e7e7e
    transform: translateY(-9px)
    cursor: pointer
    &.medium
        left: calc(65% - 40px)
    &.small
        right: 5%

.search-h1
    margin-top: 60px
    margin-left: 25%
    &.small
        margin-top: 40px

.special-name
    margin-top: 30px
    font-family: Raleway-Regular
    font-size: 20px

.special-desc
    color: #7e7e7e
    margin-left: 2px
    font-size: 14px

.category-special
    font-family: OpenSans-Regular
    margin-top: 30px
    margin-left: 8%
    text-align: left
    font-size: 16px
    color: #7e7e7e
    &.small
        margin-left: 5%

.special-h1
    margin-top: 10px
    margin-left: 0
    letter-spacing: 1px
    margin-bottom: 25px
    &.small
        margin-left: 0
        margin-bottom: 15px

.special-about-next
    font-family: OpenSans-Regular
    color: #14426B
    text-decoration: none
    margin-left: 20px
    font-size: 14px

.special-about
    color: #14426B
    text-decoration: none
    margin-top: 40px
    display: inline-block
    margin-left: 8%
    font-family: OpenSans-Regular
    font-size: 14px
    &.small
        margin-top: 25px
        margin-left: 5%

.special-pc-users
    font-family: OpenSans-Regular
    margin-left: 8%
    width: 84%
    &.small
        margin-left: 5%

.special-router
    text-decoration: none
    color: #303030

.special-pc-timelines
    font-family: OpenSans-Regular
    width: 84%
    margin-left: 8%
    &.small
        margin-left: 5%

.special-mobile
    animation-timing-function: ease-in
    animation: fadein 1s
    text-align: left
    margin: 60px 0

.special-pc
    animation-timing-function: ease-in
    animation: fadein 1s
    text-align: left
    padding: 20px
    position: fixed
    top: 100px
    right: 5%
    width: 25%
    padding-top: 15px
    overflow-y: auto
    max-height: calc( 100vh - 160px )
    &.medium
        right: 3%
        width: 25%
        top: 90px
        max-height: calc( 100vh - 150px )

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

.views
    font-family: OpenSans-Regular
    font-size: 14px
    float: left
    margin-left: 8%
    margin-top: 5px
    color: #7e7e7e
    &.small
        margin-left: 5%

.creation
    text-align: right
    float: right
    margin-right: 8%

.category
    font-family: OpenSans-Regular
    margin-top: 30px
    text-align: left
    font-size: 16px
    color: #7e7e7e
    margin-left: 8%
    &.small
        margin-left: 5%
        width: 90%

.author
    font-weight: normal
    font-family: OpenSans-Regular
    text-align: left
    font-size: 15px
    margin-top: 20px
    margin-left: 8%
    color: #14426B
    &.small
        margin-left: 5%
        width: 90%

.image_container
    display: block
    width: 84%
    margin-left: 8%
    margin-top: 30px
    margin-bottom: 30px
    &.small
        margin-left: 5%
        width: 90%

.image
    animation-timing-function: ease-in
    animation: fadein 1s
    border-radius: 5px
    width: 100%
    height: 350px
    object-fit: cover
    &.medium
        height: 320px
    &.small
        height: 300px

.desc
    text-decoration: none
    color: #303030
    margin-top: 20px
    font-family: OpenSans-Regular
    display: block
    vertical-align: top
    width: 84%
    text-align: justify 
    margin-left: 8%
    height: 67px
    overflow: hidden
    &.small
        margin-left: 5%
        width: 90%

.title
    text-decoration: none
    color: #303030
    margin-top: 10px
    font-family: Raleway-Regular
    display: block
    text-align: left
    font-size: 40px
    font-weight: bold
    letter-spacing: 1px
    margin-left: 8%
    &.small
        margin-left: 5%
        width: 90%

.element
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)
    border-radius: 15px
    padding-bottom: 50px
    padding-top: 20px
    width: 40%
    margin-left: 15%
    margin-top: 70px
    background: $bg-color
    &.medium
        width: 60%
        margin-left: 5%
    &.small
        width: 98%
        margin-top: 20px
        margin-left: 1%

.premium
    border: 1px solid #ffa585

.search-element
    width: 45%
    padding-bottom: 30px
    display: inline-block
    margin: 2%
    &.medium
        width: 45%
        margin: 2%

.search-container
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