<template lang="html">
    <div id="subscription" :class="$mq">
        <h1 :class="$mq">Subscription</h1>
        <p :class="$mq">Unlock premium plan, submit your details. Get access to unlimited timelines, more detailed statistics and special premium section on our homepage.</p>
        <h1 class="price" :class="$mq">3$ monthly</h1>
        <p v-if="$store.state.jwt.user.subscriptionEnd" :class="$mq">Your next payment: {{ $store.state.jwt.user.subscriptionEnd }}</p>
        <p v-else :class="$mq">Billed now.</p>
        <form id="subscription-form" action="javascript:void(0);" :class="$mq">
            <input autocorrect="off" spellcheck="false" type="text" placeholder="Your name" id="name" class="fin">
            <div id="card-element" class="MyCardElement">
                <!-- Elements will create input elements here -->
            </div>
            <div id="card-expiry"></div>
            <div id="card-cvc"></div>

            <!-- We'll put the error messages in this element -->
            <div id="card-errors" role="alert"></div>
            <button id="submit-button" class="fsubmit" :class="$mq" v-on:click="createPaymentMethod(2)" type="submit">Subscribe</button>
            <div class="loader" id="ls" :class="$mq"></div>
        </form>
    </div>
</template>

<script lang="js">
    export default  {
    name: 'Subscription',
    metaInfo() {
        return {
            title: 'Subscription',
            titleTemplate: '%s - Tline',
            meta: [
                { name: 'description', content: 'Subscribe to premium Tline!'},
                { property: 'og:url', content: 'https://www.tline.site/subscription'},
                { property: 'og:title', content: 'Subscription - Tline' },
                { property: 'og:descriprion', content: 'Subscribe to premium Tline!'},
                { property: 'og:image', content: 'https://storage.googleapis.com/tline-files/signup.png' },
                { property: 'twitter:card', content: 'summary_large_image'},
                { property: 'twitter:url', content: 'https://www.tline.site/subscription'},
                { property: 'twitter:title', content: 'Subscription - Tline'},
                { property: 'twitter:description', content: 'Subscribe to premium Tline!'},
                { property: 'twitter:image', content: 'https://storage.googleapis.com/tline-files/signup.png'}
            ]
        }
    },
    mounted() {
        this.scrollToTop()
        this.stripe = Stripe('pk_live_51GvlqGG6mQST9KMbJSmkP6ioKcyjlte02LEnYbiQcj5R1GFzwjgOm320AWXpt7w1FXdkcmUZtAOpexVVBRHiI9BI009xUuT25J')
        this.elements = this.stripe.elements()
        var elements = this.stripe.elements({
            fonts: [
            {
                cssSrc: 'https://fonts.googleapis.com/css2?family=Open+Sans',
            },
            ],
            // Stripe's examples are localized to specific languages, but if
            // you wish to have Elements automatically detect your user's locale,
            // use `locale: 'auto'` instead.
            locale: window.__exampleLocale
        });

        var style = {
            base: {
                color: "#303030",
                fontFamily: "Open Sans, sans-serif",
                fontSmoothing: "antialiased",
                fontSize: "16px"
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        };

        try {
            this.cardElement = elements.create("cardNumber", { showIcon: true, style: style })
            this.cardCvc = elements.create('cardCvc', { style: style})
            this.cardExpiry = elements.create('cardExpiry', { style: style})
            
        } catch (error){
            //czasem jest error ze nie mozna stworzyc dwoch card element - to zalatwia sprawe
            window.location.reload()
        }
        this.cardElement.mount("#card-element")
        this.cardExpiry.mount('#card-expiry');
        this.cardCvc.mount('#card-cvc')
        this.cardElement.on('change', this.showCardError)
        this.cardExpiry.on('change', this.showCardError)
        this.cardCvc.on('change', this.showCardError)
    },
    data () {
        return {
            cardElement: null,
            cardCvc: null,
            cardExpiry: null,
            baseApi: 'https://akuba.pl/api/tline/api/',
            stripe: null,
            elements: null
        }
    },
    methods: {
        scrollToTop() {
            const c = document.documentElement.scrollTop || document.body.scrollTop;
            if (c > 0) {
                window.requestAnimationFrame(this.scrollToTop);
                window.scrollTo(0, c - c / 8);
            }
        },
        showCardError(event) {
            let displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        },
        createPaymentMethod(priceId) {
            document.getElementById("submit-button").style.background = "#932a24"
            document.getElementById("ls").style.opacity = "1"
            return this.stripe
                .createPaymentMethod({
                    type: 'card',
                    card: this.cardElement,
                })
                .then((result) => {
                    if (result.error) {
                        this.$store.commit('setMessage', error.message)
                        document.getElementById("modal").style.display = "block"
                    } else {
                        this.createSubscription({
                        paymentMethodId: result.paymentMethod.id,
                        priceId: priceId,
                        fullName: document.getElementById("name").value
                        })
                    }
                })
        },
        createSubscription({ paymentMethodId, priceId, fullName }) {
            this.axios.post(this.baseApi + 'users/create-subscription', {
                fullName: fullName,
                username: null,
                paymentMethodId: paymentMethodId,
                priceId: priceId
            }, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                },
            })
            .then(response => {
                //console.log(response.data)
                var data = {
                    subscription: response.data,
                    priceId: priceId,
                    paymentMethodId: paymentMethodId,
                }
                if (this.handleCustomerActionRequired(data) != 'rejected'){
                    this.$router.push({ path: "/settings" })
                }
            })
            .catch(error =>{
                this.$store.commit('setMessage', error.message )
                document.getElementById("ls").style.opacity = "0"
                document.getElementById("submit-button").style.background = "#B8352D"
                document.getElementById("modal").style.display = "block"
            })
        },
        handleCustomerActionRequired({ subscription, priceId, paymentMethodId, isRetry}){
            if (subscription && (subscription.status === 'active' || subscription.status === 'trialing')) {
                this.$store.commit('setMessage', "Succces!")
                var jwt = this.$store.state.jwt
                jwt.user.subscriptionID = subscription.id
                jwt.user.subscriptionEnd = 'Refresh'
                this.$store.commit('set', jwt)
                document.getElementById("modal").style.display = "block"
                document.getElementById("ls").style.opacity = "0"
                document.getElementById("submit-button").style.background = "#B8352D"
                return { subscription, priceId, paymentMethodId };
            }

            //mialem jeszcze invoice ale wypierdolilem - przydaje sie przy odrzuceniu karty
            //tak samo odrzut isRetry, robie tylko refresh strony
            //tam w poradniku na stripe jest ze probuje jeszcze raz a ja tylko powiadamiam usera i moze sobie jeszcze raz sprobowac
            let paymentIntent = subscription.latest_invoice.payment_intent;

            if (paymentIntent && paymentIntent.status === 'requires_action') {
                return this.stripe.confirmCardPayment(paymentIntent.client_secret, {
                    payment_method: paymentMethodId,
                })
                .then((result) => {
                    if (result.error) {
                        this.cancelSubscription()
                        throw result;
                    } else {
                        if (result.paymentIntent.status === 'succeeded') {
                            var jwt = this.$store.state.jwt
                            jwt.user.subscriptionID = subscription.id
                            this.$store.commit('set', jwt)
                            this.$store.commit('setMessage', "Succes! Reload page.")
                            document.getElementById("modal").style.display = "block"
                            return {
                                priceId: priceId,
                                subscription: subscription,
                                paymentMethodId: paymentMethodId,
                            };
                        }
                    }
                })
                .catch((error) => {
                    alert(error.error.message);
                });
            }
            else if (paymentIntent && paymentIntent.status === 'requires_payment_method'){
                this.$store.commit('setMessage', "Your card was rejected! Try again.")
                document.getElementById("modal").style.display = "block"
                document.getElementById("ls").style.opacity = "0"
                document.getElementById("submit-button").style.background = "#B8352D"
                this.cancelSubscription()
                window.location.reload()
                return "rejected"
            }
            else {
                // No customer action needed.
                return { subscription, priceId, paymentMethodId }
            }
        },
        cancelSubscription(){
            this.axios.post(this.baseApi + 'users/cancel-subscription', null, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                },
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
}


</script>

<style scoped lang="sass">
@import '../assets/saas-vars.sass'

.price
    font-size: 22px
    padding: 0

#ls
    display: block
    margin-top: 20px
    margin-left: 0


#subscription
    text-align: left
    box-shadow: 0px 2px 15px 4px rgba(0,0,0,0.09)
    border-radius: 30px
    margin: 140px auto
    width: 40%
    padding-top: 60px
    padding-bottom: 80px
    &.medium
        width: 80%
        margin: 120px 10%
    &.small
        width: 100%
        margin: 100px 0

h1
    font-family: Raleway-Regular
    font-size: 40px
    margin: 20px auto
    width: 60%
    &.small
        width: 90%

p
    text-align: justify
    margin: 20px auto
    width: 60%
    margin-bottom: 50px
    &.small
        width: 90%

#subscription-form
    margin: 20px auto
    margin-top: 60px
    width: 60%
    &.small
        width: 90%

#card-element
    border-radius: 2px
    background: #e6e6e6
    padding: 12px 20px
    margin: 5px auto

#card-errors
    margin: 10px auto
    color: #B8352D
    font-family: OpenSans-Regular

#card-expiry
    border-radius: 2px
    margin-top: 5px
    background: #e6e6e6
    width: 44%
    margin-right: 10%
    padding: 10px 20px
    box-sizing: border-box
    display: inline-block

#card-cvc
    border-radius: 2px
    box-sizing: border-box
    padding: 10px 20px
    background: #e6e6e6
    display: inline-block
    width: 44%

.fsubmit
    width: 100%
    margin-top: 25px
    &:active
        background: #B8352D
    &:focus
        background: #B8352D

.fin
    box-sizing: border-box
    border-radius: 2px
    width: 100%
    color: #303030
    font-size: 16px
    margin: 5px auto

</style>
