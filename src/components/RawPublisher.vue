<template>
  <div>
    <p>Publisher: {{ rawActual.toFixed(2) }}</p>
  </div>
</template>

<script>
export default {
  name: "RawPublisher",
  data() {
    return {
      rawActual: 0,
      // index : false,
      index: 1,
      step: 0,
      interval: null
    };
  },
  mounted() {

    this.$root.$on("mqtt-connected", () => {
      this.$root.mqtt.sub("iws-status", 0, this.checkStatus);
    })
    // this.interval = setInterval(this.rawPublisher, 1000)

  },
  methods: {
    rawPublisher() {
      // console.log(this)
      // // if (this.$root.mqtt.connected) {
      //   this.$root.$on("mqtt-connected", () => {
        // console.log(this)
        // let step = this.$parent.$children[1].step
        // console.log(step)
      let tempPlus = this.rawActual + this.step
      let tempMinus = this.rawActual - this.step
      
      if (this.rawActual == 0 || tempMinus < 0)
        this.index = 1
      else if (this.rawActual == 20 || tempPlus > 20)
        this.index = -1

      this.rawActual = this.rawActual + this.index * this.step
      // if (this.rawActual % 20 == 0)
      //   this.index = !this.index
      
      // if (temp > 20)
      //   this.rawActual = this.rawActual - this.step
      // else
      //   this.rawActual = tempPlus
      // if (this.index)
      //   this.rawActual = this.rawActual + this.step
      // else
      //   this.rawActual = this.rawActual - this.step

      this.$root.mqtt.pub("iws_eric", `{"value": ${this.rawActual} }`)


    },
    checkStatus(topic, payload) {
      let status = JSON.parse(payload)["status"]
        // console.log(status)
      if (status > 0) {
        console.log('start')
        this.step = status
        this.interval = setInterval(this.rawPublisher, 1000)
        // this.rawActual = 0
      } else {
        this.rawActual = 0
        clearInterval(this.interval)
        this.interval = null
        // this.index = false
        this.index = 1
      }

      

    }
  },
};
</script>