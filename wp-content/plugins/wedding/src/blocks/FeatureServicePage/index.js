import { registerBlockType } from "@wordpress/blocks";

import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/feature-service-page", {
  title: "Feature service page",
  description: "Example block scaffolded with Create Block tool.",
  category: "wedding",
  icon: "format-image",

  attributes: {
    content: {
      type: "array",
      default: [
        {
          title: "<strong>LỄ CƯỚI NHÀ NỮ</strong>",
          icon: {
            url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/1.png`,
            alt: "",
            id: "",
          },
          date: '07:30 AM 12/03/2023',
          address: 'Bạch Đằng, Đông Hưng, Thái Bình',
        },
        {
          title: "<strong>TIỆC CƯỚI NHÀ NỮ</strong>",
          icon: {
            url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/2.png`,
            alt: "",
            id: "",
          },
          date: '07:30 AM 12/03/2023',
          address: 'Bạch Đằng, Đông Hưng, Thái Bình',
        },
        {
          title: "<strong>TIỆC CƯỚI NHÀ NAM</strong>",
          icon: {
            url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/3.png`,
            alt: "",
            id: "",
          },
          date: '07:30 AM 12/03/2023',
          address: 'Số 32, Đường Kho Sáu, Vạn Điểm, Thường Tín, Hà Nội',
        },
        {
          title: "<strong>LỄ CƯỚI NHÀ NAM</strong>",
          icon: {
            url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/4.png`,
            alt: "",
            id: "",
          },
          date: '07:30 AM 12/03/2023',
          address: 'Số 32, Đường Kho Sáu, Vạn Điểm, Thường Tín, Hà Nội',
        },
      ],
    },
  },

  example: {},
  getEditWrapperProps() {
    return { "data-align": "full" };
  },
  edit: Edit,
});
