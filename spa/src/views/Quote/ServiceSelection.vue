<template>
  <div>
    <Divider align="center" type="dotted">
      <b>Selecciona el servicio que necesitas</b>
    </Divider>
    <div class="flex flex-wrap justify-between gap-y-5">
      <Card class="h-full w-full lg:w-[33%]">
        <template #title>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <font-awesome-icon icon="fa-solid fa-ship" class="text-blue-500" />
              <p>Flete Internacional</p>
            </div>
            <Checkbox v-model="store.fleteChecked" binary />
          </div>
        </template>
        <template #content>
          <p class="m-0">
            Servicios relacionados con el transporte marítimo, incluyendo
            tarifas, rutas y tiempos de tránsito.
          </p>
        </template>
      </Card>
      <BlockUI blocked class="w-full lg:w-[33%]">
        <Card class="h-full">
          <template #title>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <font-awesome-icon
                  icon="fa-solid fa-boxes-stacked"
                  class="text-orange-500"
                />
                <p>Aduana</p>
              </div>
              <Checkbox v-model="store.aduanaChecked" binary />
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
      <BlockUI blocked class="w-full lg:w-[33%]">
        <Card class="h-full">
          <template #title>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <font-awesome-icon
                  icon="fa-solid fa-truck"
                  class="text-purple-500"
                />
                <p>Transporte Terrestre</p>
              </div>
              <Checkbox v-model="store.terresteChecked" binary />
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
  </div>
</template>

<script setup>
import Card from "primevue/card";
import BlockUI from "primevue/blockui";
import Checkbox from "primevue/checkbox";
import Divider from "primevue/divider";
import { useQuoteStore } from "@/stores/quote";

const store = useQuoteStore();
</script>
