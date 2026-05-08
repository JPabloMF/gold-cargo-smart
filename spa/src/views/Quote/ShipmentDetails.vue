<template>
  <div>
    <Divider align="center" type="dotted">
      <b>Completa la información</b>
    </Divider>
    <div class="flex flex-wrap justify-center gap-5">

      <!-- 1. Tipo de Carga (always first) -->
      <FloatLabel class="w-full lg:w-1/4 md:w-full sm:w-full" variant="on">
        <Select
          v-model="store.selectedLoadType"
          :options="loadTypes"
          inputId="load_type"
          optionLabel="name"
          class="w-full"
          size="large"
          @change="onLoadTypeChange"
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
        <label for="load_type" class="text-base">Tipo de Carga</label>
      </FloatLabel>

      <!-- 2. Origen -->
      <FloatLabel class="w-full lg:w-1/4 md:w-full sm:w-full" variant="on">
        <Select
          v-model="store.selectedOriginPort"
          :options="originPorts"
          optionLabel="label"
          optionValue="value"
          filter
          :loading="loadingPorts"
          :disabled="!store.selectedLoadType || loadingPorts"
          inputId="origin_port"
          class="w-full"
          size="large"
          @change="onOriginChange"
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
        <label for="origin_port" class="text-base">País de Origen (POL)</label>
      </FloatLabel>

      <!-- 3. Destino -->
      <FloatLabel class="w-full lg:w-1/4 md:w-full sm:w-full" variant="on">
        <Select
          v-model="store.selectedDestinationPort"
          :options="destinationPorts"
          inputId="destination_port"
          optionLabel="name"
          :disabled="!store.selectedOriginPort"
          class="w-full"
          size="large"
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
        <label for="destination_port" class="text-base">Lugar de Destino</label>
      </FloatLabel>

    </div>
  </div>
</template>

<script setup>
import Divider from "primevue/divider";
import Select from "primevue/select";
import FloatLabel from "primevue/floatlabel";
import { ref, computed } from "vue";
import { useQuoteStore } from "@/stores/quote";
import { COUNTRIES, LOAD_TYPES } from "@/utils/constants";
import { apiFetch } from "@/utils/api";

const store = useQuoteStore();
const loadTypes = LOAD_TYPES;
const API_URL = import.meta.env.VITE_API_URL;

const loadingPorts = ref(false);

// Raw data fetched once per load type
const lclRawData = ref([]);   // array of continent.data rows
const fclRawData = ref([]);   // array of FCL rate rows

// ─── Derived option lists ─────────────────────────────────────────────────────

// Normalize: uppercase, remove dots and spaces
const normalize = (str) => str.toUpperCase().replace(/[\s.]/g, "");

const flagByCountry = Object.fromEntries([
  ...COUNTRIES.map((c) => [normalize(c.nameEN), c.flag]),
  ...COUNTRIES.map((c) => [normalize(c.name), c.flag]),
  ...COUNTRIES.map((c) => [normalize(c.iso3), c.flag]),
]);

const originPorts = computed(() => {
  const type = store.selectedLoadType?.value;

  if (type === "lcl") {
    const seen = new Set();
    const ports = [];
    lclRawData.value.forEach((continent) => {
      continent.data.forEach((row) => {
        if (row.POL && !seen.has(row.POL)) {
          seen.add(row.POL);
          const country = (row.PAIS || "").toUpperCase();
          const flag = flagByCountry[normalize(row.PAIS || "")] ?? "🌐";
          ports.push({ label: `${flag} ${country} - ${row.POL}`, value: row.POL });
        }
      });
    });
    return ports.sort((a, b) => a.label.localeCompare(b.label));
  }

  if (type === "fcl") {
    const seen = new Set();
    const ports = [];
    fclRawData.value.forEach((row) => {
      const val = row.origen;
      if (val && !seen.has(val)) {
        seen.add(val);
        ports.push({ label: String(val), value: String(val) });
      }
    });
    return ports.sort((a, b) => a.label.localeCompare(b.label));
  }

  return [];
});

const destinationPorts = computed(() => {
  const type = store.selectedLoadType?.value;

  if (type === "lcl") {
    const origin = store.selectedOriginPort;
    if (!origin) return [];
    const seen = new Set();
    const ports = [];
    lclRawData.value.forEach((continent) => {
      continent.data
        .filter((row) => row.POL === origin)
        .forEach((row) => {
          const val = row.POD;
          if (val && !seen.has(val)) {
            seen.add(val);
            ports.push({ name: String(val), value: String(val) });
          }
        });
    });
    return ports.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (type === "fcl") {
    const origin = store.selectedOriginPort;
    if (!origin) return [];
    const seen = new Set();
    const ports = [];
    fclRawData.value
      .filter((row) => String(row.origen) === origin)
      .forEach((row) => {
        const val = row.destino;
        if (val && !seen.has(val)) {
          seen.add(val);
          ports.push({ name: String(val), value: String(val) });
        }
      });
    return ports.sort((a, b) => a.name.localeCompare(b.name));
  }

  return [];
});

// ─── Data fetching ────────────────────────────────────────────────────────────

const fetchLclRates = async () => {
  loadingPorts.value = true;
  try {
    const response = await apiFetch(`${API_URL}/rates`);
    const result = await response.json();
    if (result.success) {
      lclRawData.value = result.data;
    }
  } catch (error) {
    console.error("[ShipmentDetails] Error fetching LCL rates:", error);
  } finally {
    loadingPorts.value = false;
  }
};

const fetchFclRates = async () => {
  loadingPorts.value = true;
  try {
    const response = await apiFetch(`${API_URL}/fclrates`);
    const result = await response.json();
    if (result.success) {
      fclRawData.value = result.data;
    }
  } catch (error) {
    console.error("[ShipmentDetails] Error fetching FCL rates:", error);
  } finally {
    loadingPorts.value = false;
  }
};

// ─── Event handlers ───────────────────────────────────────────────────────────

const onLoadTypeChange = async () => {
  // Reset dependent selections
  store.selectedOriginPort = null;
  store.selectedDestinationPort = null;

  const type = store.selectedLoadType?.value;

  if (type === "lcl" && lclRawData.value.length === 0) {
    await fetchLclRates();
  } else if (type === "fcl" && fclRawData.value.length === 0) {
    await fetchFclRates();
  }
};

const onOriginChange = () => {
  // Reset destination whenever origin changes (relevant for FCL)
  store.selectedDestinationPort = null;
};
</script>
