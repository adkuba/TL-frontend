<template lang="html">
    <div>
        <div class="menu">
                <router-link :to="{ name: 'home' }" class="home_b"></router-link>
        </div>

        <div id="creator">
            <form id="tform">
                <div v-for="(evt, index) in events" :key="index">
                    <div class="normal" v-if="evt.type=='normal'">
                        <div class="controls">
                            <div class="control_item" v-on:click="addEvent('normal', index)">New</div>
                            <div class="control_item" v-on:click="deleteEvent(index)">Delete</div>
                            <div class="control_item" v-on:click="changeIndex(index, index-1)">Up</div>
                            <div class="control_item" v-on:click="changeIndex(index, index+1)">Down</div>
                        </div>
                        <div class="s_left">
                            <input class="ttitle" type="text" placeholder="Title"><br>
                            <textarea class="ttitle tshort" placeholder="Sub-title"></textarea>
                        </div>
                        <div class="s_right">
                            <textarea class="ttitle tlong" placeholder="Description"></textarea><br>
                            <input class="ttitle tlinks" type="text" placeholder="Link-title">
                            <input class="ttitle tlinks" type="text" placeholder="Link"><br>
                            <div class="add_sub" v-on:click="addEvent('sub', index)">Add</div>
                        </div>
                        <div class="s_line"></div>
                    </div>
                    <div class="sub" v-else>
                        <div class="controls">
                            <div class="control_item" v-on:click="deleteEvent(index)">Delete</div>
                            <div class="control_item" v-on:click="changeIndex(index, index-1)">Up</div>
                            <div class="control_item" v-on:click="changeIndex(index, index+1)">Down</div>
                        </div>
                        <div class="s_left">
                            <input class="ttitle" type="text" placeholder="Title"><br>
                            <textarea class="ttitle tshort" placeholder="Sub-title"></textarea>
                        </div>
                        <div class="s_right">
                            <textarea class="ttitle tlong" placeholder="Description"></textarea><br>
                            <input class="ttitle tlinks" type="text" placeholder="Link-title">
                            <input class="ttitle tlinks" type="text" placeholder="Link">
                        </div>
                        <div class="s_line"></div>
                    </div>
                </div>
            </form>
        </div>

    </div>
</template>

<script lang="js">

  export default  {
    name: 'Creator',
    props: [],
    mounted () {

    },
    data () {
      return {
          events: [{type: 'normal', title: 'd'}]
      }
    },
    methods: {
        addEvent(evtType, index){
            //DOPRACOWAC dziala dodawanie tylko jednego sub eventu
            var event = {type: evtType, title: ''}
            if (index == this.events.length-1){
                this.events.push(event)

            } else{
                this.events.splice(index, 0, event)
            }
        },
        deleteEvent(index){
            if (this.events.length != 1){
                this.events.splice(index, 1)   
            }
        },
        changeIndex(oldIndex, newIndex){
            if (newIndex >= 0 && newIndex < this.events.length){
                this.events.splice(newIndex, 0, this.events.splice(oldIndex, 1)[0]);
            }
        }
    },
    computed: {

    }
}


</script>

<style scoped lang="sass">
.add_sub
    text-align: right

.controls
    text-align: left
    width: 100%
    margin-bottom: 20px

.control_item
    display: inline-block
    margin-right: 40px    

.normal
    margin: 50px 0

.sub
    width: 95%
    margin-left: 5%
    margin-bottom: 25px

.ttitle
    box-sizing: border-box
    height: 35px
    width: 270px
    font-size: 20px
    background: #e6e6e6
    color: #404040
    font-family: Raleway-Regular
    margin-bottom: 10px
    padding-left: 20px
    border-radius: 5px
    border: 0px
    &:focus
        background: #d9d9d9
        outline: none

.tshort
    resize: none
    padding: 10px 20px
    height: 90px
    font-size: 15px
    font-family: OpenSans-Regular

.tlong
    resize: none
    font-size: 15px
    font-family: OpenSans-Regular
    padding: 10px 20px
    height: 85px
    width: 100%

//kolejnosc klas ma znaczenie te nizej sa wazniejsze
.tlinks
    font-family: OpenSans-Regular
    font-size: 15px
    margin-right: 20px
    width: 20%

#creator
    padding: 100px 0
    margin: 50px 10%
    background: #f6f6f6

#tform
    margin: 0 auto
    width: 80%

.s_line
    width: 100%
    height: 1px
    background: #cccccc
    margin-top: 40px
    display: inline-block

.s_left
    text-align: left
    width: 30%
    display: inline-block

.s_right
    vertical-align: top
    text-align: left
    width: 70%
    display: inline-block

</style>
