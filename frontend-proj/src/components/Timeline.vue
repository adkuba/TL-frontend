<template>
    <div id="timeline">
        <div class="empty_sep"></div>
        <div class="horizontal_line"></div>
        <div v-for="(item, index) in items" :key="index">
            <div class="line" v-if="item.type == 'line'"></div>
            <div class="circle" v-else-if="item.type == 'circle'"></div>
            <div class="year" v-else> {{ item.message }} </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Timeline',
  props: [],
  data() {
    return {
      items: [ {type: 'line'}, {type: 'circle'}, {type: 'line'}, {type: 'text', message: '2020'}, {type: 'line'} ]
    }
  }
}
</script>


<style scoped>

.empty_sep{
    height: 1px;
}

.year{
    margin-top: 40px;
}

.circle{
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 40px;

    width: 20px;
    height: 20px;
    background: #303030;
    border-radius: 50%;
}

.line{
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 40px;

    width: 8px;
    height: 40px;
    background: #303030;
}

#timeline{
    background: #F6F6F6;
    margin-left: 10%;
    margin-right: 10%;
}

.horizontal_line{
    height: 2px;
    background: #303030;

    margin-left: 10%;
    margin-right: 10%;

    margin-top: 40px;
}

</style>
