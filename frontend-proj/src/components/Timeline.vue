<template>
    <div>
        <div id="timeline">
            
            <div class="evt_desc fade trans">
                <h1 class="evt_h"> {{ items[index].title }} </h1>
                <p class="evt_p"> {{ items[index].desc }} </p>
                <p class="evt_desc_p"> {{ lorem }} </p>
                <p class="evt_desc_p2" v-for="(item, index) in links" :key="index"> {{ item.title }} </p>
            
                <div id="sub_timeline" v-if="sub_yes">
                    <div class="sub" v-for="(item, index) in items" :key="index">
                        <div class="sub_line" v-if="item.type == 'line'"></div>
                        <div class="sub_evt" v-else-if="item.type == 'circle'">
                            <div class="sub_evt_text"> 
                                <h1 class="sub_evt_h"> {{ item.title }} </h1>
                                <p class="sub_evt_p"> {{ item.desc }} </p>
                            </div>
                            <div class="sub_circle"></div>
                            <div class="sub_evt_date"> {{ item.date }} </div>
                        </div>
                        <div class="sub_year" v-else> {{ item.message }} </div>
                    </div>
                </div>
            </div>
            
            <div v-for="(item, index) in items" :key="index">
                <div class="line trans" v-if="item.type == 'line'"></div>
                <div class="evt" v-else-if="item.type == 'circle'">
                    <div class="evt_date trans" v-if="!open"> {{ item.date }} </div>
                    <div class="circle trans" v-on:click="moveLeft()"></div>
                    <div class="evt_text trans"> 
                        <h1 class="evt_h"> {{ item.title }} </h1>
                        <p class="evt_p"> {{ item.desc }} </p>
                    </div>
                </div>
                <div class="year trans" v-else> {{ item.message }} </div>
            </div>
            
        </div>
        <div id="descr">
            <h1> {{ user }} </h1>
            <p style="text-align: left;"> {{ lorem }} </p>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Timeline',
  props: [],
  created () {
      window.addEventListener('scroll', this.handleScroll, false);
  },
  data() {
    return {
      links: [ {title: 'Repozytorium', link: 'mordoo'}, {title: 'Film', link: 'mordoo'}, {title: 'Google Play', link: 'mordoo'} ],
      items: [ {type: 'line'}, {type: 'line'}, {type: 'circle', date: '2020 luty', title: 'Gravity', desc: 'Gra stworzona w unity na Androida'}, {type: 'line'}, {type: 'line'}, {type: 'text', message: '2020'}, {type: 'line'}, {type: 'line'}, {type: 'line'}, {type: 'circle', date: '2019 pazdziernik', title: 'Object tracking', desc: 'Projekt o sledzeniu obiektow za pomoca ML'}, {type: 'line'}, {type: 'line'} ],
      user: 'Jakub Adamski',
      description: 'To jest przykladowy tekst o mnie',
      open: false,
      sub_yes: true,
      index: 2,
      lorem: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus scelerisque nisi ac finibus. Donec ac est odio. Fusce pharetra quis velit sed suscipit. Aliquam convallis metus nunc. Nam eu mollis turpis. Aenean quis sollicitudin arcu, vel sollicitudin nunc. Cras sit amet elementum purus, sit amet mollis lacus. Ut id enim sodales, tincidunt lorem nec, efficitur mi. Vivamus ut elit tortor."
    }
  },
  methods: {
    moveLeft() {
        if (!this.open){
            document.getElementsByClassName("line").forEach(function moveLines(line) {line.classList.add('line_open');});
            document.getElementsByClassName("circle").forEach(function moveCircles(circle) {circle.classList.add('circle_open');});
            document.getElementsByClassName("year").forEach(function moveYears(year) {year.classList.add("year_open");});
            document.getElementsByClassName("evt_date").forEach(function moveDates(date){date.classList.add("fade");});
            document.getElementsByClassName("evt_text").forEach(function moveTexts(text){text.classList.add("fade");});
            /* zmienic na id */
            document.getElementsByClassName("evt_desc").forEach(function openDesc(text){text.classList.remove("fade");});
            this.open = !this.open;
        } else {
            document.getElementsByClassName("line").forEach(function centerLines(line) {line.classList.remove('line_open');});
            document.getElementsByClassName("circle").forEach(function centerCircles(circle) {circle.classList.remove('circle_open');});
            document.getElementsByClassName("year").forEach(function centerYears(year) {year.classList.remove('year_open');});
            document.getElementsByClassName("evt_date").forEach(function centerDates(date){date.classList.remove("fade");});
            document.getElementsByClassName("evt_text").forEach(function centerTexts(text){text.classList.remove("fade");});
            /* zmienic na id */
            document.getElementsByClassName("evt_desc").forEach(function openDesc(text){text.classList.add("fade");});
            this.open = !this.open;
        }
    },

    handleScroll(){
        //tutaj dodac to wyciszanie obiektow
    }

  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
}

}

</script>


<style scoped>


/* width */
div#sub_timeline::-webkit-scrollbar {
  height: 3px;
}

/* Track */
div#sub_timeline::-webkit-scrollbar-track {
  background: #e0e0e0;
  border-radius: 10px;
}

/* Handle */
div#sub_timeline::-webkit-scrollbar-thumb {
  background: #c7c7c7;
  border-radius: 10px;
}

div#sub_timeline:hover::-webkit-scrollbar {
    height: 10px;
}


.sub_evt_text{
    margin-bottom: 20px;
    text-align: center;
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

.sub_evt_date{
    text-align: center;
    margin-top: 20px;
}

.sub_line{
    /* nie wiem czemu akurat 5px */
    margin-bottom: 5px;
    
    width: 90px;
    height: 3px;

    background: #303030;
}

.sub_circle{
    margin: 0 auto;
    
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
    /* jest taki sam margin miedzy teksem ikonka galerii oraz linkami i sub_timeline */
    margin-top: 160px;
    height: 220px;
}





.evt_desc_p{
    margin-top: 40px;
    display: inline-block;
}

.evt_desc_p2{
    margin-right: 40px;
    margin-top: 20px;
    display: inline-block;
    color: #14426B;
}

.evt_desc{
    position: absolute;
    /* poprawic dodac wyliczanie z topki czy cos*/
    width: 45%;
    
    left: 30%;
    text-align: left;
}

.fade{
  opacity: 0;
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
    height: 90px;

    background: #303030;
}

#timeline{
    background: #F6F6F6;
    margin: 0 15%;

    padding: 80px 0;
    font-family: 'Raleway-Regular';
}

#descr{
    margin: 60px 30%;
    font-family: 'Raleway-Regular';
}

</style>
