<template>
<div>
    <form action="javascript:void(0);" class="search" :class="$mq">
        <input placeholder="Search" type="search" class="search-input" onfocus="window.scrollTo({ top: 0, behavior: 'smooth' })" id="search-input">
        <button type="submit" v-on:click="search()" class="search-b" :class="$mq">&#9906;</button>
    </form>
    <div id="homepage" :class="$mq">
        <div v-if="searchResults.length == 0">
            <div class="element" v-for="(timeline, idx) in $store.state.timelines" :key="idx" :class="$mq"> 
                <div class="s_line" :class="$mq"></div>
                <div class="category" :class="$mq">{{ timeline.category }}</div>
                <router-link :to="{ path: 'timeline/' + timeline.id }" class="title" :class="$mq">{{ timeline.descriptionTitle }}</router-link>
                <router-link :to="{ path: 'timeline/' + timeline.id }" class="desc" :class="$mq">
                    {{ timeline.description.substring(0, 100) }}...
                    <div class="author">by {{ timeline.user.username }} <div class="views">&#x2687; {{ timeline.views }} &#9825; {{ timeline.likes }} </div></div>
                </router-link>
                 <router-link :to="{ path: 'timeline/' + timeline.id }" class="image_container" :class="$mq" v-if="timeline.pictures.length > 0">
                    <img :class="$mq" class="image" :src="timeline.pictures[0]">
                </router-link>
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
                        {{ timeline.description.substring(0, 250) }}...
                        <div class="author">by {{ timeline.user.username }} <div class="views">{{ timeline.views }} views, {{ timeline.likes }} &#9825;</div></div>
                    </router-link>
                    <router-link :to="{ path: 'timeline/' + timeline.id }" class="image_container" :class="$mq" v-if="timeline.pictures.length > 0">
                        <img :class="$mq" class="image" :src="timeline.pictures[0]">
                    </router-link>
                </div>
                <div v-else class="empty">Can't find.</div>
            </div>
        </div>
    </div>
</div>
</template>

<script>

export default {
    name: 'Home',
    created(){
        this.getTimelines()
        this.axios.post(this.baseApi + 'statistics/public', null)
        .catch(error => {
            console.log(error)
        })
    },
    data() {
        return {
            baseApi: 'http://localhost:8081/api/',
            searchResults: [ ]
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
        }
    },
    mounted() {
        this.scroll()
    }
}

</script>

<style scoped lang="sass">
@import '../assets/saas-vars.sass'
.empty
    font-family: OpenSans-Regular
    padding-top: 50px
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
    width: 85%
    height: 30px
    border-radius: 5px
    font-size: 17px

.search-b
    display: inline-block
    margin-left: 5%
    background: none
    border: none
    outline: none
    color: #b8b8b8
    width: 10%
    font-size: 25px
    transform: translateY(+4px) translateX(-10px)rotate(-45deg)
    &.small
        transform: translateY(+8px) translateX(-10px)rotate(-45deg)

input::-webkit-search-cancel-button
  -webkit-appearance: none

.search
    width: 25%
    font-family: OpenSans-Regular
    position: fixed
    z-index: 4
    transform: translateY(-38px) translateX(-50%)
    left: 50%
    &.medium
        width: 35%
    &.small
        width: 40%
        transform: translateY(-38px) translateX(-91%)

.views
    margin-top: 5px

.category
    font-family: OpenSans-Regular
    margin-top: 30px
    text-align: left
    font-size: 16px
    color: #7e7e7e
    margin-left: 5%

.author
    font-weight: normal
    font-family: OpenSans-Regular
    text-align: left
    font-size: 15px
    margin-top: 30px
    color: #7e7e7e

.s_line
    width: 100%
    height: 70px
    background: white
    display: inline-block
    &.small
        height: 40px

.image_container
    display: inline-block
    width: 21%
    margin-left: 6%
    margin-right: 3%
    transform: translateY(-40px)
    &.medium
        width: 29%
    &.small
        width: 90%
        margin: 30px 0
        margin-left: 5%
        transform: translateY(0)
        display: block

.image
    border-radius: 1px
    height: 170px
    width: 100%
    object-fit: cover
    &.medium
        height: 150px

.desc
    text-decoration: none
    color: #303030
    margin-top: 20px
    font-family: OpenSans-Regular
    display: inline-block
    vertical-align: top
    width: 65%
    text-align: justify 
    margin-left: 5%
    &.medium
        width: 57%
    &.small
        width: 90%
        display: block

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
    margin-left: 5%


.element
    border-radius: 5px
    padding-bottom: 60px
    width: 60%
    margin-left: 20%
    background: $bg-color
    &.medium
        width: 80%
        margin-left: 10%
    &.small
        width: 100%
        margin-left: 0
        
        padding-bottom: 60px

#homepage
    padding-top: 1px
    margin-top: 50px

.hh
    position: absolute
    top: 0
    margin-top: 60px

</style>
