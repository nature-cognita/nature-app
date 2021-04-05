import { atom } from "jotai";

export const recordsCountAtom = atom(0);
export const downloadedDataAtom = atom({
  timestamps: [0],
  humidity: [0],
  temperature: [0],
  voltage: [0],
});
