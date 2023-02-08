import { registerBlockType } from "@wordpress/blocks";
import "./style.scss";
import Edit from './edit';

registerBlockType("create-block/visinsight-banner", {
  title: "VISInsight-banner",
  description: "Example block VISInsight",
  category: "vietis",
  icon: "dashicons dashicons-info",

  attributes: {
    title: {
      type: "string",
      default: "VISInsight",
    },
    description: {
      type: "string",
      default: "Is a project management tool of VietIS company, aiming to implement the digital transformation roadmap."
    },
    steps: {
      type: "array",
      default: [
        {
            id: 1,
            text: "Planning assistance"
        },
        {
            id: 2,
            text: "Monitoring project"
        },
        {
            id: 3,
            text: "Data collection"
        }
      ]
    },
    technology: {
      type: "array",
      default: []
    },
    image: {
      type: "object",
      default: {
          id: "",
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/product/product-insight-laptop.png",
          alt: ""
      },
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
})
