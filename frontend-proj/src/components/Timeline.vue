<template>
    <div v-if="eventsParsed">
        <div class="user_d" :class="$mq" v-if="!mockEvents" v-on:click="scrollDown()"> {{ timeline.user.fullName }} </div>

        <div id="image-viewer">
            <div class="viewer viewer-prev" :class="$mq" v-on:click="imageViewerScroll(mainImageIndex-1)">
                <div class="arrow"> &#8249; </div>
            </div>
            <img v-on:click="closeImage()" :src="mainImages[mainImageIndex]" id="main-image" v-if="mainImages">
            <div class="viewer" :class="$mq" v-on:click="imageViewerScroll(mainImageIndex+1)">
                <div class="arrow right-arrow"> &#8250; </div>
            </div>
        </div>

        <div id="timeline" :class="$mq">
            <div id="text_fade_top" class="text_fade trans"></div>

            <div id="evt_container" :class="$mq">
                <div id="evt_desc" class="fade evt_trans">
                    <div id="evt_desc_text" v-if="openedSub">
                        <div class="evt_button" v-on:click="moveRight()">Back</div>
                        <h1 class="evt_h"> {{ eventsSub[openedSub].title }} </h1>
                        <p class="evt_p"> {{ eventsSub[openedSub].shortDescription }} </p>
                        <p class="evt_desc_p"> {{ eventsSub[openedSub].description }} </p>
                        <p class="evt_desc_p2" v-for="(value, name) in eventsSub[openedSub].links" :key="name"> {{ name }} </p>
                    </div>
                    
                    <div style="text-align: center">
                        <div class="sub" v-show="evt.title" v-for="(evt, index) in subTimelineEventsParsed" :key="index">
                            <div v-if="evt.type == 'circle'">
                                <h1 class="sub_nav_h"  v-on:click="subScroll(index)"> {{ evt.title }} </h1>
                                <div class="hor-l"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="sub_timeline" :class="$mq" v-if="subTimelineEventsParsed">
                        <div class="sub_fade sub_fade_left" :class="$mq"></div>
                        <div class="sub_fade sub_fade_right" :class="$mq"></div>
                        <div class="sub_sline"></div>
                        <div class="sub" v-for="(evt, index) in subTimelineEventsParsed" :key="index">
                            <div class="sub_line" v-if="evt.type == 'line'"></div>
                            <div v-else-if="evt.type == 'circle'">
                                <p class="sub_evt_p" v-on:click="subevent(index)"> {{ evt.shortDescription }} </p>
                                <div class="sub_evt_date" v-on:click="subevent(index)"> {{ evt.date.slice(0,7) }} </div>
                            </div>
                            <div class="sub_year" v-else> {{ evt.message }} </div>
                        </div>
                        <div class="sub_sline"></div>
                    </div>

                    <div class="gallery-container" :class="$mq" v-if="openedSub">
                        <div id="sub_gallery" class="gallery" :class="$mq" v-if="eventsSub[openedSub].pictures">
                            <div class="image-container" v-for="(img, index) in eventsSub[openedSub].pictures" :key="index">
                                <img class="image" :class="$mq" :src="img" v-on:click="openImage(eventsSub[openedSub].pictures, index)">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            

            <div id="f_line" class="line trans" :class="$mq"></div>
            <div v-for="(evt, index) in eventsParsed" :key="index">
                <div class="line trans" :class="$mq" v-if="evt.type == 'line'"></div>
                <div class="evt" v-else-if="evt.type == 'circle'" :id="'circle'+index">
                    <div class="evt_date trans" :class="$mq" v-on:click="moveLeft(index)"> {{ evt.date.slice(0,7) }} </div>
                    <div class="circle trans" :class="$mq" v-on:click="move(index)"></div>
                    <div class="evt_text trans" :class="$mq" v-on:click="moveLeft(index)">
                        <h1 class="evt_h"> {{ evt.title }} </h1>
                        <p class="evt_p"> {{ evt.shortDescription }} </p>
                        <p class="evt_p" v-if="$mq == 'small'"> {{ evt.date.slice(0,7) }} </p>
                    </div>
                </div>
                <div class="year trans" :class="$mq" v-else> {{ evt.message }} </div>
            </div>
            <div id="l_line" class="line trans" :class="$mq"></div>


            <div id="text_fade_bottom" class="text_fade trans"></div>
        </div>


        <div id="descr" :class="$mq">
            <h1> {{ timeline.descriptionTitle }} </h1>
            <p> {{ timeline.description }} </p>
        </div>
        <div class="gallery-container" :class="$mq" v-if="timeline.pictures" >
            <div id="tl_gallery" class="gallery" :class="$mq">
                <div class="image-container" v-for="(img, index) in timeline.pictures" :key="index">
                    <img class="image" :class="$mq" :src="img" v-on:click="openImage(timeline.pictures, index)" >
                </div>
            </div>
        </div>
        <div class="like">
            <div v-if="$store.state.jwt">
                <div v-if="$store.state.jwt.likes.includes(timeline.id)">
                    <div v-if="timeline.likes != null" style="display: inline-block" v-on:click="dislikeTimeline()">Dislike &middot; {{ timeline.likes }} &middot; views {{ timeline.views }}</div>
                    <div v-if="timeline.user" class="email" :class="$mq">{{ timeline.user.email }}</div>
                </div>
                <div v-else>
                    <div v-if="timeline.likes != null" style="display: inline-block" v-on:click="likeTimeline()">Like &middot; {{ timeline.likes }} &middot; views {{ timeline.views }}</div> 
                    <div v-if="timeline.user" class="email" :class="$mq">{{ timeline.user.email }}</div>
                </div>
            </div>
            <div v-else>
                <router-link v-if="timeline.likes != null" style="display: inline-block" class="login-like" :to="{ name: 'login', params: {path: {path: '/timeline/' + timeline.id}}}">Login to like &middot; {{ timeline.likes }} &middot; views {{ timeline.views }}</router-link>
                <div v-if="timeline.user" class="email" :class="$mq">{{ timeline.user.email }}</div>
            </div>
        </div>
    </div>
</template>


<script>

export default {
    name: 'Timeline',
    props: {
        mockEvents: Array,
        mockTimeline: Object,
        mockSubEvents: Array
    },
    created () {
        if (!this.mockEvents){
            var timelineApi = this.baseApi + 'timelines/public?id=' + this.$route.params.id
            this.axios.get(timelineApi).then(response => {
                if (response.data != null){
                    this.timeline = response.data;
                } else {
                    this.$router.push( {path: "/"} );
                } }).catch(err => console.log(err));
        } else {
            this.mocking = true
        }
    },
    data() {
        return {
        baseApi: 'http://localhost:8081/api/',
        open: false,
        timeline: null,
        events: null,
        newPos: null,
        galleryScrolling: false,

        mainImages: null,
        mainImageIndex: null,

        eventsParsed: null,
        eventsSub: null,

        openedEvent: null,
        openedSub: null,

        subTimeline: null,
        subTimelineEvents: null,
        subTimelineEventsParsed: null,

        mocking: false
        }
    },
    watch: {
        $mq: function(){
            while (this.openedEvent != null){
                this.moveRight()
            }
        },
        mockEvents: function(){
            this.events = this.mockEvents
            this.timeline = this.mockTimeline
        },
        timeline: function(){
            if (!this.mockEvents){
                var eventsApi = this.baseApi + 'events/public?timelineId=' + this.timeline.id;
                this.axios.get(eventsApi, {
                    params: {
                        view: true
                    }
                })
                .then(response => {this.events = response.data});
            }
        },
        events: function(){
            this.eventsParsed = this.parseTimeline(JSON.parse(JSON.stringify(this.events))).reverse();
        },
        openedEvent: function(){
            if (this.openedEvent != null){
                if(!this.mockEvents){
                    var subTimelineApi = this.baseApi + 'timelines/public/event?eventId=' + this.eventsParsed[this.openedEvent].id;
                    this.axios.get(subTimelineApi)
                    .then(response => {this.subTimeline = response.data})
                    .catch(err => console.log(err));

                } else {
                    this.subTimeline = '_' + Math.random().toString(36).substr(2, 9)
                }
            }
        },
        subTimeline: function(){
            if (this.subTimeline != "" && this.subTimeline != null){
                if (!this.mocking){
                    var subTimelineEventsApi = this.baseApi + 'events/public?timelineId=' + this.subTimeline.id;
                    this.axios.get(subTimelineEventsApi)
                    .then(response => {this.subTimelineEvents = response.data});

                } else {
                    var dupera = this.mockSubEvents.find(x => x.id === this.eventsParsed[this.openedEvent].id).subEvents
                    if (dupera.length > 0){
                        this.subTimelineEvents = dupera
                    } 
                }
            }
        },
        subTimelineEvents: function(){
            if (this.subTimelineEvents != null){
                this.subTimelineEventsParsed = this.parseTimeline(JSON.parse(JSON.stringify(this.subTimelineEvents)));
            }
        }
    },
    methods: {
        scrollDown(){
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        },
        likeTimeline(){
            this.axios.post(this.baseApi + 'timelines/' + this.timeline.id + '/like', null, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                }
            })
            .then(response => {
                var jwt = this.$store.state.jwt
                jwt.likes = response.data
                this.timeline.likes += 1
                this.$store.commit('set', jwt)
            })
            .catch(error => {
                console.log(error)
            })
        },
        dislikeTimeline(){
            this.axios.post(this.baseApi + 'timelines/' + this.timeline.id + '/dislike', null, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                }
            })
            .then(response => {
                var jwt = this.$store.state.jwt
                jwt.likes = response.data
                this.timeline.likes -= 1
                this.$store.commit('set', jwt)
            })
            .catch(error => {
                console.log(error)
            })
        },
        imageViewerScroll(newIndex){
            if (this.mainImages){
                if (newIndex >= this.mainImages.length){
                    newIndex=this.mainImages.length-1
                }
                if (newIndex < 0){
                    newIndex = 0
                }
                this.mainImageIndex = newIndex
            }
        },
        closeImage(){
            document.getElementById("image-viewer").style.display = "none"
            this.mainImages = null
            this.mainImageIndex = null
        },
        openImage(images, index){
            this.mainImages = images
            this.mainImageIndex = index
            document.getElementById("image-viewer").style.display = "block"
        },
        subScroll(index){
            var subT = document.getElementById("sub_timeline")
            if (subT){
                var searchedE = subT.children[index+3];
                //subT.offsetLeft to margin sub timeline przy .large
                var newScroll = searchedE.offsetLeft - subT.offsetWidth/2 + searchedE.offsetWidth/2 - subT.offsetLeft;
                subT.scroll({top: 0, left: newScroll, behavior: 'smooth'});
            }
        },
        parseTimeline(eventsList){
            eventsList = this.sortByDate(eventsList)
            var yearsParsed = [];
            var output = [];
            var fullEvent;

            //year parsing
            for (var i = 0, len = eventsList.length; i < len-1; i++){
                var firstDate = new Date(eventsList[i].date);
                var secondDate = new Date(eventsList[i+1].date);
                fullEvent = eventsList[i];
                fullEvent.type = "circle";
                yearsParsed.push(fullEvent);
                
                for (var j=0, len2 = secondDate.getFullYear() - firstDate.getFullYear(); j < len2; j++){
                    //ZMIENIC POTEM text na year???? uwaga data roku jest zawsze z 31 grudnia poprzedniego!!
                    var yearDate = firstDate.getFullYear() + '-12-31T00:00:00';
                    var year = {type: 'text', message: 0, date: yearDate};
                    year.message = firstDate.getFullYear() + (j + 1);
                    yearsParsed.push(year);
                }
            }
            fullEvent = eventsList[eventsList.length-1];
            fullEvent.type = "circle";
            yearsParsed.push(fullEvent);

            //lines
            j = 0;
            var linePrefab = {type: 'line'};
            output.push(linePrefab);
            for (i = 0, len = yearsParsed.length; i < len-1; i++){
                //min one line is required
                output.push(linePrefab);
                output.push(yearsParsed[i]);

                firstDate = new Date(yearsParsed[i].date);
                secondDate = new Date(yearsParsed[i+1].date);

                var monthDiff = (secondDate.getFullYear() - firstDate.getFullYear()) * 12;
                monthDiff -= firstDate.getMonth();
                monthDiff += secondDate.getMonth();

                //additional lines based on months
                for (j = 0, len2 = monthDiff; j < len2; j++){
                    output.push(linePrefab);
                }
            }
            output.push(linePrefab)
            output.push(yearsParsed[yearsParsed.length-1])
            output.push(linePrefab)
            output.push(linePrefab)

            return output;
        },
        move(index){
            if (!this.open){
                this.moveLeft(index);

            } else{
                this.moveRight();
            }
        },
        moveLeft(index) {
            if (!this.open){
                this.subTimeline = null;
                this.subTimelineEvents = null;
                this.subTimelineEventsParsed = null;

                var distanceTop = window.pageYOffset + document.getElementById("circle"+index).getBoundingClientRect().top;
                this.newPos = distanceTop - 100;
                document.getElementById("evt_container").style.top = this.newPos + "px";
                window.scroll({top: this.newPos-100, left: 0, behavior: 'smooth'});

                document.getElementsByClassName("line").forEach(function moveLines(line) {line.classList.add('line_open');});
                document.getElementsByClassName("circle").forEach(function moveCircles(circle) {circle.classList.add('circle_open');});
                document.getElementsByClassName("year").forEach(function moveYears(year) {year.classList.add("year_open");});
                document.getElementsByClassName("evt_date").forEach(function moveDates(date){date.classList.add("fade");});
                document.getElementsByClassName("evt_text").forEach(function moveTexts(text){text.classList.add("fade");});
                
                document.getElementById("text_fade_top").classList.add("fade");
                document.getElementById("text_fade_bottom").classList.add("fade");
                document.getElementById("evt_desc").classList.remove("fade");
                this.open = !this.open;
                this.openedEvent = index;

                this.eventsSub = this.eventsParsed;
                this.openedSub = index;
            }
        },
        moveRight(){
            //jesli jestesmy w sub evencie
            if (this.openedSub != this.openedEvent){
                this.eventsSub = this.eventsParsed;
                this.openedSub = this.openedEvent;
                window.scroll({top: this.newPos-100, left: 0, behavior: 'smooth'});

            } else {
                document.getElementsByClassName("line").forEach(function centerLines(line) {line.classList.remove('line_open');});
                document.getElementsByClassName("circle").forEach(function centerCircles(circle) {circle.classList.remove('circle_open');});
                document.getElementsByClassName("year").forEach(function centerYears(year) {year.classList.remove('year_open');});
                document.getElementsByClassName("evt_date").forEach(function centerDates(date){date.classList.remove("fade");});
                document.getElementsByClassName("evt_text").forEach(function centerTexts(text){text.classList.remove("fade");});
                document.getElementsByClassName("evt_text").forEach(function centerTexts(text){text.classList.remove("fade");});
                
                document.getElementById("text_fade_top").classList.remove("fade");
                document.getElementById("text_fade_bottom").classList.remove("fade");
                document.getElementById("evt_desc").classList.add("fade");

                this.open = !this.open;
                this.openedEvent = null;
            }
        },
        subevent(index){
            this.eventsSub = this.subTimelineEventsParsed;
            this.openedSub = index;
            window.scroll({top: this.newPos-100, left: 0, behavior: 'smooth'});
        },
        sortByDate(array){
            return array.sort(function(a, b){
                return new Date(a.date) - new Date(b.date)
            })
        },
    },
    updated() {
        if (this.openedSub == this.openedEvent){
            this.subScroll(2)
        }
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
    }
}


</script>


<style scoped lang="sass">
@import '../assets/saas-vars.sass'
.email
    display: inline-block
    color: #303030
    margin-left: 120px
    user-select: text
    &:hover
        cursor: default
    &.small
        display: block
        margin: 10px 0

.login-like
    text-decoration: none
    color: #14426B
    
.like
    color: #14426B
    font-family: RaleWay-Regular
    user-select: none
    &:hover
        cursor: pointer

.right-arrow
    right: 0

.arrow
    top: calc(50% - 40px)
    margin: 10px
    position: absolute

.viewer-prev
    transform: translateX(0) !important
    background: linear-gradient(-90deg, rgba(48,48,48,0) 0%, rgba(48,48,48,1) 100%) !important

.viewer
    transition: all 0.2s
    position: absolute
    display: inline-block
    color: white
    top: 0
    height: calc(100% - 50px)
    font-size: 60px
    width: 100px
    z-index: 5
    transform: translateX(-100px)
    opacity: 0.4
    background: rgb(48,48,48)
    background: linear-gradient(90deg, rgba(48,48,48,0) 0%, rgba(48,48,48,1) 100%)
    //tylko dla urzadzen obslugujacych hover
    @media(hover: hover) and (pointer: fine)
        &:hover
            opacity: 0.6
    &:active
        opacity: 0.6
    &.medium
        width: 80px
        transform: translateX(-80px)
    &.small
        width: 40px
        transform: translateX(-40px)

#main-image
    border-radius: 5px
    display: inline-block
    height: 80%
    max-width: 100%
    object-fit: contain
    margin-top: 50px

#image-viewer
    user-select: none
    color: white
    position: fixed
    z-index: 3
    background: #303030
    width: 100%
    height: calc( 100% - 50px )
    bottom: 0
    left: 0
    display: none

.image-container
    display: inline-block
    margin-right: 7px
    margin-bottom: 5px

.image
    height: 100px
    width: 120px
    object-fit: cover
    border-radius: 2px

.gallery
    user-select: none
    display: inline-block
    width: 100%

.gallery-container
    z-index: 2
    position: relative
    margin: 180px 30%
    &.medium
        margin: 170px 15%
    &.small
        margin: 50px 10%
    #evt_container &
        width: 100%
        margin: 100px 0


div#sub_timeline::-webkit-scrollbar
    display: none

.sub_fade
    z-index: 2
    position: absolute
    width: 30px
    height: 60px
    background: $bg-color

.sub_fade_left
    background: linear-gradient(270deg, rgba($bg-color,0) 0%, rgba($bg-color,1) 91%)
    transform: translateX(-2px)

.sub_fade_right
    right: 0
    background: linear-gradient(90deg, rgba($bg-color,0) 0%, rgba($bg-color,1) 91%)
    transform: translateX(+2px)
    &.large
        right: 12%

.sub_evt_p
    margin: 10px 30px
    padding: 0

.sub_line
    transform: translateY(-20px)
    width: 90px
    height: 1px
    background: #303030

.sub_sline
    display: inline-block
    transform: translateY(-20px)
    width: 20vw
    height: 1px
    background: #303030

.sub_year
    margin: 0 40px
    font-size: 19px
    letter-spacing: 2px

.sub_nav_h
    font-family: Raleway-Regular
    font-size: 20px
    letter-spacing: 1px
    margin: 10px 20px

.sub_evt_date
    text-align: center
    margin: 0 30px
    font-size: 15px

.sub
    position: relative
    z-index: 3
    display: inline-block

#evt_desc_text
    margin-bottom: 100px

.sub_nav
    background: #14426B
    display: inline-block
    color: white
    border-radius: 50%
    width: 22px
    height: 22px
    letter-spacing: 2px
    font-size: 13px

.sub_nav_right
    float: right
    

#sub_timeline
    overflow-x: auto
    overflow-y: hidden
    white-space: nowrap
    height: 80px
    margin-top: 40px
    &.large
        margin-left: auto
        margin-right: auto
        width: 76%


.hor-l
    height: 1px
    background: #b3b3b3


.evt_desc_p
    margin-top: 40px
    display: block
    text-align: justify

.evt_desc_p2
    margin-top: 10px
    margin-right: 20px 
    display: inline-block
    color: #14426B
    

#evt_container
    position: absolute
    text-align: left
    &.large
        width: 45%
        left: 30%
    &.medium
        width: 65%
        left: 20%
    &.small
        width: 85%
        left: 10%

//za pomoca sass mozna wszytskie trans wrzucic do jednej klasy 
.evt_trans
    transition: all 0.7s, top 1ms

.evt_button
    user-select: none
    z-index: 2
    position: absolute
    right: 0
    background-color: #303030
    border: 0px solid #303030
    border-radius: 10px
    color: white
    padding: 3px 17px
    letter-spacing: 2px
    font-size: 13px
    transform: translateY(+5px)


.user_d
    z-index: 4
    position: fixed
    color: white
    letter-spacing: 2px
    font-family: Raleway-Regular
    font-size: 16px
    top: 19px
    left: 50%
    transform: translateX(-50%) scale(1.005)

.fade
  opacity: 0

.text_fade
    position: sticky
    z-index: 2
    height: 50px
    background: $bg-color
    

#text_fade_top
    top: 50px
    background: linear-gradient(180deg, rgba($bg-color,1) 30%, rgba($bg-color,0) 100%)
    transform: translateY(-5px)

#text_fade_bottom
    bottom: 0
    background: linear-gradient(0deg, rgba($bg-color,1) 30%, rgba($bg-color,0) 100%)
    transform: translateY(+5px)

.trans
    transition: all 0.7s

.evt_h
    font-size: 35px
    margin: 0
    padding: 0
    letter-spacing: 2px
    width: 70%

.evt_p
    margin-top: 0
    padding-top: 10px

.evt
    margin: 40px auto

.evt_date
    user-select: none
    position: relative
    float: left
    width: 40%
    text-align: right
    letter-spacing: 2px
    &.small
        z-index: -1
        opacity: 0
        

.evt_text
    margin-right: 10px
    float: right
    width: 40%
    height: 150px
    text-align: left
    transform: translateY(-45px)
    &.small
        width: 64%
        transform: translateY(-50%)

.year_open
    margin: 40px 8% !important
    opacity: 0.2
    &.small
        opacity: 0.05
        margin: 40px 0 !important
        transform: translateX(-50%) rotateZ(-90deg)

.year
    margin: 40px 50%
    width: 20%
    transform: translateX(-50%)
    font-size: 19px
    letter-spacing: 2px
    &.small
        margin: 40px 15%

.circle_open
    margin: 0 8% !important
    opacity: 0.2
    &.small
        opacity: 0.05
        margin: 0 0% !important

.circle
    margin: 0 50%
    transform: translateX(-50%)
    width: 25px
    height: 25px
    background: #B8352D
    border-radius: 50%
    &.small
        margin: 0 15%

.line_open
    margin: 0 8% !important
    opacity: 0.2
    &.small
        opacity: 0.05
        margin: 0 0% !important

.line
    display: block
    margin: 0 50%
    width: 2px
    height: 80px
    background: #303030
    &.small
        margin: 0 15%

#f_line
    background: $bg-color
    background: linear-gradient(180deg, rgba(48,48,48,0) 0%, rgba(48,48,48,1) 100%)

#l_line
    background: rgb(48,48,48)
    background: linear-gradient(0deg, rgba(48,48,48,0) 0%, rgba(48,48,48,1) 100%)

#timeline
    background: $bg-color
    //wyskokosc evt desc to ok 866 desktop, 1149 mobile
    //pojawia sie 100px nad circle, po circle musza byc dwie linie czyli 160px
    //czyli 866-260px = 606 padding bottom
    //w praktyce gdzies 450 starczy
    padding-top: 100px
    padding-bottom: 450px
    font-family: 'Raleway-Regular'
    &.large
        margin: 0 10%
    &.small
        padding-bottom: 750px
    &.medium
        padding-bottom: 520px

#descr
    white-space: pre-wrap
    height: 200px
    margin: 60px 30%
    font-family: 'Raleway-Regular'
    p
        text-align: justify
    &.small
        margin: 60px 10%
        height: 500px
    &.medium
        margin: 50px 15%

</style>
