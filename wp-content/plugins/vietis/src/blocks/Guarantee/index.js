import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/guarantee", {
  title: "Guarantee",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-awards",

  attributes: {
    title: {
      type: "string",
      default: "<strong>Our Vision</strong>",
    },
    guarantee_title: {
      type: "string",
      default:
        "<strong><span>What We Guarantee</span> for Successful Businesses</strong>",
    },
    guarantee_txt: {
      type: "string",
      default:
        "<strong>Leverage technology to enhance the value of the business and provide clients with the best service possible.</strong><br></br>VIETIS provides a new creative platform to increase people’s creativity and productivity and support developers and companies in the next generation of technology. We aim to absorb the latest technology and innovative businesses with our own strength, create new value, and position ourselves as a globally reliable partner.",
    },
    image: {
      type: "object",
      default: {
        url:
          PV_Admin.PV_BASE_URL +
          "/assets/img/blocks/guarantee/guarantee_default.png",
        alt: "",
        id: "",
      },
    },
    visions: {
      type: "array",
      default: [
        {
          text: "Become an IT service company with innovative technology",
        },
        {
          text: "Create an internal environment where employees can work comfortably.",
        },
        {
          text: "Aiming to be a company with 1000 people and continuous process improvement (CMMi L4)",
        },
        {
          text: "We are always the trusted partner of our customers and can recommend the best technology solutions and business flows.",
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
