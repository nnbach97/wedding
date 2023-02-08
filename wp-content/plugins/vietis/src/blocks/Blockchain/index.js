import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/block-blockchain", {
  title: "Blockchain",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-info",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Why do we use Blockchain Technology?</strong>",
    },
    config: {
      type: "object",
      default: {},
    },
    items: {
      type: "array",
      default: [
        {
          icon: {
            url:
              PV_Admin.PV_BASE_URL + "/assets/img/blocks/blockchain/blockchain_icon01.svg",
            alt: "",
            id: "",
          },
          ttl: "<strong>Cost-effectiveness</strong>",
          txt: "Blockchain technology eliminates the costs associated with managing and recording transactions through third parties including banks, mediators, payment networks, and money transfer services. By avoiding the need to update old systems and administrative infrastructure in enterprises, it can also reduce operational and IT expenditures. The use of Blockchain technology requires some financial commitment. However, the price is far lower than the expense of maintaining IT infrastructure. The same holds true for other facets of the company, such as finance or supply chain management.",
          color: "#F3F4FD",
        },
        {
          icon: {
            url:
              PV_Admin.PV_BASE_URL + "/assets/img/blocks/blockchain/blockchain_icon02.svg",
            alt: "",
            id: "",
          },
          ttl: "<strong>Generating Revenue</strong>",
          txt: "The Blockchain removes administrative and teamwork boundaries, paving the path for creative business tactics that were simply not possible before distributed ledger technology. Blockchain opens the door for new infrastructure and business models with this new independence.",
          color: "#EDFAFE",
        },
        {
          icon: {
            url:
              PV_Admin.PV_BASE_URL + "/assets/img/blocks/blockchain/blockchain_icon03.svg",
            alt: "",
            id: "",
          },
          ttl: "<strong>Effect on Consumers</strong>",
          txt: "The possibility to address previously neglected needs of customers and communities is provided by new business models. Blockchain innovations in the medical sector offer ways to get around obstacles like remote patient care and record-keeping via networked smart medical devices and synced records.",
          color: "#EBF5FF",
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
