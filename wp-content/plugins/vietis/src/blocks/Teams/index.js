import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/teams", {
  title: "Leadership",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-buddicons-buddypress-logo",
  attributes: {
      title: {
        type: "string",
        default: "<strong>Meet Our Leadership Team</strong>",
      },
      title_shadow: {
        type: "string",
        default: "Team",
      },
      blocks: {
        type: "array",
        default: [
          {
            icon: {
              url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img01.png",
              id: "",
              alt: ""
            },
            title: "<strong>Dang Dieu Linh</strong>",
            des: "VIETIS President & CEO"
          },
          {
            icon: {
              url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img02.png",
              id: "",
              alt: ""
            },
            title: "<strong>Nguyen Ngoc Tan</strong>",
            des: "VIETIS Vice-Director & VIETIS Solution President"
          },
          {
            icon: {
              url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img03.png",
              id: "",
              alt: ""
            },
            title: "<strong>Nguyen Truong Giang</strong>",
            des: "VIETIS CPO & VIETIS Solution CEO"
          },
          {
            icon: {
              url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img04.png",
              id: "",
              alt: ""
            },
            title: "<strong>Tran Tri Dung</strong>",
            des: "VIETIS COO & QA Manager"
          },
          {
            icon: {
              url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img05.png",
              id: "",
              alt: ""
            },
            title: "<strong>Le Tuan Anh</strong>",
            des: "VIETIS BU2 Director"
          },
        ],
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
