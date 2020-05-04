<template>
    <div>
        <div id="timeline">
            <div class="horizontal_line"></div>
            <div v-for="(item, index) in items" :key="index">
                <div class="line" v-if="item.type == 'line'"></div>
                <div class="evt" v-else-if="item.type == 'circle'">
                    <div class="evt_date"> {{ item.date }} </div>
                    <div class="circle"></div>
                    <div class="evt_text"> {{ item.title }} </div>
                </div>
                <div class="year" v-else> {{ item.message }} </div>
            </div>
            <div class="horizontal_line"></div>
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
      items: [ {type: 'line'}, {type: 'circle', date: '2020 luty', title: 'Gra Unity'}, {type: 'line'}, {type: 'text', message: '2020'}, {type: 'line'} ],
      user: 'Jakub Adamski',
      description: 'To jest przykladowy tekst o mnie'
    }
  }
}
</script>


<style scoped>

.evt{
    margin-top: 50px;
    font-size: 27px;
}

/* transform przesuwa na srodek evt! */
.evt_date{
    float: left;
    width: 40%;
    text-align: right;
}

p{
    font-family: 'OpenSans-Regular';
}

.evt_text{
    float: right;
    width: 40%;
    text-align: left;
}

#descr{
    margin-left: 30%;
    margin-right: 30%;
    margin-top: 60px;
    font-family: 'Raleway-Regular';
}


.year{
    margin-top: 50px;
    font-size: 19px;
}

.circle{
    display: inline-block;
    margin: 0 auto;

    width: 21px;
    height: 21px;
    
    /* moze tego nie dawac! */
    transform: translateY(+10%);
    
    background: #B8352D;
    border-radius: 50%;
}

.line{
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;

    width: 5px;
    height: 35px;
    background: #303030;
}

#timeline{
    background: #F6F6F6;
    margin-left: 15%;
    margin-right: 15%;

    padding-top: 1px;
    padding-bottom: 1px;
    font-family: 'Raleway-Regular';
}

.horizontal_line{
    height: 1px;
    background: #a3a3a3;

    margin-left: 38%;
    margin-right: 38%;
    margin-top: 70px;
    margin-bottom: 70px;
}

</style>
