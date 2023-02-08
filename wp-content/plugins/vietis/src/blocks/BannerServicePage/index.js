import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/banner-service-page", {
  title: "Banner Service_Page",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "format-image",

  attributes: {
    title: {
      type: "string",
      default: "<strong>Our services that serve your business needs</strong>",
    },
    description: {
      type: "string",
      default:
        "At VietIS, our customers’ business needs are at the center of everything we do. We don’t just deliver technological solutions – we provide services that offer tangible business value. To accomplish this, we help you decide on the most suitable approach and the best technology to meet your specific needs.",
    },
    title_process: {
      type: "string",
      default: "<strong>Process main service</strong>",
    },
    list_text_process: {
      type: "object",
      default: {
        text1: "Receive the Requirement",
        text2: "Understanding the requirement",
        text3: "Consultation/ interview",
        text4: "Quotation / contract",
        text5: "Development",
        text6: "Process Evaluation",
        text7: "Test",
        text8: "Maintenance",
      },
    },
  },

  example: {},
  getEditWrapperProps() {
    return { "data-align": "full" };
  },
  edit: Edit,
});
