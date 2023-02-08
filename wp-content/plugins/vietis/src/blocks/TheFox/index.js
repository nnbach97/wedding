import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/the-fox", {
  title: "The Fox",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-book",

  attributes: {
    title: {
      type: "string",
      default: "<strong><span class = 'color'>The Fox</span> - The Mascot Of VietIS</strong>",
    },
    image: {
      type: "object",
      default: {
        id: "",
        url: PV_Admin.PV_BASE_URL + '/assets/img/blocks/thefox/the-fox.png',
        alt: ""
      }
    },
    desc: {
      type: "string",
      default: "In Japanese Culture, the Fox is believed to be the messenger of the Inari God, the protector of rice cultivation. The fox is so flexible and intelligent that it can distinguish good and bad people based on their daily behaviors. Moreover, this sacred animal can wholeheartedly help people to fulfill their dreams with its magic and bring  good luck to them<br>"
      + "<br>We chose the Fox as the Mascot of our company because VietIS and the Fox share the same characteristics. They are flexibility, devotion, and bringing good luck to the people they serve.<br>"
      + "<br><strong><span class = 'color'>Flexibility</span></strong>: We are flexible not only in the delivery process but also in ensuring our contracts can meet our customer’s requirements. Moreover, different resources will be allocated and utilized to meet the specific demands of our customers.<br>"
      + "<br><strong><span class = 'color'>Devotion</span></strong>: Our team always tries their best to complete the projects on time and on budget by using the most advanced technology available. Our skilled engineers are required to constantly update their knowledge and improve their technical skills to ensure the best outcomes.<br>"
      + "<br><strong><span class = 'color'>Good luck charm</span></strong>: Our services have aided many organizations in digitally transformation for their business. It is estimated that 70% of customers using VietIS products and services have witnessed rapid growth in their businesses. We attribute this to the luck of our Inari fox.",
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
