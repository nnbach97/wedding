import { registerBlockType } from "@wordpress/blocks";

import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/feature-service-page", {
	title: "Feature service page",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "format-image",

	attributes: {
		title: {
			type: "string",
			default: "<strong>Features of the service</strong>",
		},
		content: {
			type: "array",
			default: [
				{
					title:
						"<strong>Full sup	port from analysis to solution construction and operation</strong>",
					icon: {
						url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/product_digital-transformation_feature_1.png`,
						alt: "",
						id: "",
					},
				},
				{
					title: "<strong>Experienced and proven expert team</strong>",
					icon: {
						url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/product_digital-transformation_feature_2.png`,
						alt: "",
						id: "",
					},
				},
				{
					title:
						"<strong>Advanced technology know-how and abundant staff</strong>",
					icon: {
						url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/product_digital-transformation_feature_3.png`,
						alt: "",
						id: "",
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
