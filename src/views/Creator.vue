<template lang="html">
    <div>
        <div class="message" v-if="numberOfTimelines && numberOfTimelines >= 2 && !$store.state.jwt.user.subscriptionEnd && editTimeline == null">
            <h1 class="limit-h1">You have reached your limit!</h1>
            <a href="https://www.tline.site/about#subscription" style="text-decoration: none; color: #303030">Buy subscription to create more than 2 timelines.</a>
        </div>
        <div v-else>
            <div id="mainPicturesContainer" class="file-selector" :class="$mq">
                <div class="exit" v-on:click="close()">x</div>
                <input class="file" accept="image/*" @change="saveData()" type="file" id="mainPictures" multiple><br>
                <div class="file-desc">Click on image to delete</div>
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
                    <input class="ttitle tlid" autocorrect="off" spellcheck="false" :class="$mq" type="text" id="timelineId" placeholder="ID" maxlength="40" minlength="3" required pattern="^(?=[a-zA-Z0-9-]{3,40}$)(?!.*[-]{2})[^-].*[^-]$" title="Alphanumerical and '-' (inside, no duplicates) max 40 min 3 characters" v-model="timeline.id">
                    <div class="opis">ID will be in the link to your timeline. Create your timeline. See in preview how it looks. If you want to add links, type: <div class="desc-link">[Tline](www.tline.site)</div>. Be careful about new lines!</div>

                    <div id="mainData">
                        <input class="ttitle main-tl" autocorrect="off" spellcheck="false" :class="$mq" type="text" id="mainTitle" required maxlength="60" minlength="3" placeholder="Title" v-model="timeline.descriptionTitle">
                        <div v-if="timeline.pictures" class="file-container" :class="$mq" v-on:click="open(-1)">Files {{timeline.pictures.length}}</div>
                        <textarea class="ttitle tlong main-long" autocorrect="off" spellcheck="false" :class="$mq" id="mainLong" required placeholder="Description" maxlength="3000" v-model="timeline.description"></textarea>
                    </div>

                    <h2>Events</h2>
                    <div class="opis">Add events to your timeline. Save your data, we are still working on a backup feature.</div>

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
                                    <input class="ttitle" autocorrect="off" spellcheck="false" :class="$mq" type="text" :id="'title'+index" required maxlength="40" minlength="2" placeholder="Title" v-model="evt.title">
                                     <date-picker class="tdate" :class="$mq" :input-attr="{ id: 'date' + index, required: true  }" placeholder="Select date" v-model="evt.date" value-type="format"></date-picker>
                                    <div v-if="timeline.pictures" :class="$mq" class="file-container" v-on:click="open(index)">Files {{evt.pictures.length}}</div>
                                    <textarea class="ttitle tlong" autocorrect="off" spellcheck="false" :class="$mq" :id="'long'+index" required maxlength="1500" placeholder="Description" v-model="evt.description"></textarea>
                                    <div class="control_item add_sub" v-on:click="addSubEvent(index)">&#43;</div>
                                </div>
                            </div>
                            <transition-group name="fade">
                                <div class="sub" v-for="(subevt, subindex) in evt.sub" v-bind:key="subevt.id">
                                    <div class="controls">
                                        <div class="control_item del" v-on:click="deleteSubEvent(index, subindex)">&ndash;</div>
                                        <div class="control_item up" v-on:click="changeSubIndex(index, subindex, subindex-1)" v-if="subindex!=0">&lang;</div>
                                        <div class="control_item down" v-on:click="changeSubIndex(index, subindex, subindex+1)" v-if="subindex!=evt.sub.length-1">&lang;</div>
                                    </div>
                                    <div class="s_left">
                                        <input class="ttitle" autocorrect="off" spellcheck="false" :class="$mq" :id="'sub'+index+'title'+subindex" required maxlength="40" minlength="2" type="text" placeholder="Title" v-model="subevt.title">
                                        <date-picker class="tdate" :class="$mq" :input-attr="{ id: 'sub'+index+'date'+subindex, required: true }" placeholder="Select date" v-model="subevt.date" value-type="format"></date-picker>
                                        <div v-if="timeline.pictures" :class="$mq" class="file-container" v-on:click="open(index, subindex)">Files {{subevt.pictures.length}}</div>
                                        <textarea class="ttitle tlong" autocorrect="off" spellcheck="false" :class="$mq" :id="'sub'+index+'long'+subindex" required maxlength="1500" placeholder="Description" v-model="subevt.description"></textarea>
                                    </div>
                                </div>
                            </transition-group>
                        </div>
                    </transition-group>
                    <input type="submit" :class="$mq" class="masterC" v-on:click="preview()" :disabled="status=='sending'" value="Preview">
                    <input type="submit" :class="$mq" class="masterC" v-on:click="submit()" :disabled="status=='sending'" value="Submit">
                    <div class="ls-container"><div class="loader" id="ls" :class="$mq"></div></div>
                </form>
                
            </div>
            <div style="margin-top: 100px" v-else>Login!!</div>

            <Timeline v-bind:mockEvents="eventsParsed" v-bind:mockTimeline="timeline" v-bind:mockSubEvents="subEventsParsed"></Timeline>
        </div>
    </div>
</template>

<script lang="js">
  import Timeline from './Timeline.vue';
  import DatePicker from 'vue2-datepicker';
  import 'vue2-datepicker/index.css';
  import { submitTimeline } from './submit.js'

  export default  {
    name: 'Creator',
    props: {
        editTimeline: Object,
        editEvents: Array
    },
    components: {
        Timeline,
        DatePicker
    },
    metaInfo() {
        return {
            title: 'Creator',
            titleTemplate: '%s - Tline',
            meta: [
                { name: 'description', content: 'Create your timeline!'},
                { property: 'og:url', content: 'https://www.tline.site/creator'},
                { property: 'og:title', content: 'Creator - Tline' },
                { property: 'og:descriprion', content: 'Create your timeline!'},
                { property: 'og:image', content: 'https://storage.googleapis.com/tline-files/creator.png' },
                { property: 'twitter:card', content: 'summary_large_image'},
                { property: 'twitter:url', content: 'https://www.tline.site/creator'},
                { property: 'twitter:title', content: 'Creator - Tline'},
                { property: 'twitter:description', content: 'Create your timeline!'},
                { property: 'twitter:image', content: 'https://storage.googleapis.com/tline-files/creator.png'}
            ]
        }
    },
    created () {
        var timelineApi = this.baseApi + 'timelines/public/' + this.$store.state.jwt.user.username
        this.axios.get(timelineApi)
            .then(response => {
                this.numberOfTimelines = response.data.length
            }).catch(err => {
                console.log(err)
                this.$router.push({ path: "/home" })
            })
    },
    mounted() {
        document.getElementById("dropdown").style.display = "none"
        document.getElementById("dropdown-bg").style.display = "none"
    },
    data () {
      return {
          events: [{id: 'first', type: 'normal', title: '', pictures: [], picturesRaw: [], description: '', date: '', links: new Map(), sub: []}],
          eventsParsed: [],
          timeline: {pictures: [], picturesRaw: []},
          subEventsParsed: [],
          errorMessage: '',
          numberOfTimelines: null,

          status: 'ok',

          openedPictures: -1,
          openedSubPictures: -1,
          currentPictures: [],
          deletedPictures: [],

          baseApi: 'https://akuba.pl/api/tline/api/',
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
        async submit(){
            if (document.getElementById("tform").checkValidity()){
                document.getElementById("ls").style.opacity = "1"
                this.preview()

                this.status = "sending"
                var sendStatus = await submitTimeline(this.baseApi, this.editTimeline, this.timeline, this.$store.state.jwt.token, this.eventsParsed, this.events, this.subEventsParsed, this.deletedPictures)

                if (sendStatus == 'taken'){
                    document.getElementById("ls").style.opacity = "0"
                    this.errorMessage = "This ID is taken!"
                    document.getElementById("timelineId").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
                    this.status = "ok"

                } else if (sendStatus == "error"){
                    document.getElementById("ls").style.opacity = "0"
                    this.errorMessage = "Send error! Check console."
                    this.status = "ok"

                } else if (sendStatus == "ok"){
                    this.$store.commit('setMessage', "Submitted timeline!")
                    document.getElementById("modal").style.display = "block"
                    this.$router.push({ path: '/profile/' + this.$store.state.jwt.user.username })
                }
            }
        },
        preview() {
            if (document.getElementById("tform").checkValidity()){
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
            }
        },
        addEvent(index){
            this.saveData()
            var event = {id: '', type: 'normal', title: '', pictures: [], picturesRaw: [], description: '', date: '', links: new Map(), sub: []}
            event.id = '_' + Math.random().toString(36).substr(2, 9)
            if (index == this.events.length){
                this.events.push(event)

            } else{
                this.events.splice(index, 0, event)
            }
        },
        addSubEvent(index){
            this.saveData()
            var subEvent = {id: '', title: '', pictures: [], picturesRaw: [], description: '', date: '', links: new Map()}
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
                if (this.events[i].sub && sort){
                    this.events[i].sub = this.sortByDate(this.events[i].sub)
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

<style lang="sass">

.mx-input
    border: 0px
    border-radius: 8px
    padding: 0 20px
    font-size: 15px
    font-family: OpenSans-Regular
    background: #f3f3f3
    color: #404040
    box-shadow: none

</style>

<style scoped lang="sass">

@import '../assets/saas-vars.sass'

.limit-h1
    text-align: center
    font-size: 35px

.file-desc
    position: absolute
    top: 5px
    font-size: 13px
    left: 50%
    width: 100%
    color: #7e7e7e
    transform: translateX(-50%)

.message
    margin-top: 100px
    text-align: center

.image-master
    margin-top: 55px
    margin-left: 15px

.exit
    z-index: 5
    position: absolute
    user-select: none
    cursor: pointer
    right: 10px
    top: 5px

.image
    width: 60px
    height: 50px
    object-fit: cover 
    border-radius: 2px

.image-container
    display: inline-block
    margin-left: 7px
    margin-bottom: 3px
    float: left

.file-selector
    position: fixed
    font-family: OpenSans-Regular
    top: 25%
    left: 35%
    width: 30%
    padding-bottom: 20px
    border-radius: 10px
    background: $bg-color
    box-shadow: 0 0 0 1600px rgba(0,0,0,0.65)
    z-index: 4
    display: none
    &.medium
        width: 50%
        left: 25%
    &.small
        width: 90%
        left: 5%

.file-container
    user-select: none
    cursor: pointer
    margin-left: 50px
    margin-bottom: 20px
    font-family: OpenSans-Regular
    display: inline-block
    vertical-align: bottom
    color: #14426B
    &.medium
        margin-left: 20px
    &.small
        position: absolute
        right: 6%
        transform: translateY(-80px)
        .normal &
            transform: translateY(-120px)
            right: 9%
        .sub &
            transform: translateY(-120px)
            right: 9%

.desc-link
    display: inline
    color: #14426B

.errorID
    position: absolute
    right: 44%
    top: 123px
    font-family: OpenSans-Regular
    color: #B8352D

.file
    position: absolute
    margin-top: 30px
    left: 20px
    color: transparent
    &:focus
        outline: none

.file::-webkit-file-upload-button
    -webkit-appearance: none
    user-select: none
    cursor: pointer
    border: 0
    font-family: OpenSans-Regular
    height: 27px
    padding: 0 17px
    background: #B8352D
    color: white
    letter-spacing: 1px
    border-radius: 3px
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
    text-align: left

#mainData
    text-align: left
    margin-top: 50px
    .ttitle
        margin-left: 0
        margin-right: 0
    .tlong
        width: 100%

.p_line
    width: 100%
    height: 5px
    background: #303030

.ls-container
    display: inline-block

#ls
    opacity: 0

.masterC
    user-select: none
    cursor: pointer
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
        margin: 130px 5px
        margin-bottom: 0

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
    margin: 0 30px !important

.controls
    text-align: left
    width: 100%
    margin-bottom: 10px

.control_item
    user-select: none
    cursor: pointer
    color: #666666
    font-weight: bold
    font-size: 18px
    display: inline-block
    margin: 0 30px
    font-family: OpenSans-Regular
    border-radius: 7px

.normal
    margin-top: 100px
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)
    border-radius: 20px
    padding: 15px 0

.sub
    width: 95%
    margin-top: 20px
    margin-left: 5%
    margin-bottom: 25px
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)
    border-radius: 20px
    padding: 15px 0

.ttitle
    text-align: justify
    box-sizing: border-box
    height: 50px
    width: 40%
    font-size: 25px
    background: #f3f3f3
    color: #404040
    font-family: Raleway-Regular
    padding-left: 20px
    border: 0px
    border-radius: 8px
    margin: 20px
    margin-top: 5px
    &.medium
        width: 50%
    &:focus
        outline: none
    &.small
        width: 94%
        margin: 0 3%
        margin-top: 10px

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
        border-radius: 8px
        left: 2%
        top: 85px
        width: 89%


.tdate
    width: 20%
    margin-left: 35px
    transform: translateY(+3px)
    &.medium
        margin-left: 10px
        width:  calc(20% + 20px)
    &.small
        margin: 5px 3%
        transform: translateY(0)
        width: 94%

::-webkit-inner-spin-button
    display: none

.tlong
    resize: none
    font-size: 15px
    font-family: OpenSans-Regular
    padding: 10px 20px
    height: 160px
    width: calc( 100% - 40px )
    margin-top: -10px
    margin-bottom: 15px
    &.medium
        width: 94%
    .sub &
        height: 120px
    &.small
        margin-left: 3%
        width: 94%
        margin-top: 0

.main-long
    &.small
        margin-top: 10px
        border-radius: 8px

.main-tl
    &.small
        width: 100%
        border-radius: 8px

//kolejnosc klas ma znaczenie te nizej sa wazniejsze
#creator
    padding: 5px 0
    margin: 0 7%
    background: $bg2-color
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

.s_left
    text-align: left
    width: 100%
    display: inline-block

</style>