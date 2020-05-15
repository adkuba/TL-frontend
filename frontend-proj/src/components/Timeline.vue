<template>
    <div v-if="eventsParsed">
        <div class="menu">
            <router-link class="home_b" :to="{ name: 'home' }">Home</router-link>
            <div class="user_d"> {{ timeline.user.fullName }} </div>
        </div>

        <div id="timeline">
            <div id="text_fade_top" class="text_fade trans"></div>


            <div id="evt_desc" class="fade evt_trans">
                <div v-if="openedEvent">
                    <div class="evt_button" v-on:click="moveRight()">Back</div>
                    <h1 class="evt_h"> {{ eventsParsed[openedEvent].title }} </h1>
                    <p class="evt_p"> {{ eventsParsed[openedEvent].shortDescription }} </p>
                    <p class="evt_desc_p"> {{ eventsParsed[openedEvent].description }} </p>
                    <p class="evt_desc_p2" v-for="(value, name) in eventsParsed[openedEvent].links" :key="name"> {{ name }} </p>
                </div>

                <div id="sub_timeline" v-if="subTimelineEventsParsed">
                    <div class="sub_fade sub_fade_left"></div>
                    <div class="sub_fade sub_fade_right"></div>
                    <div class="sub" v-for="(evt, index) in subTimelineEventsParsed" :key="index">
                        <div class="sub_line" v-if="evt.type == 'line'"></div>
                        <div class="sub_evt" v-else-if="evt.type == 'circle'">
                            <div> 
                                <h1 class="sub_evt_h"> {{ evt.title }} </h1>
                                <p class="sub_evt_p"> {{ evt.shortDescription }} </p>
                            </div>
                            <div class="sub_circle"></div>
                            <div> {{ evt.date }} </div>
                        </div>
                        <div class="sub_year" v-else> {{ evt.message }} </div>
                    </div>
                </div>

                <div id="evt_gallery"></div>
            </div>
            

            <div id="f_line" class="line trans"></div>
            <div v-for="(evt, index) in eventsParsed" :key="index">
                <div class="line trans" v-if="evt.type == 'line'"></div>
                <div class="evt" v-else-if="evt.type == 'circle'">
                    <div class="evt_date trans" v-on:click="moveLeft(index)"> {{ evt.date }} </div>
                    <div class="circle trans" v-on:click="move(index)"></div>
                    <div class="evt_text trans" v-on:click="moveLeft(index)"> 
                        <h1 class="evt_h"> {{ evt.title }} </h1>
                        <p class="evt_p"> {{ evt.shortDescription }} </p>
                    </div>
                </div>
                <div class="year trans" v-else> {{ evt.message }} </div>
            </div>
            <div id="l_line" class="line trans"></div>


            <div id="text_fade_bottom" class="text_fade trans"></div>
        </div>


        <div id="descr">
            <h1> {{ timeline.user.fullName }} </h1>
            <p> {{ timeline.user.description }} </p>
        </div>
    </div>
</template>


<script>

export default {
    name: 'Timeline',
    props: [],
    created () {
        var timelineApi = this.baseApi + 'timelines?username=' + this.$route.params.id;
        this.axios.get(timelineApi).then(response => {
            if (response.data.length != 0){
                this.timeline = response.data;
            } else {
                this.$router.push( {path: "/"} );
            } }).catch(err => console.log(err));
    },
    data() {
        return {
        baseApi: 'http://localhost:8081/',
        open: false,
        timeline: null,
        events: null,
        eventsParsed: null,
        openedEvent: null,
        subTimeline: null,
        subTimelineEvents: null,
        subTimelineEventsParsed: null,
        }
    },
    watch: {
        timeline: function(){
            var eventsApi = this.baseApi + 'events?timelineId=' + this.timeline.id;
            this.axios.get(eventsApi).then(response => {this.events = response.data});
        },
        events: function(){
            this.eventsParsed = this.parseTimeline(this.events);
        },
        openedEvent: function(){
            var subTimelineApi = this.baseApi + 'timelines/event?eventId=' + this.eventsParsed[this.openedEvent].id;
            this.axios.get(subTimelineApi).then(response => {this.subTimeline = response.data});
        },
        subTimeline: function(){
            if (this.subTimeline != "" && this.subTimeline != null){
                var subTimelineEventsApi = this.baseApi + 'events?timelineId=' + this.subTimeline.id;
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

            output = output.reverse();
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
                document.getElementsByClassName("line").forEach(function moveLines(line) {line.classList.add('line_open');});
                document.getElementsByClassName("circle").forEach(function moveCircles(circle) {circle.classList.add('circle_open');});
                document.getElementsByClassName("year").forEach(function moveYears(year) {year.classList.add("year_open");});
                document.getElementsByClassName("evt_date").forEach(function moveDates(date){date.classList.add("fade");});
                document.getElementsByClassName("evt_text").forEach(function moveTexts(text){text.classList.add("fade");});
                
                document.getElementById("text_fade_top").classList.add("fade");
                document.getElementById("text_fade_bottom").classList.add("fade");
                document.getElementById("evt_desc").classList.remove("fade");
                this.open = !this.open;
                this.openedEvent = index
        },
        moveRight(){
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
                this.subTimeline = null;
                this.subTimelineEvents = null;
                this.subTimelineEventsParsed = null;
        }
    },
    updated: function(){
        //poprawka pozycjonowania jak juz wszystkie dane wygeneruje
        var newPos = window.scrollY + 160;
        var evt_desc = document.getElementById("evt_desc");
        console.log(evt_desc.offsetHeight);
        if (newPos + evt_desc.offsetHeight > document.getElementById("descr").offsetTop - 100){
            newPos = document.getElementById("descr").offsetTop - evt_desc.offsetHeight - 160;
        }
        document.getElementById("evt_desc").style.top = newPos + "px";
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
    }
}


</script>


<style scoped>
/* sub_timeline */
div#sub_timeline::-webkit-scrollbar {
  height: 3px;
}

div#sub_timeline::-webkit-scrollbar-track {
  background: #e0e0e0;
  border-radius: 10px;
}

div#sub_timeline::-webkit-scrollbar-thumb {
  background: #c7c7c7;
  border-radius: 10px;
}

div#sub_timeline:hover::-webkit-scrollbar {
    height: 10px;
}

.sub_fade{
    z-index:2;
    position: absolute;
    width: 70px;
    height: 200px;
    background: rgb(246,246,246);
}

.sub_fade_left{
    background: linear-gradient(270deg, rgba(246,246,246,0) 0%, rgba(246,246,246,1) 91%);
}

.sub_fade_right{
    right: 0;
    background: linear-gradient(90deg, rgba(246,246,246,0) 0%, rgba(246,246,246,1) 91%);
}

.sub_evt_h{
    font-size: 23px;
    margin: 0;
    padding: 0;
    letter-spacing: 2px;
}

.sub_evt_p{
    font-size: 15px;
    margin-top: 0;
    padding-top: 10px;
}

.sub_line{
    margin-bottom: 5px;
    width: 90px;
    height: 3px;
    background: #303030;
}

.sub_circle{
    margin: 20px auto;
    width: 20px;
    height: 20px;
    background: #14426B;
    border-radius: 50%;
}

.sub_year{
    margin: 0 40px;
    font-size: 19px;
    letter-spacing: 2px;
}

.sub_evt{
    text-align: center;
    /* font size z year + margin 20px */
    transform: translateY(+39px);
}

.sub{
    display: inline-block;
}

#sub_timeline{
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    margin-top: 60px;
    height: 220px;
}



/* evt_desc */
#evt_gallery{
    height: 350px;
    width: 100%;
    margin-top: 60px;
    border: 2px solid red;
    border-radius: 10px;
    background: #F6F6F6;
}

.evt_desc_p{
    margin-top: 40px;
    display: block;
}

.evt_desc_p2{
    margin-right: 40px;
    margin-top: 40px;
    display: inline-block;
    color: #14426B;
}

#evt_desc{
    position: absolute;
    width: 45%;
    left: 30%;
    text-align: left;
}

.evt_trans{
    transition: all 0.7s, top 1ms;
}

.evt_button {
    z-index: 2;
    position: absolute;
    right: 0;
    background-color: #303030;
    border: 0px solid #303030;
    border-radius: 10px;
    color: white;
    padding: 3px 17px;
    letter-spacing: 2px;
    font-size: 13px;
    transform: translateY(+5px);
}



/* main */
.user_d{
    z-index: 4;
    color: white;
    letter-spacing: 1px;
    font-family: OpenSans-Regular;
    width: 20%;
    margin: 12px auto;
}

.fade{
  opacity: 0;
}

.text_fade{
    position: sticky;
    z-index:2;
    height: 150px;
    background: rgb(246,246,246);
}

#text_fade_top{
    top: 50px;
    background: linear-gradient(0deg, rgba(246,246,246,0) 0%, rgba(246,246,246,1) 91%);
}

#text_fade_bottom{
    bottom: 0;
    background: linear-gradient(180deg, rgba(246,246,246,0) 0%, rgba(246,246,246,1) 91%);
}

.trans{
    transition: all 0.7s;
}

.evt_h{
    font-size: 30px;
    margin: 0;
    padding: 0;
    letter-spacing: 2px;
}

.evt_p{
    margin-top: 0;
    padding-top: 10px;
}

.evt{
    margin: 40px auto;
}

.evt_date{
    position: relative;
    float: left;
    width: 40%;
    text-align: right;
    letter-spacing: 2px;
}

.evt_text{
    float: right;
    width: 40%;
    text-align: left;
    transform: translateY(-50%);
}

.year_open{
    margin: 40px 8% !important;
    opacity: 0.2;
}

.year{
    margin: 40px 50%;
    width: 20%;
    transform: translateX(-50%);
    font-size: 19px;
    letter-spacing: 2px;
}

.circle_open{
    margin: 0 8% !important;
    opacity: 0.2;
}

.circle{
    margin: 0 50%;
    transform: translateX(-50%);
    width: 25px;
    height: 25px;
    background: #B8352D;
    border-radius: 50%;
}

.line_open{
    margin: 0 8% !important;
    opacity: 0.2;
}

.line{
    display: block;
    margin: 0 50%;
    width: 3px;
    height: 80px;
    background: #303030;
}

#f_line{
    background: rgb(48,48,48);
    background: linear-gradient(180deg, rgba(48,48,48,0) 0%, rgba(48,48,48,1) 100%);
}

#l_line{
    background: rgb(48,48,48);
    background: linear-gradient(0deg, rgba(48,48,48,0) 0%, rgba(48,48,48,1) 100%);
}

#timeline{
    background: #F6F6F6;
    margin: 0 15%;
    font-family: 'Raleway-Regular';
}

#descr{
    height: 200px;
    margin: 60px 30%;
    font-family: 'Raleway-Regular';
}

#descr p{
    text-align: left;
}
</style>
