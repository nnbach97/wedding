import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/outsource", {
  title: "Outsource",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "format-image",

  attributes: {
    title: {
      type: "string",
      default: "<strong>Why Outsource Your IT Services?</strong>",
    },
    title_shadow: {
      type: "string",
      default: "Why Outsource",
    },
    image: {
      type: "object",
      default: {
        url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/outsource/outsource_img.png",
        alt: "",
        id: "",
      },
    },
    whys : {
      type: "array",
      default: [
        {
          title: "Save Costs",
          text: "It takes a lot of resources to manage IT. In addition to money and time, hardware and software need to be purchased, installed, and maintained. Additionally, hiring, training, retaining, and managing IT workers costs money and time. You can lower operational costs by outsourcing your IT services and lowering the price associated with these vital IT resources. Additionally, you will spend less on hiring, firing, annual bonuses, health insurance, retirement payments, and other expenses.",
        },
        {
          title: "Simplify Procurement",
          text: "By using Outsourcing Service, you don’t have to take care of the necessary hardware (such as computers and other office equipment).",
        },
        {
          title: "Flexibly Scalable",
          text: "Different firms have different IT requirements. yet occasionally, the requirements of a firm can also shift. Your business’ other essential components won’t be put under undue strain as a result of the scalability you’ll have with an IT partner that can adapt to your needs at any time.",
        },
        {
          title: "Utilise more experience",
          text: "You may get much more experience by outsourcing your IT services to a skilled provider, which is almost hard for an in-house IT team to do. This is because companies that provide outsourced IT services have a wide range of expertise from working with various organizations and their various IT requirements.",
        },
      ],
    },
    text_meeting: {
      type: "string",
      default: "<strong>Looking for a Long-Term Technical Partner?</strong>",
    },
    text_button_meeting: {
      type: "string",
      default: "Arrange Meeting Right Now!",
    },
    modal_meeting: {
      type: 'object',
      default: {
        title_modal: "Exec partnership meeting",
        link: "https://meetings.hubspot.com/ken-nguyen1?embed=true",
      },
    },
  },
  example: {},
  getEditWrapperProps() {
    return { "data-align": "full" };
  },
  edit: Edit,
});
