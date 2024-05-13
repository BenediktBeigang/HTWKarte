import zuse_0 from "./Assets/Buildings/ZU/ZU_0.svg";
import zuse_1 from "./Assets/Buildings/ZU/ZU_1.svg";
import zuse_2 from "./Assets/Buildings/ZU/ZU_2.svg";
import zuse_3 from "./Assets/Buildings/ZU/ZU_3.svg";
import zuse_4 from "./Assets/Buildings/ZU/ZU_4.svg";
import zuse_5 from "./Assets/Buildings/ZU/ZU_5.svg";
import zuse_roof from "./Assets/Buildings/ZU/ZU_Roof.svg";

import gutenberg_0 from "./Assets/Buildings/GU/GU_0.svg";
import gutenberg_1 from "./Assets/Buildings/GU/GU_1.svg";
import gutenberg_2 from "./Assets/Buildings/GU/GU_2.svg";
import gutenberg_3 from "./Assets/Buildings/GU/GU_3.svg";
import gutenberg_roof from "./Assets/Buildings/GU/GU_Roof.svg";

const floors_zuse = [zuse_0, zuse_1, zuse_2, zuse_3, zuse_4, zuse_5, zuse_roof];

const floors_gutenberg = [gutenberg_0, gutenberg_1, gutenberg_2, gutenberg_3, gutenberg_roof];

const buildingFactory = {
  getBuilding: (abbreviation: string): string[] | undefined => {
    switch (abbreviation) {
      case "ZU":
        return floors_zuse;
      case "GU":
        return floors_gutenberg;
      default:
        return undefined;
    }
  },

  getRoof: (abbreviation: string): string | undefined => {
    switch (abbreviation) {
      case "ZU":
        return floors_zuse[6];
      case "GU":
        return floors_gutenberg[4];
      default:
        return undefined;
    }
  },
};

export default buildingFactory;
