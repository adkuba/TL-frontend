<template lang="html">
    <form id="subscription-form" action="javascript:void(0);">
        <div id="card-element" class="MyCardElement">
        <!-- Elements will create input elements here -->
        </div>

        <!-- We'll put the error messages in this element -->
        <div id="card-errors" role="alert"></div>
        <button v-on:click="createPaymentMethod(2)" type="submit">Subscribe</button>
    </form>
</template>

<script src="https://js.stripe.com/v3/"></script>
<script lang="js">

    var stripe = Stripe('pk_test_51GvlqGG6mQST9KMb0zlu9ve2ztlyvHxpqHKbCCwWhjCHJDRKZ3f04oyfRFW3wtdfsP2T1SB9kiL7SIflXllLA15g00qMN28v5H');
    var elements = stripe.elements()

    export default  {
    name: 'Subscription',
    mounted() {
        var style = {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
            color: "#aab7c4"
            }
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
        }
        };

        this.cardElement = elements.create("card", { style: style })
        this.cardElement.mount("#card-element")
        this.cardElement.on('change', this.showCardError)
    },
    data () {
        return {
            cardElement: null,
            baseApi: 'http://localhost:8081/api/',
        }
    },
    methods: {
        showCardError(event) {
            let displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        },
        createPaymentMethod(priceId) {
            return stripe
                .createPaymentMethod({
                    type: 'card',
                    card: this.cardElement,
                })
                .then((result) => {
                    if (result.error) {
                        displayError(error);
                    } else {
                        this.createSubscription({
                        paymentMethodId: result.paymentMethod.id,
                        priceId: priceId,
                        })
                    }
                })
        },
        createSubscription({ paymentMethodId, priceId }) {
            this.axios.post(this.baseApi + 'users/create-subscription', {
                username: null,
                paymentMethodId: paymentMethodId,
                priceId: priceId
            }, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.jwt.token
                },
            })
            .then(response => {
                alert(response.data)
                this.$router.push({ path: "/settings" })
            })
            .catch(error =>{
                console.log(error)
            })
        }
    }
}


</script>

<style scoped lang="sass">

#subscription-form
    width: 30%
    margin: 100px auto

</style>
