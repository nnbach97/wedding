import { registerBlockType } from "@wordpress/blocks";

import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/process", {
	title: "Process",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "format-image",

	attributes: {
		title: {
			type: "string",
			default: "<strong>Process</strong>",
		},
		content: {
			type: "array",
			default: [
				{
					title: "<strong>Discovery</strong>",
					icon: {
						url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/product_lv1.png`,
						alt: "",
						id: "",
					},
					tooltip: {
						title: "",
						lists:
							"wedding will go into detail about the experience you want to offer before diving into digital transformation. We will help you in this process by providing answers to the following questions: What, Where, and How?",
					},
				},
				{
					title: "<strong>Change</strong>",
					icon: {
						url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/product_lv2.png`,
						alt: "",
						id: "",
					},
					tooltip: {
						title: "",
						lists:
							"Before deciding to adopt technology, many firms don't take the time to consider what they actually need. This is a waste of time and resources and can result in digital fatigue.<br>Therefore, defining your objectives and desired outcomes can help you develop an effective digital transformation strategy. The appropriate technologies in line with the strategy for digital transformation will be offered by our knowledgeable experts.",
					},
				},
				{
					title: "<strong>Scale</strong>",
					icon: {
						url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/product_lv3.png`,
						alt: "",
						id: "",
					},
					tooltip: {
						title: "",
						lists:
							"The process of digital transformation is ongoing and has no defined end point. To assure your success, wedding keeps its tech specialists up to date on the newest developments in technology.",
					},
				},
				{
					title: "<strong>Optimize</strong>",
					icon: {
						url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/product_lv4.png`,
						alt: "",
						id: "",
					},
					tooltip: {
						title: "",
						lists:
							"Take a step back as you execute improvements in your company to assess your progress and make any corrections. Then, you can discuss your progress and what isn't working with important stakeholders. In the future, wedding will be available to help you with any additional upgrades.",
					},
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
