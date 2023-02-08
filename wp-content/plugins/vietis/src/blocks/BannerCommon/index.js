import { registerBlockType } from "@wordpress/blocks";

import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/banner-common", {
  title: "Banner Common",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-info",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Case Study</strong>",
    },
    img: {
      type: "object",
      default: {
        url:
          PV_Admin.PV_BASE_URL + "assets/img/blocks/casestudy/casestudy_bg.png",
        alt: "",
        id: "",
      },
    },
  },
  example: {},
  getEditWrapperProps() {
    return { "data-align": "full" };
  },
  edit: Edit,
});
