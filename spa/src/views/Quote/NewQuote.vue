<template>
  <div class="min-h-screen flex flex-col">
  <Menubar>
    <template #start>
      <img src="/gold_cargo.png" alt="gold cargo logo" class="w-30" />
    </template>
    <template #end>
      <a href="https://wa.me/573167465762" target="_blank" rel="noopener noreferrer">
        <Button label="Contactanos" severity="success"></Button>
      </a>
    </template>
  </Menubar>
  <div class="flex justify-center p-[0.5%] text-2xl">
    <Panel header="Nueva Cotización" class="w-full lg:w-[80%]">
      <Stepper v-model:value="activeStep">
        <StepList>
          <Step value="1">Cliente</Step>
          <Step value="2">Servicio</Step>
          <Step value="3">Envío</Step>
          <Step value="4">Carga</Step>
          <Step value="5">Adicionales</Step>
          <Step value="6">Resumen</Step>
        </StepList>

        <StepPanels>
          <StepPanel v-slot="{ activateCallback }" value="1">
            <CustomerInfo />
            <div class="flex justify-end mt-6">
              <Button label="Siguiente" iconPos="right" :disabled="!store.customerInfoValid" @click="activateCallback('2')">
                <template #icon><font-awesome-icon icon="fa-solid fa-arrow-right" /></template>
              </Button>
            </div>
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="2">
            <ServiceSelection />
            <div class="flex justify-between mt-6">
              <Button label="Anterior" severity="secondary" @click="activateCallback('1')">
                <template #icon><font-awesome-icon icon="fa-solid fa-arrow-left" /></template>
              </Button>
              <Button label="Siguiente" iconPos="right" :disabled="!store.fleteChecked" @click="activateCallback('3')">
                <template #icon><font-awesome-icon icon="fa-solid fa-arrow-right" /></template>
              </Button>
            </div>
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="3">
            <ShipmentDetails />
            <div class="flex justify-between mt-6">
              <Button label="Anterior" severity="secondary" @click="activateCallback('2')">
                <template #icon><font-awesome-icon icon="fa-solid fa-arrow-left" /></template>
              </Button>
              <Button label="Siguiente" iconPos="right" :disabled="!store.selectedLoadType" @click="activateCallback('4')">
                <template #icon><font-awesome-icon icon="fa-solid fa-arrow-right" /></template>
              </Button>
            </div>
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="4">
            <LclDetails v-if="store.selectedLoadType?.value === 'lcl'" />
            <FclDetails v-else-if="store.selectedLoadType?.value === 'fcl'" />
            <div v-else class="flex justify-center items-center py-10 text-surface-400">
              <p>Selecciona un tipo de carga en el paso anterior para continuar.</p>
            </div>
            <div class="flex justify-between mt-6">
              <Button label="Anterior" severity="secondary" @click="activateCallback('3')">
                <template #icon><font-awesome-icon icon="fa-solid fa-arrow-left" /></template>
              </Button>
              <Button label="Siguiente" iconPos="right" :disabled="!store.selectedLoadType" @click="activateCallback('5')">
                <template #icon><font-awesome-icon icon="fa-solid fa-arrow-right" /></template>
              </Button>
            </div>
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="5">
            <AdditionalServices />
            <div class="flex justify-between mt-6">
              <Button label="Anterior" severity="secondary" @click="activateCallback('4')">
                <template #icon><font-awesome-icon icon="fa-solid fa-arrow-left" /></template>
              </Button>
              <Button label="Ver Resumen" iconPos="right" @click="activateCallback('6')">
                <template #icon><font-awesome-icon icon="fa-solid fa-arrow-right" /></template>
              </Button>
            </div>
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="6" class="flex flex-col items-center">
            <QuoteSummary />
            <div class="flex justify-start mt-6">
              <Button label="Anterior" severity="secondary" @click="activateCallback('5')">
                <template #icon><font-awesome-icon icon="fa-solid fa-arrow-left" /></template>
              </Button>
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </Panel>
  </div>

  <footer class="mt-auto py-6 bg-white border-t border-gray-200">
    <div class="flex flex-col items-center gap-3">
      <a
        href="https://goldcargo.com.co/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary-600 font-semibold text-base tracking-wide hover:text-primary-400 transition-colors duration-200"
      >
        goldcargo.com.co
      </a>

      <div class="flex items-center gap-2 text-surface-500 text-sm">
        <font-awesome-icon icon="fa-solid fa-location-dot" class="text-primary-500" />
        <span>Medellín, Colombia</span>
      </div>

      <div class="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-sm text-surface-600">
        <a
          href="https://wa.me/573167465762"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 hover:text-green-600 transition-colors duration-200"
        >
          <font-awesome-icon icon="fa-solid fa-phone" class="text-green-500 text-base" />
          +57 316 7465762
        </a>
        <span class="text-surface-300">·</span>
        <a
          href="https://wa.me/573046280055"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 hover:text-green-600 transition-colors duration-200"
        >
          <font-awesome-icon icon="fa-solid fa-phone" class="text-green-500 text-base" />
          +57 304 6280055
        </a>
      </div>

      <a
        href="mailto:manager@goldcargo.com.co"
        class="flex items-center gap-1.5 text-sm text-surface-600 hover:text-primary-500 transition-colors duration-200"
      >
        <font-awesome-icon icon="fa-solid fa-envelope" class="text-primary-400" />
        manager@goldcargo.com.co
      </a>

      <p class="text-xs text-surface-400 mt-1">&copy; {{ new Date().getFullYear() }} Gold Cargo. Todos los derechos reservados.</p>
    </div>
  </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import Panel from "primevue/panel";
import Stepper from "primevue/stepper";
import StepList from "primevue/steplist";
import Step from "primevue/step";
import StepPanels from "primevue/steppanels";
import StepPanel from "primevue/steppanel";
import ServiceSelection from "@/views/Quote/ServiceSelection.vue";
import CustomerInfo from "@/views/Quote/CustomerInfo.vue";
import ShipmentDetails from "@/views/Quote/ShipmentDetails.vue";
import LclDetails from "@/views/Quote/LclDetails.vue";
import FclDetails from "@/views/Quote/FclDetails.vue";
import AdditionalServices from "@/views/Quote/AdditionalServices.vue";
import QuoteSummary from "@/views/Quote/QuoteSummary.vue";
import { useQuoteStore } from "@/stores/quote";

const store = useQuoteStore();
const activeStep = ref("1");
</script>
