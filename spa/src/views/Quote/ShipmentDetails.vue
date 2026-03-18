<template>
  <div>
    <Divider align="center" type="dotted">
      <b>Completa la información</b>
    </Divider>
    <div class="flex flex-wrap justify-center gap-5">
      <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
        <Select
          v-model="store.selectedOriginCountry"
          :options="countries"
          filter
          inputId="origin_country"
          optionLabel="name"
          class="w-full"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center gap-2">
              <p>{{ slotProps.value.flag }}</p>
              <div>{{ slotProps.value.name }}</div>
            </div>
          </template>
          <template #option="slotProps">
            <div class="flex items-center gap-2 text-base">
              <p>{{ slotProps.option.flag }}</p>
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
          <template #dropdownicon>
            <font-awesome-icon icon="fa-regular fa-map" />
          </template>
        </Select>
        <label for="origin_country">Pais de Origen</label>
      </FloatLabel>
      <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
        <Select
          v-model="store.selectedDestinationCountry"
          :options="countries"
          filter
          inputId="destination_country"
          optionLabel="name"
          class="w-full"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center gap-2">
              <p>{{ slotProps.value.flag }}</p>
              <div>{{ slotProps.value.name }}</div>
            </div>
          </template>
          <template #option="slotProps">
            <div class="flex items-center gap-2 text-base">
              <p>{{ slotProps.option.flag }}</p>
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
          <template #dropdownicon>
            <font-awesome-icon icon="fa-regular fa-map" />
          </template>
        </Select>
        <label for="destination_country">Pais de Destino</label>
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
import { useQuoteStore } from "@/stores/quote";
import { COUNTRIES, LOAD_TYPES } from "@/utils/constants";

const store = useQuoteStore();
const countries = COUNTRIES;
const loadTypes = LOAD_TYPES;
</script>
