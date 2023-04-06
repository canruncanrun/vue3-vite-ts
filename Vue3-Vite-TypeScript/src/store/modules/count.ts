// dome 演示
import { store } from "../index";
import { defineStore } from "pinia";

export const useCount = defineStore({
  id: "use-count",
  state: () => ({
    num: 0,
  }),
  getters: {},
  actions: {
    addNumber() {
      this.num += 1
    },
    delNumber() {
      this.num -= 1
    }
  }
});



export function useAppStoreHook() {
  return useCount(store);
}
