<template>
  <Panel header="Resumen de la Cotización" class="lg:w-[45%] mt-5">
    <p class="m-0 text-xl">
      Aquí se mostrará un resumen de la cotización basada en la información
      proporcionada.
    </p>
    <DataTable :value="store.summary" class="text-xl">
      <Column field="field" header="Campo" />
      <Column field="value" header="Valor" />
    </DataTable>

    <div class="mt-4 flex flex-col gap-2">
      <FloatLabel variant="on">
        <Textarea
          id="customer_annotations"
          v-model="store.customerAnnotations"
          rows="3"
          class="w-full"
          autoResize
        />
        <label for="customer_annotations" class="text-xl">Observaciones de la carga (opcional)</label>
      </FloatLabel>
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
import FloatLabel from "primevue/floatlabel";
import Textarea from "primevue/textarea";
import { useQuoteStore } from "@/stores/quote";
import { useQuoteGenerator } from "@/composables/useQuoteGenerator";

const store = useQuoteStore();
const { generating, errorMsg, canGenerate, generateQuote } = useQuoteGenerator();
</script>
