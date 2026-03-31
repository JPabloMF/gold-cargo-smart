<template>
  <div>
    <Divider align="center" type="dotted">
      <b>Completa la información</b>
    </Divider>
    <div class="flex flex-wrap justify-center gap-5">
      <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
        <Select
          v-model="store.selectedOriginPort"
          :options="originPorts"
          optionLabel="label"
          optionValue="value"
          filter
          :loading="loadingOriginPorts"
          :disabled="loadingOriginPorts"
          inputId="origin_port"
          class="w-full"
        >
          <template #value="slotProps">
            <span v-if="slotProps.value">{{ originPorts.find(o => o.value === slotProps.value)?.label }}</span>
          </template>
          <template #option="slotProps">
            <div class="flex items-center gap-2 text-base">
              <span>{{ slotProps.option.label }}</span>
            </div>
          </template>
          <template #dropdownicon>
            <font-awesome-icon icon="fa-regular fa-map" />
          </template>
        </Select>
        <label for="origin_port">Pais de Origen (POL)</label>
      </FloatLabel>
      <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
        <Select
          v-model="store.selectedDestinationPort"
          :options="destinationPorts"
          inputId="destination_port"
          optionLabel="name"
          class="w-full"
        >
          <template #option="slotProps">
            <div class="flex items-center gap-2 text-base">
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
          <template #dropdownicon>
            <font-awesome-icon icon="fa-regular fa-map" />
          </template>
        </Select>
        <label for="destination_port">Lugar de Destino</label>
      </FloatLabel>
      <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
        <Select
          v-model="store.selectedLoadType"
          :options="loadTypes"
          inputId="loadt_type"
          optionLabel="name"
          class="w-full"
        >
          <template #option="slotProps">
            <div class="flex items-center gap-2 text-base">
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
          <template #dropdownicon>
            <font-awesome-icon icon="fa-solid fa-truck-ramp-box" />
          </template>
        </Select>
        <label for="loadt_type">Tipo de Carga</label>
      </FloatLabel>
    </div>
  </div>
</template>

<script setup>
import Divider from "primevue/divider";
import Select from "primevue/select";
import FloatLabel from "primevue/floatlabel";
import { ref, onMounted } from "vue";
import { useQuoteStore } from "@/stores/quote";
import { COUNTRIES, LOAD_TYPES, DESTINATION_PORTS } from "@/utils/constants";
import { apiFetch } from "@/utils/api";

const store = useQuoteStore();
const loadTypes = LOAD_TYPES;
const destinationPorts = DESTINATION_PORTS;
const originPorts = ref([]);
const loadingOriginPorts = ref(true);

// Normalize: uppercase, remove dots and spaces
const normalize = (str) => str.toUpperCase().replace(/[\s.]/g, "");

// Build a lookup map keyed by nameEN, name, and iso3 (normalized) → flag emoji
const flagByCountry = Object.fromEntries([
  ...COUNTRIES.map((c) => [normalize(c.nameEN), c.flag]),
  ...COUNTRIES.map((c) => [normalize(c.name), c.flag]),
  ...COUNTRIES.map((c) => [normalize(c.iso3), c.flag]),
]);

onMounted(async () => {
  try {
    const response = await apiFetch(`${import.meta.env.VITE_API_URL}/rates`);
    const result = await response.json();
    if (result.success) {
      const seen = new Set();
      const ports = [];
      result.data.forEach((continent) => {
        continent.data.forEach((row) => {
          if (row.POL && !seen.has(row.POL)) {
            seen.add(row.POL);
            const country = (row.PAIS || "").toUpperCase();
            const flag = flagByCountry[normalize(row.PAIS || "")] ?? "🌐";
            ports.push({ label: `${flag} ${country} - ${row.POL}`, value: row.POL });
          }
        });
      });
      originPorts.value = ports.sort((a, b) => a.label.localeCompare(b.label));
    }
  } catch (error) {
    console.error("[ShipmentDetails] Error fetching origin ports:", error);
  } finally {
    loadingOriginPorts.value = false;
  }
});
</script>
