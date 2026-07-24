import useCollection from "./useCollection";
import { values as seedValues } from "../data/values";
import type { Value } from "../models/value";

function useValues() {
  return useCollection<Value>("northstar-values", seedValues);
}

export default useValues;
