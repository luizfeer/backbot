<template>
  <div class="container">
    <div v-show="dialog" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" />
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  class="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 id="modal-headline" class="text-lg leading-6 font-medium text-gray-900">
                  {{ statusType === "producing" ? "O pedido está em produção?" : statusType === "sending" ? "O pedido está saindo para entrega?" : statusType === "finished" ? "O pedido concluido (Fechado)?" : "" }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ statusType === "producing" ? "Se você confirmar o cliente receberá um aviso que o pedido dele está sendo produzido, essa alteração nao pode ser desfeita!" : statusType === "sending" ? "Se você confirmar o cliente receberá um aviso que o pedido dele está saindo para entrega, essa alteração nao pode ser desfeita!" : statusType === "finished" ? "Se você confirmar esse pedido será fechado e concluido. Ele saira dessa lista. Essa alteração não poderá ser desfeita! " : "" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex md:flex-row-reverse">
            <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto text-white sm:text-sm" @click="dialog = false">
              Cancelar
            </button>
            <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-white text-base font-medium bg-blue-5 hover:bg-blue-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="statusChange()">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="head-statement w-full">
      <div class="controller flex gap-6 mb-4">
        <button @click.prevent="playSound()">
          Play Sound
        </button>
        <div
          class="swiper-button relative w-6 h-10 flex items-center justify-center box-border border border-black rounded bg-white"
        >
          <v-icon>
            mdi-account-settings
          </v-icon>
          {{ statements.length }} pedidos na fila
        </div>
      </div>
    </div>
    <template v-if="statements.length > 0">
      <div class="controller flex gap-6">
        <div
          class="swiper-button relative w-6 h-10 flex items-center justify-center box-border border border-black rounded bg-white"
          @click="prev"
        >
          <v-icon>
            mdi-arrow-left-thick
          </v-icon>
        </div>
        <div
          class="swiper-button relative w-6 h-10 flex items-center justify-center box-border border border-black rounded bg-white"
          @click="loadData()"
        >
          <v-icon>
            mdi-circle
          </v-icon>
        </div>

        <div
          class="swiper-button relative w-6 h-10 flex items-center justify-center box-border border border-black rounded bg-white"
          @click="next"
        >
          <v-icon>
            mdi-arrow-right-thick
          </v-icon>
        </div>
      </div>
      <swiper
        ref="mySwiperRef"
        class="swiper w-full mt-3 mb-3"
        navigation
        :options="swiperOption"
      >
        <swiper-slide
          v-for="(statement, index) in statements"
          :key="index"
        >
          <div class="h-auto colab-card bg-white">
            <article class="card colab-card border-2 border-gray-900">
              <div
                class="header flex p-4 font-semibold gap-4 justify-between text-white"
                :class="[
                  statement.finished ? 'bg-gray-800' :statement.sending ? 'bg-blue-5' : statement.producing ? 'bg-yellow-5' : 'bg-red-500'
                ]"
              >
                <div>
                  NÚMERO DO PEDIDO: {{ statement.id_service }}
                </div>
                <div>
                  {{ statement.time_br }}
                </div>
              </div>
              <div class="card-body border-t-2 border-gray-900 p-4">
                <div class="info flex flex-col gap-2 mb-4">
                  <div>
                    <span class="font-semibold">
                      NOME:
                    </span>
                    {{ statement.name }}
                  </div>
                  <div>
                    <span class="font-semibold">
                      TELEFONE:
                    </span>
                    {{ maskPhone(statement.phone) }}
                  </div>
                  <div v-if="statement.id_address_service">
                    <span class="font-semibold">
                      ENDEREÇO:
                    </span>
                    {{ statement.address }}
                  </div>
                  <div v-else>
                    <span class="font-semibold">
                      RETIRAR NO ESTABELECIMENTO
                    </span>
                  </div>
                  <div>
                    <span class="font-semibold">
                      PAGAMENTO:
                    </span>
                    {{ statement.payment_card ? "Cartão de cŕedito" : statement.payment_pix ? "PIX" : "Dinheiro" }}
                  </div>
                  <div v-if="statement.change">
                    <span class="font-semibold">
                      TROCO:
                    </span>
                    {{ statement.change ? statement.change : '' }}
                  </div>
                  <div>
                    <span class="font-semibold">
                      STATUS:
                    </span>
                    {{ statement.producing ? 'Preparando' : statement.sending ? 'Enviado' : statement.finished ? 'Concluido' : 'Visualizado' }}
                  </div>
                </div>
                <!---->
                <div class="pedido border-2 border-gray-900">
                  <div class="header flex bg-purple-200 text-white p-4 font-semibold gap-4 justify-between">
                    <div>
                      PEDIDOS: ({{ statement.products.length }} items)
                    </div>
                  </div>
                  <div class="border-t-2 border-gray-900 p-4 flex flex-col gap-2">
                    <template v-if="statement.products && statement.products.length > 0">
                      <div v-for="(product, indexProduct) in statement.products" :key="indexProduct">
                        <div class="item flex justify-between border-b-2 border-gray-200">
                          <div>{{ indexProduct+1 }} - {{ product.name }}</div><div>{{ product.price ? product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : 'R$ 0' }}</div>
                        </div>
                        <template v-if="product.additionals && product.additionals.length > 0">
                          <div v-for="(additional, indexAdditional) in product.additionals" :key="indexAdditional" class="item pl-6 w-full flex justify-between border-b-2 border-gray-200">
                            <div>{{ indexAdditional+1 }} - {{ additional.name }}</div><div>{{ additional.price ? additional.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : 'R$ 0' }}</div>
                          </div>
                        </template>
                      </div>
                    </template>
                    <div class="item flex justify-between p-4 bg-gray-200">
                      <div>TOTAL:</div>
                      <div>{{ statement.total ? statement.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : 'R$ 0' }}</div>
                    </div>
                  </div>
                </div>

                <div class="buttons px-4 p-6">
                  <div class="text-center flex gap-6 flex-wrap ">
                    <v-btn
                      x-large
                      :loading="loadProducing"
                      :disabled="statement.producing"
                      color="blue"
                      class="ma-2 white--text"
                      @click.stop="producing(statement.id_service, index, statement.phone)"
                    >
                      <v-icon
                        left
                        dark
                      >
                        mdi-stove
                      </v-icon>
                      PREPARANDO PEDIDO
                    </v-btn>
                    <v-btn
                      x-large
                      :loading="loadSending"
                      :disabled="statement.sending"
                      color="blue"
                      class="ma-2 white--text"
                      @click.stop="sending(statement.id_service, index, statement.phone)"
                    >
                      <v-icon
                        left
                        dark
                      >
                        mdi-moped-outline
                      </v-icon>
                      PEDIDO ENVIADO
                    </v-btn>

                    <v-btn
                      x-large
                      :loading="loadFinished"
                      :disabled="statement.finished"
                      color="blue"
                      class="ma-2 white--text"
                      @click.stop="finished(statement.id_service, index, statement.phone)"
                    >
                      <v-icon
                        left
                        dark
                      >
                        mdi-notebook-check-outline
                      </v-icon>
                      PEDIDO ENTREGUE (FINALIZAR)
                    </v-btn>
                  </div>
                </div>
              </div>
              <!----><!---->
            </article>
          </div>
        </swiper-slide>
      </swiper>

      <a
        href="/campaigns"
        class="mt-5 not-italic font-bold text-sm leading-5 text-blue-20"
      >mais</a>
    </template>
    <p v-else class="text-center text-3xl pt-5">
      Carregando <v-icon class="mdi-spin spin">
        mdi-reload
      </v-icon>
    </p>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import SwiperCore, { Navigation, Pagination, A11y } from 'swiper'
import 'swiper/swiper-bundle.css'
SwiperCore.use([Navigation, Pagination, A11y])
const beepMp3 = require('@/assets/sound/beep.mp3')

export default {
  sockets: {
    lastUpdate (data) {
      data = data.created_at
      if ((new Date(data)).getTime() > 0 && this.lastUpdate !== data) {
        try {
          // alert(data, this.lastUpdate)
          // this.lastUpdate = data
          this.updateOn = true
          this.loadData()
          this.playSound()
        } catch (e) {

        } finally {
          this.updateOn = false
        }
      }
    }
  },
  components: {
    Swiper,
    SwiperSlide
  },
  data () {
    return {
      id: '',
      index: '',
      phone: '',
      dialog: false,
      statusType: '',
      loadSending: false,
      loadFinished: false,
      loadProducing: false,
      loadingPage: true,
      search: '',
      lastUpdate: '',
      updateOn: false,
      headers: [
        {
          text: 'Código',
          align: 'start',
          sortable: false,
          value: 'code'
        },
        { text: 'Nome', value: 'name' },
        { text: 'Descrição', value: 'keywords' },
        { text: 'Preço', value: 'price' },
        { text: 'Ações:', value: 'controlers' }
      ],
      statements: [],
      LINK_API: 'https://alemdoportaomovement.com/api/',
      swiperOption: {
        touchRatio: 0.8,
        pagination: {
          clickable: true
        },
        slidesPerView: 'auto',
        spaceBetween: 20,
        loop: false
        // breakpoints: {
        //   // when window width is >= 320px
        //   320: {
        //     slidesPerView: 1,
        //     slidesPerGroup: 1,

        //   },
        //   // when window width is >= 480px
        //   480: {
        //     slidesPerView: 2,
        //     slidesPerGroup: 2,

        //   },
        //   // when window width is >= 640px
        //   640: {
        //     slidesPerView: 2,
        //     slidesPerGroup: 2,

      //   },
      //   720: {
      //     slidesPerView: 3,
      //     slidesPerGroup: 3,
      //   },
      //   1000: {
      //     slidesPerView: 5,
      //     slidesPerGroup: 5,
      //   }
      // }
      }
    }
  },
  async mounted () {
    await this.loadData()
  },
  computed: {
    ...mapState(['sessions', 'sessionActive'])
  },
  watch: {},
  methods: {
    ...mapMutations([
      'setState',
      'setSession',
      'setMessage',
      'getStatus',
      'setSessions'
    ]),
    playSound () {
      const audio = new Audio(beepMp3)
      audio.play()
    },
    maskPhone (phone) {
      return phone
        .replace(/\D/g, '')
        .replace(/(^\d{2})(\d)/, '+$1 $2')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4}$)/, '$1-$2')
    },
    async loadData () {
      try {
        this.statements = await this.getData()
        this.lastUpdate = this.statements[this.statements.length - 1].created_at
        this.loadingPage = false
      } catch (err) {
        console.error(err)
      }
    },
    async getData () {
      try {
        const response = await fetch(`${this.LINK_API}/statements`)
        return response.json()
      } catch (err) {
        console.error(err)
      }
    },
    next () {
      this.$refs.mySwiperRef.$swiper.slideNext()
    },
    prev () {
      this.$refs.mySwiperRef.$swiper.slidePrev()
    },
    async updateItem (id, field) {
      try {
        await fetch(`${this.LINK_API}/set/${this.id}`, {
          method: 'PUT',
          body: JSON.stringify(field),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      } catch (err) {
        alert(err)
      }
    },
    producing (id, index, phone) {
      // open dialog
      this.phone = phone
      this.dialog = true
      this.id = id
      this.statusType = 'producing'
      this.index = index
    },
    sending (id, index, phone) {
      this.phone = phone
      this.dialog = true
      this.id = id
      this.statusType = 'sending'
      this.index = index
    },
    finished (id, index, phone) {
      this.phone = phone
      this.dialog = true
      this.id = id
      this.statusType = 'finished'
      this.index = index
    },
    statusChange () {
      switch (this.statusType) {
        case 'producing':
          try {
            this.dialog = false
            this.loadProducing = true
            const i = this.index
            this.updateItem(this.id, { field: { producing: true }, type: 'producing', phone: this.phone })
            this.statements[i].producing = true
            this.loadProducing = false
          } catch (e) {
            console.log(e)
          }
          break
        case 'sending':
          try {
            this.dialog = false
            this.loadSending = true
            const i = this.index
            this.updateItem(this.id, { field: { sending: true }, type: 'sending', phone: this.phone })
            this.statements[i].sending = true
            this.loadSending = false
          } catch (e) {
            console.log(e)
          }
          break
        case 'finished':
          try {
            this.dialog = false
            this.loadFinished = true
            const i = this.index
            this.updateItem(this.id, { field: { finished: true } })
            this.statements[i].finished = true
            this.statements.splice(i, 1)
            this.loadFinished = false
          } catch (e) {
            console.log(e)
          }
          break
      }
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

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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
