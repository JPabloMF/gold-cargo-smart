import { ref, computed } from "vue";
import { useQuoteStore } from "@/stores/quote";
import { buildQuotePdf, parseDimensions } from "@/utils/quotePdf";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Find the rate row for a given POL.
 * First tries an exact POL match that already has the tariff fields populated.
 * If not found, falls back to any row with the same PAIS (country) that has the fields.
 * This handles tables where TARIFA W/M and MIN are stored once per country.
 */
const findRateRow = (ratesData, pol) => {
  let polMatch = null;   // exact POL match (may lack tariff fields)
  let paisMatch = null;  // first row of same PAIS with tariff fields populated

  for (const continent of ratesData) {
    for (const row of continent.data) {
      if (row.POL === pol) {
        polMatch = row;
        // If this exact POL row has the tariff, we're done
        if (row["TARIFA W/M"] != null || row["MIN"] != null) return row;
      }
    }
  }

  // polMatch found but tariff is empty — look for another row with the same PAIS
  if (polMatch?.PAIS) {
    const targetPais = polMatch.PAIS;
    for (const continent of ratesData) {
      for (const row of continent.data) {
        if (row.PAIS === targetPais && (row["TARIFA W/M"] != null || row["MIN"] != null)) {
          paisMatch = row;
          break;
        }
      }
      if (paisMatch) break;
    }
  }

  return paisMatch ?? polMatch ?? null;
};

const getMwRate = (row) => row["TARIFA W/M"] ?? null;

const getMinima = (row) => row["MIN"] ?? null;

const loadLogoBase64 = async () => {
  try {
    const resp = await fetch("/gold_cargo_pdf.png");
    if (!resp.ok) return null;
    const blob = await resp.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    console.warn("[useQuoteGenerator] Could not load logo.");
    return null;
  }
};

export const useQuoteGenerator = () => {
  const store = useQuoteStore();
  const generating = ref(false);
  const errorMsg = ref("");

  const canGenerate = computed(() => {
    if (!store.selectedOriginPort || !store.selectedDestinationPort || !store.selectedLoadType) {
      return false;
    }
    if (store.selectedLoadType.value === "lcl") {
      return !!(store.weight && store.dimensions && !store.dimensions.includes("_"));
    }
    if (store.selectedLoadType.value === "fcl") {
      return !!(store.weight && store.selectedContainerType);
    }
    return false;
  });

  const generateQuote = async () => {
    generating.value = true;
    errorMsg.value = "";

    try {
      // Fetch destination fees (public endpoint, no auth required)
      const incomeResp = await fetch(`${API_URL}/income`);
      if (!incomeResp.ok) {
        errorMsg.value = "No se pudo obtener la configuración de tarifas. Contacte al administrador.";
        return;
      }
      const incomeResult = await incomeResp.json();
      if (!incomeResult.success || !incomeResult.data?.length) {
        errorMsg.value = "No hay tarifas de destino configuradas. Contacte al administrador.";
        return;
      }
      const income = incomeResult.data[0];

      // Fetch M/W rate and minimum for the selected POL (LCL only)
      let mwRate = null;
      let minima = null;
      if (store.selectedLoadType.value === "lcl") {
        const ratesResp = await fetch(`${API_URL}/rates`);
        if (ratesResp.ok) {
          const ratesResult = await ratesResp.json();
          if (ratesResult.success) {
            const row = findRateRow(ratesResult.data, store.selectedOriginPort);
            if (row) {
              mwRate = getMwRate(row);
              minima = getMinima(row);
            }
          }
        }
      }

      const logoBase64 = await loadLogoBase64();

      // Collect quote data from store as a plain object
      const quoteData = {
        selectedOriginPort: store.selectedOriginPort,
        selectedDestinationPort: store.selectedDestinationPort,
        selectedLoadType: store.selectedLoadType,
        weight: store.weight,
        dimensions: store.dimensions,
        selectedContainerType: store.selectedContainerType,
        loadEnsurance: store.loadEnsurance,
        originPickup: store.originPickup,
        destinationDelivery: store.destinationDelivery,
      };

      buildQuotePdf(quoteData, income, mwRate, minima, logoBase64);

      // Record the generated quote in the database (fire-and-forget)
      fetch(`${API_URL}/quotes/count`, { method: "POST" }).catch(() => {});
    } catch (err) {
      console.error("[useQuoteGenerator] Error generating quote:", err);
      errorMsg.value = "Ocurrió un error al generar la cotización.";
    } finally {
      generating.value = false;
    }
  };

  return { generating, errorMsg, canGenerate, generateQuote };
};
