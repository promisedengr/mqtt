<template>
  <div>
    <p>Publisher: {{ rawActual }}</p>
  </div>
</template>

<script>
export default {
  name: "RawPublisher",
  data() {
    return {
      rawActual: 0,
      index : false
    };
  },
  mounted() {
    // this.rawPublisher()
      // setInterval(this.rawPublisher, 1000)
    this.$root.$on("mqtt-connected", () => {
      // console.log('adsfjie')
      // this.$root.mqtt.pub("iws_eric", "0.5")
      setInterval(this.rawPublisher, 1000)
      // console.log("fix me");
      // this.$root.mqtt.sub("iws-sim", this.rawActual, this.setNextCall);
      // this.$root.mqtt.pub("iws-sim", "0.5");
    })
  },
  methods: {
    rawPublisher() {
      // // console.log(this)
      // // if (this.$root.mqtt.connected) {
      //   this.$root.$on("mqtt-connected", () => {
      if (this.rawActual % 20 == 0)
        this.index = !this.index
      if (this.index)
        this.rawActual = this.rawActual + 0.5
      else
        this.rawActual = this.rawActual - 0.5
      // console.log(this.rawActual)
        // this.rawActual = this.rawActual - (1 - parseInt(this.rawActual / 20 ) * 1)
      // console.log("fix me");
      this.$root.mqtt.pub("iws_eric", `{"value": ${this.rawActual} }`)
      //     this.$root.mqtt.sub("iws-sim", this.rawActual, this.setNextCall);
      //     this.$root.mqtt.pub("iws-sim", "0.5");
      //   })
    },
    // setNextCall(topic, payload) {
    //   console.log(payload)
    //   console.log(parseFloat(payload))
    //   if (parseFloat(payload) < 20 )
    //     setTimeout(this.increaseCallback() ,1000)
    //   else
    //     setTimeout(this.decreaseCallback(), 1000)
    // },
    // increaseCallback () {
    //   console.log('incease')
    //   this.rawActual = this.rawActual + 0.5
    //   this.$root.mqtt.sub("iws-sim", 0, this.setNextCall);
    //   this.$root.mqtt.pub("iws-sim", "1.5");
    // },
    // decreaseCallback() {
    //   console.log('decrease')
    // }
    // result(topic, payload) {
    //   console.log(`Foorrr - topic: ${topic} payload: ${payload}`);
    //   // setTimeout(this.rawPublisher, 1000)
    //   // this.msg = payload;
    // },
  },
};
</script>