import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/service-head", {
  title: "Service-head",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-info",
  attributes: {
    ttl: {
      type: "string",
      default: "<strong>Please Enter Title..</strong>",
    },
    txt: {
      type: "string",
      default: "Please Enter Content ..",
    },
    image: {
      type: "object",
      default: {
        url:
          PV_Admin.PV_BASE_URL +
          "/assets/img/image-default.png",
        alt: "",
        id: "",
      },
    },
    reverse: {
      type : "string",
      default: "left"
    },
    id: {
      type: "string",
      default: ""
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
  save: () => {
    return <InnerBlocks.Content />;
  },
});
