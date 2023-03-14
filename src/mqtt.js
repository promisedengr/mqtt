import Paho from 'paho-mqtt'

export default class IWS_MQTT {
  /** This class is a wrapper for the Paho MQTT class to provide extra
   *  functionality to the publish, subsribe and onMessage methods.
   * 
   * Paho JS MQTT Docs: https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   * 
   * @param {string} host the hostname of the MQTT broker.
   * @param {int} port the port of the MQTT broker.
   */
  // creating the MQTT client
  constructor(host, port) {
    this.host = host
    this.port = port
    this.connected = false
    // Creation of Paho Client
    this.client = new Paho.Client(host, port, "clientjs");
    this.client.onMessageArrived = this.handleMessage.bind(this)
    this.callbackMap = new Map()
    this.onMessage = null
    this.subbedTopics = []
  }

  _defaultConnect() {
    this.connected = true
    console.log('Connected!')
  }

  // connecting to the mqtt ws server
  connect(callbackFn = null) {
    console.log(`Connecting to ws://${this.host}:${this.port}`);
    let successCallbackFn = this._defaultConnect
    if (callbackFn) {
      successCallbackFn = () => {
        this._defaultConnect()
        callbackFn()
      }
    }
    let options = {
      timeout: 3,
      onSuccess: successCallbackFn
    }
    this.client.connect(options)
  }
  // subscript the topic of connection and set the callback funtion
  sub(topic, qos = 0, callbackFn = null) {
    this.client.subscribe(topic, { qos: qos })
    this.subbedTopics.push(topic)
    if (callbackFn) {
      this.callbackMap.set(topic, callbackFn)
    }
  }
  // unsubscribe the topic of connection and set the callback funtion
  unSub(topic, qos = 0, callbackFn = null) {
    // removeing topic form mqtt
    this.client.unsubscribe(topic, { qos: qos })
    // removing topics from array
    var index = array.indexOf(topic);
    if (index > -1) {
      this.subbedTopics.splice(index, 1);
    }
    if (callbackFn) {
      this.callbackMap.set(topic, callbackFn)
    }
  }

  addSubCallback(topic, callbackFn) {
    console.log('addSubCallback')
    if (this.subbedTopics.indexOf(topic) != -1) {
      this.callbackMap.set(topic, callbackFn)
    } else {
      console.log(`Callback cannot be added to topic:
      '${topic}'
      because it does not exist.`)
    }
  }
  // publich the topic of the connection and set the callback function
  pub(topic, payload, qos = 0, retain = false) {
    if (this.connected) {
      this.client.publish(topic, payload, qos, retain)
    } else {
      console.log(`MQTT not connected. Failed to publish:
      topic: ${topic}
      payload: ${payload}`)
    }
  }

  handleMessage(message) {
    try {
      const callbackFn = this.callbackMap.get(message.destinationName)
      if (callbackFn) {
        callbackFn(message.destinationName, message.payloadString)
      } else if (this.onMessage) {
        this.onMessage(message.destinationName, message.payloadString)
      }
    } catch (e) {
      console.log(`Handler for topic ${message.destinationName} failed. Error: `, e)
    }
  }
}