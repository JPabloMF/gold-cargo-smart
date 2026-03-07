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
      <Divider align="center" type="dotted">
        <b>Selecciona el servicio que necesitas</b>
      </Divider>
      <div class="flex justify-content-center gap-3">
        <Card class="w-1/3">
          <template #title>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <font-awesome-icon icon="fa-solid fa-ship" class="text-blue-500" />
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
        <BlockUI blocked class="w-1/3">
          <Card>
            <template #title>
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <font-awesome-icon icon="fa-solid fa-boxes-stacked" class="text-orange-500" />
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
        <BlockUI blocked class="w-1/3">
          <Card class="h-full">
            <template #title>
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <font-awesome-icon icon="fa-solid fa-truck" class="text-purple-500" />
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
              <InputMask id="dimensions" v-model="dimensions" mask="9.9 x 9.9 x 9.9" slotChar="Ancho x Largo x Alto" showClear />
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
      <template v-if="selectedLoadType?.value">
        <Divider align="center" type="dotted">
          <b>Servicios Adicionales</b>
        </Divider>
        <p class="text-center mb-3">¿Necesitas servicios adicionales para tu carga?</p>
        <div class="card flex flex-wrap justify-center gap-4">
        <div class="flex items-center gap-2">
          <Checkbox
            v-model="loadEnsurance"
            name="seguro"
            value="loadEnsurance"
          />
          <label for="ingredient1">Seguro de Carga</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            v-model="originPickup"
            name="recogida"
            value="originPickup"
          />
          <label for="ingredient2">Recogida en Origen</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            v-model="destinationDelivery"
            name="destino"
            value="destinationDelivery"
          />
          <label for="ingredient3">Entrega en Destino</label>
        </div>
      </div>
      </template>
    </Panel>
    <Panel header="Resumen de la Cotización" class="m-3 w-1/4">
      <p class="m-0">
        Aquí se mostrará un resumen de la cotización basada en la información
        proporcionada.
      </p>
      <DataTable :value="summary">
        <Column field="field" header="Campo" />
        <Column field="value" header="Valor" />
      </DataTable>
    </Panel>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
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
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputMask from "primevue/inputmask";

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
const selectedContainerType = ref(null);
const weight = ref("");
const dimensions = ref("");
const loadEnsurance = ref(false);
const originPickup = ref(false);
const destinationDelivery = ref(false);

const summary = computed(() => {
  const summaryData = [];

  const services = [];
  if (fleteChecked.value) services.push("Flete Internacional");
  if (aduanaChecked.value) services.push("Aduana");
  if (terresteChecked.value) services.push("Transporte Terrestre");

  if (services.length > 0) {
    summaryData.push({ field: "Servicios", value: services.join(", ") });
  }

  if (selectedOriginCountry.value) {
    summaryData.push({
      field: "Origen",
      value: `${selectedOriginCountry.value.flag} ${selectedOriginCountry.value.name}`,
    });
  }

  if (selectedDestinationCountry.value) {
    summaryData.push({
      field: "Destino",
      value: `${selectedDestinationCountry.value.flag} ${selectedDestinationCountry.value.name}`,
    });
  }

  if (selectedLoadType.value) {
    summaryData.push({
      field: "Tipo de Carga",
      value: selectedLoadType.value.name,
    });
  }

  if (selectedLoadType.value?.value === "lcl") {
    if (weight.value) {
      summaryData.push({
        field: "Peso",
        value: `${weight.value} kg`,
      });
    }
    
    if (dimensions.value && !dimensions.value.includes('_')) {
      const parts = dimensions.value.split(' x ');
      if (parts.length === 3) {
        const width = parseFloat(parts[0]);
        const length = parseFloat(parts[1]);
        const height = parseFloat(parts[2]);
        console.log(width, length, height);
        if (!isNaN(width) && !isNaN(length) && !isNaN(height)) {
          const volume = width * length * height;
          summaryData.push({
            field: "Volumen",
            value: `${volume.toFixed(2)} m³`,
          });
        }
      }
    }
  }

  if (selectedLoadType.value?.value === "fcl") {
    if (selectedContainerType.value) {
      summaryData.push({
        field: "Tipo de Contenedor",
        value: selectedContainerType.value.name,
      });
    }
    if (weight.value) {
      summaryData.push({
        field: "Peso",
        value: `${weight.value} kg`,
      });
    }
  }

  return summaryData;
});


</script>
