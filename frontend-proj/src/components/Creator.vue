<template lang="html">
    <div>
        <div class="menu">
                <router-link :to="{ name: 'home' }" class="home_b"></router-link>
        </div>

        <div id="creator">
            <form id="tform">
                <transition-group name="fade">
                    <div v-for="(evt, index) in events" :key="evt">
                        <div class="normal">
                            <div class="controls">
                                <div class="control_item" v-on:click="addEvent('normal', index)" v-if="index==0">&#43;</div>
                                <div class="control_item" v-on:click="deleteEvent(index)">&ndash;</div>
                                <div class="control_item up" v-on:click="changeIndex(index, index-1)" v-if="index!=0">&lang;</div>
                                <div class="control_item down" v-on:click="changeIndex(index, index+1)" v-if="index!=events.length-1">&lang;</div>
                            </div>
                            <div class="marker"></div>
                            <div class="s_left">
                                <input class="ttitle" type="text" :id="'title'+index" placeholder="Title" :value="evt.title"><br>
                                <textarea class="ttitle tshort" :id="'short'+index" placeholder="Sub-title" :value="evt.short"></textarea>
                            </div>
                            <div class="s_right">
                                <textarea class="ttitle tlong" :id="'long'+index" placeholder="Description" :value="evt.long"></textarea><br>
                                <input class="ttitle tlinks" type="text" placeholder="Link-title">
                                <input class="ttitle tlinks" type="text" placeholder="Link"><br>
                                <div class="control_item add_sub" v-on:click="addSubEvent(index)">&#43;</div>
                            </div>
                            <div class="s_line"></div>
                        </div>
                        <transition-group name="fade">
                            <div class="sub" v-for="(subevt, subindex) in evt.sub" :key="subevt">
                                <div class="controls">
                                    <div class="control_item del" v-on:click="deleteSubEvent(index, subindex)">&ndash;</div>
                                    <div class="control_item up" v-on:click="changeSubIndex(index, subindex, subindex-1)" v-if="subindex!=0">&lang;</div>
                                    <div class="control_item down" v-on:click="changeSubIndex(index, subindex, subindex+1)" v-if="subindex!=evt.sub.length-1">&lang;</div>
                                </div>
                                <div class="marker"></div>
                                <div class="s_left">
                                    <input class="ttitle" :id="'sub'+index+'title'+subindex" type="text" placeholder="Title" :value="subevt.title"><br>
                                    <textarea class="ttitle tshort" :id="'sub'+index+'short'+subindex" placeholder="Sub-title" :value="subevt.short"></textarea>
                                </div>
                                <div class="s_right">
                                    <textarea class="ttitle tlong" :id="'sub'+index+'long'+subindex" placeholder="Description" :value="subevt.long"></textarea><br>
                                    <input class="ttitle tlinks" type="text" placeholder="Link-title">
                                    <input class="ttitle tlinks" type="text" placeholder="Link">
                                </div>
                                <div class="s_line"></div>
                            </div>
                        </transition-group>
                    </div>
                </transition-group>
            </form>
            <div class="masterC" >Preview</div>
            <div class="masterC">Submit</div>
        </div>

    </div>
</template>

<script lang="js">

  export default  {
    name: 'Creator',
    data () {
      return {
          events: [{type: 'normal', title: '', short: '', long: '', sub: []}]
      }
    },
    methods: {
        addEvent(index){
            this.saveData()
            //DOPRACOWAC dziala dodawanie tylko jednego sub eventu
            var event = {type: 'normal', title: '', short: '', long: '', sub: []}
            if (index == this.events.length){
                this.events.push(event)

            } else{
                this.events.splice(index, 0, event)
            }
        },
        addSubEvent(index){
            this.saveData()
            var subEvent = {title: '', short: '', long: ''}
            this.events[index].sub.unshift(subEvent)
        },
        deleteEvent(index){
            if (this.events.length != 1){
                this.events.splice(index, 1)   
            }
        },
        changeIndex(oldIndex, newIndex){
            if (newIndex >= 0 && newIndex < this.events.length){
                this.saveData()
                this.events.splice(newIndex, 0, this.events.splice(oldIndex, 1)[0]);
            }
        },
        deleteSubEvent(index, subindex){
            this.events[index].sub.splice(subindex, 1)
        },
        changeSubIndex(index, oldIndex, newIndex){
            if (newIndex >= 0 && newIndex < this.events[index].sub.length){
                this.saveData()
                this.events[index].sub.splice(newIndex, 0, this.events[index].sub.splice(oldIndex, 1)[0]);
            }
        },
        saveData(){
            for (var i=0, len=this.events.length; i<len; i++){
                this.events[i].title = document.getElementById("title"+i).value;
                document.getElementById("title"+i).value = '';

                this.events[i].short = document.getElementById("short"+i).value;
                document.getElementById("short"+i).value = '';

                this.events[i].long = document.getElementById("long"+i).value;
                document.getElementById("long"+i).value = '';

                if (this.events[i].sub){
                    for (var j=0, len2=this.events[i].sub.length; j<len2; j++){
                        if (document.getElementById("sub"+i+"title"+j)){
                            this.events[i].sub[j].title = document.getElementById("sub"+i+"title"+j).value;
                            document.getElementById("sub"+i+"title"+j).value = '';

                            this.events[i].sub[j].short = document.getElementById("sub"+i+"short"+j).value;
                            document.getElementById("sub"+i+"short"+j).value = '';

                            this.events[i].sub[j].long = document.getElementById("sub"+i+"long"+j).value;
                            document.getElementById("sub"+i+"long"+j).value = '';
                        }
                    }
                }
            }
        }
    },
    computed: {

    }
}


</script>

<style scoped lang="sass">
.marker
    vertical-align: top
    display: inline-block
    background: #6cacac
    width: 4px
    margin-right: 3%
    height: 135px
    .sub &
        background: #ff6666

.masterC
    font-family: Raleway-Regular
    padding: 7px 12px
    display: inline-block
    margin: 120px 20px
    font-weight: bold
    font-size: 30px

.fade-leave-active
    transition: all 1ms

.fade-move, .fade-enter-active
    transition: all 0.4s

.fade-enter, .fade-leave-to
    opacity: 0

.up
    transform: rotateZ(90deg)

.down
    transform: rotateZ(-90deg)

.add_sub
    float: right
    margin: 0 5px !important

.controls
    text-align: left
    width: 100%
    margin-bottom: 20px
    margin-left: 5%
    

.control_item
    color: #666666
    font-weight: bold
    font-size: 18px
    display: inline-block
    margin: 0 27px
    font-family: OpenSans-Regular
    border-radius: 7px

.normal
    margin-top: 150px

.sub
    width: 95%
    margin-top: 20px
    margin-left: 5%
    margin-bottom: 25px

.ttitle
    box-sizing: border-box
    height: 35px
    width: 90%
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
    padding: 1px 0
    margin: 0 10%
    background: #f6f6f6

#tform
    margin: 0 auto
    width: 70%

.s_line
    width: 100%
    height: 1px
    background: #cccccc
    display: inline-block

.s_left
    text-align: left
    width: 30%
    display: inline-block

.s_right
    vertical-align: top
    text-align: left
    width: 64%
    display: inline-block

</style>
