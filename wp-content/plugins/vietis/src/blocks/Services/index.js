import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/services", {
	title: "Services",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "dashicons dashicons-edit-page",
	attributes: {
		title: {
			type: "string",
			default: "<strong>wedding Services</strong>",
		},
		title_shadow: {
			type: "string",
			default: "Services",
		},
		conditon_post: {
			type: "object",
			default: {
				post_type: "services",
				posts_per_page: 4,
				orderby: "date",
				order: "DESC",
			},
		},
		desc: {
			type: "string",
		},
		sub: {
			type: "string",
		},
		config: {
			type: "object",
			default: {},
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
