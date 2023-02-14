import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import "./style.scss";

registerBlockType("create-block/develop-benefit", {
	title: "Develop Benefit",
	description: "Example block scaffolded with Create Block tool.",
	category: "wedding",
	icon: "dashicons dashicons-awards",

	attributes: {
		items: {
			type: "array",
			default: [
				{
					icon: {
						id: 1,
						url:
							PV_Admin.PV_BASE_URL +
							"/assets/img/blocks/benefit/service-software-icon01.svg",
						alt: "",
					},
					title: "Efficiency",
					txt: "Custom software is a product that has been specifically designed to ensure smooth operation. In terms of software setup, support, and scalability, this approach saves time and money.",
				},
				{
					icon: {
						id: 2,
						url:
							PV_Admin.PV_BASE_URL +
							"/assets/img/blocks/benefit/service-software-icon02.svg",
						alt: "",
					},
					title: "Scalability",
					txt: "With software customized to your company's needs, you won't have to worry about scalability because software complexity increases in lockstep with your business's expansion.",
				},
				{
					icon: {
						id: 2,
						url:
							PV_Admin.PV_BASE_URL +
							"/assets/img/blocks/benefit/service-software-icon03.svg",
						alt: "",
					},
					title: "Simple & Affordable Integration",
					txt: "With the help of custom software development, existing digital services and infrastructure may be accurately and seamlessly integrated, allowing business operations to be properly synchronized.",
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
