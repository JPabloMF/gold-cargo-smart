<template>
  <Panel header="Resumen de la Cotización" class="lg:w-[33.2%]">
    <p class="m-0">
      Aquí se mostrará un resumen de la cotización basada en la información
      proporcionada.
    </p>
    <DataTable :value="store.summary">
      <Column field="field" header="Campo" />
      <Column field="value" header="Valor" />
    </DataTable>
  </Panel>
</template>

<script setup>
import Panel from "primevue/panel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useQuoteStore } from "@/stores/quote";

const store = useQuoteStore();
</script>
