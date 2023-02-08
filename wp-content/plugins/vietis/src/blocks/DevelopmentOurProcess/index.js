import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/develop-our-process", {
  title: "Develop Our Process",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-awards",

  attributes: {
    title: {
      type: "string",
      default: "<strong>Our Process</strong>",
    },

    steps: {
      type: "array",
      default: [
        {
          title: "Exploration Stage",
          txt: "The assessment of the project and comprehension of your company's objectives are the primary objectives of the discovery stage of the development of bespoke software. Based on this demand elicitation, we create the most affordable technological solution and tailored software development methodology to jointly accomplish the set goals.</br>"
          + "<br/>Based on the specifics and requirements of your project, our team develops an individual discovery plan with corresponding deliveries for the creation of custom software. Following the exploration phase, you will be given an interactive product prototype showing your future digital product. We will work together to complete the UX/UI design."
        },
        {
          title: "UI/UX Design",
          txt: "Every one of our projects is driven by design, and UI/UX design is crucial to the discovery stage. As part of our bespoke software services, we create a design based on your project concept and organizational requirements while adhering to the project budget and timeframe. The creation of user-friendly software with an aesthetically beautiful interface is the ultimate goal of custom software development."
        },
        {
          title: "Custom Software Development",
          txt: "This is the stage of developing custom software where the magic happens. Based on our high standards for software development, we pay particular attention to guaranteeing the product's stability and good performance (iOS, Android, Web Front-end, Web Back-end).</br>"
          + "</br>In order to meet the project's budget and timeline, we use agile methodologies to track our work on a daily basis."
        },
        {
          title: "Software Testing",
          txt: "Since the beginning of the custom software development lifecycle, we have integrated quality assurance (2-week sprints). This indicates that any new feature created during this time period is fully tested using hundreds of autotests and manual techniques.</br>"
          + "</br>To make sure that previously developed features are not affected by new software functionality, we undertake regression testing in addition to routine functional, performance, regression, usability, and unit tests."
        },
        {
          title: "Delivery",
          txt: "The solution is subsequently prepared for market entry and made accessible to final users."
        },
        {
          title: "Maintenance",
          txt: "Our programmers will monitor the performance of your solution after it is operational and take user feedback into account to further enhance it. Following deployment, we additionally make any necessary modifications."
        }
      ]
    },
  },
  example: {},
  getEditWrapperProps() {
    return { "data-align": "full" };
  },
  edit: Edit,
});
