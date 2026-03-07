<template>
  <Menubar>
    <template #start>
      <img src="/gold_cargo.png" alt="gold cargo logo" class="w-20 mr-2" />
    </template>
    <template #end>
      <Button label="Contactanos" severity="success"></Button>
    </template>
  </Menubar>
  <div class="flex">
    <Panel header="Nueva Cotización" class="m-3 w-3/4">
      <ServiceSelection />
      <ShipmentDetails />
      <template v-if="store.selectedLoadType?.value === 'lcl'">
        <LclDetails />
      </template>
      <template v-else-if="store.selectedLoadType?.value === 'fcl'">
        <FclDetails />
      </template>
      <template v-if="store.selectedLoadType?.value">
        <AdditionalServices />
      </template>
    </Panel>
    <QuoteSummary />
  </div>
</template>

<script setup>
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import Panel from "primevue/panel";
import ServiceSelection from "@/views/Quote/ServiceSelection.vue";
import ShipmentDetails from "@/views/Quote/ShipmentDetails.vue";
import LclDetails from "@/views/Quote/LclDetails.vue";
import FclDetails from "@/views/Quote/FclDetails.vue";
import AdditionalServices from "@/views/Quote/AdditionalServices.vue";
import QuoteSummary from "@/views/Quote/QuoteSummary.vue";

import { useQuoteStore } from "@/stores/quote";

const store = useQuoteStore();
</script>
