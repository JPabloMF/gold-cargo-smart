<template>
  <Panel header="Nueva Cotización" class="m-3 w-fit">
    <Divider align="center" type="dotted">
      <b>Selecciona el servicio que necesitas</b>
    </Divider>
    <div class="flex flex-wrap justify-content-center gap-3">
      <Card style="width: 25rem">
        <template #title>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <font-awesome-icon icon="fa-solid fa-ship" />
              <p>Flete Internacional</p>
            </div>
            <Checkbox v-model="fleteChecked" binary />
          </div>
        </template>
        <template #content>
          <p class="m-0">
            Servicios relacionados con el transporte marítimo, incluyendo
            tarifas, rutas y tiempos de tránsito.
          </p>
        </template>
      </Card>
      <BlockUI blocked>
        <Card style="width: 25rem">
          <template #title>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <font-awesome-icon icon="fa-solid fa-boxes-stacked" />
                <p>Aduana</p>
              </div>
              <Checkbox v-model="aduanaChecked" binary />
            </div>
          </template>
          <template #content>
            <p class="m-0">
              Servicios relacionados con el despacho aduanero, incluyendo
              tarifas, requisitos y tiempos de procesamiento.
            </p>
          </template>
        </Card>
      </BlockUI>
      <BlockUI blocked>
        <Card style="width: 25rem">
          <template #title>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <font-awesome-icon icon="fa-solid fa-truck" />
                <p>Transporte Terrestre</p>
              </div>
              <Checkbox v-model="terresteChecked" binary />
            </div>
          </template>
          <template #content>
            <p class="m-0">
              Servicios relacionados con el transporte terrestre, incluyendo
              tarifas, rutas y tiempos de tránsito.
            </p>
          </template>
        </Card>
      </BlockUI>
    </div>
    <Divider align="center" type="dotted">
      <b>Completa la información</b>
    </Divider>
    <div class="flex justify-center gap-5">
      <FloatLabel class="w-full md:w-56" variant="on">
        <Select
          v-model="selectedOriginCountry"
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
            <div class="flex items-center gap-2">
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
      <FloatLabel class="w-full md:w-56" variant="on">
        <Select
          v-model="selectedDestinationCountry"
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
            <div class="flex items-center gap-2">
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
      <FloatLabel class="w-full md:w-56" variant="on">
        <Select
          v-model="selectedLoadType"
          :options="loadTypes"
          inputId="loadt_type"
          optionLabel="name"
          class="w-full"
        >
          <template #dropdownicon>
            <font-awesome-icon icon="fa-solid fa-truck-ramp-box" />
          </template>
        </Select>
        <label for="loadt_type">Tipo de Carga</label>
      </FloatLabel>
    </div>
    <template v-if="selectedLoadType?.value === 'lcl'">
      <Divider align="center" type="dotted">
        <b>Peso y Dimensiones de la Carga</b>
      </Divider>
      <div class="flex justify-center items-center gap-5">
        <FloatLabel variant="on">
          <IconField>
            <InputNumber id="weight" v-model="weight" showClear />
            <InputIcon>
              <font-awesome-icon icon="fa-solid fa-weight-hanging" />
            </InputIcon>
          </IconField>
          <label for="weight">Peso</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <IconField>
            <InputNumber id="dimensions" v-model="dimensions" showClear />
            <InputIcon>
              <font-awesome-icon icon="fa-solid fa-ruler-vertical" />
            </InputIcon>
          </IconField>
          <label for="dimensions">Dimensiones</label>
        </FloatLabel>
        <Fieldset legend="IMO">
          <RadioButtonGroup name="ingredient" class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2">
                <RadioButton inputId="cheese" value="Cheese" />
                <label for="cheese">Si</label>
            </div>
            <div class="flex items-center gap-2">
                <RadioButton inputId="mushroom" value="Mushroom" />
                <label for="mushroom">No</label>
            </div>
          </RadioButtonGroup>
        </Fieldset>
      </div>
    </template>
    <template v-else-if="selectedLoadType?.value === 'fcl'">
      <Divider align="center" type="dotted">
        <b>Dimensiones del Contenedor</b>
      </Divider>
      <div class="flex justify-center items-center gap-5">
        <FloatLabel variant="on">
          <Select
            v-model="selectedContainerType"
            :options="containerTypes"
            inputId="container_type"
            optionLabel="name"
            class="w-3xs"
          />
          <label for="container_type">Tipo de Contenedor</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <IconField>
            <InputNumber id="weight" v-model="weight" showClear />
            <InputIcon>
              <font-awesome-icon icon="fa-solid fa-weight-hanging" />
            </InputIcon>
          </IconField>
          <label for="weight">Peso</label>
        </FloatLabel>
        <Fieldset legend="IMO">
          <RadioButtonGroup name="ingredient" class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2">
                <RadioButton inputId="cheese" value="Cheese" />
                <label for="cheese">Si</label>
            </div>
            <div class="flex items-center gap-2">
                <RadioButton inputId="mushroom" value="Mushroom" />
                <label for="mushroom">No</label>
            </div>
          </RadioButtonGroup>
        </Fieldset>
      </div>
    </template>
  </Panel>
</template>

<script setup>
import { ref } from "vue";
import Panel from "primevue/panel";
import Card from "primevue/card";
import BlockUI from "primevue/blockui";
import Checkbox from "primevue/checkbox";
import Divider from "primevue/divider";
import Select from "primevue/select";
import FloatLabel from "primevue/floatlabel";
import InputNumber from "primevue/inputnumber";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Fieldset from "primevue/fieldset";
import RadioButton from "primevue/radiobutton";
import RadioButtonGroup from "primevue/radiobuttongroup";

import { COUNTRIES, LOAD_TYPES, CONTAINER_TYPES } from "@/utils/constants";
const countries = COUNTRIES;
const loadTypes = LOAD_TYPES;
const containerTypes = CONTAINER_TYPES;

const fleteChecked = ref(true);
const aduanaChecked = ref(false);
const terresteChecked = ref(false);
const selectedOriginCountry = ref(null);
const selectedDestinationCountry = ref(null);
const selectedLoadType = ref(null);
const weight = ref("");
const dimensions = ref("");
</script>
