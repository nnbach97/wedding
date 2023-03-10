import { registerBlockType } from "@wordpress/blocks";

import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/event", {
	title: "Event",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "format-image",

	attributes: {
		title: {
			type: "string",
			default: "<strong>Sự Kiện Cưới</strong>",
		},
		txt: {
			type: "string",
			default:
				"Được ai đó yêu sâu sắc sẽ mang lại cho bạn sức mạnh, trong khi yêu ai đó sâu sắc sẽ cho bạn dũng khí.",
		},
		content: {
			type: "array",
			default: [
				{
					title: "<strong>LỄ CƯỚI NHÀ NỮ</strong>",
					icon: {
						url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/event/1.png`,
						alt: "",
						id: "",
					},
					date: "07:30 AM 12/03/2023",
					address: "Bạch Đằng, Đông Hưng, Thái Bình",
				},
				{
					title: "<strong>TIỆC CƯỚI NHÀ NỮ</strong>",
					icon: {
						url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/event/2.png`,
						alt: "",
						id: "",
					},
					date: "07:30 AM 12/03/2023",
					address: "Bạch Đằng, Đông Hưng, Thái Bình",
				},
				{
					title: "<strong>TIỆC CƯỚI NHÀ NAM</strong>",
					icon: {
						url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/event/3.png`,
						alt: "",
						id: "",
					},
					date: "07:30 AM 12/03/2023",
					address: "Số 32, Đường Kho Sáu, Vạn Điểm, Thường Tín, Hà Nội",
				},
				{
					title: "<strong>LỄ CƯỚI NHÀ NAM</strong>",
					icon: {
						url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/event/4.png`,
						alt: "",
						id: "",
					},
					date: "07:30 AM 12/03/2023",
					address: "Số 32, Đường Kho Sáu, Vạn Điểm, Thường Tín, Hà Nội",
				},
			],
		},
	},

	example: {},
	getEditWrapperProps() {
		return { "data-align": "full" };
	},
	edit: Edit,
});
