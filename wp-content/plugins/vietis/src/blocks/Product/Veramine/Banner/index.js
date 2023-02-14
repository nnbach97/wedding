import { registerBlockType } from "@wordpress/blocks";
import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/veramine-banner", {
	title: "Veramine-banner",
	description: "Example block Veramine",
	category: "wedding",
	icon: "dashicons dashicons-info",

	attributes: {
		title: {
			type: "string",
			default: "テレワークのデバイス環<br>境をセキュアに保つ",
		},
		header_txt: {
			type: "string",
			default: "アメリカ国防総省、空軍、国土安全保障省なとて導入済み!",
		},
		description: {
			type: "string",
			default:
				"従来のセキュリティ対策ソフトでは対応できないサイバー攻撃を阻止!",
		},
		logo: {
			type: "object",
			default: {
				url:
					PV_Admin.PV_BASE_URL +
					"/assets/img/blocks/product/veramine/logo_veramin.svg",
				id: 1,
				alt: "",
			},
		},
		image: {
			type: "object",
			default: {
				url:
					PV_Admin.PV_BASE_URL +
					"/assets/img/blocks/product/veramine/icon_baner_veramin.svg",
				id: 1,
				alt: "",
			},
		},
		steps: {
			type: "array",
			default: [
				{
					text: "クラウドとオンプレミス いすれにも対応",
					color: "#F3F4FD",
				},
				{
					text: "強力なすべての機能を 1つのセンサーに バッケージ化",
					color: "#EDFAFE",
				},
				{
					text: "CPU 1 % 20M3 AMで負荷がかからない",
					color: "#EBF5FF",
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
});
