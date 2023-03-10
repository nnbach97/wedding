import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/story", {
	title: "Story",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "dashicons dashicons-info",
	attributes: {
		ttl: {
			type: "string",
			default: "<strong>Nhập tiêu đề</strong>",
		},
		txt: {
			type: "string",
			default: "Nhập nội dung",
		},
		date: {
			type: "string",
			default: "Nhập ngày (DD/MM/YYYY)",
		},
		image: {
			type: "object",
			default: {
				url: PV_Admin.PV_BASE_URL + "/assets/img/image-default.png",
				alt: "",
				id: "",
			},
		},
		reverse: {
			type: "string",
			default: "left",
		},
		id: {
			type: "string",
			default: "",
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
