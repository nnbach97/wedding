import { registerBlockType } from "@wordpress/blocks";
import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/contact", {
	title: "Contact",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "dashicons dashicons-book",

	attributes: {
		title: {
			type: "string",
			default: "<strong>Sổ Lưu Bút</strong>",
		},
		txt: {
			type: "string",
			default:
				"Tôi yêu bạn vì tất cả những gì bạn đang có, tất cả những gì bạn đã có, và tất cả những gì bạn chưa hiện hữu.",
		},
	},
	example: {},
	getEditWrapperProps() {
		return { "data-align": "full" };
	},
	edit: Edit,
});
