import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/develop-mobile", {
  title: "Develop Mobile",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-awards",

  attributes: {
    title: {
      type: "string",
      default: "<strong>System Development</strong>",
    },
    desc: {
      type: "string",
      default: "VietIS Software’s business application development and maintenance services are designed to enable you to lower the total cost of ownership (TCO) for your application portfolio.VietIS ’s application service helps you extract the best out of your existing applications. We also help you to migrate from legacy systems to a more dynamic and modern technologies, capable of today’s more rigorous business needs. Enterprises spend a lot of time in maintaining their legacy applications, which serve critical business functions.<br><br>VietIS provides reliable and cost effective solutions for application maintenance in technologies spanning across .Net, Java, PHP, ReactJS, Ruby and other languages.",
    },
    items: {
      type: "array",
      default: [
        {
          icon: {
            url:
              PV_Admin.PV_BASE_URL +
              "/assets/img/blocks/mobile/data.svg",
            alt: "",
            id: "",
          },
          ttl: "<strong>Application Development</strong>",
          txt: "VietIS team dedicates to develop software solution, providing a complete lifecycle which includes business analysis, design, application development, implementation, maintenance and other supports",
        },
        {
          icon: {
            url:
              PV_Admin.PV_BASE_URL +
              "/assets/img/blocks/mobile/optimize.svg",
            alt: "",
            id: "",
          },
          ttl: "<strong>Application Maintenance</strong>",
          txt: "Our application maintenance services help to improve our clients’ efficiency, slash costs and enhance overall business performance. Our scope of work will enables clients’ business to continuously reinvent system landscapes and achieve IT goals that align with business needs. ",
        },
        {
          icon: {
            url:
              PV_Admin.PV_BASE_URL +
              "/assets/img/blocks/mobile/feature.svg",
            alt: "",
            id: "",
          },
          ttl: "<strong>Application Maintenance</strong>",
          txt: "Our application maintenance services help to improve our clients’ efficiency, slash costs and enhance overall business performance. Our scope of work will enables clients’ business to continuously reinvent system landscapes and achieve IT goals that align with business needs. ",
        },
      ],
    },
    image: {
      type: "object",
      default: {
        url:
          PV_Admin.PV_BASE_URL +
          "/assets/img/blocks/mobile/services-page-mobile01.png",
        alt: "",
        id: "",
      },
    },
    image_txt: {
      type: "string",
      default: "Our Service Offering",
    },
  },
  example: {},
  getEditWrapperProps() {
    return { "data-align": "full" };
  },
  edit: Edit,
});
