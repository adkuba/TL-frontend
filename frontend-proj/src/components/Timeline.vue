<template>
    <div>
        <div class="menu">
            <router-link class="home_b" :to="{ name: 'home' }">Home</router-link>
            <div class="user_d"> {{ user }} </div>
        </div>

        <div id="timeline">
            <div id="text_fade_top" class="text_fade trans"></div>


            <div id="evt_desc" class="fade evt_trans">
                <div class="evt_button" v-on:click="moveRight()">Back</div>
                <h1 class="evt_h"> {{ items[index].title }} </h1>
                <p class="evt_p"> {{ items[index].desc }} </p>
                <p class="evt_desc_p"> {{ lorem }} </p>
                <p class="evt_desc_p2" v-for="(item, index) in links" :key="index"> {{ item.title }} </p>
                <img class="evt_img" src="../assets/images/g2s.png" width="65" height="17" v-on:click="openGallery()">
            

                <div id="sub_timeline" v-if="sub_yes">
                    <div class="sub_fade sub_fade_left"></div>
                    <div class="sub_fade sub_fade_right"></div>
                    <div class="sub" v-for="(item, index) in items" :key="index">
                        <div class="sub_line" v-if="item.type == 'line'"></div>
                        <div class="sub_evt" v-else-if="item.type == 'circle'">
                            <div> 
                                <h1 class="sub_evt_h"> {{ item.title }} </h1>
                                <p class="sub_evt_p"> {{ item.desc }} </p>
                            </div>
                            <div class="sub_circle"></div>
                            <div> {{ item.date }} </div>
                        </div>
                        <div class="sub_year" v-else> {{ item.message }} </div>
                    </div>
                </div>

                <div id="evt_gallery" class="fade gallery_trans"></div>
            </div>
            

            <div id="f_line" class="line trans"></div>
            <div v-for="(item, index) in items" :key="index">
                <div class="line trans" v-if="item.type == 'line'"></div>
                <div class="evt" v-else-if="item.type == 'circle'">
                    <div class="evt_date trans" v-on:click="moveLeft()"> {{ item.date }} </div>
                    <div class="circle trans" v-on:click="move()"></div>
                    <div class="evt_text trans" v-on:click="moveLeft()"> 
                        <h1 class="evt_h"> {{ item.title }} </h1>
                        <p class="evt_p"> {{ item.desc }} </p>
                    </div>
                </div>
                <div class="year trans" v-else> {{ item.message }} </div>
            </div>
            <div id="l_line" class="line trans"></div>


            <div id="text_fade_bottom" class="text_fade trans"></div>
        </div>


        <div id="descr">
            <h1> {{ user }} </h1>
            <p> {{ lorem }} </p>
        </div>
    </div>
</template>


<script>
export default {
    name: 'Timeline',
    props: [],
    created () {
        //alert(this.$route.params.id);
    },
    data() {
        return {
        links: [ {title: 'Repozytorium', link: 'mordoo'}, {title: 'Google Play', link: 'mordoo'} ],
        items: [ {type: 'line'}, {type: 'line'}, {type: 'circle', date: '2020 luty', title: 'Gravity', desc: 'Gra stworzona w unity na Androida'}, {type: 'line'}, {type: 'line'}, {type: 'text', message: '2020'}, {type: 'line'}, {type: 'line'}, {type: 'line'}, {type: 'circle', date: '2019 pazdziernik', title: 'Object tracking', desc: 'Projekt o sledzeniu obiektow za pomoca ML'}, {type: 'line'}, {type: 'line'} ],
        user: 'Jakub Adamski',
        description: 'To jest przykladowy tekst o mnie',
        open: false,
        g_open: false,
        sub_yes: true,
        index: 2,
        lorem: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus scelerisque nisi ac finibus. Donec ac est odio. Fusce pharetra quis velit sed suscipit. Aliquam convallis metus nunc. Nam eu mollis turpis. Aenean quis sollicitudin arcu, vel sollicitudin nunc. Cras sit amet elementum purus, sit amet mollis lacus. Ut id enim sodales, tincidunt lorem nec, efficitur mi. Vivamus ut elit tortor."
        }
    },
    methods: {
        move(){
            if (!this.open){
                this.moveLeft();

            } else{
                this.moveRight();
            }
        },
        openGallery(){
            var gallery = document.getElementById("evt_gallery");
            if (!this.g_open){
                gallery.classList.remove('fade');
                gallery.style.zIndex=2;
                this.g_open = !this.g_open;

            } else{
                gallery.classList.add('fade');
                gallery.style.zIndex=-1;
                this.g_open = !this.g_open;
            }

        },
        moveLeft() {
                var newPos = window.scrollY + 160;
                var evt_desc = document.getElementById("evt_desc");
                if (newPos + evt_desc.offsetHeight > document.getElementById("descr").offsetTop - 100){
                    newPos = document.getElementById("descr").offsetTop - evt_desc.offsetHeight - 160;
                }
                document.getElementById("evt_desc").style.top = newPos + "px";

                document.getElementsByClassName("line").forEach(function moveLines(line) {line.classList.add('line_open');});
                document.getElementsByClassName("circle").forEach(function moveCircles(circle) {circle.classList.add('circle_open');});
                document.getElementsByClassName("year").forEach(function moveYears(year) {year.classList.add("year_open");});
                document.getElementsByClassName("evt_date").forEach(function moveDates(date){date.classList.add("fade");});
                document.getElementsByClassName("evt_text").forEach(function moveTexts(text){text.classList.add("fade");});
                
                document.getElementById("text_fade_top").classList.add("fade");
                document.getElementById("text_fade_bottom").classList.add("fade");
                document.getElementById("evt_desc").classList.remove("fade");
                this.open = !this.open;
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
        }
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
    margin-top: 160px;
    height: 220px;
}



/* evt_desc */
#evt_gallery{
    position: absolute;
    transform: translateY(-300px);
    z-index: -1;
    height: 350px;
    width: 100%;
    border: 2px solid red;
    border-radius: 10px;
    background: #F6F6F6;
}

.gallery_trans{
    transition: all 0.4s, z-index 1ms;
}

.evt_desc_p{
    margin-top: 40px;
    display: inline-block;
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

.evt_img{
    border-radius: 8px;
    position: absolute;
    z-index: 2;
    right: 0;
    margin-top: 40px;
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
