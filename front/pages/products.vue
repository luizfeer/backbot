<template>
  <div class="container">
    <div class="w-full flex flex-col items-center">
      <h1 class="title">
        Seus produtos:
      </h1>
      <v-card>
        <v-card-title>
          Cardápio
          <v-spacer />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          />
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="desserts"
          :search="search"
          :loading="loadingPage"
          loading-text="Carregando aguarde...."
        >
          <template v-slot:item.controlers="props">
            <v-btn
              class="mx-2"
              fab
              dark
              small
              color="pink"
              @click="onButtonClick(props.item.id_product)"
            >
              <v-icon dark>
                mdi-playlist-edit
              </v-icon>
            </v-btn>
            <v-btn
              class="mx-2"
              fab
              dark
              small
              color="pink"
              @click="onButtonClick(props.item.id_product)"
            >
              <v-icon dark>
                mdi-delete
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  layout: 'products',
  data () {
    return {
      loadingButton: false,
      loadingPage: true,
      search: '',
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
      desserts: [],
      LINK_API: 'https://alemdoportaomovement.com/api/'

    }
  },
  async created () {
    try {
      this.desserts = await this.getData()
      this.loadingPage = false
    } catch (err) {
      console.error(err)
    }
  },
  computed: {
    ...mapState(['sessions', 'sessionActive'])
  },
  watch: {

  },
  methods: {
    ...mapMutations(['setState', 'setSession', 'setMessage', 'getStatus', 'setSessions']),
    async getData () {
      try {
        const response = await fetch(`${this.LINK_API}/products`)
        const data_ = await response.json()
        console.log(data_)
        return (data_)
      } catch (err) {
        console.error(err)
      }
    },
    onButtonClick (err) {
      alert(JSON.stringify(err))
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
