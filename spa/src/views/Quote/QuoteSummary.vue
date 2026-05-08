<template>
  <Panel header="Resumen de la Cotización" class="lg:w-[45%] mt-5">
    <p class="m-0 text-xl">
      Aquí se mostrará un resumen de la cotización basada en la información
      proporcionada.
    </p>

    <!-- Basic shipment info — always shown -->
    <DataTable :value="store.summary" class="text-xl mt-2">
      <Column field="field" header="Campo" />
      <Column field="value" header="Valor" />
    </DataTable>

    <!-- FCL cost breakdown -->
    <template v-if="isFcl">
      <div v-if="loadingCost" class="flex items-center gap-2 mt-4 text-base text-slate-500">
        <i class="pi pi-spin pi-spinner"></i>
        <span>Calculando costos...</span>
      </div>

      <div v-else-if="costError" class="mt-4 text-base text-red-500">
        {{ costError }}
      </div>

      <!-- <template v-else-if="fclBreakdown">
        <h3 class="text-xl font-semibold mt-4 mb-2" style="color: #2C3D69;">Desglose de Costos FCL</h3>
        <DataTable :value="fclBreakdown.rows" class="text-base">
          <Column field="concepto" header="Concepto" />
          <Column field="base" header="Base (USD)" />
          <Column field="iva" header="IVA 19%" />
          <Column field="total" header="Total (USD)" />
        </DataTable>
        <div class="flex justify-end items-center gap-3 mt-3 text-xl font-bold">
          <span style="color: #2C3D69;">TOTAL COTIZACIÓN:</span>
          <span style="color: #FFCF25; background:#2C3D69; padding: 0.2rem 0.8rem; border-radius: 0.4rem;">
            USD {{ fclBreakdown.grandTotal.toFixed(2) }}
          </span>
        </div>
      </template> -->
    </template>

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
import { ref, computed, watch } from "vue";
import { useQuoteStore } from "@/stores/quote";
import { useQuoteGenerator } from "@/composables/useQuoteGenerator";
import { apiFetch } from "@/utils/api";

const store = useQuoteStore();
const { generating, errorMsg, canGenerate, generateQuote } = useQuoteGenerator();

const API_URL = import.meta.env.VITE_API_URL;
const IVA = 0.19;
const fmt = (v) => `USD ${Number(v).toFixed(2)}`;

const isFcl = computed(() => store.selectedLoadType?.value === "fcl");

// ─── FCL cost state ───────────────────────────────────────────────────────────
const loadingCost = ref(false);
const costError = ref("");
const fclBreakdown = ref(null);

const computeFclBreakdown = async () => {
  // Need origin, destination, and container type to compute
  if (
    !store.selectedOriginPort ||
    !store.selectedDestinationPort ||
    !store.selectedContainerType
  ) {
    fclBreakdown.value = null;
    return;
  }

  loadingCost.value = true;
  costError.value = "";
  fclBreakdown.value = null;

  try {
    const [ratesResp, incomeResp] = await Promise.all([
      apiFetch(`${API_URL}/fclrates`),
      apiFetch(`${API_URL}/income`),
    ]);

    const ratesResult = await ratesResp.json();
    const incomeResult = await incomeResp.json();

    if (!ratesResult.success) {
      costError.value = "No se pudieron obtener las tarifas FCL.";
      return;
    }
    if (!incomeResult.success || !incomeResult.data?.length) {
      costError.value = "No hay tarifas de destino configuradas. Contacte al administrador.";
      return;
    }

    const income = incomeResult.data[0];
    const origin = store.selectedOriginPort;
    const destination = store.selectedDestinationPort?.value ?? store.selectedDestinationPort?.name;
    const containerValue = store.selectedContainerType?.value; // "20" or "40"

    const rateRow = ratesResult.data.find(
      (row) => String(row.origen) === String(origin) && String(row.destino) === String(destination)
    );

    const fleteRaw = rateRow
      ? (containerValue === "20" ? rateRow.flete20 : rateRow.flete40)
      : null;
    const flete = fleteRaw != null ? Number(fleteRaw) : null;

    const fees = [
      { concepto: "Emisión BL",         base: Number(income.emisionEnDestinoBL) || 0 },
      { concepto: "Gastos en Destino",  base: Number(income.gastosEnDestino) || 0 },
      { concepto: "Radicación BL",      base: Number(income.radicacionBL) || 0 },
    ];

    const rows = [];
    let grandTotal = 0;

    // Flete row (no IVA)
    rows.push({
      concepto: `Flete (Contenedor ${store.selectedContainerType?.name})`,
      base: flete != null ? fmt(flete) : "No disponible",
      iva: "-",
      total: flete != null ? fmt(flete) : "-",
    });
    if (flete != null) grandTotal += flete;

    // Fee rows (+ IVA 19%)
    for (const fee of fees) {
      const iva = fee.base * IVA;
      const total = fee.base + iva;
      grandTotal += total;
      rows.push({
        concepto: fee.concepto,
        base: fmt(fee.base),
        iva: fmt(iva),
        total: fmt(total),
      });
    }

    fclBreakdown.value = { rows, grandTotal };
  } catch (err) {
    console.error("[QuoteSummary] FCL cost fetch failed:", err);
    costError.value = "Ocurrió un error al calcular los costos.";
  } finally {
    loadingCost.value = false;
  }
};

// Recompute whenever any FCL-relevant selection changes
watch(
  [
    () => store.selectedLoadType,
    () => store.selectedOriginPort,
    () => store.selectedDestinationPort,
    () => store.selectedContainerType,
  ],
  () => {
    if (isFcl.value) {
      computeFclBreakdown();
    } else {
      fclBreakdown.value = null;
      costError.value = "";
    }
  },
  { deep: true }
);
</script>
