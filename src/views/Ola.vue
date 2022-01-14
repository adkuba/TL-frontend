<template lang="html">
    <div id="ola">
       Ola to najlepsza dziewczyna na świecie <div style="display: inline; color: red">kocham cię</div><br>
       <img src="../assets/images/ola.jpg" class="image">
    </div>
</template>

<script lang="js">

  export default  {
    name: 'Ola',
    metaInfo() {
        return {
            title: 'Ola',
            titleTemplate: '%s - Tline',
            meta: [
                { name: 'description', content: 'Ola to najlepsza dziewczyna na świecie'},
                { property: 'og:url', content: 'https://www.tline.site/ola'},
                { property: 'og:title', content: 'Ola - Tline' },
                { property: 'og:descriprion', content: 'Ola to najlepsza dziewczyna na świecie'},
                { property: 'og:image', content: 'https://storage.googleapis.com/tline-files/ola.jpg' },
                { property: 'twitter:card', content: 'summary_large_image'},
                { property: 'twitter:url', content: 'https://www.tline.site/ola'},
                { property: 'twitter:title', content: 'Ola - Tline'},
                { property: 'twitter:description', content: 'Ola to najlepsza dziewczyna na świecie'},
                { property: 'twitter:image', content: 'https://storage.googleapis.com/tline-files/ola.jpg'}
            ]
        }
    },
    data () {
      return {
          baseApi: 'https://akuba.pl/api/tline/api/',
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