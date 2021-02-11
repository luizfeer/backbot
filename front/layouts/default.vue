<template>
  <div>
    <Nuxt />
    <v-row
      class="fixed right-0 bottom-0 pr-4 pb-4 z-50"
      align="center"
      justify="space-around"
    >
      <v-btn
        dark
        rounded
        elevation="2"
        :style="serverOn ? 'background:#029200' : 'background:#f96a26'"
      >
        <v-icon v-if="serverOn" left>
          mdi-access-point-network
        </v-icon>
        <v-icon v-else left>
          mdi-access-point-network-off
        </v-icon>
        <div v-if="serverOn">
          On
        </div>
        <div v-else>
          Conectando..
        </div>
      </v-btn>
    </v-row>
  </div>
</template>

<script>

import { mapMutations } from 'vuex'

export default {
  sockets: {
    connect () {
      this.serverOn = true
      console.log('server connected')
    },
    disconnect () {
      this.serverOn = false
      console.log('server disconnected')
    },
    setMessage (data) {
      this.setMessage(data)
    },
    setQRCode (data) {
      this.setQRCode(data)
    }
  },
  data () {
    return {
      serverOn: false
    }
  },
  async mounted () {
    await this.loadData()
  },
  methods: {
    ...mapMutations(['setMessage', 'setQRCode']),
    loadData () {
      this.$socket.emit('pingteste', new Date(), (data) => {
        if (data.time) {
          this.serverOn = true
        } else {
          this.serverOn = false
        }
      })
    }
  }

}
</script>
<style>
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
body{
  background: #ececec;
}
.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 40px;
  height: 40px;
}
.lds-ellipsis div {
  position: absolute;
  top: 16px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

</style>
