<template lang="html">
    <Creator v-bind:editTimeline="timeline" v-bind:editEvents="events"></Creator>
</template>

<script lang="js">
import Creator from './Creator.vue'

  export default  {
    name: 'EditorLoader',
    components: {
        Creator
    },
    created() {
        var timelineApi = this.baseApi + 'timelines/public?id=' + this.$route.params.id
        this.axios.get(timelineApi).then(response => {
                this.timeline = response.data
                this.timeline.id = this.$route.params.id
            })
            .catch(err => console.log(err))
    },
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          timeline: null,
          events: null
      }
    },
    watch: {
        timeline: function(){
            var eventsApi = this.baseApi + 'events/public?timelineId=' + this.timeline.id
            this.axios.get(eventsApi).then(response => {
                this.events = response.data
            })
        },
        events: function(){
            
        }
    }
}


</script>

<style scoped lang="sass">

</style>
