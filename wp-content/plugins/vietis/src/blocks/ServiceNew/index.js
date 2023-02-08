import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/services-new", {
  title: "Services New",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-edit-page",
  attributes: {
    title: {
      type: "string",
      default: "<strong>VietIS Services</strong>",
    },

    items: {
      type: "array",
      default: [
        {
          image: {
            url:
              PV_Admin.PV_BASE_URL +
              "/assets/img/blocks/service/service_img01.png",
            alt: "",
            id: "",
          },
          ttl: "Digital Transformation",
          txt: "Our team at VietIS can assist you in creating a solid digital foundation for your company so you can evolve your customer experience and surpass your competitors.",
          link: "/service/#service-dx",
        },
        {
          image: {
            url:
              PV_Admin.PV_BASE_URL +
              "/assets/img/blocks/service/service_img02.png",
            alt: "",
            id: "",
          },
          ttl: "Block Chain Technology",
          txt: "In the areas of banking, real estate, entertainment, healthcare, transportation, and insurance, VietIS is a company that specializes in offering organizations and enterprises solutions and applications of Blockchain technology.<br>We will assess, evaluate, develop a plan, and provide the best solution to install Blockchain technology applications for people and businesses with a team of competent and experienced specialists and programmers. Businesses and corporations may do so swiftly, effectively, and safely.",
          link: "/service/#block-chain",
        },
        {
          image: {
            url:
              PV_Admin.PV_BASE_URL +
              "/assets/img/blocks/service/service_img03.png",
            alt: "",
            id: "",
          },
          ttl: "Development of Mobile and Web Applications",
          txt: "Utilizing the best practices obtained from VIETIS's many years of service provision experience, all services are performed according to international standards such as CMMI level 3, ISO27001: 2013, and we can provide the level of service requested by our customers.",
          link: "/service/#service-system",
        },
        {
          image: {
            url:
              PV_Admin.PV_BASE_URL +
              "/assets/img/blocks/service/service_img04.png",
            alt: "",
            id: "",
          },
          ttl: "04. Development of Personalized Software",
          txt: "We offer a solution for custom software development to entrepreneurs. We create audacious and distinctive digital products that support your professional objectives. Each product's features are intended to increase the worth of your business, the number of customers you have, and your profitability. Custom software development enables certain business requirements to be handled at a competitive price when compared to commercial software and its modification and maintenance.",
          link: "/service/#service-ui-ux",
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
