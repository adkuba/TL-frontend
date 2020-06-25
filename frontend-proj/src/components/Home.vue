<template>
<div>
    <form action="javascript:void(0);" class="search" :class="$mq">
        <input placeholder="Search" type="search" class="search-input" onfocus="window.scrollTo({ top: 0, behavior: 'smooth' })" id="search-input">
        <button type="submit" v-on:click="search()" class="search-b" :class="$mq">&#9906;</button>
    </form>
    <div id="homepage" :class="$mq">
        <div v-if="searchResults.length == 0">
            <div v-if="$mq != 'small' && special" class="special-pc">
                <div v-if="special.data[0].username != null" class="special-pc-users">
                    Users: randomowi i new
                    <div v-for="(user, idx) in special.data" :key="idx">
                        {{ user.fullName }} <br> @{{user.username}} Followers: {{user.followers.filter(e => e.userId != null).length}}
                    </div>
                </div>
                <div v-else class="special-pc-timelines">
                    Popular timelines:
                    <div v-for="(timeline, idx) in special.data" :key="idx">
                        Title: {{timeline.descriptionTitle}}
                    </div>
                </div>
                <div class="special-about">About, help</div>
            </div>
            <div v-for="(timeline, idx) in $store.state.timelines" :key="idx" :class="$mq"> 
                <div v-if="timeline.data == null" class="element">
                    <div class="s_line" :class="$mq"></div>
                    <div class="category" :class="$mq">{{ timeline.category }}</div>
                    <router-link :to="{ path: 'timeline/' + timeline.id }" class="title" :class="$mq">{{ timeline.descriptionTitle }}</router-link>
                    <router-link :to="{ path: 'timeline/' + timeline.id }" class="desc" :class="$mq">
                        {{ timeline.description.substring(0, 100) }}...
                    </router-link>
                    <router-link :to="{ path: 'timeline/' + timeline.id }" class="image_container" :class="$mq" v-if="timeline.pictures.length > 0">
                        <img :class="$mq" class="image" :src="timeline.pictures[0]">
                    </router-link>
                    <div class="author" :class="$mq">By {{ timeline.user.username }} <div class="views" v-on:click="openDetails(timeline.likes)">{{ timeline.views }} views &middot; {{ timeline.likes.length }} likes</div></div>
                </div>
                <div v-else>
                    <div v-if="$mq == 'small'"> specjalny elem na mobile</div>
                </div>
            </div>
        </div>
        <div v-else>
            <h1 :class="$mq">Search results:</h1>
            <div v-on:click="quit()" class="quit" :class="$mq">x</div>
            <div class="element" v-for="(timeline, idx) in searchResults" :key="idx" :class="$mq">
                <div v-if="!timeline.none">
                    <div class="s_line" :class="$mq"></div>
                    <div class="category" :class="$mq"></div>
                    <router-link :to="{ path: 'timeline/' + timeline.id }" class="title" :class="$mq">{{ timeline.descriptionTitle }}</router-link>
                    <router-link :to="{ path: 'timeline/' + timeline.id }" class="desc" :class="$mq">
                        {{ timeline.description.substring(0, 100) }}...
                    </router-link>
                    <router-link :to="{ path: 'timeline/' + timeline.id }" class="image_container" :class="$mq" v-if="timeline.pictures.length > 0">
                        <img :class="$mq" class="image" :src="timeline.pictures[0]">
                    </router-link>
                    <div class="author" :class="$mq">By {{ timeline.user.username }} <div class="views" v-on:click="openDetails(timeline.likes)">{{ timeline.views }} views &middot; {{ timeline.likes.length }} likes</div></div>
                </div>
                <div v-else class="empty">Can't find.</div>
            </div>
        </div>
    </div>
    <div id="details">
        Users:
        <div class="exit" v-on:click="closeDetails()">x</div>
        <div v-for="(detail, index) in details" :key="index">
            {{ detail.userId }}
        </div>
    </div>
</div>
</template>

<script>

export default {
    name: 'Home',
    created(){
        this.getTimelines()
        this.getSpecial()
        this.axios.post(this.baseApi + 'statistics/public', null)
        .catch(error => {
            console.log(error)
        })
    },
    data() {
        return {
            baseApi: 'http://localhost:8081/api/',
            searchResults: [ ],
            details: null,
            counter: 0,
            special: null
        }
    },
    methods: {
        openDetails(likes){
            this.details = likes
            document.getElementById('details').style.display = 'block'
        },
        closeDetails(){
            this.details = null
            document.getElementById('details').style.display = 'none'
        },
        scroll() {
            window.onscroll = () => {
                let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

                if (bottomOfWindow) {
                    this.getTimelines()
                    if (this.counter == 2){
                        this.counter = 0
                        this.getSpecial()
                    }
                    this.counter += 1
                }
            };
        },
        getTimelines(){
            var timelinesApi = this.baseApi + 'timelines/public/homepage'
            this.axios.get(timelinesApi)
            .then(response => {
                this.$store.commit('addTimelines', response.data)
            })
            .catch(error => {
                console.log(error)
            })
        },
        search(){
            if (document.getElementById("search-input").value){
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
        }
    },
    mounted() {
        this.scroll()
    }
}

</script>

<style scoped lang="sass">
@import '../assets/saas-vars.sass'
.special-about
    background: $bg-color
    padding: 20px

.special-pc-users
    background: $bg-color
    padding: 20px

.special-pc-timelines
    background: $bg-color
    padding: 20px

.special-pc
    position: fixed
    top: 150px
    right: 20%

.exit
    position: absolute
    top: 10px
    right: 20px

#details
    position: fixed
    top: 40%
    left: 50%
    transform: translateX(-50%) translateY(-50%)
    width: 20%
    background: white
    display: none
    box-shadow: 0 0 0 1600px rgba(0,0,0,0.65)

.empty
    font-family: OpenSans-Regular
    padding-top: 50px
    padding-bottom: 50px
    text-align: left
    font-size: 20px
    margin-left: 5%

.quit
    position: absolute
    right: 20%
    top: 100px
    font-family: OpenSans-Regular
    font-size: 30px
    color: #7e7e7e
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
    background: #303030
    padding: 0 10px
    outline: none
    border: none
    color: white
    width: 80%
    height: 30px
    border-radius: 10px
    font-size: 17px

.search-b
    display: inline-block
    margin-left: 10%
    background: none
    border: none
    outline: none
    color: #b8b8b8
    width: 10%
    font-size: 25px
    transform: translateY(+4px) translateX(-10px)rotate(-45deg)
    &.small
        transform: translateY(+6px) translateX(-10px)rotate(-45deg)

input::-webkit-search-cancel-button
  -webkit-appearance: none

.search
    width: 30%
    font-family: OpenSans-Regular
    position: fixed
    z-index: 4
    transform: translateY(-41px) translateX(calc(-50% + 5px))
    left: 50%
    &.medium
        width: 40%
    &.small
        width: 60%

.views
    cursor: pointer
    margin-top: 5px
    color: #7e7e7e

.category
    font-family: OpenSans-Regular
    margin-top: 30px
    text-align: left
    font-size: 16px
    color: #7e7e7e
    margin-left: 10%
    &.small
        margin-left: 5%
        width: 90%

.author
    font-weight: normal
    font-family: OpenSans-Regular
    text-align: left
    font-size: 15px
    margin-top: 20px
    margin-left: 10%
    color: #14426B
    &.small
        margin-left: 5%
        width: 90%

.s_line
    width: 100%
    height: 100px
    background: white
    display: inline-block
    &.small
        height: 50px

.image_container
    display: block
    width: 80%
    margin-left: 10%
    margin-top: 30px
    &.small
        margin-left: 5%
        width: 90%

.image
    border-radius: 1px
    width: 100%
    max-height: 350px
    object-fit: cover

.desc
    text-decoration: none
    color: #303030
    margin-top: 20px
    font-family: OpenSans-Regular
    display: block
    vertical-align: top
    width: 80%
    text-align: justify 
    margin-left: 10%
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
    margin-left: 10%
    &.small
        margin-left: 5%
        width: 90%


.element
    border-radius: 5px
    padding-bottom: 40px
    width: 40%
    margin-left: 20%
    background: $bg-color
    &.medium
        width: 50%
        margin-left: 10%
    &.small
        width: 100%
        margin-left: 0

#homepage
    padding-top: 1px
    margin-top: 50px

.hh
    position: absolute
    top: 0
    margin-top: 60px

</style>
