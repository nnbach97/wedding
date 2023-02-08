import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/overview", {
  title: "company-overview",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-building",

  attributes: {
    title: {
      type: "string",
      default: "<strong>Company overview</strong>",
    },
    title_shadow: {
      type: "string",
      default: "VietIS",
    },
    config: {
      type: "object",
      default: {},
    },
  },
  example: {},
  getEditWrapperProps() {
    return { "data-align": "full" };
  },
  edit: Edit,
});
