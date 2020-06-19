<template lang="html">
    <div>
        <div id="mainPicturesContainer" class="file-selector" :class="$mq">
            <div class="exit" v-on:click="close()">x</div>
            <input class="file" @change="saveData()" type="file" id="mainPictures" multiple><br>
            <div class="image-master">
                <div class="image-container" :class="$mq" v-for="(img, index) in currentPictures" :key="index">
                    <img class="image" :class="$mq" :src="img" v-on:click="deleteImg(index)">
                </div>
            </div>
        </div>

        <div id="creator" :class="$mq" v-if="$store.state.jwt">
            <form action="javascript:void(0);" id="tform" :class="$mq">
                <h1>Creator</h1>
                <div class="errorID">{{ errorMessage }}</div>
                <input class="ttitle tlid" :class="$mq" type="text" id="timelineId" placeholder="ID" maxlength="40" required pattern="[^/]*" title="Don't use /" :value="timeline.id">
                <div class="opis">Create your timeline.</div>

                <div id="mainData">
                    <input class="ttitle" :class="$mq" type="text" id="mainTitle" required maxlength="60" placeholder="Title" :value="timeline.descriptionTitle">
                    <div v-if="timeline.pictures" class="file-container" :class="$mq" v-on:click="open(-1)">Files {{timeline.pictures.length}}</div>
                    <textarea class="ttitle tlong" id="mainLong" required placeholder="Description" maxlength="3000" :value="timeline.description"></textarea>
                </div>

                <h2>Events</h2>
                <div class="opis">Add events to your timeline.</div>

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
                                <input class="ttitle" :class="$mq" type="text" :id="'title'+index" required maxlength="40" placeholder="Title" :value="evt.title">
                                <input class="ttitle tdate" :class="$mq" type="date" required :id="'date'+index" placeholder="mm/dd/yyyy" :value="evt.date">
                                <div v-if="timeline.pictures" :class="$mq" class="file-container" v-on:click="open(index)">Files {{evt.pictures.length}}</div>
                                <textarea class="ttitle tlong" :id="'long'+index" required maxlength="1500" placeholder="Description" :value="evt.shortDescription ? evt.shortDescription + '\n' + evt.description : ''"></textarea>
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
                                    <input class="ttitle" :class="$mq" :id="'sub'+index+'title'+subindex" required maxlength="40" type="text" placeholder="Title" :value="subevt.title">
                                    <input class="ttitle tdate" :class="$mq" type="date" required :id="'sub'+index+'date'+subindex" placeholder="mm/dd/yyyy" :value="subevt.date">
                                    <div v-if="timeline.pictures" :class="$mq" class="file-container" v-on:click="open(index, subindex)">Files {{subevt.pictures.length}}</div>
                                    <textarea class="ttitle tlong" :id="'sub'+index+'long'+subindex" required maxlength="1500" placeholder="Description" :value="subevt.shortDescription ? subevt.shortDescription + '\n' + subevt.description : ''"></textarea>
                                </div>
                            </div>
                        </transition-group>
                    </div>
                </transition-group>
                <input type="submit" :class="$mq" class="masterC" v-on:click="preview()" value="Preview">
                <input type="submit" :class="$mq" class="masterC" v-on:click="submit()" value="Submit">
            </form>
            
        </div>
        <div style="margin-top: 100px" v-else>Login!!</div>

        <Timeline v-bind:mockEvents="eventsParsed" v-bind:mockTimeline="timeline" v-bind:mockSubEvents="subEventsParsed"></Timeline>

    </div>
</template>

<script lang="js">
  import Timeline from './Timeline.vue';

  export default  {
    name: 'Creator',
    props: {
        editTimeline: Object,
        editEvents: Array
    },
    components: {
        Timeline
    },
    data () {
      return {
          events: [{id: 'first', type: 'normal', title: '', pictures: [], picturesRaw: [], shortDescription: '', description: '', date: '', links: new Map(), sub: []}],
          eventsParsed: [],
          eventsParsedSubmit: [],
          timeline: {pictures: [], picturesRaw: []},
          subEventsParsed: [],
          errorMessage: '',

          mainTimelineSubmit: {},
          subTimelinesSubmitted: [],

          openedPictures: -1,
          openedSubPictures: -1,
          currentPictures: [],
          deletedPictures: [],

          baseApi: 'http://localhost:8081/api/',
          }
    },
    updated() {
        if (this.editTimeline){
            document.getElementById('timelineId').disabled = true
        }
    },
    watch: {
        editEvents: function(){
            if (this.editEvents){
                for (var i=0, len=this.editEvents.length; i<len; i++){
                    this.editEvents[i].type = "normal"
                }
                this.events = this.editEvents
            }
        },
        editTimeline: function(){
            if (this.editTimeline){
                this.timeline = this.editTimeline
                
            }
        },
        mainTimelineSubmit: function(){
            if (this.mainTimelineSubmit){
                var eventsApi = this.baseApi + 'events/multiple'
                var eventsParsedSubmitTemp = JSON.parse(JSON.stringify(this.eventsParsed))

                for (var i=0, len=eventsParsedSubmitTemp.length; i<len; i++){
                    eventsParsedSubmitTemp[i].timeline = this.mainTimelineSubmit
                    delete eventsParsedSubmitTemp[i]['type']
                    delete eventsParsedSubmitTemp[i]['id']
                    delete eventsParsedSubmitTemp[i]['pictures']
                    delete eventsParsedSubmitTemp[i]['picturesRaw']
                }
                this.axios.post(eventsApi, eventsParsedSubmitTemp, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.jwt.token
                    }
                })
                .then(response => {
                    for (i=0, len=this.events.length; i<len; i++){
                        this.sendPictures(this.baseApi + 'events/' + response.data[i].id, this.events[i].pictures, this.events[i].picturesRaw)
                    }
                    this.eventsParsedSubmit = response.data
                })
                .catch(error => {
                    console.log(error)
                })
            }
        },
        eventsParsedSubmit: function(){
            if (this.eventsParsedSubmit){
                var timelinesApi = this.baseApi + 'timelines/multiple'

                var subTimelines = []
                for (var i=0, len=this.eventsParsed.length; i<len; i++){
                    var subEvtsTemp = JSON.parse(JSON.stringify(this.subEventsParsed.find(x => x.id === this.eventsParsed[i].id).subEvents))
                    if (subEvtsTemp.length > 0){
                        //found subTimeline
                        var subTimeline = {
                            id: this.mainTimelineSubmit.id + '-sub' + i,
                            event: this.eventsParsedSubmit[i]
                        }

                        subTimelines.push(subTimeline)
                    }
                }
                if (subTimelines.length == 0){
                    alert("Submitted1")
                    this.$router.push({ path: '/settings' })

                } else {
                    this.axios.post(timelinesApi, subTimelines, {
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.state.jwt.token
                        },
                    })
                    .then(response => {
                        this.subTimelinesSubmitted = response.data
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
            }
        },
        subTimelinesSubmitted: async function(){
            if(this.subTimelinesSubmitted){
                var eventsApi = this.baseApi + 'events/multiple'
                var counter = 0

                for (var i=0, len=this.eventsParsed.length; i<len; i++){
                    
                    var subEvtsTemp = JSON.parse(JSON.stringify(this.subEventsParsed.find(x => x.id === this.eventsParsed[i].id).subEvents))
                    if (subEvtsTemp.length > 0){
                        for (var j=0, len2=subEvtsTemp.length; j<len2; j++){
                            delete subEvtsTemp[j]['type']
                            delete subEvtsTemp[j]['id']
                            delete subEvtsTemp[j]['pictures']
                            delete subEvtsTemp[j]['picturesRaw']
                            subEvtsTemp[j].timeline = JSON.parse(JSON.stringify(this.subTimelinesSubmitted[counter]))
                        }
                        counter += 1
                        await this.axios.post(eventsApi, subEvtsTemp, {
                                headers: {
                                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                                }
                            })
                            .then(response => {
                                //i sie nie zmienia bo jest await? O KURWA CHYBA DZIALA
                                var subEvtsTemp = this.subEventsParsed.find(x => x.id === this.eventsParsed[i].id).subEvents.slice()
                                for (var k=0, len3=subEvtsTemp.length; k<len3; k++){
                                    this.sendPictures(this.baseApi + 'events/' + response.data[k].id, subEvtsTemp[k].pictures, subEvtsTemp[k].picturesRaw)
                                }
                            })
                            .catch(error =>{
                                console.log(error)
                            })
                    }
                }
                alert("Submitted2")
                this.$router.push({ path: '/settings' })
            }
        }
    },
    methods: {
        close(){
            document.getElementById('mainPicturesContainer').style.display = "none"
            this.openedSubPictures = -1
            this.openedPictures = -1
        },
        open(index, subindex=-1){
            document.getElementById('mainPicturesContainer').style.display = "block"
            this.openedPictures = index
            if (subindex != -1){
                this.openedSubPictures = subindex
            }
            this.saveData()
            
        },
        setPicturesContext(){
            //timeline
            if (this.openedPictures == -1){
                this.currentPictures = this.timeline.pictures

            } else {
                if (this.openedSubPictures != -1){
                    //subevt
                    this.currentPictures = this.events[this.openedPictures].sub[this.openedSubPictures].pictures

                } else {
                    //evt
                    this.currentPictures = this.events[this.openedPictures].pictures
                }
            }
        },
        deleteImg(index){
            //timeline picture delete
            if (this.openedPictures == -1){
                var rawIndex = index - (this.timeline.pictures.length - this.timeline.picturesRaw.length)
                if (this.timeline.pictures[index].substring(0, 4) != "data"){
                    this.deletedPictures.push(this.timeline.pictures[index])
                }
                this.timeline.pictures.splice(index, 1)
                if (rawIndex >= 0){
                    this.timeline.picturesRaw.splice(rawIndex, 1)
                }
            } else {
                if (this.openedSubPictures != -1){
                    //subevt picture delete
                    rawIndex = index - (this.events[this.openedPictures].sub[this.openedSubPictures].pictures.length - this.events[this.openedPictures].sub[this.openedSubPictures].picturesRaw.length)
                    if (this.events[this.openedPictures].sub[this.openedSubPictures].pictures[index].substring(0,4) != "data"){
                        this.deletedPictures.push(this.events[this.openedPictures].sub[this.openedSubPictures].pictures[index])
                    }
                    this.events[this.openedPictures].sub[this.openedSubPictures].pictures.splice(index, 1)
                    if (rawIndex >= 0){
                        this.events[this.openedPictures].sub[this.openedSubPictures].picturesRaw.splice(rawIndex, 1)
                    }

                } else {
                    //evt picture delete
                    rawIndex = index - (this.events[this.openedPictures].pictures.length - this.events[this.openedPictures].picturesRaw.length)
                    if (this.events[this.openedPictures].pictures[index].substring(0,4) != "data"){
                        this.deletedPictures.push(this.events[this.openedPictures].pictures[index])
                    }
                    this.events[this.openedPictures].pictures.splice(index, 1)
                    if (rawIndex >= 0){
                        this.events[this.openedPictures].picturesRaw.splice(rawIndex, 1)
                    }
                }
            }            
        },
        submit(){
            var timelinesApi = this.baseApi + 'timelines'
            this.preview()

            //main timeline
            var myParams = {
                findUser: true,
                withDelete: true,
                add: true
            }
            if (this.editTimeline){
                myParams.add = false
            }

            var timelineCopy = JSON.parse(JSON.stringify(this.timeline))
            delete timelineCopy["pictures"]
            delete timelineCopy["picturesRaw"]

            this.axios.post(timelinesApi, timelineCopy, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.jwt.token
                    },
                    params: myParams
                })
                .then(response => {
                    this.sendPictures(timelinesApi + "/" + response.data.id, this.timeline.pictures, this.timeline.picturesRaw)
                    //main timeline submitted now events
                    this.mainTimelineSubmit = response.data
                })
                .catch(error => {
                    console.log(error)
                    if (error.toString().includes("409")){
                        this.errorMessage = 'This ID is taken!'
                        document.getElementById("timelineId").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
                    }
                })
            if (this.deletedPictures.length > 0){
                var formData = new FormData()
                for (var i=0, len=this.deletedPictures.length; i<len; i++){
                    formData.append("urls", this.deletedPictures[i])
                }
                this.axios.delete(this.baseApi + 'files', {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.jwt.token
                    },
                    data: formData
                })
            }
        },
        sendPictures(url, array, arrayRaw){
            //pictures
            var formData = new FormData()
            for (var i=0, len=arrayRaw.length; i<len; i++){
                formData.append("pictures", arrayRaw[i])
            }
            var urlList = new FormData()
            for (i=0, len=array.length; i<len; i++){
                if (array[i].substring(0,4) != 'data'){
                    urlList.append("picturesURL", array[i])
                }
            }
            if (!urlList.has("picturesURL")){
                urlList.append("picturesURL", "")
            }
            
            this.axios.post(url + "/pictures", formData, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(() => {
                //old pictures
                this.axios.post(url + "/picturesURL", urlList, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.jwt.token,
                    }
                })
                .catch(error => {
                    console.log(error)
                })
            })
            .catch(error => {
                console.log(error)
            })
        },
        preview() {
            this.saveData(true)
            //mainEvents
            this.eventsParsed = this.events.slice()
            for (var i=0, len=this.eventsParsed.length; i<len; i++){
                this.eventsParsed[i].type = "circle"
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
                //delete this.eventsParsed[i]["sub"]
                this.subEventsParsed.push(object)
            }
        },
        addEvent(index){
            this.saveData()
            //DOPRACOWAC dziala dodawanie tylko jednego sub eventu
            var event = {id: '', type: 'normal', title: '', shortDescription: '', pictures: [], picturesRaw: [], description: '', date: '', links: new Map(), sub: []}
            event.id = '_' + Math.random().toString(36).substr(2, 9)
            if (index == this.events.length){
                this.events.push(event)

            } else{
                this.events.splice(index, 0, event)
            }
        },
        addSubEvent(index){
            this.saveData()
            var subEvent = {id: '', title: '', shortDescription: '', pictures: [], picturesRaw: [], description: '', date: '', links: new Map()}
            subEvent.id = '_' + Math.random().toString(36).substr(2, 9)
            this.events[index].sub.unshift(subEvent)
        },
        deleteEvent(index){
            if (this.events.length != 1){
                if (this.events[index].pictures){
                    for (var i=0, len=this.events[index].pictures.length; i<len; i++){
                        if (this.events[index].pictures[i].substring(0,4) != "data"){
                             this.deletedPictures.push(this.events[index].pictures[i])
                        }
                    }
                }
                for (i=0, len=this.events[index].sub.length; i<len; i++){
                    this.deleteSubEvent(index, i)
                }
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
            if (this.events[index].sub[subindex].pictures){
                for (var i=0, len=this.events[index].sub[subindex].pictures.length; i<len; i++){
                    if (this.events[index].sub[subindex].pictures[i].substring(0,4) != "data"){
                        this.deletedPictures.push(this.events[index].sub[subindex].pictures[i])
                    } 
                }
            }
            this.events[index].sub.splice(subindex, 1)
        },
        changeSubIndex(index, oldIndex, newIndex){
            if (newIndex >= 0 && newIndex < this.events[index].sub.length){
                this.saveData()
                this.events[index].sub.splice(newIndex, 0, this.events[index].sub.splice(oldIndex, 1)[0]);
            }
        },
        toArray(fileList){
            return Array.prototype.slice.call(fileList)
        },
        saveData(sort=false){
            //files saving
            var tempPictures = []
            var tempPicturesRaw = []
            var tempPicturesList = document.getElementById("mainPictures").files
            for (var i=0, len=tempPicturesList.length; i<len; i++){
                var reader = new FileReader()
                reader.onload = function(e) {
                    tempPictures.push(e.target.result)
                }
                reader.readAsDataURL(tempPicturesList[i])
            }

            //timeline files
            if (this.openedPictures == -1){
                tempPictures = tempPictures.concat(this.timeline.pictures)
                tempPicturesRaw = this.toArray(this.timeline.picturesRaw).concat(this.toArray(tempPicturesList))
                this.timeline.pictures = tempPictures
                this.timeline.picturesRaw = tempPicturesRaw

            } else {
                if (this.openedSubPictures != -1){
                    //subevent files
                    tempPictures = tempPictures.concat(this.events[this.openedPictures].sub[this.openedSubPictures].pictures)
                    tempPicturesRaw = this.toArray(this.events[this.openedPictures].sub[this.openedSubPictures].picturesRaw).concat(this.toArray(tempPicturesList))
                    this.events[this.openedPictures].sub[this.openedSubPictures].pictures = tempPictures
                    this.events[this.openedPictures].sub[this.openedSubPictures].picturesRaw = tempPicturesRaw

                } else {
                    //event files
                    tempPictures = tempPictures.concat(this.events[this.openedPictures].pictures)
                    tempPicturesRaw = this.toArray(this.events[this.openedPictures].picturesRaw).concat(this.toArray(tempPicturesList))
                    this.events[this.openedPictures].pictures = tempPictures
                    this.events[this.openedPictures].picturesRaw = tempPicturesRaw
                }
            }
            document.getElementById("mainPictures").value = ''
            this.setPicturesContext()


            //text saving
            this.timeline.id = document.getElementById("timelineId").value
            this.timeline.descriptionTitle = document.getElementById("mainTitle").value
            this.timeline.description = document.getElementById("mainLong").value

            for (i=0, len=this.events.length; i<len; i++){
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

.image-master
    position: absolute
    margin-top: 47px
    margin-left: 15px

.exit
    position: absolute
    right: 10px
    top: 5px

.image
    width: 50px
    height: 50px
    object-fit: cover 
    border-radius: 2px

.image-container
    display: inline-block
    margin-left: 7px
    float: left

.file-selector
    position: fixed
    font-family: OpenSans-Regular
    top: 40%
    left: 50%
    transform: translateX(-50%) translateY(-50%)
    width: 30%
    height: 150px
    border: 2px solid #575757
    border-radius: 10px
    background: $bg-color
    z-index: 4
    display: none
    &.medium
        width: 50%
    &.small
        width: 90%
        height: 200px

.file-container
    margin-left: 50px
    font-family: OpenSans-Regular
    display: inline-block
    vertical-align: bottom
    color: #14426B
    &.small
        position: absolute
        right: 5%
        transform: translateY(-30px)
        .normal &
            transform: translateY(-80px)
        .sub &
            transform: translateY(-80px)

.errorID
    position: absolute
    right: 44%
    top: 117px
    font-family: OpenSans-Regular
    color: #B8352D

.file
    position: absolute
    margin-top: 22px
    left: 20px
    color: transparent
    &:focus
        outline: none

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
    &:focus
        outline: none

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
    outline: none
    border: none
    background: none
    font-family: Raleway-Regular
    padding: 7px 12px
    display: inline-block
    margin: 120px 20px
    margin-bottom: 0
    font-weight: bold
    font-size: 30px
    &.small
        margin: 120px 5px

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
    background: #f3f3f3
    color: #404040
    font-family: Raleway-Regular
    padding-left: 20px
    border: 0px
    &:focus
        outline: none
    .sub &
        border-left: 2px solid #89bcbc
    &.small
        width: 100%

.tlid
    font-size: 18px
    height: 35px
    position: absolute
    top: 110px
    width: 20%
    right: 22%
    &.medium
        right: 5%
        width: 35%
    &.small
        left: 5%
        top: 90px
        width: 90%

.tdate
    font-size: 12px
    width: 20%
    font-family: OpenSans-Regular
    padding-left: 22px
    margin-left: 45px
    height: 30px
    vertical-align: bottom
    color: #535353
    &.small
        margin-left: 0
        margin-top: 0

::-webkit-inner-spin-button
    display: none

.tlong
    white-space: pre-wrap
    resize: none
    font-size: 15px
    font-family: OpenSans-Regular
    padding: 10px 20px
    height: 160px
    width: 100%
    margin-top: 10px
    .sub &
        height: 120px

//kolejnosc klas ma znaczenie te nizej sa wazniejsze
#creator
    padding: 30px 0
    margin: 0 10%
    background: $bg-color
    &.medium
        margin: 0
    &.small
        margin: 0
        padding-top: 55px

#tform
    margin: 0 auto
    width: 70%
    &.medium
        width: 90%
    &.small
        width: 90%

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
