<template>
    <div v-if="eventsParsed">
        <div class="menu">
            <router-link :to="{ name: 'home' }" class="home_b"></router-link>
            <div class="user_d" :class="$mq"> {{ timeline.user.fullName }} </div>
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
                        <div class="sub_fade sub_fade_left"></div>
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

                    <div id="evt_gallery" v-if="false"></div>
                </div>
            </div>
            

            <div id="f_line" class="line trans" :class="$mq"></div>
            <div v-for="(evt, index) in eventsParsed" :key="index">
                <div class="line trans" :class="$mq" v-if="evt.type == 'line'"></div>
                <div class="evt" v-else-if="evt.type == 'circle'">
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
    </div>
</template>


<script>

export default {
    name: 'Timeline',
    props: [],
    created () {
        var timelineApi = this.baseApi + 'timelines/public?id=' + this.$route.params.id;
        this.axios.get(timelineApi).then(response => {
            if (response.data != null){
                this.timeline = response.data;
            } else {
                this.$router.push( {path: "/"} );
            } }).catch(err => console.log(err));
    },
    data() {
        return {
        baseApi: 'http://localhost:8081/api/',
        open: false,
        timeline: null,
        events: null,
        newPos: null,

        eventsParsed: null,
        eventsSub: null,

        openedEvent: null,
        openedSub: null,

        subTimeline: null,
        subTimelineEvents: null,
        subTimelineEventsParsed: null,
        }
    },
    watch: {
        timeline: function(){
            var eventsApi = this.baseApi + 'events/public?timelineId=' + this.timeline.id;
            this.axios.get(eventsApi).then(response => {this.events = response.data});
        },
        events: function(){
            this.eventsParsed = this.parseTimeline(this.events).reverse();
        },
        openedEvent: function(){
            if (this.openedEvent != null){
                var subTimelineApi = this.baseApi + 'timelines/public/event?eventId=' + this.eventsParsed[this.openedEvent].id;
                this.axios.get(subTimelineApi).then(response => {this.subTimeline = response.data});
            }
        },
        subTimeline: function(){
            if (this.subTimeline != "" && this.subTimeline != null){
                var subTimelineEventsApi = this.baseApi + 'events/public?timelineId=' + this.subTimeline.id;
                this.axios.get(subTimelineEventsApi).then(response => {this.subTimelineEvents = response.data});
            }
        },
        subTimelineEvents: function(){
            if (this.subTimelineEvents != null){
                this.subTimelineEventsParsed = this.parseTimeline(this.subTimelineEvents);
            }
        }
    },
    methods: {
        subScroll(index){
            var subT = document.getElementById("sub_timeline");
            if (subT){
                var searchedE = subT.children[index+3];
                //subT.offsetLeft to margin sub timeline przy .large
                var newScroll = searchedE.offsetLeft - subT.offsetWidth/2 + searchedE.offsetWidth/2 - subT.offsetLeft;
                subT.scroll({top: 0, left: newScroll, behavior: 'smooth'});
            }
        },
        parseTimeline(eventsList){
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
            output.push(yearsParsed[yearsParsed.length-1]);
            output.push(linePrefab);
            output.push(linePrefab);

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
                //zerujemy przed startem
                this.subTimeline = null;
                this.subTimelineEvents = null;
                this.subTimelineEventsParsed = null;

                //160 to odstep od poczatku stront - menu
                this.newPos = window.scrollY + 160;
                //-220 to margines, 870 to wysokosc opisu CZY NAPEWNO TYLE?
                if (this.newPos + 934 > document.getElementById("descr").offsetTop - 220){
                    this.newPos -= this.newPos + 870 - (document.getElementById("descr").offsetTop - 220);
                }
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
        }
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
/* sub_timeline */
div#sub_timeline::-webkit-scrollbar
    display: none

.sub_fade
    z-index: 2
    position: absolute
    width: 30px
    height: 60px
    background: rgb(246,246,246)

.sub_fade_left
    background: linear-gradient(270deg, rgba(246,246,246,0) 0%, rgba(246,246,246,1) 91%)
    transform: translateX(-2px)

.sub_fade_right
    right: 0
    background: linear-gradient(90deg, rgba(246,246,246,0) 0%, rgba(246,246,246,1) 91%)
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
    z-index: 1
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


/* wysokosc zalezna od szerokosci */
@mixin responsive-box($height)
    position: relative
    &:before
        content: ''
        display: block
        padding-top: $height

#evt_gallery
    @include responsive-box(50%)
    width: 100%
    margin-top: 70px
    border-radius: 10px
    background: rgb(90, 90, 90)

.evt_desc_p
    margin-top: 40px
    display: block
    text-align: justify

.evt_desc_p2
    margin-top: 10px
    margin-right: 20px 
    display: inline-block
    color: #14426B
    

/* evt_desc jest do js zeby dodawac i usuwac fade */
/* evt_container do roznych wielkosci - gdy zmieniala sie wielkosc automatycznie dodawala mi sie klasa fade */
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



/* main */

.user_d
    z-index: 4
    color: white
    letter-spacing: 2px
    font-family: Raleway-Regular
    font-size: 16px
    width: 20%
    margin: 15px auto
    &.small
        width: 60%

.fade
  opacity: 0

.text_fade
    position: sticky
    z-index: 2
    height: 50px
    background: rgb(246,246,246)
    

#text_fade_top
    top: 50px
    background: linear-gradient(180deg, rgba(246,246,246,1) 30%, rgba(246,246,246,0) 100%)
    transform: translateY(-5px)

#text_fade_bottom
    bottom: 0
    background: linear-gradient(0deg, rgba(246,246,246,1) 30%, rgba(246,246,246,0) 100%)
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
    background: rgb(48,48,48)
    background: linear-gradient(180deg, rgba(48,48,48,0) 0%, rgba(48,48,48,1) 100%)

#l_line
    background: rgb(48,48,48)
    background: linear-gradient(0deg, rgba(48,48,48,0) 0%, rgba(48,48,48,1) 100%)

#timeline
    background: #F6F6F6
    margin-top: 50px
    padding: 100px 0
    font-family: 'Raleway-Regular'
    &.large
        margin: 0 10%

#descr
    height: 200px
    margin: 60px 30%
    font-family: 'Raleway-Regular'
    p
        text-align: justify
    &.small
        margin: 60px 10%
    &.medium
        margin: 50px 15%

</style>
