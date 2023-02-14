import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/banner-new-img", {
	title: "Banner New Img",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "format-image",

	attributes: {
		title: {
			type: "string",
			default: "In Pursuit of Excellence",
		},
		description: {
			type: "string",
			default: "To be your long term Tech - Partner",
		},
		btn_watch: {
			type: "object",
			default: {
				text: '<a href="#">Watch vision film</a>',
				icon: {
					url:
						PV_Admin.PV_BASE_URL +
						"/assets/img/blocks/banner/banner_icon-film.svg",
					alt: "",
					id: "",
				},
			},
		},
		btn_inquiry: {
			type: "object",
			default: {
				text: '<a href="/en/contact/">Inquiry</a>',
				icon: {
					url:
						PV_Admin.PV_BASE_URL +
						"/assets/img/blocks/banner/banner_icon-inquiry.svg",
					alt: "",
					id: "",
				},
			},
		},
		certificate: {
			type: "array",
			default: {
				certificate_01: {
					url:
						PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_iso.svg",
					alt: "",
					id: "",
				},
				certificate_02: {
					url:
						PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_cmmi.png",
					alt: "",
					id: "",
				},
			},
		},
		counters: {
			type: "array",
			default: [
				{
					number: "03",
					text: "Locations",
				},
				{
					number: "250",
					text: "Clients",
				},
				{
					number: "300",
					text: "Projects",
				},
			],
		},
		img_banner: {
			type: "string",
			default: {
				url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_new.png",
				alt: "",
			},
		},
		video_film: {
			type: "string",
			default:
				PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/video_film.mp4",
		},
		is_show_btn_video: {
			type: "boolean",
			default: true,
		},
		is_show_bg: {
			type: "boolean",
			default: true,
		},
	},
	example: {},
	getEditWrapperProps() {
		return { "data-align": "full" };
	},
	edit: Edit,
});
