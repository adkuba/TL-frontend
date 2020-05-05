<template>
    <div>
        <div id="timeline">
            <div class="line f_line"></div>
            <div v-for="(item, index) in items" :key="index">
                <div class="line n_line" v-if="item.type == 'line'"></div>
                <div class="evt" v-else-if="item.type == 'circle'">
                    <div class="evt_date"> {{ item.date }} </div>
                    <div class="circle"></div>
                    <div class="evt_text"> 
                        <h1 class="evt_h"> {{ item.title }} </h1>
                        <p class="evt_p"> {{ item.desc }} </p>
                    </div>
                </div>
                <div class="year" v-else> {{ item.message }} </div>
            </div>
            <div class="line l_line"></div>
            
        </div>
        <div id="descr">
            <h1> {{ user }} </h1>
            <p> {{ description }} </p>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Timeline',
  props: [],
  data() {
    return {
      items: [ {type: 'line'}, {type: 'circle', date: '2020 luty', title: 'Gravity', desc: 'Gra stworzona w unity na Androida'}, {type: 'line'}, {type: 'text', message: '2020'}, {type: 'line'} ],
      user: 'Jakub Adamski',
      description: 'To jest przykladowy tekst o mnie'
    }
  }
}
</script>


<style scoped>

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
    /* 25 to wielkosc circle */
    transform: translateY(-25px);
}

.year{
    margin: 40px auto;
    font-size: 19px;
    letter-spacing: 2px;
}

.circle{
    display: inline-block;
    margin: 0 auto;

    width: 25px;
    height: 25px;
    
    background: #B8352D;
    border-radius: 50%;
}

.line{
    display: block;
    margin: 0 auto;

    width: 3px;
    height: 80px;
}

.n_line{
    background: #303030;
}

.f_line{
    background: rgb(255,255,255);
    background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(48,48,48,1) 100%);
}

.l_line{
    background: rgb(255,255,255);
    background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(48,48,48,1) 100%);
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
