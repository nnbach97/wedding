import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";

import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/leadership", {
	title: "Gallary List",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "dashicons dashicons-buddicons-buddypress-logo",
	attributes: {
		title: {
			type: "string",
			default: "<strong>Ngọc Bách & Huyền Trang</strong>",
		},
		txt: {
			type: "string",
			default:
				"Tôi có thể chinh phục thế giới bằng một tay miễn là bạn đang nắm tay kia",
		},
		blocks: {
			type: "array",
			default: [
				{
					icon: {
						url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/1.png",
						id: "",
						alt: "",
					},
				},
				{
					icon: {
						url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/1.png",
						id: "",
						alt: "",
					},
				},
				{
					icon: {
						url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/1.png",
						id: "",
						alt: "",
					},
				},
				{
					icon: {
						url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/1.png",
						id: "",
						alt: "",
					},
				},
			],
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
