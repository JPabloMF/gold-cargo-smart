<template>
  <Panel header="Resumen de la Cotización" class="lg:w-[33%]">
    <p class="m-0">
      Aquí se mostrará un resumen de la cotización basada en la información
      proporcionada.
    </p>
    <DataTable :value="store.summary">
      <Column field="field" header="Campo" />
      <Column field="value" header="Valor" />
    </DataTable>

    <div class="mt-4 flex flex-col gap-2">
      <Button
        label="Generar Cotización"
        icon="pi pi-file-pdf"
        :loading="generating"
        :disabled="!canGenerate"
        @click="generateQuote"
        class="w-full"
      />
      <Message v-if="errorMsg" severity="error" class="mt-1">{{ errorMsg }}</Message>
    </div>
  </Panel>
</template>

<script setup>
import Panel from "primevue/panel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Message from "primevue/message";
import { useQuoteStore } from "@/stores/quote";
import { useQuoteGenerator } from "@/composables/useQuoteGenerator";

const store = useQuoteStore();
const { generating, errorMsg, canGenerate, generateQuote } = useQuoteGenerator();
</script>
