<template>
  <div class="container">
    <div class="w-full flex flex-col items-center">
      <h1 class="title">
        Bem vindo!
      </h1>
      <div v-if="sessions && sessions.length>0" class="space-y-1 w-full md:w-1/2 ">
        <label id="listbox-label" class="block text-sm leading-5 font-medium text-gray-700">
          Você já tem sessões ativas
        </label>
        <div class="mt-1 w-full rounded-md bg-white shadow-lg ">
          <ul
            v-for="(session, index) in sessions"
            :key="index"
            tabindex="-1"
            role="listbox"
            aria-labelledby="listbox-label"
            aria-activedescendant="listbox-item-3"
            class="rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
            style="max-height:250px"
          >
            <li id="listbox-item-0" role="option" class="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9">
              <div class="flex items-center space-x-3 justify-between">
                <div class="flex items-center w-full" @click="activeSession(session ? session.name : '')">
                  <img src="~assets/img/whatsapp.svg" alt="" class="flex-shrink-0 h-6 w-6 rounded-full">
                  <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
                  <span class="font-normal block truncate ml-2">
                    {{ session ? session.name : '' }}
                  </span>
                </div>

                <div class="flex">
                  <div
                    class="border border-gray-400 py-1 px-2 text-xs text-gray-400 rounded-md mr-3 hover:bg-gray-400 hover:text-white"
                    @click="activeSession(session ? session.name : '')"
                  >
                    Continuar
                  </div>
                  <div
                    class="border border-red-500 py-1 px-2 text-xs text-red-500 rounded-md mr-3 hover:bg-red-500 hover:text-white"
                    @click="close(session ? session.name : '')"
                  >
                    Fechar
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="links">
        <v-btn
          dark
          class="primary"
          :loading="loadingButton"
          elevation="2"
          @click="startSession('session1')"
        >
          Iniciar nova Sessão
        </v-btn>
        <v-btn
          dark
          class="primary"
          elevation="2"
          @click="save('session1')"
        >
          save
        </v-btn>
        <v-btn
          dark
          class="primary"
          elevation="2"
          @click="existUser('session1')"
        >
          get
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  layout: 'DashboardPage',
  sockets: {
    setState (data) {
      console.log(data)
      this.setState(data)
    },
    setMessage (data) {
      console.log('setmessage:', data)
      this.setMessage(data)
    }
  },
  data () {
    return {
      loadingButton: false,
      loadingPage: false
    }
  },
  async mounted () {
    await this.loadData()
  },
  computed: {
    ...mapState(['result', 'message', 'qrcode', 'sessions', 'sessionActive'])
  },
  watch: {
    result (val) {
      if (val === 'success') {
        this.$router.push('/start/' + this.sessionActive)
      }
    },
    message (val) {
      if (['QRCODE', 'PAIRING', 'STARTING'].includes(val)) {
        this.$router.push('/start/' + this.sessionActive)
      }
    }
  },
  methods: {
    ...mapMutations(['setState', 'setSession', 'setMessage', 'getStatus', 'setSessions']),

    loadData () {
      this.$socket.emit('getSessions', new Date(), (data) => {
        console.log(data.sessions)
        this.setSessions(data.sessions)
      })
    },
    save (session) {
      this.$socket.emit('save', { session, phone: '3599976145', name: 'Luiz' }, (data) => {
        console.log(data)
      })
    },
    existUser (session) {
      this.$socket.emit('existUser', { session, phone: '3599976145', name: 'Luiz' }, (data) => {
        console.log(data)
      })
    },

    startSession (name) {
      this.loadingButton = true
      localStorage.setItem('sessionActive', name)
      this.$socket.emit('startSession', name, (data) => {
        this.setSession(data)
      })

      // setInterval(() => {
      this.$socket.emit('getStatus', name, (data) => {
        this.getStatus(data)
      })
      // }, 1000 * 3)
    },
    activeSession (nameSession) {
      localStorage.setItem('sessionActive', nameSession)
      this.$router.push('/start/' + nameSession)
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
