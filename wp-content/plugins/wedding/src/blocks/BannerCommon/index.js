import { registerBlockType } from "@wordpress/blocks";

import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/banner-common", {
  title: "Banner Common",
  description: "Example block scaffolded with Create Block tool.",
  category: "wedding",
  icon: "dashicons dashicons-info",
  attributes: {
    title: {
      type: "string",
      default:
        "<strong>...Tình yêu không phải là nhìn chằm chằm vào nhau, mà là nhìn chằm chằm về cùng một hướng...</strong>",
    },
    txt: {
      type: "string",
      default: "--Forever one love--",
    },
    img: {
      type: "object",
      default: {
        url:
          PV_Admin.PV_BASE_URL +
          "assets/img/blocks/story/banner_bg_common_story.jpg",
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
