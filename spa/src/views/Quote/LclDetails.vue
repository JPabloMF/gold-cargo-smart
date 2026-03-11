<template>
  <div>
    <Divider align="center" type="dotted">
      <b>Peso y Dimensiones de la Carga</b>
    </Divider>
    <div class="flex flex-wrap justify-center items-center gap-5">
      <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
        <IconField>
          <InputNumber id="weight" class="w-full" v-model="store.weight" showClear />
          <InputIcon>
            <font-awesome-icon icon="fa-solid fa-weight-hanging" />
          </InputIcon>
        </IconField>
        <label for="weight">Peso en Kg</label>
      </FloatLabel>
      <FloatLabel class="w-full lg:w-80 md:w-full sm:w-full" variant="on">
        <IconField>
          <InputMask
            id="dimensions"
            class="w-full"
            v-model="store.dimensions"
            mask="9.9 x 9.9 x 9.9"
            showClear
          />
          <InputIcon>
            <font-awesome-icon icon="fa-solid fa-ruler-vertical" />
          </InputIcon>
        </IconField>
        <label for="dimensions">Dimensiones Ancho x Largo x Alto</label>
      </FloatLabel>
      <Fieldset class="w-full lg:w-56 md:w-full sm:w-full" legend="IMO">
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
  </div>
</template>

<script setup>
import Divider from "primevue/divider";
import FloatLabel from "primevue/floatlabel";
import InputNumber from "primevue/inputnumber";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Fieldset from "primevue/fieldset";
import RadioButton from "primevue/radiobutton";
import RadioButtonGroup from "primevue/radiobuttongroup";
import InputMask from "primevue/inputmask";
import { useQuoteStore } from "@/stores/quote";

const store = useQuoteStore();
</script>
