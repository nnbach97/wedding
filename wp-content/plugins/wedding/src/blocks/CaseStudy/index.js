import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/casestudy", {
	title: "Case Study",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "dashicons dashicons-forms",
	attributes: {
		title: {
			type: "string",
			default: "",
		},
		title_shadow: {
			type: "string",
			default: "Team",
		},
		images: {
			type: "array",
			default: [],
		},
		conditon_post: {
			type: "object",
			default: {
				post_type: "Works",
				posts_per_page: 3,
				orderby: "date",
				order: "DESC",
				highlight_post_only: "0",
			},
		},
		blocks: {
			type: "array",
			default: [],
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
