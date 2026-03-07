<template>
  <div>
    <Divider align="center" type="dotted">
      <b>Peso y Dimensiones de la Carga</b>
    </Divider>
    <div class="flex justify-center items-center gap-5">
      <FloatLabel variant="on">
        <IconField>
          <InputNumber id="weight" v-model="store.weight" showClear />
          <InputIcon>
            <font-awesome-icon icon="fa-solid fa-weight-hanging" />
          </InputIcon>
        </IconField>
        <label for="weight">Peso</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <IconField>
          <InputMask
            id="dimensions"
            v-model="store.dimensions"
            mask="9.9 x 9.9 x 9.9"
            slotChar="Ancho x Largo x Alto"
            showClear
          />
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
