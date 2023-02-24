import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/clients", {
  title: "Clients",
  description: "Example block scaffolded with Create Block tool.",
  category: "wedding",
  icon: "dashicons dashicons-buddicons-buddypress-logo",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Album Hình Cưới</strong>",
    },
    txt: {
      type: "string",
      default:
        "Tôi có thể chinh phục thế giới bằng một tay miễn là bạn đang nắm tay kia.",
    },
    images: {
      type: "array",
      default: [],
    },
    conditon_post: {
      type: "object",
      default: {
        post_type: "services",
        posts_per_page: 4,
        orderby: "date",
        order: "DESC",
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
  save: () => {
    return <InnerBlocks.Content />;
  },
});
