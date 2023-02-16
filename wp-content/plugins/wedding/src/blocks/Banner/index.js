import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/banner", {
	title: "Banner",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "format-image",

	attributes: {
		title: {
			type: "string",
			default: "In Pursuit of Excellent",
		},
		description: {
			type: "string",
			default: "Ngọc Bách & Huyền Trang",
		},
		config: {
			type: "object",
			default: {
				bg_method: "gradient",
				bg_gradient:
					"linear-gradient(105.79deg,rgba(127,23,231,.8) 2.36%,rgba(23,44,231,.8) 25.81%,rgba(1,4,32,.6) 100.86%)",
			},
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
				text: '<a href="#">Inquiry</a>',
				icon: {
					url:
						PV_Admin.PV_BASE_URL +
						"/assets/img/blocks/banner/banner_icon-inquiry.svg",
					alt: "",
					id: "",
				},
			},
		},
		mail: {
			type: "object",
			default: {
				icon: {
					url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/mail_icon.png",
					alt: "",
					id: "",
				},
				title: "MAIL US DAILY:",
				mail:
					'<a href="mailto:' +
					PV_Admin.contact_email +
					'">' +
					PV_Admin.contact_email +
					"</a>",
			},
		},
		video_background: {
			type: "string",
			default:
				PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/video_time.mp4",
		},
		video_film: {
			type: "string",
			default:
				PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/video_time.mp4",
		},
		is_show_btn_video: {
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
