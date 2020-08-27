<template>
    <div v-if="special && special.data[0]" v-bind:class="[{'special-mobile': mobile}, {'special-pc': !mobile}, $mq]">
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
</template>

<script>
export default {
    name: 'HomeSpecial',
    props: {
        special: Object,
        mobile: Boolean
    }
}
</script>

<style scoped lang="sass">

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

.special-pc-timelines
    font-family: OpenSans-Regular
    width: 84%
    margin-left: 8%
    &.small
        margin-left: 5%

.special-name
    margin-top: 30px
    font-family: Raleway-Regular
    font-size: 20px

.special-desc
    color: #7e7e7e
    margin-left: 2px
    font-size: 14px

.special-router
    text-decoration: none
    color: #303030

.special-h1
    font-family: Raleway-Regular
    margin-top: 10px
    margin-left: 0
    letter-spacing: 1px
    margin-bottom: 25px
    &.small
        margin-left: 0
        margin-bottom: 15px

.special-pc-users
    font-family: OpenSans-Regular
    margin-left: 8%
    width: 84%
    &.small
        margin-left: 5%

.category-special
    font-family: OpenSans-Regular
    margin-top: 30px
    margin-left: 8%
    text-align: left
    font-size: 16px
    color: #7e7e7e
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

</style>