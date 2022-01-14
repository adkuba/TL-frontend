<template>
        <div v-if="timeline && !timeline.none" class="element" v-bind:class="[timeline.category == 'PREMIUM' ? 'premium': '', {'search-element': search}, $mq]">
            <div v-if="!search" class="more" :class="$mq" v-on:click="openMore(idx)">&#9866;</div>
            <div v-if="!search" class="moreOpened" :class="$mq" :id="'more-' + idx" v-on:click="report(timeline, idx)">Report</div>
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
</template>

<script>
export default {
    name: 'HomeElement',
    props: {
        timeline: Object,
        search: Boolean,
        idx: Number
    },
    data() {
        return {
            baseApi: 'https://akuba.pl/api/tline/api/',
            defaultImage: (Math.floor(Math.random() * 10) + 1)
        }
    },
    methods: {
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
        },
        premium(timeline){
            if (timeline.category == 'PREMIUM'){
                this.axios.post(this.baseApi + 'timelines/public/premium-view?id=' + timeline.id)
                    .catch(error => {
                        console.log(error)
                    })
            }
        },
    }
}
</script>

<style scoped lang="sass">
@import '../assets/saas-vars.sass'

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

.search-element
    width: 45%
    padding-bottom: 30px
    display: inline-block
    margin: 2%
    &.medium
        width: 45%
        margin: 2%

.premium
    border: 1px solid #ffa585

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

</style>