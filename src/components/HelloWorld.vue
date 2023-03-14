<template>
  <div class="hello">
    <h1>HelloWorld status: {{ msg }}</h1>
    <!-- <h1>input: {{ rawActual }}</h1>
    <h1>output: {{ engActual }}</h1> -->



  <div class="center">
    <!-- <p>4-20 mA sensor</p> -->
  </div>
  <div class="center">
    <div style="width : 450px">
      <h1 class="center" :style="rawActual < 4 ? 'color: red;' : 'color: black;'">input: {{ rawActual.toFixed(2) }}</h1>
      <div :style="`background-color: ${outputColor}`">
        <h1 v-if="rawActual < 4">Output : Out of Range</h1>
        <h1 v-else >Output : {{ engActual.toFixed(2) }}</h1>
      </div>
    </div>


  </div>
      <div>
        <div>
          <span class="add-on">Minimun current value  </span>
          <input type="text" v-model="rawLow" :disabled="runningFlag">
          <span class="add-on">mA</span>
        </div>
        <div>
          <span class="add-on">Maximum current value  </span>
          <input type="text" v-model="rawHigh" :disabled="runningFlag">
          <span class="add-on">mA</span>
        </div>
        <div>
          <span class="add-on">Minimun current value  </span>
          <input type="text" v-model="engLow" :disabled="runningFlag">
          <span class="add-on">°C</span>
        </div>
        <div>
          <span class="add-on">Maximum temperature value  </span>
          <input type="text" v-model="engHigh" :disabled="runningFlag">
          <span class="add-on">°C</span>
        </div>

        <div>
          <span class="add-on">Current step value  </span>
          <input type="text" v-model="step" :disabled="runningFlag">
          <span class="add-on">mA/s</span>
        </div>
     
      <button @click="handleReset">{{btnTxt}}</button>
    </div>

  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "init",
      rawActual: 0, // Received raw sensor value, mA
      rawLow: 4, // Minimum sensor reading, mA
      rawHigh: 20, // Maximum sensor readin, mA
      engActual: 0, // Current thermometer reading, deg C
      engLow: -70, // Minimum temperature of thermometer, deg C
      engHigh: 70, // Maximum temperature of thermometer, deg C
      outputColor : 'blue',

      btnTxt: 'Stop',
      runningFlag: true,
      step: 6,

      intervalContainer: null
    };
  },
  mounted() {
    this.$root.$on("mqtt-connected", () => {
      this.$root.mqtt.sub("iws-foo", 0, this.onIwsFoo);
      this.$root.mqtt.sub("iws_eric", 0, this.rawCallback);
      this.$root.mqtt.pub("iws-foo", "mounted");
    });
  },
  methods: {
    handleReset() {
      this.runningFlag = !this.runningFlag
      if (this.runningFlag) {
        this.btnTxt = 'Stop'
        this.$root.mqtt.pub("iws-status", `{"status": ${this.step} }`);
      } else {
        this.rawActual = 0
        this.engActual = 0
        this.btnTxt = 'Start'
        this.$root.mqtt.pub("iws-status", `{"status": ${0} }`);
      
      }
      
    },
    onIwsFoo(topic, payload) {
      console.log(`Foo - topic: ${topic} payload: ${payload}`);
      this.msg = payload;
      // this.intervalContainer = setInterval(this.$parent.$children[0].rawPublisher, 1000)
      this.$root.mqtt.pub("iws-status", `{"status": ${this.step} }`);


    },
    rawCallback(topic, payload) {
      this.rawActual = JSON.parse(payload)["value"]
      let rawGap =  this.rawHigh - this.rawLow
      if (this.rawActual < this.rawLow + rawGap * 0.25)
        this.outputColor = 'blue'
      else if (this.rawActual > this.rawHigh - rawGap * 0.25)
        this.outputColor = 'red'
      else
        this.outputColor = ' white'
      
      this.engActual = (this.engHigh - this.engLow) / rawGap * (this.rawActual - this.rawLow) + this.engLow

    },
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
