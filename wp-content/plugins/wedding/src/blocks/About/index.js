import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/about", {
	title: "About",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "dashicons dashicons-editor-help",
	attributes: {
		title: {
			type: "string",
			default: "<strong>Why wedding?</strong>",
		},
		title_shadow: {
			type: "string",
			default: "About",
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
							PV_Admin.PV_BASE_URL + "/assets/img/blocks/about/about_img01.png",
						alt: "",
						id: "",
					},
					ttl: "<strong>Certified technical staff</strong>",
					txt: "Highly selected vendors from our rapidly expanding vendor ecosystem",
					color: "#F3F4FD",
				},
				{
					icon: {
						url:
							PV_Admin.PV_BASE_URL + "/assets/img/blocks/about/about_img02.png",
						alt: "",
						id: "",
					},
					ttl: "<strong>Instant deployment</strong>",
					txt: "Using data-driven matching and improved profile creation",
					color: "#EDFAFE",
				},
				{
					icon: {
						url:
							PV_Admin.PV_BASE_URL + "/assets/img/blocks/about/about_img03.png",
						alt: "",
						id: "",
					},
					ttl: "<strong>Business simplicity</strong>",
					txt: "An efficient platform for the full remote employee augmentation process",
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
