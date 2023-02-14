import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/feature", {
	title: "Feature",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "format-image",

	attributes: {
		title: {
			type: "string",
			default:
				"<strong>Scale Up your tech team though out highly skilled developers</strong>",
		},
		title_highlight: {
			type: "string",
			default: "<strong>highly skilled developers</strong>",
		},
		title_shadow: {
			type: "string",
			default: "Feature",
		},
		description: {
			type: "string",
			default:
				"wedding specializing in providing digital transformation consulting services and software solutions in many domains. We have a highly experienced in house technical team which provides enterprise-level IT consulting design, procurement, and support to customers.",
		},
		image: {
			type: "object",
			default: {
				url:
					PV_Admin.PV_BASE_URL + "/assets/img/blocks/feature/feature_img.png",
				alt: "",
				id: "",
			},
		},
	},
	example: {},
	getEditWrapperProps() {
		return { "data-align": "full" };
	},
	edit: Edit,
});
