<template lang="html">
    <div>
        <div id="creator" v-if="$store.state.jwt">
            <div id="tform">
                <h1>Creator</h1>
                <input class="ttitle tlid" type="text" id="timelineId" placeholder="ID">
                <div class="opis">{{ lorem }}</div>

                <div id="mainData">
                    <input class="ttitle" type="text" id="mainTitle" placeholder="Title">
                    <input class="file" type="file" id="mainPictures" multiple><br>
                    <textarea class="ttitle tlong" id="mainLong" placeholder="Description"></textarea>
                </div>

                <h2>Events</h2>
                <div class="opis">{{ lorem }}</div>

                <transition-group name="fade">
                    <div v-for="(evt, index) in events" v-bind:key="evt.id">
                        <div class="normal">
                            <div class="controls">
                                <div class="control_item" v-on:click="addEvent('normal', index)" v-if="index==0">&#43;</div>
                                <div class="control_item" v-on:click="deleteEvent(index)">&ndash;</div>
                                <div class="control_item up" v-on:click="changeIndex(index, index-1)" v-if="index!=0">&lang;</div>
                                <div class="control_item down" v-on:click="changeIndex(index, index+1)" v-if="index!=events.length-1">&lang;</div>
                            </div>
                            <div class="s_left">
                                <input class="ttitle" type="text" :id="'title'+index" placeholder="Title" :value="evt.title">
                                <input class="ttitle tdate" type="date" :id="'date'+index" placeholder="mm/dd/yyyy" :value="evt.date">
                                <input class="file" type="file" :id="'pictures'+index" multiple><br>
                                <textarea class="ttitle tlong" :id="'long'+index" placeholder="Description" :value="evt.shortDescription ? evt.shortDescription + '\n' + evt.description : ''"></textarea>
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
                                <div class="s_left">
                                    <input class="ttitle" :id="'sub'+index+'title'+subindex" type="text" placeholder="Title" :value="subevt.title">
                                    <input class="ttitle tdate" type="date" :id="'sub'+index+'date'+subindex" placeholder="mm/dd/yyyy" :value="subevt.date">
                                    <input class="file" type="file" :id="'sub'+index+'pictures'+subindex" multiple><br>
                                    <textarea class="ttitle tlong" :id="'sub'+index+'long'+subindex" placeholder="Description" :value="subevt.shortDescription ? subevt.shortDescription + '\n' + subevt.description : ''"></textarea>
                                </div>
                            </div>
                        </transition-group>
                    </div>
                </transition-group>
            </div>
            <div class="masterC" v-on:click="preview()">Preview</div>
            <div class="masterC" v-on:click="submit()">Submit</div>
        </div>
        <div style="margin-top: 100px" v-else>Login!!</div>

        <Timeline v-bind:mockEvents="eventsParsed" v-bind:mockTimeline="timeline" v-bind:mockSubEvents="subEventsParsed"></Timeline>

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
          events: [{id: 'first', type: 'normal', title: '', shortDescription: '', description: '', date: '', links: new Map(), sub: []}],
          eventsParsed: [],
          eventsParsedSubmit: [],
          timeline: {},
          subEventsParsed: [],

          mainTimelineSubmit: {},
          evtSubmited: null,
          subTimelinesReady: null,
          subTimelinesSubmitted: [],

          baseApi: 'http://localhost:8081/api/',
          lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae auctor urna, sed volutpat orci. Etiam interdum finibus eros, a porta quam ultrices id. Sed eget ligula vel lorem eleifend tincidunt. Proin at lacinia elit. Cras rhoncus interdum libero vitae tristique. Donec facilisis quam quis diam consequat, ullamcorper malesuada nisi elementum. Cras vehicula orci consectetur est blandit volutpat. Suspendisse ultrices imperdiet neque, suscipit pretium nulla commodo quis.'
      }
    },
    watch: {
        mainTimelineSubmit: function(){
            if (this.mainTimelineSubmit){
                var eventsApi = this.baseApi + 'events'
                var eventsParsedSubmitTemp = JSON.parse(JSON.stringify(this.eventsParsed))

                var counter1 = 0
                for (var i=0, len=eventsParsedSubmitTemp.length; i<len; i++){
                    eventsParsedSubmitTemp[i].timeline = this.mainTimelineSubmit
                    delete eventsParsedSubmitTemp[i]['type']
                    delete eventsParsedSubmitTemp[i]['id']

                    this.axios.post(eventsApi, eventsParsedSubmitTemp[i], {
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.jwt.token
                        }
                    })
                    .then(response => {
                        this.eventsParsedSubmit.push(response.data)
                        //events submitted now subTimelines
                        if (counter1 == len-1){
                            this.evtSubmited = true
                        }
                        counter1 +=1
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }   
            }
        },
        evtSubmited: function(){
            if (this.evtSubmited){
                var timelinesApi = this.baseApi + 'timelines'

                var subTimelinesLen = 0
                for (var i=0, len=this.eventsParsed.length; i<len; i++){
                    var subEvtsTemp = JSON.parse(JSON.stringify(this.subEventsParsed.find(x => x.id === this.eventsParsed[i].id).subEvents))
                    if (subEvtsTemp.length > 0){
                        //found subTimeline
                        subTimelinesLen += 1
                    }
                }

                var counter1 = 0
                for (i=0, len=this.eventsParsed.length; i<len; i++){
                    subEvtsTemp = JSON.parse(JSON.stringify(this.subEventsParsed.find(x => x.id === this.eventsParsed[i].id).subEvents))
                    if (subEvtsTemp.length > 0){
                        //found subTimeline
                        var subTimeline = {
                            id: this.mainTimelineSubmit.id + '-sub' + i,
                            event: this.eventsParsedSubmit[i]
                        }

                        this.axios.post(timelinesApi, subTimeline, {
                            headers: {
                                'Authorization': 'Bearer ' + this.$store.state.jwt.token
                            },
                            params: {
                                findUser: false
                            }
                        })
                        .then(response => {
                            this.subTimelinesSubmitted.push(response.data)
                            counter1 += 1
                            if (counter1 == subTimelinesLen){
                                //subTimelines submitted now subEvents
                                this.subTimelinesReady = true
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                    }
                }
            }
        },
        subTimelinesReady: function(){
            if(this.subTimelinesReady){
                var eventsApi = this.baseApi + 'events'

                var counter = 0
                for (var i=0, len=this.eventsParsed.length; i<len; i++){

                    var subEvtsTemp = JSON.parse(JSON.stringify(this.subEventsParsed.find(x => x.id === this.eventsParsed[i].id).subEvents))
                    if (subEvtsTemp.length > 0){
                        for (var j=0, len2=subEvtsTemp.length; j<len2; j++){
                            delete subEvtsTemp[j]['type']
                            delete subEvtsTemp[j]['id']
                            subEvtsTemp[j].timeline = this.subTimelinesSubmitted[counter]
                            this.axios.post(eventsApi, subEvtsTemp[j], {
                                headers: {
                                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                                }
                            })
                            .catch(error =>{
                                console.log(error)
                            })
                        }
                        counter += 1
                    }
                }
                alert("Submitted!")
            }
        }
    },
    methods: {
        submit(){
            var timelinesApi = this.baseApi + 'timelines'
            this.preview()

            //main timeline
            this.axios.post(timelinesApi, this.timeline, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.jwt.token
                    },
                    params: {
                        findUser: true
                    }
                })
                .then(response => {
                    //main timeline submitted now events
                    this.mainTimelineSubmit = response.data
                })
                .catch(error => {
                    console.log(error)
                })
        },
        preview() {
            this.saveData(true)
            //mainEvents
            this.eventsParsed = JSON.parse(JSON.stringify(this.events))
            for (var i=0, len=this.eventsParsed.length; i<len; i++){
                this.eventsParsed[i].type = "circle"
            }
            //timeline
            this.timeline = {
                id: document.getElementById("timelineId").value,
                descriptionTitle: document.getElementById("mainTitle").value,
                description: document.getElementById("mainLong").value
            }
            //subEvents
            this.subEventsParsed = []
            for (i=0, len=this.eventsParsed.length; i<len; i++){
                for (var j=0, len2=this.eventsParsed[i].sub.length; j<len2; j++){
                    this.eventsParsed[i].sub[j].type = "circle"
                }
                var object = {
                    id: this.eventsParsed[i].id,
                    subEvents: this.eventsParsed[i].sub
                }
                delete this.eventsParsed[i]["sub"]
                this.subEventsParsed.push(object)
            }
        },
        addEvent(index){
            this.saveData()
            //DOPRACOWAC dziala dodawanie tylko jednego sub eventu
            var event = {id: '', type: 'normal', title: '', shortDescription: '', description: '', date: '', links: new Map(), sub: []}
            event.id = '_' + Math.random().toString(36).substr(2, 9)
            if (index == this.events.length){
                this.events.push(event)

            } else{
                this.events.splice(index, 0, event)
            }
        },
        addSubEvent(index){
            this.saveData()
            var subEvent = {id: '', title: '', shortDescription: '', description: '', date: '', links: new Map()}
            subEvent.id = '_' + Math.random().toString(36).substr(2, 9)
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
        saveData(sort=false){
            for (var i=0, len=this.events.length; i<len; i++){
                this.events[i].title = document.getElementById("title"+i).value;
                document.getElementById("title"+i).value = '';

                var long = document.getElementById("long"+i).value.split('\n')
                this.events[i].shortDescription = long[0]
                long.shift()
                this.events[i].description = long.join('\n')
                document.getElementById("long"+i).value = '';

                this.events[i].date = document.getElementById("date"+i).value;
                document.getElementById("date"+i).value = '';

                if (this.events[i].sub){
                    for (var j=0, len2=this.events[i].sub.length; j<len2; j++){
                        if (document.getElementById("sub"+i+"title"+j)){
                            this.events[i].sub[j].title = document.getElementById("sub"+i+"title"+j).value;
                            document.getElementById("sub"+i+"title"+j).value = '';

                            long = document.getElementById("sub"+i+"long"+j).value.split('\n')
                            this.events[i].sub[j].shortDescription = long[0]
                            long.shift()
                            this.events[i].sub[j].description = long.join('\n')
                            document.getElementById("sub"+i+"long"+j).value = ''

                            this.events[i].sub[j].date = document.getElementById("sub"+i+"date"+j).value;
                            document.getElementById("sub"+i+"date"+j).value = '';
                        }
                    }
                    if (sort){
                        this.events[i].sub = this.sortByDate(this.events[i].sub)
                    }
                }
            }
            if (sort){
                this.events = this.sortByDate(this.events)
            }
        },
        sortByDate(array){
            return array.sort(function(a, b){
                return new Date(a.date) - new Date(b.date)
            })
        },
    },
    computed: {

    }
}


</script>

<style scoped lang="sass">
@import '../assets/saas-vars.sass'

.file
    margin-left: 40px
    font-family: OpenSans-Regular
    vertical-align: bottom

.file::-webkit-file-upload-button
    border: 0
    font-family: OpenSans-Regular
    height: 27px
    padding: 0 17px
    background: #e57676
    color: white
    letter-spacing: 1px
    border-radius: 3px
    .sub &
        background: #7ba9a9

h1
    margin-top: 100px
    font-size: 45px
    font-family: Raleway-Regular
    text-align: left

h2
    margin-top: 70px
    font-size: 25px
    font-family: Raleway-Regular
    text-align: left

.opis
    margin-left: 2px
    font-family: OpenSans-Regular  
    text-align: justify

#mainData
    text-align: left
    margin-top: 50px   

.p_line
    width: 100%
    height: 5px
    background: #303030

.masterC
    font-family: Raleway-Regular
    padding: 7px 12px
    display: inline-block
    margin: 120px 20px
    margin-bottom: 0
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

.control_item
    color: #666666
    font-weight: bold
    font-size: 18px
    display: inline-block
    margin: 0 27px
    font-family: OpenSans-Regular
    border-radius: 7px

.normal
    margin-top: 100px

.sub
    width: 95%
    margin-top: 20px
    margin-left: 5%
    margin-bottom: 25px

.ttitle
    box-sizing: border-box
    height: 50px
    width: 40%
    font-size: 25px
    .normal &
        border-left: 2px solid #ff8484
    background: #efefef
    color: #404040
    font-family: Raleway-Regular
    padding-left: 20px
    border: 0px
    &:focus
        outline: none
    .sub &
        border-left: 2px solid #89bcbc

.tlid
    font-size: 18px
    height: 35px
    position: absolute
    top: 110px
    width: 15%
    right: 22%

.tdate
    font-size: 12px
    width: 20%
    font-family: OpenSans-Regular
    padding-left: 22px
    margin-left: 45px
    height: 30px
    vertical-align: bottom
    color: #535353

::-webkit-inner-spin-button
    display: none

.tlong
    resize: none
    font-size: 15px
    font-family: OpenSans-Regular
    padding: 10px 20px
    height: 120px
    width: 100%
    margin-top: 5px
    .sub &
        height: 90px

//kolejnosc klas ma znaczenie te nizej sa wazniejsze
#creator
    padding: 1px 0
    margin: 0 10%
    background: $bg-color

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
    width: 100%
    display: inline-block

</style>
