import { defineStore } from "pinia";
import { ref } from "vue";
import { apiFetch } from "@/utils/api";

const API_URL = import.meta.env.VITE_API_URL;

export const useQuoteHistoryStore = defineStore("quoteHistory", () => {
  const entries = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchEntries = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiFetch(`${API_URL}/quotes`);
      const result = await response.json();
      if (result.success) {
        entries.value = result.data;
      }
    } catch (err) {
      console.error("[quoteHistory] Error fetching quotes:", err);
      error.value = "No se pudo cargar el historial.";
    } finally {
      loading.value = false;
    }
  };

  const addEntry = async (entry) => {
    try {
      const response = await fetch(`${API_URL}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      const result = await response.json();
      if (result.success) {
        entries.value.unshift(result.data);
      }
    } catch (err) {
      console.error("[quoteHistory] Error saving quote:", err);
    }
  };

  return { entries, loading, error, fetchEntries, addEntry };
});
