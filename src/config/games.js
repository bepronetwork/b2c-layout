import FlipPage from "../containers/FlipPage";
import RoulettePage from "../containers/RoulettePage";
import DicePage from "../containers/DicePage";
import WheelPage from "../containers/WheelPage";
import PlinkoPage from "../containers/PlinkoPage";
import WheelVariation1 from "../containers/WheelVariation1Page";
import KenoPage from "../containers/KenoPage";
import DiamondPage from "../containers/DiamondPage";
import SlotsPage from "../containers/SlotsPage";

export default [
  {
    metaName: "coinflip_simple",
    component: FlipPage,
  },
  {
    metaName: "european_roulette_simple",
    component: RoulettePage,
  },
  {
    metaName: "linear_dice_simple",
    component: DicePage,
  },
  {
    metaName: "baccarat_simple",
    component: null,
  },
  {
    metaName: "plinko_variation_1",
    component: PlinkoPage,
  },
  {
    metaName: "wheel_simple",
    component: WheelPage,
  },
  {
    metaName: "wheel_variation_1",
    component: WheelVariation1,
  },
  {
    metaName: "keno_simple",
    component: KenoPage,
  },
  {
    metaName: "diamonds_simple",
    component: DiamondPage,
  },
  {
    metaName: "slots_simple",
    component: SlotsPage,
  },
];
