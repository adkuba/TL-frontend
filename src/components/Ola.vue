<template lang="html">
    <div id="ola">
       Ola to najlepsza dziewczyna na świecie <div style="display: inline; color: red">kocham cię</div><br>
       <img src="../assets/images/ola.jpg" class="image">
    </div>
</template>

<script lang="js">

  export default  {
    name: 'Ola',
    created() {
    },
    metaInfo() {
        return {
            title: 'Ola',
            titleTemplate: '%s - Tline',
            content: 'Kocham cie ola'
        }
    },
    data () {
      return {
          baseApi: 'https://api.tline.site/api/',
          errMessage: ''
      }
    },
    methods: {
    }
}


</script>

<style scoped lang="sass">

.image
    image-rendering: crisp-edges
    margin-top: 20px
    border-radius: 10px
    margin-top: 80px

#ola
    margin-top: 120px
    font-family: Raleway-Regular
    font-size: 40px
    font-weight: bold

</style>
