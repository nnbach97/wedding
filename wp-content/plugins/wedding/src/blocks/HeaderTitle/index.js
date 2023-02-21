import { registerBlockType } from "@wordpress/blocks";
import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/header-title", {
  title: "Header Title",
  description: "Example block scaffolded with Create Block tool.",
  category: "wedding",
  icon: "dashicons dashicons-book",

  attributes: {
    title: {
      type: "string",
      default: "<strong>Chuyện Tình Yêu</strong>",
    },
    txt: {
      type: "string",
      default:
        "Tình yêu không làm cho thế giới quay tròn. Tình yêu là những gì làm cho chuyến đi đáng giá.",
    },
  },
  example: {},
  getEditWrapperProps() {
    return { "data-align": "full" };
  },
  edit: Edit,
});
