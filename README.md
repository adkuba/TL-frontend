# TL-frontend
Frontend do strony Timeline

## Instalacja
Instalacja z vue cli i npm potem vue create itd. Jak uruchomic w README w projekcie.

## Uwagi
Lista:
- Testowac rozne wyglady!
- Refaktor kodu??

## Kod
Lista:
- W pliku vue mam 3 sekcje: pierwsza to html, druga javascript, trzecia css. Moze pozniej to rozbic do osobnych plikow.
- komponenty eksportuje sie tak jak mam w App.vue, uwaga przy export <code>name: 'App'</code> to musi byc nazwa danego komponentu, dopiero dalej definiujemy jakie zawiera w sobie inne komponenty.
- Data() to lokalna prywatna pamiec danego komponentu, props podobnie [roznice](https://michaelnthiessen.com/vue-props-vs-data/), propsem mozna przekazac jakies dane z parenta, ale trzeba to zrobic w sekcji html!
- Style scoped oznacza ze ten css bedzie dzialal tylko w danym pliku
- Pomaga dodawanie border do diva bo widac co sie dzieje
