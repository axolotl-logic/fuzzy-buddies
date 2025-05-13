import type { SerializedAXNode } from "puppeteer";
import type { Observation } from "./types";

export function toObservation(node: SerializedAXNode): Observation {
  return {
    multiselectable: node.multiselectable,
    autocomplete: node.autocomplete,
    valuetext: node.valuetext,
    name: node.name,
    role: node.role,
    value: node.value,
    modal: node.modal,
    level: node.level,
    checked: node.checked,
    focused: node.focused,
    disabled: node.disabled,
    invalid: node.invalid,
    haspopup: node.haspopup,
    readonly: node.readonly,
    description: node.description,
    roledescription: node.roledescription,
    pressed: node.pressed,
    expanded: node.expanded,
    required: node.required,
  };
}

export function diffObservations(
  xs: Observation[],
  ys: Observation[],
): [Observation[], Observation[]] {
  const added: Observation[] = [];
  const removed: Observation[] = [];

  for (const x of xs) {
    if (ys.find((y) => y.name === x.name) === undefined) {
      removed.push(x);
    }
  }

  for (const y of ys) {
    if (xs.find((x) => x.name === y.name) === undefined) {
      added.push(y);
    }
  }

  return [added, removed];
}
