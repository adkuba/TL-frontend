<template lang="html">
    <div>
        <div id="creator" v-if="$store.state.jwt">
            <div id="tform">
                <transition-group name="fade">
                    <div v-for="(evt, index) in events" v-bind:key="evt.id">
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
                                <input class="ttitle tshort" type="text" :id="'short'+index" placeholder="sub-title" :value="evt.shortDescription"><br>
                                <textarea class="ttitle tlong" :id="'long'+index" placeholder="Description" :value="evt.description"></textarea>
                                <input class="ttitle tdate" type="date" :id="'date'+index" placeholder="mm/dd/yyyy" :value="evt.date"><br>
                                <div class="control_item add_sub" v-on:click="addSubEvent(index)">&#43;</div>
                            </div>
                            <div class="s_line"></div>
                        </div>
                        <transition-group name="fade">
                            <div class="sub" v-for="(subevt, subindex) in evt.sub" v-bind:key="subevt.id">
                                <div class="controls">
                                    <div class="control_item del" v-on:click="deleteSubEvent(index, subindex)">&ndash;</div>
                                    <div class="control_item up" v-on:click="changeSubIndex(index, subindex, subindex-1)" v-if="subindex!=0">&lang;</div>
                                    <div class="control_item down" v-on:click="changeSubIndex(index, subindex, subindex+1)" v-if="subindex!=evt.sub.length-1">&lang;</div>
                                </div>
                                <div class="marker"></div>
                                <div class="s_left">
                                    <input class="ttitle" :id="'sub'+index+'title'+subindex" type="text" placeholder="Title" :value="subevt.title"><br>
                                    <input class="ttitle tshort" type="text" :id="'sub'+index+'short'+subindex" placeholder="sub-title" :value="subevt.shortDescription"><br>
                                    <textarea class="ttitle tlong" :id="'sub'+index+'long'+subindex" placeholder="Description" :value="subevt.description"></textarea>
                                    <input class="ttitle tdate" type="text" :id="'sub'+index+'date'+subindex" placeholder="mm/dd/yyyy" :value="subevt.sate"><br>
                                </div>
                                <div class="s_line"></div>
                            </div>
                        </transition-group>
                    </div>
                </transition-group>
            </div>
            <div class="masterC" v-on:click="preview()">Preview</div>
            <div class="masterC">Submit</div>
        </div>
        <div style="margin-top: 100px" v-else>Login!!</div>

        <Timeline v-bind:mockEvents="eventsParsed"></Timeline>

    </div>
</template>

<script lang="js">
  import Timeline from './Timeline.vue';

  export default  {
    name: 'Creator',
    components: {
        Timeline
    },
    data () {
      return {
          events: [{id: 'first', type: 'normal', title: '', shortDescription: '', description: '', date: '', links: [], sub: []}],
          eventsParsed: []
      }
    },
    methods: {
        preview() {
            this.saveData()
            this.eventsParsed = JSON.parse(JSON.stringify(this.events))
            for (var i=0, len=this.eventsParsed.length; i<len; i++){
                delete this.eventsParsed[i]["id"];
                this.eventsParsed[i].type = "circle";
                delete this.eventsParsed[i]["sub"];
            }
        },
        addEvent(index){
            this.saveData()
            //DOPRACOWAC dziala dodawanie tylko jednego sub eventu
            var event = {id: '', type: 'normal', title: '', shortDescription: '', description: '', date: '', links: [], sub: []}
            event.id = '_' + Math.random().toString(36).substr(2, 9);
            if (index == this.events.length){
                this.events.push(event)

            } else{
                this.events.splice(index, 0, event)
            }
        },
        addSubEvent(index){
            this.saveData()
            var subEvent = {id: '', title: '', shortDescription: '', description: '', date: '', links: []}
            subEvent.id = '_' + Math.random().toString(36).substr(2, 9);
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

                this.events[i].description = document.getElementById("long"+i).value;
                document.getElementById("long"+i).value = '';

                this.events[i].shortDescription = document.getElementById("short"+i).value;
                document.getElementById("short"+i).value = '';

                this.events[i].date = document.getElementById("date"+i).value;
                document.getElementById("date"+i).value = '';

                if (this.events[i].sub){
                    for (var j=0, len2=this.events[i].sub.length; j<len2; j++){
                        if (document.getElementById("sub"+i+"title"+j)){
                            this.events[i].sub[j].title = document.getElementById("sub"+i+"title"+j).value;
                            document.getElementById("sub"+i+"title"+j).value = '';

                            this.events[i].sub[j].description = document.getElementById("sub"+i+"long"+j).value;
                            document.getElementById("sub"+i+"long"+j).value = '';

                            this.events[i].sub[j].shortDescription = document.getElementById("sub"+i+"short"+j).value;
                            document.getElementById("sub"+i+"short"+j).value = '';

                            this.events[i].sub[j].date = document.getElementById("sub"+i+"date"+j).value;
                            document.getElementById("sub"+i+"date"+j).value = '';
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
.p_line
    width: 100%
    height: 5px
    background: #303030

.marker
    vertical-align: top
    display: inline-block
    background: #ff6666
    width: 4px
    margin-right: 40px
    height: 90px
    .sub &
        background: #6cacac

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
    margin: 0 10px !important

.controls
    text-align: left
    width: 100%
    margin-bottom: 10px
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
    height: 45px
    width: 40%
    font-size: 20px
    background: #EBEBEB
    color: #404040
    font-family: Raleway-Regular
    padding-left: 20px
    border: 0px
    &:focus
        outline: none

.tdate
    font-size: 15px
    width: 100%
    transform: translateY(-5px)
    font-family: OpenSans-Regular
    border-bottom-right-radius: 10px
    padding-left: 22px

.tshort
    border-bottom-right-radius: 10px
    font-size: 15px
    padding-left: 22px

.tlong
    resize: none
    font-size: 15px
    font-family: OpenSans-Regular
    padding: 10px 20px
    height: 120px
    width: 100%
    margin-top: 20px
    .sub &
        height: 90px

//kolejnosc klas ma znaczenie te nizej sa wazniejsze
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
    width: 95%
    display: inline-block

</style>
