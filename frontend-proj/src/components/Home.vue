<template>
<div>
    <div class="search">
        <input type="search" onfocus="window.scrollTo({ top: 0, behavior: 'smooth' })">
        <div v-on:click="search()" class="search-b">Search</div>
    </div>
    <div id="homepage" :class="$mq">
        <div v-if="searchResults.length == 0">
            <div class="element" v-for="(timeline, idx) in $store.state.timelines" :key="idx">
                <div class="s_line"></div>
                <div class="category">{{ timeline.category }}</div>
                <router-link :to="{ path: 'timeline/' + timeline.id }" class="image_container" v-if="timeline.pictures.length > 0">
                    <img class="image" :src="timeline.pictures[0]">
                </router-link>
                <router-link :to="{ path: 'timeline/' + timeline.id }" class="title">{{ timeline.descriptionTitle }}</router-link>
                <router-link :to="{ path: 'timeline/' + timeline.id }" class="desc">
                    {{ timeline.description.substring(0, 250) }}...
                </router-link>
                <div class="author">by {{ timeline.user.username }}, <div class="views">{{ timeline.views }} views</div></div>
            </div>
        </div>
        <div v-else>
            <h1>Search results:</h1>
            <div v-on:click="quit()" class="quit">x</div>
            <div class="element" v-for="(timeline, idx) in searchResults" :key="idx">
                <div class="s_line"></div>
                <div class="category"></div>
                <router-link :to="{ path: 'timeline/' + timeline.id }" class="image_container" v-if="timeline.pictures.length > 0">
                    <img class="image" :src="timeline.pictures[0]">
                </router-link>
                <router-link :to="{ path: 'timeline/' + timeline.id }" class="title">{{ timeline.descriptionTitle }}</router-link>
                <router-link :to="{ path: 'timeline/' + timeline.id }" class="desc">
                    {{ timeline.description.substring(0, 250) }}...
                </router-link>
                <div class="author">by {{ timeline.user.username }}, <div class="views">{{ timeline.views }} views</div></div>
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
            var timelinesApi = this.baseApi + 'timelines/public/random'
            this.axios.get(timelinesApi)
            .then(response => {
                this.$store.commit('addTimelines', response.data)
            })
            .catch(error => {
                console.log(error)
            })
        },
        search(){
            var timelinesApi = this.baseApi + 'timelines/public/random'
            this.axios.get(timelinesApi)
            .then(response => {
                this.searchResults = response.data
            })
            .catch(error => {
                console.log(error)
            })
        },
        quit(){
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
.quit
    position: absolute
    right: 21%
    top: 100px
    font-family: OpenSans-Regular
    font-size: 30px

h1
    font-family: Raleway-Regular
    font-size: 40px
    text-align: left
    margin-left: 18%
    margin-top: 50px

.search-b
    display: inline-block
    margin-left: 20px

.search
    position: fixed
    z-index: 4
    width: 20%
    transform: translateY(-35px) translateX(-50%)
    left: 50%
    color: white

.views
    display: inline-block
    margin-left: 15px

.category
    font-family: OpenSans-Regular
    margin-top: 30px
    text-align: left
    color: #7e7e7e
    font-size: 16px

.author
    font-weight: normal
    font-family: OpenSans-Regular
    text-align: left
    font-size: 15px
    margin-top: 30px
    color: #7e7e7e

.s_line
    width: calc( 100% + 100px )
    transform: translateX(-50px)
    height: 70px
    background: white
    display: inline-block

.image_container
    position: absolute
    display: block
    right: 20%
    margin-top: 5px

.image
    border-radius: 1px
    height: 170px
    width: 260px
    object-fit: cover

.desc
    text-decoration: none
    color: #303030
    margin-top: 20px
    font-family: OpenSans-Regular
    display: block
    width: 73%
    text-align: justify 

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


.element
    border-radius: 5px
    padding: 0 50px
    padding-bottom: 60px
    width: 60%
    margin-left: calc(20% - 50px)
    background: $bg-color

#homepage
    padding-top: 1px
    margin-top: 50px

.hh
    position: absolute
    top: 0
    margin-top: 60px

</style>
