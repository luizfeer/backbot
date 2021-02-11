<template>
  <div class="container">
    <div class="w-full flex flex-col items-center">
      <h1 class="title">
        Bem vindo!
      </h1>
      <span>{{ session }}</span>
      {{ message === 'STARTING' ? 'Iniciando serviço..' :
        message === 'QRCODE' ? 'Escaneie o QRCODE com seu whatsapp' :
        message === 'PAIRING' ? 'Pareando com seu Whatsapp' :
        message === 'CONNECTED' ? 'Conectado!' :
        message === 'NOTFOUND' ? 'Erro na conexão.' :
        message === 'CLOSED' ? 'Conexão fechada.' :
        (["CONFLICT", "UNPAIRED", "UNLAUNCHED", "UNPAIRED_IDLE"].includes(message)) ? 'Conflito na conexão.'
        : ''

      }}
      <img v-if="message == 'QRCODE' && qrcode && qrcode.length>1" :src="qrcode" alt="Red dot" height="232" class="m-10">
      <v-btn
        dark
        class="primary"
        elevation="2"
        @click="getAllContacts('session1')"
      >
        get
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  // layout: 'dashboard',
  sockets: {
    setState (data) {
      console.log(data)
      this.setState(data)
    },
    setQRCode (data) {
      console.log(data)
      this.setQRCode(data)
    },
    setMessage (data) {
      console.log('setmessage:', data)
      this.setMessage(data)
    }
  },
  data () {
    return {
      loadingButton: false,
      loadingPage: false,
      session: ''
    }
  },
  async mounted () {
    this.session = this.$route.params.session
    if (!this.session) {
      this.$router.push('/')
    }
    await this.loadData(this.session)
  },
  computed: {
    ...mapState(['result', 'message', 'qrcode', 'sessions', 'sessionActive'])
  },
  watch: {
    message (val) {
      // const sessionLocal = localStorage.getItem('sessionActive')
      // if (val === 'QRCODE') {
      //   this.laodQRCode(sessionLocal)
      // } else {
      //   this.setQRCode({ qrcode: '' })
      // }
      if (val === 'NOTFOUND') {
        this.$router.push('/')
      }
    }
  },
  methods: {
    ...mapMutations(['setQRCode', 'setState', 'setSession', 'setMessage', 'getStatus', 'setSessions']),

    loadData (session) {
      this.$socket.emit('getStatus', session, (data) => {
        if (data.state) {
          this.getStatus(data)
          this.verifyStatus(data.name)
        } else {
          this.$router.push('/')
          // TOAST NAO EXISTE ESSA SESSAO
        }
      })
    },
    verifyStatus (name) {
      // setInterval(() => {
      this.$socket.emit('getStatus', name, (data) => {
        this.getStatus(data)
      })
      // }, 1000 * 3)
    },
    getAllContacts (session) {
      this.$socket.emit('getAllContacts', session, (data) => {
        console.log(data)
      })
    },

    getQRCode (name) {
      this.$socket.emit('getQRCode', name)
    },
    close (name) {
      this.$socket.emit('close', name)
    }

  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
button:disabled {
  background: #2d4238;

}
button:disabled:hover {
  background: #2d4238;

}
.lds-roller {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 40px 40px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fff;
  margin: -4px 0 0 -4px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 63px;
  left: 63px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 68px;
  left: 56px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 71px;
  left: 48px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 72px;
  left: 40px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 71px;
  left: 32px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 68px;
  left: 24px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 63px;
  left: 17px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 56px;
  left: 12px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
