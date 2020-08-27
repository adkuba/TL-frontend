<template>
    <div v-if="eventsParsed">
        <router-link :to="{ path: '/profile/' + timeline.user.username }" class="user_d" :class="$mq" v-if="!mockEvents"> {{ timeline.user.fullName }} </router-link>

        <div id="image-viewer" :class="$mq">
            <div id="img-container">
                <img :src="mainImages[mainImageIndex]" id="main-image" v-if="mainImages">
                <div id="left-control" v-on:click="imageViewerScroll(mainImageIndex-1)"></div>
                <div id="right-control" v-on:click="imageViewerScroll(mainImageIndex+1)"></div>
            </div>
        </div>
        <div id="image-full-bg" v-on:click="closeImage()"></div>

        <div id="timeline" :class="$mq" v-if="timeline.active && mockTimeline == null || mockTimeline">
            <div v-if="mockTimeline == null">
                <div class="moreG" :class="$mq" v-on:click="openMore()">&#9866;</div>
                <div id="more" :class="$mq" v-on:click="report(timeline)">Report</div>
            </div>

            <div id="evt_container" :class="$mq">
                <div id="evt_desc" class="fade evt_trans">
                    <div id="evt_desc_text" v-if="openedSub">
                        <div class="evt_button" :style="'background: ' + mainColor" v-on:click="moveRight()">Back</div>
                        <div v-if="eventsParsed && sub && eventsParsed[openedEvent]" class="master-title" v-on:click="moveRight()">{{ eventsParsed[openedEvent].title.toUpperCase() }}</div>
                        <h1 class="evt_h"> {{ eventsSub[openedSub].title }} </h1>
                        <p class="evt_desc_p"> {{ eventsSub[openedSub].description.replace(/\[([^\]]+)\]\(([^\)]+)\)?/g, '') }} </p>
                        <div class="link-container" v-for="(value, lidx) in eventsSub[openedSub].description.match(/\[([^\]]+)\]\(([^\)]+)\)/g)" :key="lidx">
                            <a :href="'https://' + value.split('(')[1].slice(0, -1).replace(/(^\w+:|^)\/\//, '')" target="_blank" class="evt_desc_p2" > {{ value.split('(')[0].slice(1, -1) }} </a>
                        </div>
                    </div>
                    
                    <div style="text-align: center">
                        <div class="sub" v-show="evt.title" v-for="(evt, index) in subTimelineEventsParsed" :key="index">
                            <div v-if="evt.type == 'circle'">
                                <h1 class="sub_nav_h"  v-on:click="subScroll(index, true)"> {{ evt.title }} </h1>
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
                                <p class="sub_evt_p" v-on:click="subevent(index)"> {{ evt.description.substring(0, 20) }}... </p>
                                <div class="sub_evt_date" v-on:click="subevent(index)"> {{ evt.date.slice(0,7) }} </div>
                            </div>
                            <div class="sub_year" v-else> {{ evt.message }} </div>
                        </div>
                        <div class="sub_sline"></div>
                    </div>

                    <div class="gallery-container" :class="$mq" v-if="openedSub">
                        <div id="sub_gallery" class="gallery" :class="$mq" v-if="eventsSub[openedSub].pictures.length > 0">
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
                    <div class="circle trans" :style="'background: ' + mainColor" :class="$mq" v-on:click="move(index)"></div>
                    <div class="evt_text trans" :class="$mq" v-on:click="moveLeft(index)">
                        <h1 class="evt_h"> {{ evt.title }} </h1>
                        <p class="evt_p"> {{ evt.description.substring(0, 35) }}... </p>
                        <p class="evt_p" v-if="$mq == 'small'"> {{ evt.date.slice(0,7) }} </p>
                    </div>
                </div>
                <div class="year trans" :class="$mq" v-else> {{ evt.message }} </div>
            </div>
            <div id="l_line" class="line trans" :class="$mq"></div>

        </div>
        <div id="timeline" style="padding-bottom: 100px; width: 90%; margin-left: 5%" v-if="!timeline.active && mockTimeline == null">
            <h1 style="margin: 10px">Timeline not active!</h1>
        </div>


        <div id="descr" :class="$mq">
            <h1> {{ timeline.descriptionTitle }} </h1>
            <p> {{ timeline.description.replace(/\[([^\]]+)\]\(([^\)]+)\)?/g, '') }} </p>
            <div class="link-container" v-for="(value, lidx) in timeline.description.match(/\[([^\]]+)\]\(([^\)]+)\)/g)" :key="lidx">
                <a :href="'https://' + value.split('(')[1].slice(0, -1).replace(/(^\w+:|^)\/\//, '')" target="_blank" class="evt_desc_p2" > {{ value.split('(')[0].slice(1, -1) }} </a>
            </div>
        </div>
        <div class="gallery-container" :class="$mq" v-if="timeline.pictures.length > 0" >
            <div id="tl_gallery" class="gallery" :class="$mq">
                <div class="image-container" v-for="(img, index) in timeline.pictures" :key="index">
                    <img class="image" :class="$mq" :src="img" v-on:click="openImage(timeline.pictures, index)" >
                </div>
            </div>
        </div>
        <div class="like" v-bind:class="[{ shadow: !timeline.active}, $mq]">
            <div v-if="$store.state.jwt">
                <div v-if="$store.state.jwt.user.likes.includes(timeline.id)">
                    <div v-if="timeline.likes != null" class="like-action" v-on:click="dislikeTimeline()" :class="$mq"><div class="like-button" :class="{free: !timeline.user.subscriptionEnd}">Dislike</div>&middot; {{ timeline.likes.length }} &middot; views {{ timeline.views }}</div>
                    <div class="trending" :class="$mq">{{ timeline.creationDate }} &middot; &#8593;{{ timeline.trendingViews }}</div>
                    <div v-if="timeline.user" class="email" :class="$mq">{{ timeline.user.email }}</div>
                </div>
                <div v-else>
                    <div v-if="timeline.likes != null" class="like-action" v-on:click="likeTimeline()" :class="$mq"><div class="like-button" :class="{free: !timeline.user.subscriptionEnd}">Like</div>&middot; {{ timeline.likes.length }} &middot; views {{ timeline.views }}</div> 
                    <div class="trending" :class="$mq">{{ timeline.creationDate }} &middot; &#8593;{{ timeline.trendingViews }}</div>
                    <div v-if="timeline.user" class="email" :class="$mq">{{ timeline.user.email }}</div>
                </div>
            </div>
            <div v-else>
                <router-link v-if="timeline.likes != null" class="login-like like-action" :to="{ name: 'login', params: {path: {path: '/timeline/' + timeline.id}}}" :class="$mq"><div class="like-button" :class="{free: !timeline.user.subscriptionEnd}">Login to like</div> &middot; {{ timeline.likes.length }} &middot; views {{ timeline.views }}</router-link>
                <div class="trending" :class="$mq">{{ timeline.creationDate }} &middot; &#8593;{{ timeline.trendingViews }}</div>
                <div v-if="timeline.user" class="email" :class="$mq">{{ timeline.user.email }}</div>
            </div>
        </div>
    </div>
    <div v-else>
        <div v-if="!mockTimeline" class="empty-element" :class="$mq"></div>
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
    metaInfo() {
        return {
            title: this.timeline.descriptionTitle,
            titleTemplate: '%s - Tline',
            meta: [
                { name: 'description', content: this.timeline.description},
                { property: 'og:url', content: 'https://www.tline.site/timeline/' + this.$route.params.id },
                { property: 'og:title', content: this.timeline.descriptionTitle + ' - Tline' },
                { property: 'og:descriprion', content: this.timeline.description},
                { property: 'og:image', content: this.timeline.pictures.length > 0 ? this.timeline.pictures[0] : 'https://storage.googleapis.com/tline-files/Default7.png' },
                { property: 'twitter:card', content: 'summary_large_image'},
                { property: 'twitter:url', content: 'https://www.tline.site/timeline/' + this.$route.params.id },
                { property: 'twitter:title', content: this.timeline.descriptionTitle + ' - Tline' },
                { property: 'twitter:description', content: this.timeline.description },
                { property: 'twitter:image', content: this.timeline.pictures.length > 0 ? this.timeline.pictures[0] : 'https://storage.googleapis.com/tline-files/Default7.png' }
            ]
        }
    },
    mounted() {
        this.scrollToTop()
        window.addEventListener("resize", this.resize)
    },
    created () {
        this.mainColor = this.circleColors[Math.floor(Math.random() * this.circleColors.length)]
        if (!this.mockEvents){
            var username = null
            if (this.$store.state.jwt){
                username = this.$store.state.jwt.user.username
            }
            var timelineApi = this.baseApi + 'timelines/public?username=' + username + '&id=' + this.$route.params.id
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
        baseApi: 'https://api.tline.site/api/',
        open: false,
        timeline: {
            description: 'Timeline',
            pictures: []
        },
        events: null,
        newPos: null,
        galleryScrolling: false,
        sub: false,
        circleColors: ['#B8352D', '#14426b'],
        mainColor: '#B8352D',

        mainImages: null,
        mainImageIndex: null,
        padding: 150,

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
        resize(){
            if (this.mainImages){
                this.changeImageContainerSize()
            }
        },
        scrollToTop() {
            const c = document.documentElement.scrollTop || document.body.scrollTop;
            if (c > 0) {
                window.requestAnimationFrame(this.scrollToTop);
                window.scrollTo(0, c - c / 8);
            }
        },
        openMore(){
            var more = document.getElementById('more')
            if (more.style.display=='block'){
                more.style.display="none"

            } else {
                more.style.display="block"
            }
        },
        report(timeline){
            this.axios.post(this.baseApi + 'timelines/public/report?id=' + timeline.id)
                .then(() => {
                    this.$store.commit('setMessage', "Our admins will review it, thank you!")
                    document.getElementById("modal").style.display = "block"
                    this.openMore()
                })
                .catch(error => {
                    console.log(error)
                })
        },
        likeTimeline(){
            this.axios.post(this.baseApi + 'timelines/' + this.timeline.id + '/like', null, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                }
            })
            .then(response => {
                var jwt = this.$store.state.jwt
                jwt.user.likes = response.data
                this.timeline.likes.push({date: new Date(), userId: this.$store.state.jwt.user.username})
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
                jwt.user.likes = response.data
                var index = this.timeline.likes.indexOf(this.timeline.likes.find(x => x.userId === this.$store.state.jwt.user.username))
                this.timeline.likes.splice(index, 1)
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
                this.changeImageContainerSize()
            }
        },
        closeImage(){
            document.getElementById("image-viewer").style.display = "none"
            document.getElementById("image-full-bg").style.display = "none"
            this.mainImages = null
            this.mainImageIndex = null
        },
        openImage(images, index){
            document.getElementById("image-viewer").style.display = "block"
            document.getElementById("image-full-bg").style.display = "block"
            this.mainImages = images
            this.mainImageIndex = index
            this.changeImageContainerSize()
        },
        changeImageContainerSize(){
            var imageObject = new Image()
            imageObject.src = this.mainImages[this.mainImageIndex]
            var self = this
            imageObject.onload = function() {
                if (imageObject.width > imageObject.height){
                    var container = document.getElementById("img-container")
                    var width = (window.innerWidth * 0.9)
                    var height = width * (imageObject.height/imageObject.width)
                    if (height > window.innerHeight * 0.8){
                        height = window.innerHeight * 0.8
                        width = height * (imageObject.width/imageObject.height)
                    }
                    container.setAttribute("style", "width:" + width + 'px')
                    container.style.width = width + 'px'
                    container.style.height = height + 'px'
                    self.setControlsSize(width, height)
                    
                } else {
                    container = document.getElementById("img-container")
                    height = (window.innerHeight * 0.8)
                    width = height * (imageObject.width/imageObject.height)
                    if (width > window.innerWidth * 0.9){
                        width = window.innerWidth * 0.9
                        height = width * (imageObject.height/imageObject.width)
                    }
                    container.style.height = height + 'px'
                    container.setAttribute("style", "width:" + width + 'px')
                    container.style.width = width + 'px'
                    self.setControlsSize(width, height)
                }
            }
        },
        setControlsSize(width, height){
            var leftControl = document.getElementById("left-control")
            leftControl.setAttribute("style", "width:" + width/2 + 'px')
            leftControl.style.width = width/2 + 'px'
            leftControl.style.height = height + 'px'
            var rightControl = document.getElementById("right-control")
            rightControl.setAttribute("style", "width:" + width/2 + 'px')
            rightControl.style.width = width/2 + 'px'
            rightControl.style.height = height + 'px'
            rightControl.style.marginLeft = width/2 + 'px'
        },
        subScroll(index, open=false){
            var subT = document.getElementById("sub_timeline")
            if (subT){
                var searchedE = subT.children[index+3];
                //subT.offsetLeft to margin sub timeline przy .large
                var newScroll = searchedE.offsetLeft - subT.offsetWidth/2 + searchedE.offsetWidth/2 - subT.offsetLeft;
                subT.scroll({top: 0, left: newScroll, behavior: 'smooth'});
                if (open){
                    this.subevent(index)
                }
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
                
                if (firstDate.getFullYear() < secondDate.getFullYear()){
                    var year = {type: 'text', message: '', date: '', startDate: ''};
                    if ((firstDate.getFullYear() + 1) < secondDate.getFullYear()){
                        year.date = secondDate.getFullYear() + '-01-01T00:00:00';
                        year.startDate = firstDate.getFullYear() + '-12-31T00:00:00';
                        year.message = secondDate.getFullYear() +  '\n-\n'  + (firstDate.getFullYear() + 1)
                    } else {
                        year.date = firstDate.getFullYear() + '-12-31T00:00:00';
                        year.startDate = year.date
                        year.message = firstDate.getFullYear() + 1
                    }
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

                if (yearsParsed[i+1].startDate != null){
                    firstDate = new Date(yearsParsed[i].date);
                    secondDate = new Date(yearsParsed[i+1].startDate);

                } else {
                    firstDate = new Date(yearsParsed[i].date);
                    secondDate = new Date(yearsParsed[i+1].date);
                }
                
                var monthDiff = (secondDate.getFullYear() - firstDate.getFullYear()) * 12;
                monthDiff -= firstDate.getMonth();
                monthDiff += secondDate.getMonth();

                //additional lines based on months
                for (var j = 0, len2 = monthDiff; j < len2; j++){
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
                
                document.getElementById("evt_desc").classList.remove("fade");
                this.open = !this.open;
                this.openedEvent = index;

                this.eventsSub = this.eventsParsed;
                this.openedSub = index;
                this.computeTimeline()
            }
        },
        moveRight(){
            //jesli jestesmy w sub evencie
            if (this.sub){
                this.sub = false
                this.eventsSub = this.eventsParsed
                this.openedSub = this.openedEvent
                window.scroll({top: this.newPos-100, left: 0, behavior: 'smooth'})
                this.computeTimeline()

            } else {
                document.getElementById("timeline").style.paddingBottom = '150px'
                this.padding = 150
                document.getElementsByClassName("line").forEach(function centerLines(line) {line.classList.remove('line_open');});
                document.getElementsByClassName("circle").forEach(function centerCircles(circle) {circle.classList.remove('circle_open');});
                document.getElementsByClassName("year").forEach(function centerYears(year) {year.classList.remove('year_open');});
                document.getElementsByClassName("evt_date").forEach(function centerDates(date){date.classList.remove("fade");});
                document.getElementsByClassName("evt_text").forEach(function centerTexts(text){text.classList.remove("fade");});
                document.getElementsByClassName("evt_text").forEach(function centerTexts(text){text.classList.remove("fade");});
                
                document.getElementById("evt_desc").classList.add("fade");

                this.open = !this.open;
                this.openedEvent = null;
            }
        },
        subevent(index){
            this.sub = true
            this.eventsSub = this.subTimelineEventsParsed
            this.openedSub = index
            window.scroll({top: this.newPos-100, left: 0, behavior: 'smooth'})
            this.computeTimeline()
        },
        sortByDate(array){
            return array.sort(function(a, b){
                return new Date(a.date) - new Date(b.date)
            })
        },
        computeTimeline(){
            var timelineElem = document.getElementById("timeline")
            var evtElem = document.getElementById("evt_container")
            var difference = (evtElem.offsetTop + evtElem.offsetHeight + 60) - (timelineElem.offsetTop + timelineElem.offsetHeight)
            //console.log("difference" + difference)
            if (difference > 0){
                timelineElem.style.paddingBottom = (this.padding + difference) + 'px'
                this.padding += difference
            }
        }
    },
    updated() {
        if (this.openedSub == this.openedEvent){
            this.subScroll(2)
        }
        if (this.openedEvent){
            this.computeTimeline()
        }
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
    }
}


</script>


<style scoped lang="sass">
@import '../assets/saas-vars.sass'

#left-control
    position: absolute
    z-index: 7
    top: 0

#right-control
    position: absolute
    z-index: 7
    top: 0

#image-full-bg
    z-index: 5
    display: none
    top: 0
    left: 0
    position: fixed
    width: 100%
    height: 100%

.master-title
    cursor: pointer
    font-size: 14px
    color: #7e7e7e

.like-button
    margin-right: 5px
    padding: 5px 10px
    border-radius: 5px
    display: inline-block
    color: white
    background: #ff7f51

.free
    background: #9cafb7

.like-action
    display: inline-block
    cursor: pointer
    user-select: none
    &.small
        text-align: left
        margin-left: 5%
        margin-bottom: 10px
        display: block

.empty-element
    margin-top: 80px
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)
    border-radius: 20px
    position: relative
    width: 80%
    height: 1000px
    margin-left: 10%
    background: rgba(0, 0, 0, 0.04)
    animation: pulse 1.5s linear infinite
    &.medium
        width: 100%
        margin-left: 0
    &.small
        width: 100%
        margin-left: 0

@keyframes pulse
    0%
        background: rgba(0, 0, 0, 0.04)
    50%
        background: rgba(0, 0, 0, 0.1)
    100%
        background: rgba(0, 0, 0, 0.04)

#more
    position: absolute
    top: 120px
    right: calc(10% + 20px)
    font-size: 14px
    display: none
    cursor: pointer
    &.medium
        right: 2%
    &.small
        right: 5%

.moreG
    position: absolute
    right: calc(10% + 20px)
    top: 90px
    color: #7e7e7e
    cursor: pointer
    &.medium
        right: 2%
    &.small
        right: 5%

.trending
    display: inline-block
    margin-left: 85px
    color: #7e7e7e
    &.small
        display: block
        text-align: left
        margin-left: 5%

.email
    display: inline-block
    color: #303030
    margin-left: 85px
    user-select: text
    &:hover
        cursor: default
    &.small
        display: block
        margin-left: 5%
        margin-top: 10px
        text-align: left

.login-like
    text-decoration: none
    color: #14426B
    
.like
    animation-timing-function: ease-in
    animation: fadein 1s
    color: #14426B
    font-family: RaleWay-Regular
    margin-top: 20px
    &.small
        width: 90%
        margin-left: 5%

.left
    left: 35%
    position: absolute
    &.medium
        left: 25%
    &.small
        left: 5%

.vm-item
    padding: 0 15px
    top: 3px
    font-weight: bold
    border-radius: 5px
    font-size: 17px
    cursor: pointer
    position: absolute
    right: 35%
    &.medium
        right: 25%
    &.small
        right: 5%

.center
    position: absolute
    left: 50%
    top: 5px
    transform: translateX(-50%)

.arrow
    cursor: pointer
    font-size: 20px
    padding: 0 20px
    margin-top: 2px
    margin-right: 10px
    display: inline-block
    &.small
        margin-right: 5px

.viewer-menu
    width: 30%
    margin-left: 35%
    border-radius: 5px
    height: 30px
    margin-bottom: 5px
    background: rgb(83,83,83)
    background: linear-gradient(0, rgba(83,83,83,1) 0%, rgba(61,61,61,1) 100%)
    &.medium
        width: 50%
        margin-left: 25%
    &.small
        width: 90%
        margin-left: 5%

#img-container
    margin: 0 auto

#main-image
    width: 100%
    height: 100%

#image-viewer
    color: #cccccc
    font-size: 15px
    font-family: Raleway-Regular
    top: 10%
    user-select: none
    position: fixed
    z-index: 6
    width: 80%
    height: 0
    left: 10%
    box-shadow: 0px 0px 0px 1600px rgba(0,0,0,0.85)
    border-radius: 5px
    display: none
    &.small
        width: 100%
        left: 0
    &.medium
        width: 90%
        left: 5%

.image-container
    display: inline-block
    margin-right: 7px
    margin-bottom: 5px

.image
    animation-timing-function: ease-in
    animation: fadein 1s
    cursor: pointer
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
    text-align: center
    margin: 70px 30%
    &.medium
        margin: 170px 15%
    &.small
        margin: 50px 10%
    #evt_container &
        width: 100%
        margin: 60px 10px
        margin-left: 0


div#sub_timeline::-webkit-scrollbar
    display: none

.sub_fade
    z-index: 4
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
    cursor: pointer
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
    cursor: pointer
    font-family: Raleway-Regular
    font-size: 20px
    letter-spacing: 1px
    margin: 10px 20px

.sub_evt_date
    cursor: pointer
    text-align: center
    margin: 0 30px
    font-size: 15px

.sub
    position: relative
    z-index: 3
    display: inline-block

#evt_desc_text
    min-height: 170px
    margin-bottom: 40px

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
    scrollbar-width: none
    overflow-x: auto
    overflow-y: hidden
    white-space: nowrap
    height: 80px
    margin-top: 30px
    &.large
        margin-left: auto
        margin-right: auto
        width: 76%


.hor-l
    height: 1px
    background: #b3b3b3


.evt_desc_p
    white-space: pre-line
    margin-top: 40px
    display: block
    text-align: lect

.link-container
    display: inline-block

.evt_desc_p2
    text-decoration: none
    font-family: OpenSans-Regular
    margin-top: 10px
    margin-right: 20px
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
    cursor: pointer
    user-select: none
    z-index: 2
    position: absolute
    right: 0
    border-radius: 10px
    color: white
    padding: 3px 17px
    letter-spacing: 2px
    font-size: 13px
    transform: translateY(+5px)


.user_d
    animation-timing-function: ease-in
    animation: fadein 1s
    user-select: none
    text-decoration: none
    z-index: 5
    position: fixed
    color: white
    letter-spacing: 2px
    font-family: Raleway-Regular
    font-size: 16px
    top: 19px
    transform: translateX(-50%) scale(1.001)

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
    cursor: pointer
    font-size: 35px
    margin: 0
    padding: 0
    letter-spacing: 2px
    width: 70%

.evt_p
    cursor: pointer
    margin-top: 0
    padding-top: 10px

.evt
    margin: 40px auto

.evt_date
    cursor: pointer
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
    &.medium
        white-space: pre-line
    &.small
        white-space: pre-line
        margin: 40px 15%

.circle_open
    margin: 0 8% !important
    opacity: 0.2
    &.small
        opacity: 0.05
        margin: 0 0% !important

.circle
    cursor: pointer
    margin: 0 50%
    transform: translateX(-50%)
    width: 25px
    height: 25px
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
    animation-timing-function: ease-in
    animation: fadein 1s
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)
    border-radius: 30px
    background: $bg-color
    padding-top: 100px
    margin-top: 80px
    padding-bottom: 150px
    font-family: 'Raleway-Regular'
    transition: padding 1s
    &.large
        margin-left: 10%
        margin-right: 10%

#descr
    white-space: pre-line
    animation-timing-function: ease-in
    animation: fadein 1s
    margin: 0 20%
    margin-top: 100px
    margin-bottom: 50px
    min-height: 130px
    text-align: left
    font-family: 'Raleway-Regular'
    h1
        text-align: center
    p
        text-align: left
    &.small
        margin: 60px 10%
    &.medium
        margin: 50px 15%

</style>