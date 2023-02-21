import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/services-new", {
  title: "Services New",
  description: "Example block scaffolded with Create Block tool.",
  category: "wedding",
  icon: "dashicons dashicons-edit-page",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Cô dâu & Chú rể</strong>",
    },
    txt: {
      type: "string",
      default: "Tình yêu là điều kiện trong đó hạnh phúc của người khác là điều cần thiết cho chính bạn.",
    },

    items: {
      type: "array",
      default: [
        {
          image: {
            url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/service/bach.jpg",
            alt: "",
            id: "",
          },
          ttl: "Ngô Ngọc Bách",
          txt: "Đẹp trai có tài ăn nói :D",
          link: "https://www.facebook.com/nngocbach",
        },
        {
          image: {
            url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/service/trang.jpg",
            alt: "",
            id: "",
          },
          ttl: "Trần Thị Huyền Trang",
          txt: "Xinh gái nhưng hay dỗi người yêu :D",
          link: "https://www.facebook.com/profile.php?id=100011665988271",
        },
      ],
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
