<template lang="html">
    <div>
        <div class="menu">
                <router-link :to="{ name: 'home' }" class="home_b"></router-link>
                <router-link :to="{ name: 'creator' }" class="creator_b">Nowa strona</router-link>
        </div>

        <div v-if="!jwt" id="login" :class="$mq">
            <form class="login_form">
                <h1>Sign in</h1>
                <input class="fin" type="text" placeholder="Username"><br>
                <input class="fin" type="password" placeholder="Password"><br><br>
                <input class="fsubmit" type="submit" value="Login" v-on:click="jwt='d'">
                <div class="fsignup">Sign up</div>
            </form> 
        </div>

        <div v-if='jwt' id="settings" :class="$mq">
            <div class="s_item">
                <div class="s_left">Dane</div>
                <div class="s_right">
                    <div>Email: akuba</div>
                    <div>Haslo: **</div>
                </div>
                <div class="s_line"></div>
            </div>
            <div class="s_item">
                <div class="s_left">Strona</div>
                <div class="s_right">Twoja strona 1</div>
                <div class="s_line"></div>
            </div>
        </div>

    </div>
</template>

<script lang="js">

  export default  {
    name: 'Login',
    props: [],
    mounted () {

    },
    data () {
      return {
          jwt: ''
      }
    },
    methods: {

    },
    computed: {

    }
}


</script>

<style scoped lang="sass">
.creator_b
    z-index: 4
    color: white
    background: #B8352D
    float: right
    margin: 15px
    text-decoration: none
    font-family: Raleway-Regular

.s_line
    width: 100%
    height: 1px
    background: #cccccc
    margin-top: 40px
    display: inline-block

.s_left
    font-weight: bold
    text-align: left
    width: 30%
    font-size: 25px
    font-family: 'Raleway-Regular'
    display: inline-block
    float: left

.s_right
    font-family: 'OpenSans-Regular'
    text-align: left
    float: left
    width: 70%
    display: inline-block  

.s_item
    letter-spacing: 1px
    margin: 0 auto
    width: 80%
    margin-bottom: 100px

#settings
    background: #F6F6F6
    padding: 100px 0
    &.large
        margin: 50px 10%

#login
    background: #F6F6F6
    font-family: 'Raleway-Regular'
    &.large
        margin: 50px 10%

.login_form
    padding: 120px 0
    letter-spacing: 2px
    h1
        margin: 0 auto
        margin-bottom: 40px
        text-align: left
        width: 300px
        font-size: 40px

.fin
    margin-bottom: 15px
    border-radius: 5px
    border: 0px
    background: #e6e6e6
    height: 40px
    width: 280px
    padding-left: 20px
    font-size: 15px
    font-family: 'OpenSans-Regular'
    &:focus
        background: #d9d9d9
        outline: none

.fsubmit
    margin-top: 10px
    border-radius: 5px
    height: 40px
    width: 300px
    font-family: 'Raleway-Regular'
    letter-spacing: 1px
    font-weight: bold
    font-size: 15px
    border: 0
    background: #B8352D
    color: white
    &:focus
        outline: none
        background: #a42e28

.fsignup
    font-size: 14px
    text-align: left
    margin: 15px auto
    width: 290px
    letter-spacing: 0px

</style>
