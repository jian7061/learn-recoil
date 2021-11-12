import React from "react";
import {
  atom,
  selector,
  RecoilRoot,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";

const ALL = "all";
const ANIMALS = {
  DOG: "dog",
  CAT: "cat",
};

const animalsState = atom({
  key: "animalsState",
  default: [
    {
      id: 1,
      name: "Rexy",
      type: ANIMALS.DOG,
    },
    {
      id: 2,
      name: "Oscar",
      type: ANIMALS.CAT,
    },
    {
      id: 3,
      name: "Tom",
      type: ANIMALS.CAT,
    },
  ],
});

const animalFilterState = atom({
  key: "animalFilterState",
  default: ALL,
});

const filteredAnimalState = selector({
  key: "animalListState",
  get: ({ get }) => {
    const filter = get(animalFilterState);
    const animals = get(animalsState);
    if (filter === ALL) return animals;
    return animals.filter((animal) => animal.type === filter);
  },
});

const Animals = () => {
  const animals = useRecoilValue(filteredAnimalState);
  return (
    <div>
      {animals.map((animal) => (
        <div>
          {animal.name} {animal.type}
        </div>
      ))}
    </div>
  );
};

const PickAnimal = () => {
  const setAnimalFilter = useSetRecoilState(animalFilterState);
  return (
    <div>
      <button onClick={() => setAnimalFilter(ALL)}>All</button>
      <button onClick={() => setAnimalFilter(ANIMALS.DOG)}>Dogs</button>
      <button onClick={() => setAnimalFilter(ANIMALS.CAT)}>Cats</button>
    </div>
  );
};

export default function App() {
  return (
    <RecoilRoot>
      <div>
        <PickAnimal />
        <Animals />
      </div>
    </RecoilRoot>
  );
}
